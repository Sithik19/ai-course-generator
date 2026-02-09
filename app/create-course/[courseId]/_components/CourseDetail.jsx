import React from 'react'
import { IoBarChart } from "react-icons/io5";
import { FaClockRotateLeft } from "react-icons/fa6";
import { GrChapterAdd } from "react-icons/gr";
import { FaPhotoVideo } from "react-icons/fa";
function CourseDetail({course}) {
  return (
    <div className='border p-6 rounded-xl shadow-sm mt-3'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
        <div className='flex gap-2'>
            <IoBarChart className="text-4xl text-blue-500"/>
            <div>
                <h2 className="text-xs text-gray-500">Skill Level</h2>
                <h2 className="font-medium text-lg">{course?.level}</h2>
            </div>
        </div>

        <div className='flex gap-2'>
            <FaClockRotateLeft className="text-4xl text-blue-500" />
            <div>
                <h2 className="text-xs text-gray-500">Duration</h2>
                <h2 className="font-medium text-lg">{course?.courseOutput?.duration}</h2>
            </div>
        </div>

        <div className='flex gap-2'>
            <GrChapterAdd className="text-4xl text-blue-500"/>
            <div>
                <h2 className="text-xs text-gray-500">No of Chapters</h2>
                <h2 className="font-medium text-lg">{course?.courseOutput?.chapters.length}</h2>
            </div>
        </div>

        <div className='flex gap-2'>
            <FaPhotoVideo className="text-4xl text-blue-500" />
            <div>
                <h2 className="text-xs text-gray-500">Video included ?</h2>
                <h2 className="font-medium text-lg">{course?.includeVideo}</h2>
            </div>
        </div>

      </div>
    </div>
  )
}

export default CourseDetail
