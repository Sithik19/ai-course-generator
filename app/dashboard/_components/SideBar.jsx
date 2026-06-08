"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineHome } from "react-icons/hi";
import { FaWpexplorer } from "react-icons/fa";
import { GrUpgrade } from "react-icons/gr";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { UserCourseListContext } from '../../_context/UserCourseListContext'
import { useClerk, useUser } from "@clerk/nextjs";
import { checkUserSubscription } from "@/configs/subscription";

const ADMIN_EMAILS = ['sithikranjan25@gmail.com', '717823i155@kce.ac.in'];

function SideBar() {
  const { user } = useUser();
  const {userCourseList,setUserCourseList} = React.useContext(UserCourseListContext);
  const { signOut } = useClerk();
  const [isMember, setIsMember] = React.useState(false);

  React.useEffect(() => {
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

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  const Menu = [
    { id: 1, name: "Home", icon: <HiOutlineHome />, path: "/dashboard" },
    { id: 2, name: "Explore", icon: <FaWpexplorer />, path: "/dashboard/explore" },
    { id: 3, name: "Upgrade", icon: <GrUpgrade />, path: "/dashboard/upgrade" },
    ...(isAdmin ? [{ id: 5, name: "Admin Panel", icon: <MdOutlineAdminPanelSettings />, path: "/dashboard/admin" }] : []),
    { id: 4, name: "Logout", icon: <LuLogOut />, path: "/dashboard/logout" },
  ];

  const path = usePathname();

  return (
    <div className="fixed h-full md:w-64 p-5 shadow-sm border-r bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Image
        src="/logo.svg"
        width={160}
        height={36}
        alt="logo"
        className="logo-filter transition-all duration-200 object-contain"
      />

      <hr className="my-5" />

      <ul>
        {Menu.map((item) => (
          <li key={item.id}>
            {item.name === "Logout" ? (
              <div
                onClick={() => signOut({ redirectUrl: "/" })}
                className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg mb-3 transition-colors ${
                  item.path === path 
                    ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold" 
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
                }`}
              >
                <div className="text-3xl">{item.icon}</div>
                <h2>{item.name}</h2>
              </div>
            ) : (
              <Link href={item.path}>
                <div
                  className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg mb-3 transition-colors ${
                    item.path === path 
                      ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <div className="text-3xl">{item.icon}</div>
                  <h2>{item.name}</h2>
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="absolute bottom-10 w-[80%]">
        <Progress
          value={isMember ? 100 : (userCourseList?.length / 5) * 100}
          className={`h-2 bg-gray-200 ${isMember ? '[&>div]:bg-emerald-500' : '[&>div]:bg-blue-500'}`}
        />
        <h2 className="text-sm my-2">
          {isMember ? 'Unlimited Courses (Premium)' : `${userCourseList?.length} Out of 5 Course Created`}
        </h2>
        <h2 className="text-xs text-gray-500">
          {isMember ? 'Thank you for being a premium member!' : 'Upgrade your plan for unlimited course generate.'}
        </h2>
      </div>
    </div>
  );
}

export default SideBar;
