"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { UserCourseListContext } from '../../_context/UserCourseListContext'
function AddCourse() {
  const { user } = useUser();
  const {userCourseList,setUserCourseList} = React.useContext(UserCourseListContext);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">
          Hello, {user?.fullName}
        </h2>

        <p className="text-sm text-gray-500">
          Create new course with AI, share with your friends and earn from it.
        </p>
      </div>

      <Link href={userCourseList?.length >= 5 ? '/dashboard/upgrade' : '/create-course'}>
        <Button className="bg-blue-500 hover:bg-blue-600">
          + Create AI Course
        </Button>
      </Link>
    </div>
  );
}

export default AddCourse;
