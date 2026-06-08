"use client"

import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs/db'
import { CourseList, Chapters } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import CourseBasicInfo from './_components/CourseBasicInfo'
import CourseDetail from './_components/CourseDetail'
import ChapterList from './_components/ChapterList'
import { Button } from '@/components/ui/button'
import LoadingDialog from '../_components/LoadingDialog'
import { GenerateChapterContent_AI } from '@/configs/AiModel'
import ServiceWorker from '@/configs/service';
import { useRouter } from 'next/navigation'





import { normalizeCourse } from '@/configs/dbNormalize';

function CourseLayout() {
  const { user } = useUser();
  const params = useParams();  
  const [course,setCourse]=React.useState([]);
  const [loading,setLoading]=React.useState(false);
  const router=useRouter();
  useEffect(() => {
    if (params?.courseId && user) {
      GetCourse();
    }
  }, [params,user]);           

  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(
        and(
          eq(CourseList.courseId, params?.courseId),
          eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    setCourse(normalizeCourse(result[0]));
    console.log(normalizeCourse(result[0]));
  };
  const cleanAndParseJson = (text) => {
    if (!text) return null;
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();
    return JSON.parse(cleanText);
  };

  const sendMessageWithRetry = async (chatSession, prompt, retries = 5, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await chatSession.sendMessage(prompt);
      } catch (error) {
        const isTransient = error.message?.includes("503") || error.message?.includes("429") || error.status === 503 || error.status === 429;
        if (isTransient && attempt < retries) {
          let waitTime = delay;
          const match = error.message?.match(/Please retry in (\d+\.?\d*)s/i);
          if (match) {
            const seconds = parseFloat(match[1]);
            waitTime = Math.ceil(seconds * 1000) + 1500; // Add 1.5s buffer
            console.warn(`Gemini Rate Limit. Waiting ${waitTime}ms before retry (attempt ${attempt}/${retries})...`);
          } else {
            console.warn(`Gemini API transient error (attempt ${attempt}/${retries}). Retrying in ${delay}ms...`);
            delay *= 2;
          }
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          throw error;
        }
      }
    }
  };

  const GenerateChapterContent=async ()=>{
    setLoading(true);
    try {
      const chapters=course?.courseOutput?.chapters;
      const language=course?.courseOutput?.language || 'English';
      
      // Clear any existing chapters for this course ID first to avoid duplicate entries
      await db.delete(Chapters).where(eq(Chapters.courseId, course?.courseId));
      
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];
        const PROMPT='Explain the concept in Detail on Topic: '+course?.name+', Chapter: '+chapter?.chapter_name+', in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode > format) if applicable. The entire response (title, description, etc.) must be written in '+language+' language.';
        console.log(PROMPT);
        
        let videoId='';
        try {
          //Generate Video URL 
          const searchQuery = course?.name + ': ' + chapter?.chapter_name + ' in ' + language;
          const resp = await ServiceWorker.getVideos(searchQuery);
          console.log(resp);
          videoId = resp[0]?.id?.videoId || '';
        } catch (videoErr) {
          console.error("Error fetching video for chapter:", videoErr);
        }

        // Generate Chapter Content
        const result=await sendMessageWithRetry(GenerateChapterContent_AI, PROMPT); 
        const rawText = result?.response?.text();
        console.log(rawText);
        const content = cleanAndParseJson(rawText);
        
        // Save Chapter Content + Video URL
        await db.insert(Chapters).values({ 
          chapterId:index, 
          courseId:course?.courseId, 
          content:content,  
          videoId:videoId              
        });

        // Add 1 second delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      router.replace('/create-course/'+course?.courseId+'/finish');
    } catch (e) {
      console.error("Error generating chapter content:", e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='mt-10 px-7 md:px-20 lg:px-44'>
      <h2 className='font-bold text-center text-2xl'>Course Layout</h2>
      <LoadingDialog loading={loading}/>
      {/*Basic Info */}
        <CourseBasicInfo course={course} refreshData={()=>GetCourse()}/>
      {/*Course Detail */}
        <CourseDetail course={course}/>
      {/* List of Lesson */}
        <ChapterList course={course} refreshData={()=>GetCourse()}/>

        <Button onClick={GenerateChapterContent} className="mt-5 bg-blue-500 hover:bg-blue-600">Generate Course Content</Button>
    </div>
  )
}

export default CourseLayout
