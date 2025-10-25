'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe, Star, Users, Award, ChevronRight } from 'lucide-react'; // Removed unused icons
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
// import AdBanner from '../shared/AdBanner'; // AdBanner removed from this component's structure

// --- MODIFICATION START ---
// Define the types ONLY for props used by THIS component
type CourseHeaderProps = {
  title: string;
  description: string;
  instructorName: string;
  instructorAvatar: string; // Assuming you might use this, keeping it
  lastUpdated: string;
  language: string;
  rating: number; // Used in the ratings block
  ratingCount: number; // Used in the ratings block
  studentCount: number; // Used in the ratings block
  isBestseller: boolean;
  isFree: boolean;
  // REMOVED props belonging to CourseEnrollmentCard:
  // thumbnailUrl, courseDuration, articlesAttached,
  // downloadableResources, freeCourse, mockTests
};
// --- MODIFICATION END ---

export default function CourseHeader({
  title,
  description,
  instructorName,
  instructorAvatar,
  lastUpdated,
  language,
  rating,
  ratingCount,
  studentCount,
  isBestseller,
  isFree,
}: CourseHeaderProps) { // Removed unused props from function signature
  // State to hold the formatted numbers, initialized with the raw numbers
  const [formattedRatingCount, setFormattedRatingCount] = useState<string | number>(ratingCount);
  const [formattedStudentCount, setFormattedStudentCount] = useState<string | number>(studentCount);

  // This effect runs only on the client, after the initial render
  useEffect(() => {
    setFormattedRatingCount(ratingCount.toLocaleString());
    setFormattedStudentCount(studentCount.toLocaleString());
  }, [ratingCount, studentCount]);

  // --- MODIFICATION START ---
  // Removed the CourseEnrollmentCard JSX from this component.
  // It should be rendered separately on the page ([slug].tsx).
  // --- MODIFICATION END ---

  return (
    // Adjusted bottom margin/padding as the enrollment card is removed
    <section className="bg-[#16161D] text-white p-6 sm:p-8 relative min-h-[40vh] pb-24 md:pb-32">
      <div className="relative z-10 md:px-18 px-4 lg:max-w-4xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-300 mb-6">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><span className="text-gray-500"><ChevronRight size={14}/></span></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
              <li><span className="text-gray-500"><ChevronRight size={14}/></span></li>
              {/* Make breadcrumb dynamic later */}
              <li><span className="font-medium text-white line-clamp-1">{title}</span></li>
            </ol>
        </nav>

        {/* Title and Description */}
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">{title}</h1>
        <p className="max-w-2xl text-gray-200 mb-6">{description}</p>

        {/* Instructor and Badges */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
            <div className="flex items-center gap-2">
                {/* Use instructorAvatar prop */}
                <Image src={instructorAvatar || '/default-avatar.png'} alt={instructorName} width={48} height={48} className="rounded-full bg-white h-12 w-12 object-cover border-2 border-indigo-300" />
                <span className="font-medium">By {instructorName}</span>
            </div>
            {isBestseller && (
                <span className="shine text-xs font-semibold bg-green-200 text-green-800 px-3 py-1 rounded-md inline-flex items-center gap-1">
                    <Award size={14} /> Bestseller
                </span>
            )}
             {/* Use isFree prop */}
            {isFree && (
                <span className="shine text-xs font-semibold bg-purple-300 text-purple-800 px-3 py-1 rounded-md">FREE</span>
            )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300 mb-8 border-b border-gray-700 w-fit pb-4">
            <div className="flex items-center gap-1.5"><Clock size={16} /> Last update on {lastUpdated}</div>
            <span className='hidden sm:block text-gray-600'>|</span>
            <div className="flex items-center gap-1.5"><Globe size={16} /> {language}</div>
        </div>

      </div>
      {/* Moved Ratings Block to overlap bottom */}
      <div className="absolute -bottom-16 left-0 right-0 px-4 md:px-10 lg:px-24 z-20">
        <div className=" bg-white text-gray-800 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 max-w-2xl shadow-lg mx-auto sm:mx-0 sm:ml-6 lg:ml-18">
            <div className="shine flex-shrink-0 bg-gradient-to-r from-[#982920] to-[#fb3d3d] p-4 rounded-md">
                <Image src="/logo.png" alt="Logo" width={60} height={60} className="rounded-sm bg-none" />
            </div>
            <div className="flex-grow text-center sm:text-left">
                <p className="font-semibold text-gray-700 leading-tight">Access the best and the latest top content from Haryana Job Alert, with the <span className="font-bold text-red-600">Pro Subscription</span></p>
            </div>
            <div className="text-center flex-shrink-0 pl-4 sm:border-l border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{rating}</p>
                <div className="flex text-yellow-400 justify-center">
                    {/* Add logic to display stars based on rating */}
                    <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} className="text-gray-300" />
                </div>
                <p className="text-xs text-gray-500 mt-1">{formattedRatingCount} ratings</p>
            </div>
            <div className="text-center flex items-center flex-col flex-shrink-0 px-4 py-4 sm:border-l border-gray-200">
                <Users size={24} />
                <p className="text-xl font-bold text-gray-900 mt-1">{formattedStudentCount}</p>
                <p className="text-xs text-gray-500 mt-1">Learners</p>
            </div>
        </div>
      </div>

        {/* Removed Enroll button and absolute positioned images/cards */}

    </section>
  );
}