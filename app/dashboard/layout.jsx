"use client"
import React, { useState } from 'react'
import SideBar from './_components/SideBar' 
import Header from './_components/Header'
import { UserCourseListContext } from '../_context/UserCourseListContext'

function DashboardLayout({children}) {
  const [userCourseList, setUserCourseList] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
      <div className="relative min-h-screen">
        {/* Desktop Sidebar */}
        <div className='md:w-64 hidden md:block fixed h-full z-10'>
          <SideBar />
        </div>

        {/* Mobile Sidebar Slide-in Drawer */}
        <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop Blur/Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          
          {/* Drawer Content */}
          <div className={`absolute top-0 left-0 w-64 h-full bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <SideBar closeMenu={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className='md:ml-64 min-h-screen flex flex-col'>
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          <div className='p-5 md:p-10 flex-1'> 
            {children}
          </div>
        </div>
      </div>
    </UserCourseListContext.Provider>
  )
}

export default DashboardLayout