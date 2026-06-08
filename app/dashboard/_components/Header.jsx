import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "../../_components/ThemeToggle";
import { Menu } from "lucide-react";

function Header({ onMenuClick }) {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm border-b bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 md:hidden text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Image
          src="/m_Logo.svg"
          width={40}
          height={28}
          alt="Application logo"
          className="logo-filter transition-all duration-200 object-contain"
        />
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
