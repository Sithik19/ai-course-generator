import React from 'react'
import { BiCategoryAlt } from "react-icons/bi";
import { Button } from '@/components/ui/button';
import EditCourseBasicInfo from './EditCourseBasicInfo';
import Link from 'next/link';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { eq } from 'drizzle-orm';

// Category banner mapping using premium stock images
const categoryBanners = {
  programming: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
  coding: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
  developer: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
  health: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
  fitness: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
  design: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80",
  creative: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80",
  business: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
  finance: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
  marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
  education: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
  language: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80",
};

const getCourseBanner = (category) => {
  const cat = (category || '').toLowerCase();
  for (const [key, value] of Object.entries(categoryBanners)) {
    if (cat.includes(key)) {
      return value;
    }
  }
  return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"; // Default learning banner
};

function CourseBasicInfo({course,refreshData,edit=true}) {

  const category = course?.courseOutput?.category || course?.category || 'General';
  const defaultBanner = getCourseBanner(category);
  const bannerUrl = course?.courseOutput?.courseBanner || defaultBanner;

  const onFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      
      const updatedOutput = {
        ...course.courseOutput,
        courseBanner: base64String
      };

      await db.update(CourseList)
        .set({ courseOutput: updatedOutput })
        .where(eq(CourseList.id, course?.id));

      if (refreshData) {
        refreshData(true);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='p-10 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm mt-5 bg-white dark:bg-slate-900'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div className='flex flex-col gap-3'>
                <h2 className='font-bold text-3xl text-gray-900 dark:text-white flex items-center gap-2'>
                  {course?.courseOutput?.course_name}
                  {edit && <EditCourseBasicInfo course={course} refreshData={()=>refreshData(true)}/>}
                </h2>
                <p className='text-sm text-gray-500 dark:text-slate-300 leading-relaxed mt-2'>{course?.courseOutput?.description}</p>
                
                <div className='flex items-center gap-2 mt-4'>
                  <h2 className='font-semibold text-sm flex gap-2 items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 px-3 py-1 rounded-full uppercase tracking-wider'>
                    <BiCategoryAlt className='text-base' />
                    {category}
                  </h2>
                  <span className='text-xs text-gray-400 dark:text-slate-300 font-semibold bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full capitalize'>
                    {course?.courseOutput?.level || course?.level || 'Beginner'}
                  </span>
                </div>
            </div>

            {/* Thumbnail section */}
            <div className='relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm bg-gray-50 dark:bg-slate-850 group'>
              <img 
                src={bannerUrl} 
                alt="Course Banner" 
                className='w-full h-full object-cover transition-all duration-300' 
              />
              
              {edit && (
                <label className='absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white cursor-pointer transition-all duration-300'>
                  <span className='font-semibold text-sm bg-white/20 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/30 hover:scale-105 transition-transform'>
                    Change Thumbnail
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className='hidden' 
                    onChange={onFileSelected} 
                  />
                </label>
              )}
            </div>
        </div>

        {!edit && (
          <Link href={'/course/'+course?.courseId+"/start"} className="w-full block">
            <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-sm">
              Start
            </Button>
          </Link>
        )}
    </div>
  )
}

export default CourseBasicInfo
