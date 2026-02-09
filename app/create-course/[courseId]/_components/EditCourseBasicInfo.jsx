import React from 'react'
import { DialogClose } from "@/components/ui/dialog"
import { FaRegEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState,useEffect } from 'react';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import {  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
function EditCourseBasicInfo({course,refreshData}) {

    const [course_name, setName] = useState();
    const [description, setDescription] = useState();

    useEffect(() => {
      if(course?.courseOutput){
  setName(course?.courseOutput?.course_name);
  setDescription(course?.courseOutput?.description);}
}, [course])


const onUpdateHandler = async () => {
  course.courseOutput.course_name = course_name;
  course.courseOutput.description = description;
  const result = await db.update(CourseList).set({
    courseOutput:course?.courseOutput
  }).where(eq(CourseList?.id, course?.id))
  .returning({id:CourseList.id})
  refreshData(true);
}

  return (
    <Dialog>
  <DialogTrigger><FaRegEdit /></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Course Title & Description</DialogTitle>
      <DialogDescription>
        <div className='mt-3'>
            <label>Course Title</label>
            <Input defaultValue={course?.courseOutput?.course_name}
            onChange={(event) => setName(event?.target.value)}
 />
        </div>
        <div>
            <label>Course Description</label>
            <Textarea className="h-40" defaultValue={course?.courseOutput?.description}
            onChange={(event) => setDescription(event?.target.value)} />
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

export default EditCourseBasicInfo
