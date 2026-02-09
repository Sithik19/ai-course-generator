import React from 'react'
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import DropdownOption from './DropdownOption';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image'

function CourseCard({ course, refreshData,displayUser=false }) {

  const handleOnDelete = async () => {
    const resp = await db.delete(CourseList)
      .where(eq(CourseList.id, course?.id))
      .returning({ id: CourseList?.id });

    if (resp) {
      refreshData();
    }
  }

  return (
    <div className="shadow-sm border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer mt-4 hover:scale-105">

      {/* Header Row: Title + 3 Dots */}
      <div className="flex justify-between items-start mb-2">
        <Link href={'/course/' + course?.courseId}>
          <h3 className="font-semibold text-lg">
            {course?.courseOutput?.course_name}
          </h3>
        </Link>

       { !displayUser&& <DropdownOption handleOnDelete={() => handleOnDelete()}>
          <IoEllipsisVerticalSharp className="text-xl cursor-pointer" />
        </DropdownOption> }
      </div>

      {/* Meta Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Category:</span>{' '}
          {course?.courseOutput?.category || 'N/A'}
        </p>

        <p>
          <span className="font-medium">Difficulty:</span>{' '}
          {course?.courseOutput?.level || 'N/A'}
        </p>

        <p>
          <span className="font-medium">Chapters:</span>{' '}
          {course?.courseOutput?.chapters?.length ?? 0}
        </p>
      </div>
      { displayUser &&
      <div className='flex gap-2 items-center mt-4'>
        <Image 
  src={course?.userProfileImage} 
  width={35} 
  height={35} 
  alt='user'
  className='rounded-full' 
/>
    <h2 className='text-sm'>{course?.userName}</h2>
      </div>}
    </div>
  )
}

export default CourseCard
