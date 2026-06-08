"use client"
import React, { use, useEffect, useState } from 'react'
import { db } from '@/configs/db';
import { CourseList, Chapters } from '@/configs/schema';
import { eq, and } from 'drizzle-orm';
import ChapterListCard from './_components/ChapterListCard';
import ChapterContent from './_components/ChapterContent';

import { normalizeCourse } from '@/configs/dbNormalize';

function CourseStart({ params }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams?.courseId;
  
  const [course, setCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState();
  const [chapterContent, setChapterContent] = useState();

  // Load course metadata when page opens
  useEffect(() => {
    if (courseId) {
      GetCourse();
    }
  }, [courseId]);

  const GetCourse = async () => {
    const result = await db.select()
      .from(CourseList)
      .where(eq(CourseList.courseId, courseId));
    
    const normalized = normalizeCourse(result[0]);
    setCourse(normalized);
    
    // Default to the first chapter on load
    if (normalized?.courseOutput?.chapters?.[0]) {
        setSelectedChapter(normalized.courseOutput.chapters[0]);
        GetSelectedChapterContent(0);
    }
  };

  const GetSelectedChapterContent = async (chapterId) => {
    // FIX: Using 'and' ensures we only get this specific course's chapter
    const result = await db.select().from(Chapters)
      .where(and(
        eq(Chapters.chapterId, chapterId),
        eq(Chapters.courseId, courseId) 
      ));
    
    setChapterContent(result[0]);
  };

  return (
    <div className='flex'>
      {/* Sidebar Area */}
      <div className='fixed md:w-72 h-screen border-r border-gray-100 dark:border-slate-800 shadow-sm overflow-y-auto bg-white dark:bg-slate-900'>
        <h2 className='font-medium text-lg bg-blue-600 p-4 text-white sticky top-0'>
          {course?.courseOutput?.course_name || "Loading Course..."}
        </h2>

        <div className='p-2'>
          {course?.courseOutput?.chapters.map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer transition-all rounded-lg mb-1 hover:bg-violet-100 dark:hover:bg-slate-800  ${
                selectedChapter?.title === chapter?.title 
              
                
              }`}
              onClick={() => {
                setSelectedChapter(chapter); // Sets UI info
                GetSelectedChapterContent(index); // Fetches DB video
              }}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className='md:ml-72 w-full'>
        <ChapterContent 
          chapter={selectedChapter} 
          content={chapterContent} 
        />
      </div>
    </div>
  );
}

export default CourseStart;