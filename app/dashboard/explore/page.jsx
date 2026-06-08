"use client"
import React, { useEffect, useState } from 'react'
import { CourseList } from '@/configs/schema'
import { db } from '@/configs/db'
import CourseCard from '@/app/dashboard/_components/CourseCard'
import { Button } from "@/components/ui/button";

import { normalizeCourse } from '@/configs/dbNormalize'

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex,setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetAllCourse();
  }, [pageIndex])

  const GetAllCourse = async () => {
    try {
      setLoading(true);
      const result = await db.select().from(CourseList)
        .limit(9)
        .offset(pageIndex*9);
      
      const normalizedResult = result.map(course => normalizeCourse(course));
      setCourseList(normalizedResult);
      console.log(normalizedResult);
    } catch (error) {
      console.error("Error fetching all courses:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className='font-bold text-3xl'>Explore More Projects</h2>
      <p className='text-gray-500'>Explore more projects built by AI by other users</p>
      
      {/* Added Responsive Grid: 
          1 column on mobile, 2 on medium, 3 on large screens 
      */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {loading ? (
          // Skeleton Loader for better UX
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div 
              key={index} 
              className='h-[250px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg'
            />
          ))
        ) : (
          courseList?.map((course) => (
            /* FIX: The unique 'key' is placed on the outermost 
               element of the map function.
            */
            <div key={course.id}>
              <CourseCard course={course} displayUser={true} />
            </div>
          ))
        )}
      </div>

      {courseList.length === 0 && !loading && (
        <p className='mt-10 text-center text-gray-400'>No public courses found.</p>
      )}
      <div className='flex justify-between mt-5'>

      {pageIndex != 0 && <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setPageIndex(pageIndex - 1)}>Previous Page</Button>}

      <Button className="bg-blue-500 hover:bg-blue-600" onClick={()=>setPageIndex(pageIndex+1)}>Next Page</Button>

      </div>
    </div>
  )
}

export default Explore