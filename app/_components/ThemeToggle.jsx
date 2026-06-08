"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Read persisted theme, defaulting to light mode
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "light";
    
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="relative w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-800 cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        aria-label="Toggle theme"
      >
        {/* Track Icons */}
        <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none">
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <Moon className="h-3.5 w-3.5 text-blue-400" />
        </div>
        
        {/* Sliding Knob */}
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-950 shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out transform ${
            theme === "dark" ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {/* Dynamic Icon inside Knob */}
          {theme === "dark" ? (
            <Moon className="h-3 w-3 text-blue-400 fill-blue-400" />
          ) : (
            <Sun className="h-3 w-3 text-amber-500 fill-amber-500" />
          )}
        </div>
      </button>
      <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 hidden sm:inline select-none">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </div>
  );
}
