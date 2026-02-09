"use client" // This is required to use useState

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { UserCourseListContext } from "./_context/UserCourseListContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  // 1. Initialize the shared state
  const [userCourseList, setUserCourseList] = useState([]);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* 2. Provide the state and setter to the entire app */}
          <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
            {children}
          </UserCourseListContext.Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}