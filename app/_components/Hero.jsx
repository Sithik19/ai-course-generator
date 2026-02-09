import React from 'react'
import Link from 'next/link' // 1. Import Link

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white">
      <div className="mx-auto max-w-screen-md px-4 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span className="block text-blue-500">
            AI Course Generator
          </span>
          <span className="block text-black">
            Custom Learning Paths, Powered by AI
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-700">
          Unlock personalized education with AI-driven course creation. Tailored learning paths to suit your goals and pace.
        </p>

        <div className="mt-8 flex justify-center">
          {/* 2. Use Link instead of <a> */}
          <Link
            href="/dashboard"
            className="inline-block rounded bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;