"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import CategoryList from "@/app/_shared/CategoryList";
import { UserInputContext } from '@/app/_context/UserInputContext';

function SelectCategory() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleCategoryChange = (category) => {
    setUserCourseInput(prev => ({
      ...prev,
      category: category
    }))
  }
  return (
    <div className="px-10 md:px-20">
      <h2 className="my-5">Select the Course Category</h2>

      <div className="grid grid-cols-3 gap-10">
        {CategoryList.map((item, index) => (
          <div key={item.id }
            className={`flex flex-col p-5 border border-gray-200 dark:border-slate-800 items-center rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800/60 cursor-pointer
              ${userCourseInput?.category==item.name && 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40'}`}
            onClick={() => handleCategoryChange(item.name)}
          >
            <Image src={item.icon} width={50} height={50} alt="image"/>
              <h2 className="mt-2">{item.name}</h2>
            </div>
        ))}
    </div>
    </div>
  )
}

export default SelectCategory
