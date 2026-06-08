import React from 'react';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <div className='flex justify-between items-center p-5 shadow-sm border-b bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 transition-colors duration-200'> 
      <Image 
        src={"/logo.svg"} 
        width={160} 
        height={36} 
        alt="Logo"
        className="logo-filter transition-all duration-200 object-contain"
      />
      <div className='flex items-center gap-4'>
        <ThemeToggle />
        <Button className="bg-blue-500 hover:bg-blue-600">Get Started</Button>
      </div>
    </div>
  )
}

export default Header
