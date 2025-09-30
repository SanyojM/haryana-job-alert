'use client';

import { ChevronDown, Clock, Users, Globe, Mail, ArrowRight, ChevronRight, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Define the types for the props this component will accept
type TestHeaderProps = {
  title: string;
  level: string;
  lastUpdated: string;
  totalTests: number;
  freeTests: number;
  users: number;
  language: string;
  features: string[];
  isUserLoggedIn: boolean; // Prop to control the sign-up form visibility
};

export default function TestHeader({
  title,
  level,
  lastUpdated,
  totalTests,
  freeTests,
  users,
  language,
  features,
  isUserLoggedIn, // Destructure the new prop
}: TestHeaderProps) {
  // Split features for the two-column layout
  const midPoint = Math.ceil(features.length / 2);
  const chunk = (arr: string[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  const featureGroups = chunk(features, 2);
  const [selectedLevel, setSelectedLevel] = useState(level);

  return (
    <section className="bg-gray-100 p-6 mb-10">
      <div className="flex flex-col lg:flex-row gap-8 justify-between">
        
        {/* Left Side: Main Content */}
        <div>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-12">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
              <li><span className="text-gray-400"><ChevronRight /></span></li>
              <li><Link href="/mock-tests" className="hover:text-indigo-600">Mock Tests</Link></li>
              <li><span className="text-gray-400"><ChevronRight /></span></li>
              {/* <li aria-current="page"><span className="font-medium text-gray-700">SSC Exam</span></li> */}
              <li><Link href="/mock-tests/exams/{id}" className="hover:text-indigo-600 font-medium text-gray-700">SSC Exam</Link></li>
              <li><span className="text-gray-400"><ChevronRight /></span></li>
              <li><Link href="/mock-tests/{id}" className="hover:text-indigo-600">{title}</Link></li>
            </ol>
          </nav>

          {/* Title Section */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <img src="https://placehold.co/60x60/e2e8f0/334155?text=SSC" alt="Test Logo" className="w-14 h-14 rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock size={14} />
                  <span>Last update on {lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <select
                id="level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as 'Beginner' | 'Moderate' | 'Expert')}
                className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Level: Beginner</option>
                <option value="Moderate">Level: Moderate</option>
                <option value="Expert">Level: Expert</option>
              </select>
              <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className='ml-18'>
            {/* Info Tags */}
            <div className="w-fit flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700 font-medium mb-6 border-b-1 pb-6 px-2 border-gray-400">
              <span className="flex items-center gap-1.5">{totalTests} Total Tests</span>
              <span className='text-gray-400'>|</span>
              <span className="bg-gradient-to-r from-green-950 to-green-600 text-white px-3 py-1 rounded-md">{freeTests} FREE Test</span>
              <span className='text-gray-400'>|</span>
              <div className="flex items-center gap-1.5"><Users size={16} /> {users} Users</div>
              <span className='text-gray-400'>|</span>
              <div className="flex items-center gap-1.5 text-cyan-500"><Globe size={16} /> {language}</div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-800 font-medium mb-12">
              {featureGroups.map((group, groupIndex) => (
                <ul key={groupIndex} className="list-disc list-inside">
                  {group.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      {/* <span className="text-gray-700 mt-1">•</span> */}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            {/* Action Button */}
            <button className="min-w-xl sm:w-auto bg-gradient-to-r from-indigo-700 to-indigo-400 text-white font-bold py-3 px-12 rounded-lg hover:opacity-90 transition-opacity">
              Take the mock test
            </button>
          </div>
        </div>
        {/* --- CONDITIONAL SIGN UP SECTION --- */}
        {/* This entire block will only render if isUserLoggedIn is false */}
        <div className=' flex flex-col gap-4 w-full lg:w-96'>
        {!isUserLoggedIn && (
          <div className="flex-shrink-0 w-full">
            <div className="bg-gray-100 rounded-lg border border-gray-400 p-6 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Sign Up To Test Your Exam</h3>
              <p className="text-gray-800 font-bold mb-4">Knowledge Now!</p>
              
              <form className="space-y-3 border border-gray-400 p-6 rounded-lg">
                <div className="relative border-b border-gray-300 mb-4">
                  <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" placeholder="Enter your Email" className="w-full border-none pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-green-950 to-green-600 text-white font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity">
                  Sign up now
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-emerald-500" viewBox="0 0 16 16">
                  <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.875-.433L6.31 9H2.5a.5.5 0 0 1-.395-.807l7-9z"/>
                </svg>
                {users} users have enrolled till now
              </p>
            </div>
          </div>
        )}
        <div className="mt-6 hidden lg:flex justify-center">
              <img src="./illust2.png" alt="Person studying for an exam" />
            </div>
        </div>
      </div>
    </section>
  );
}