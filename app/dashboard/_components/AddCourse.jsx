"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { UserCourseListContext } from '../../_context/UserCourseListContext'
import { checkUserSubscription } from "@/configs/subscription";

function AddCourse() {
  const { user } = useUser();
  const { userCourseList, setUserCourseList } = React.useContext(UserCourseListContext);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchSubscription = async () => {
        const active = await checkUserSubscription(
          user?.primaryEmailAddress?.emailAddress,
          user?.unsafeMetadata?.isMember
        );
        setIsMember(active);
      };
      fetchSubscription();
    }
  }, [user]);

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

      <Link href={(userCourseList?.length >= 5 && !isMember) ? '/dashboard/upgrade' : '/create-course'}>
        <Button className="bg-blue-500 hover:bg-blue-600">
          + Create AI Course
        </Button>
      </Link>
    </div>
  );
}

export default AddCourse;
