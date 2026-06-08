import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "../../_components/ThemeToggle";

function Header({ hideLogoOnDesktop = false }) {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm border-b bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <Image
        src="/m_Logo.svg"
        width={40}
        height={28}
        alt="Application logo"
        className="logo-filter transition-all duration-200 object-contain"
      />
      <div className="flex items-center gap-4 ml-auto">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
