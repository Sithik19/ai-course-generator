import React from 'react'
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import DropdownOption from './DropdownOption';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

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

function CourseCard({ course, refreshData, displayUser=false }) {

  const handleOnDelete = async () => {
    const resp = await db.delete(CourseList)
      .where(eq(CourseList.id, course?.id))
      .returning({ id: CourseList?.id });

    if (resp) {
      refreshData();
    }
  }

  const category = course?.courseOutput?.category || course?.category || 'General';
  const bannerUrl = getCourseBanner(category);
  const chapterCount = course?.courseOutput?.chapters?.length ?? 0;
  const authorName = course?.userName || 'AI Creator';
  const userAvatar = course?.userProfileImage || 'https://img.clerk.com/placeholder-user.png';

  return (
    <div className="flex flex-col gap-3 group cursor-pointer transition-all duration-300 w-full mb-4">
      
      {/* Thumbnail Block */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 shadow-xs transition-all duration-300 group-hover:shadow-md">
        <Link href={'/course/' + course?.courseId}>
          <img 
            src={bannerUrl} 
            alt="course banner" 
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-all duration-500"
          />
        </Link>
        
        {/* Floating Chapter Duration Badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md tracking-wider">
          {chapterCount} {chapterCount === 1 ? 'Chapter' : 'Chapters'}
        </span>
      </div>

      {/* Details Area */}
      <div className="flex gap-3 px-1 justify-between items-start">
        {/* Channel/User Avatar */}
        <div className="flex-none">
          <img 
            src={userAvatar}
            alt="user avatar" 
            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100/50 dark:ring-slate-800/50 mt-0.5"
            onError={(e) => {
              e.currentTarget.src = 'https://img.clerk.com/placeholder-user.png';
            }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-grow min-w-0">
          <Link href={'/course/' + course?.courseId}>
            <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-tight tracking-tight mb-1">
              {course?.courseOutput?.course_name}
            </h3>
          </Link>

          {/* Author/Creator name */}
          <p className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium truncate">
            {authorName}
          </p>

          {/* Stats Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
              {category}
            </span>
            <span>•</span>
            <span className="capitalize">{course?.courseOutput?.level || course?.level || 'Beginner'}</span>
          </div>
        </div>

        {/* Action Dropdown Menu */}
        {!displayUser && (
          <div className="flex-none -mt-1 hover:bg-gray-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors duration-150">
            <DropdownOption handleOnDelete={() => handleOnDelete()}>
              <button className="flex items-center justify-center cursor-pointer">
                <IoEllipsisVerticalSharp className="text-gray-500 dark:text-gray-400 text-base" />
              </button>
            </DropdownOption>
          </div>
        )}
      </div>

    </div>
  );
}

export default CourseCard
