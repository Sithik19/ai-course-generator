import React from 'react'
import Image from "next/image";
import { BiCategoryAlt } from "react-icons/bi";
import { Button } from '@/components/ui/button';
import EditCourseBasicInfo from './EditCourseBasicInfo';
import Link from 'next/link';
function CourseBasicInfo({course,refreshData,edit=true}) {


  return (
    <div className='p-10 border rounded-xl shadow-sm mt-5'>
        <div className='grid grid-cols-1 gap-5'>
            <div>
                <h2 className='font-bold text-3xl'>{course?.courseOutput?.course_name}
                {edit &&   <EditCourseBasicInfo course={course} refreshData={()=>refreshData(true)}/>}</h2>
                <p className='text-xs text-gray-400 mt-3'>{course?.courseOutput?.description}</p>
                <h2 className='font-medium mt-2 flex gap-2 items-center text-blue-500'><BiCategoryAlt />{course?.category}</h2>
                {!edit && <Link href={'/course/'+course?.courseId+"/start"}>
                <Button className="w-full mt-5 bg-blue-500">Start</Button>
                </Link>}
            </div>    
            
        </div>
                     
    </div>
  )
}

export default CourseBasicInfo
