"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineHome } from "react-icons/hi";
import { FaWpexplorer } from "react-icons/fa";
import { GrUpgrade } from "react-icons/gr";
import { LuLogOut } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { UserCourseListContext } from '../../_context/UserCourseListContext'

function SideBar() {
  const {userCourseList,setUserCourseList} = React.useContext(UserCourseListContext);
  const Menu = [
    { id: 1, name: "Home", icon: <HiOutlineHome />, path: "/dashboard" },
    { id: 2, name: "Explore", icon: <FaWpexplorer />, path: "/dashboard/explore" },
    { id: 3, name: "Upgrade", icon: <GrUpgrade />, path: "/dashboard/upgrade" },
    { id: 4, name: "Logout", icon: <LuLogOut />, path: "/dashboard/logout" },
  ];

  const path = usePathname();

  return (
    <div className="fixed h-full md:w-64 p-5 shadow-md">
      <Image
        src="/logo.svg"
        width={160}
        height={100}
        alt="logo"
      />

      <hr className="my-5" />

      <ul>
        {Menu.map((item) => (
          <li key={item.id}>
            <Link href={item.path}>
              <div
                className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg mb-3 ${
                  item.path === path && "bg-gray-100 text-black"
                }`}
              >
                <div className="text-3xl">{item.icon}</div>
                <h2>{item.name}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-10 w-[80%]">
        <Progress
          value={(userCourseList?.length / 5) * 100}
          className="h-2 bg-gray-200 [&>div]:bg-blue-500"
        />
        <h2 className="text-sm my-2">{userCourseList?.length} Out of 5 Course Created</h2>
        <h2 className="text-xs text-gray-500">
          Upgrade your plan for unlimited course generate.
        </h2>
      </div>
    </div>
  );
}

export default SideBar;
