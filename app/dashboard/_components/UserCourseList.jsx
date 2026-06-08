"use client"

import React, { useEffect, useState, useContext } from 'react'
import { db } from '@/configs/db'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { CourseList } from '@/configs/schema'
import CourseCard from './CourseCard'
import { UserCourseListContext } from '../../_context/UserCourseListContext'

import { normalizeCourse } from '@/configs/dbNormalize'

function UserCourseList() {
  const { user } = useUser()
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(true)

  const { userCourseList, setUserCourseList } = useContext(UserCourseListContext);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getUserCourses()
    }    
  }, [user])

  const getUserCourses = async () => {
    try {
      setLoading(true)

      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.createdBy, user.primaryEmailAddress.emailAddress))

      const normalizedResult = result.map(course => normalizeCourse(course));
      setCourseList(normalizedResult)
      setUserCourseList(normalizedResult);
      console.log("Context check:", { setUserCourseList });
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mt-10'>
      <h2 className='font-medium text-xl'>Your Courses</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5'>
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className='flex flex-col gap-3 animate-pulse w-full'>
              <div className='aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-xl' />
              <div className='flex gap-3 mt-2'>
                <div className='h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex-none' />
                <div className='flex-1 space-y-2 py-1'>
                  <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded w-[85%]' />
                  <div className='h-3 bg-slate-200 dark:bg-slate-800 rounded w-[50%]' />
                </div>
              </div>
            </div>
          ))
        ) : courseList.length > 0 ? (
          courseList.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              refreshData={getUserCourses} 
            />
          ))
        ) : (
          <p className="text-gray-500 mt-5 col-span-full">No courses created yet.</p>
        )}
      </div>
    </div>
  )
}

export default UserCourseList
