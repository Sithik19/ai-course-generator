"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { and, eq } from 'drizzle-orm';
import CourseBasicInfo from '../_components/CourseBasicInfo';
import { CourseList } from '@/configs/schema';
import { FaCopy } from "react-icons/fa6";

import { normalizeCourse } from '@/configs/dbNormalize';

function FinishScreen() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState([]);

  useEffect(() => {
    if (params?.courseId && user) {
      getCourse();
    }
  }, [params, user]);

  const getCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(
        and(
          eq(CourseList.courseId, params?.courseId),
          eq(
            CourseList.createdBy,
            user?.primaryEmailAddress?.emailAddress
          )
        )
      );

    setCourse(normalizeCourse(result[0]));
    console.log(normalizeCourse(result[0]));
  };

  return (
    <div className="px-10 md:px-20 lg:px-44 my-7">
      <h2 className='text-center font-bold text-2xl my-3 text-blue-500'>Course Created Successfully!</h2>
      <CourseBasicInfo course={course} refreshData={() => getCourse()} />
        <h2 className='mt-3'>Course URL:</h2>
        <h2 className='text-center text-gray-400 border border-gray-200 dark:border-slate-800 p-2 rounded-lg bg-white dark:bg-slate-900 flex gap-5 items-center'>
          <a 
            href={process.env.NEXT_PUBLIC_HOST_NAME + "/course/" + course?.courseId} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline cursor-pointer flex-1 text-left break-all"
          >
            {process.env.NEXT_PUBLIC_HOST_NAME}/course/{course?.courseId}
          </a>
          <FaCopy className='h-5 w-5 text-blue-500 cursor-pointer'
          onClick={async() => navigator.clipboard.writeText(process.env.NEXT_PUBLIC_HOST_NAME+"/course/"+course?.courseId)}/>
        </h2>
    </div>
  );
}

export default FinishScreen;
