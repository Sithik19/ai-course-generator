"use client"

import React, { useEffect, useState, useContext } from 'react'
import { db } from '@/configs/db'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { CourseList } from '@/configs/schema'
import CourseCard from './CourseCard'
import { UserCourseListContext } from '../../_context/UserCourseListContext'

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

      setCourseList(result)
      setUserCourseList(result);
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

      <div>
        {loading ? (
          [1, 2, 3, 4, 5].map((_, index) => (
            <div 
              key={index} 
              className='w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[100px]'
            />
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
          <p className="text-gray-500 mt-5">No courses created yet.</p>
        )}
      </div>
    </div>
  )
}

export default UserCourseList
