"use client"

import { db } from '@/configs/db'
import { CourseList } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import CourseBasicInfo from '@/app/create-course/[courseId]/_components/CourseBasicInfo'
import ChapterList from '@/app/create-course/[courseId]/_components/ChapterList'
import CourseDetail from '@/app/create-course/[courseId]/_components/CourseDetail'
import Header from '@/app/_components/Header'

function Course() {
  const params = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (params?.courseId) {
      getCourse()
    }
  }, [params?.courseId])

  const getCourse = async () => {
    try {
      setLoading(true)

      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, params.courseId))

      if (!result.length) {
        throw new Error("Course not found")
      }

      setCourse(result[0])

    } catch (err) {
      console.error("Error fetching course:", err)
      setError("Failed to load course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />

      <div className='px-10 p-10 md:px-20 lg:px-44'>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-2/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <p className="text-red-500 font-medium">{error}</p>
        )}

        {/* Render Course */}
        {!loading && !error && course && (
          <>
            <CourseBasicInfo course={course} edit={false} />
            <CourseDetail course={course} />
            <ChapterList course={course} edit={false} />
          </>
        )}

      </div>
    </div>
  )
}

export default Course
