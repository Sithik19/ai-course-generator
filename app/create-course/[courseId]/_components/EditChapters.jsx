import React from 'react'
import { FaRegEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";  
import { Button } from '@/components/ui/button';
import { DialogClose } from "@/components/ui/dialog"
import { useState } from 'react';
import { useEffect } from 'react';  
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { eq } from 'drizzle-orm';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,   
} from "@/components/ui/dialog"
import { refresh } from 'next/cache';
function EditChapters({course,index,refreshData}) {
  const Chapters=course?.courseOutput?.chapters;
  const [chapter_name,setName]=useState();
  const [about,setAbout]=useState();

  useEffect(()=>{
    setName(Chapters[index].chapter_name);
    setAbout(Chapters[index].about);
  },[Chapters,index]);

  const onUpdateHandler = async () => {
    course.courseOutput.chapters[index].chapter_name=chapter_name;
    course.courseOutput.chapters[index].about=about;
    
     const result = await db.update(CourseList).set({
        courseOutput:course?.courseOutput
      }).where(eq(CourseList?.id, course?.id))
      .returning({id:CourseList.id})

      console.log(result);
      refreshData(true);
  }
  return (
    <Dialog>
  <DialogTrigger><FaRegEdit /></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Chapter</DialogTitle>
      <DialogDescription>
        <div className='mt-3'>
            <label>Chapter Name</label>
            <Input defaultValue={Chapters[index].chapter_name}
            onChange={(event) => setName(event?.target.value)}
 />
        </div>
        <div>
            <label>Chapter Description</label>
            <Textarea className="h-40" defaultValue={Chapters[index].about}
            onChange={(event) => setAbout(event?.target.value)} />
        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
        <DialogClose>
            <Button  onClick={onUpdateHandler} className="bg-blue-500 text-white hover:bg-blue-600">
                Update
            </Button>
        </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default EditChapters
