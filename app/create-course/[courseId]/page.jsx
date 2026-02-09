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
    setCourse(result[0]);
     console.log(result[0]);
    
  };
  const GenerateChapterContent=async ()=>{
    setLoading(true);
    const chapters=course?.courseOutput?.chapters;
    chapters.forEach(async(chapter,index)=>{
      const PROMPT='Explain the concept in Detail on Topic: '+course?.name+', Chapter: '+chapter?.chapter_name+', in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode > format) if applicable'
      console.log(PROMPT);
      //if(index<3) { 
        try{ 
          let videoId='';

          //Generate Video URL 
           ServiceWorker.getVideos(course?.name+':'+chapter?.chapter_name).then(resp=>{
            console.log(resp);
            videoId=resp[0]?.id?.videoId;
           });
          // Generate Chapter Content
          const result=await GenerateChapterContent_AI.sendMessage(PROMPT); 
          console.log(result?.response?.text());
          const content=JSON.parse(result?.response?.text());
           
           // // Save Chapter Content + Video URL
           await db.insert(Chapters).values({ 
                   chapterId:index, 
                   courseId:course?.courseId, 
                   content:content,  
                   videoId:videoId              
           })
          
           setLoading(false);
            } 
            catch(e)
            { 
              setLoading(false);
              console.log(e) 

            } 
          router.replace('/create-course/'+course?.courseId+'/finish');
          //}
  })
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

        <Button onClick={GenerateChapterContent} className="mt-5 bg-blue-500">Generate Course Content</Button>
    </div>
  )
}

export default CourseLayout
