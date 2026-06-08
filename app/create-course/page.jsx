"use client"
import React from 'react'
import { HiClipboardDocumentCheck, HiLightBulb, HiMiniSquares2X2 } from 'react-icons/hi2'
import { Button } from '@/components/ui/button';
import SelectCategory from './_components/SelectCategory';
import TopicDescription from './_components/TopicDescription';
import { Select } from '@radix-ui/react-select';  
import SelectOption from './_components/SelectOption';
import { UserInputContext } from '../_context/UserInputContext';
import { useContext,useEffect } from 'react';
import { useState } from 'react';
import { GenerateCourseLayout_AI } from '@/configs/AiModel';
import LoadingDialog from './_components/LoadingDialog';
import AlertDialog from '@/components/ui/alert-dialog';
import AlertDialogContent from '@/components/ui/alert-dialog';
import AlertDialogHeader from '@/components/ui/alert-dialog';
import AlertDialogTitle from '@/components/ui/alert-dialog';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { normalizeCourseOutput } from '@/configs/dbNormalize';

function CreateCourse() {
  const StepperOptions=[{
    id:1,
    name:"Category",
    icon:<HiMiniSquares2X2 />
  } ,
 {
    id:2,
    name:"Topic & Desc",
    icon:<HiLightBulb />
  },
  {
    id:3,
    name:"Options",
    icon:<HiClipboardDocumentCheck />
  }
]
const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
const [loading,setLoading]=useState(false);
const [activeIndex,setActiveIndex]=React.useState(0);
const {user}=useUser();
const router=useRouter();

useEffect(()=>{
  console.log(userCourseInput);
},[userCourseInput])

/**
 * Used to check Next Button Enable or disable Status
 */
  const checkStatus=()=>{
  if(userCourseInput?.length==0){
    return true;
  }
  if(activeIndex==0 && (userCourseInput?.category?.length==0||userCourseInput?.category==undefined)){
    return true;
  }
  if(activeIndex==1 && (userCourseInput?.topic==undefined||userCourseInput?.topic?.length==0)){
    return true;
  }
  else if(activeIndex==2 && (userCourseInput?.level==undefined||userCourseInput?.duration==undefined||userCourseInput?.displayVideo==undefined||userCourseInput?.noOfChapter==undefined||userCourseInput?.language==undefined)){
    return true;
  }
  return false;
  }
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

  const GenerateCourseLayout=async()=>{
    setLoading(true)
    try {
      const BASIC_PROMPT='Generate A Course Tutorial on Following Detail With field Course Name, Description,Along with Chapter Name, about, Duration:.'
      const USER_INPUT_PROMPT='Category:'+userCourseInput?.category+',Topic:'+userCourseInput?.topic+',Level:'+userCourseInput?.level+',Duration:'+userCourseInput?.duration+',NoOfChapters:'+userCourseInput?.noOfChapter+',Language:'+userCourseInput?.language+' , in JSON format.'
      const FINAL_PROMPT=BASIC_PROMPT+USER_INPUT_PROMPT+' All output fields (specifically Course Name, Description, Chapter Name, and about) must be written in '+userCourseInput?.language+' language.';
      console.log(FINAL_PROMPT);
      
      const result=await sendMessageWithRetry(GenerateCourseLayout_AI, FINAL_PROMPT);
      const rawText = result.response?.text();
      console.log(rawText);
      const parsedLayout = cleanAndParseJson(rawText);
      console.log(parsedLayout);
      await SaveCourseLayoutInDb(parsedLayout);
    } catch (error) {
      console.error("Error generating course layout:", error);
      setLoading(false);
    }
  }

  const SaveCourseLayoutInDb=async(courseLayout)=> {
    try {
      var id=uuidv4();
      setLoading(true)
      const result=await db.insert(CourseList).values({
        courseId:id,
        name: userCourseInput?.topic,
        level: userCourseInput?.level,
        category: userCourseInput?.category,
        courseOutput: { ...normalizeCourseOutput(courseLayout), language: userCourseInput?.language },
        createdBy: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        userProfileImage: user?.imageUrl,
        language: userCourseInput?.language
      });
      console.log("Finish");
      router.replace('/create-course/'+id);
    } catch (error) {
      console.error("Error saving course layout to DB:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Stepper*/}
      <div className='flex flex-col justify-center items-center mt-10'>
        <h2 className='text-2xl text-blue-500 font-medium'>Create Course</h2>
        <div className='flex mt-10'>
          {StepperOptions.map((item,index)=>(
              <div key={item.id} className='flex items-center'>
                <div className='flex flex-col items-center w-[50px] md:w-[100px]'>
                <div className={`p-3 rounded-full text-white 
                  ${activeIndex>=index ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-800'}`}>
                  {item.icon}
                </div>
                <h2 className='hidden md:block md:text-sm text-gray-900 dark:text-slate-200'>{item.name}</h2>
              </div>
               {index!=StepperOptions?.length-1&&
               <div className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] 
               ${activeIndex-1>=index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-800'}`}></div>}
              
              </div>
          ))}
        </div>
      </div>
      <div className='px-10 md:px-20 lg:px-44 mt-10'>
      {/* Component */}
          {activeIndex==0?<SelectCategory />:
          activeIndex==1?<TopicDescription />:
          <SelectOption />}
      {/* Next Previous Button*/}
      <div className='flex justify-between mt-10'>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white" disabled={activeIndex==0} 
        onClick={()=>setActiveIndex(activeIndex-1)}>Previous</Button>
          {activeIndex<2&&<Button disabled={checkStatus()} className="bg-blue-500 hover:bg-blue-600" onClick={()=>setActiveIndex(activeIndex+1)}>Next</Button>}
          {activeIndex==2&&<Button disabled={checkStatus()} className="bg-blue-500 hover:bg-blue-600" onClick={()=>GenerateCourseLayout()}>Generate Course Layout</Button>}
      </div>
      </div>
      <LoadingDialog loading={loading} />
    </div>
  )
}

export default CreateCourse
