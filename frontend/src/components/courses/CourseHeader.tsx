'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe, Star, Users, Award, MonitorPlay, FileText, Download, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import AdBanner from '../home/AdBanner';

// Define the types for the props this component will accept
type CourseHeaderProps = {
  title: string;
  description: string;
  instructorName: string;
  instructorAvatar: string;
  lastUpdated: string;
  language: string;
  rating: number;
  ratingCount: number;
  studentCount: number;
  isBestseller: boolean;
  isFree: boolean;
  thumbnailUrl: string;
    courseDuration: string;
    articlesAttached: number;
    downloadableResources: number;
    freeCourse: boolean;
    mockTests: number;
};

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
  thumbnailUrl,
    courseDuration,
    articlesAttached,
    downloadableResources,
    freeCourse,
    mockTests,
}: CourseHeaderProps) {
  // State to hold the formatted numbers, initialized with the raw numbers
  const [formattedRatingCount, setFormattedRatingCount] = useState<string | number>(ratingCount);
  const [formattedStudentCount, setFormattedStudentCount] = useState<string | number>(studentCount);

  // This effect runs only on the client, after the initial render
  useEffect(() => {
    setFormattedRatingCount(ratingCount.toLocaleString());
    setFormattedStudentCount(studentCount.toLocaleString());
  }, [ratingCount, studentCount]);

  return (
    <section className="bg-[#16161D] text-white p-6 sm:p-8 relative min-h-[65vh] sm:mb-[5rem]">
      <div className="relative z-10 md:px-18 px-4 lg:max-w-4xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-300 mb-6">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><span className="text-gray-500">&gt;</span></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
              <li><span className="text-gray-500">&gt;</span></li>
              <li><Link href="/courses/{id}" className="font-medium text-white">SSC CGL 2025 Courses</Link></li>
            </ol>
        </nav>

        {/* Title and Description */}
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">{title}</h1>
        <p className="max-w-2xl text-gray-200 mb-6">{description}</p>

        {/* Instructor and Badges */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
            <div className="flex items-center gap-2">
                <Image src={instructorAvatar} alt={instructorName} width={32} height={32} className="rounded-full bg-white h-12 w-12 object-cover" />
                <span className="font-medium">By {instructorName}</span>
            </div>
            {isBestseller && (
                <span className="text-xs font-semibold bg-blue-500 text-white px-3 py-1 rounded-md inline-flex items-center gap-1">
                    <Award size={14} /> Bestseller
                </span>
            )}
            {isFree && (
                <span className="text-xs font-semibold bg-gray-700 text-white px-3 py-1 rounded-md">FREE</span>
            )}
        </div>

        <div className='flex gap-4 mb-4 fle-wrap flex-col sm:flex-row'>
            <div className='bg-green-200 text-green-800 px-4 py-2 min-w-[10rem] text-center font-medium rounded-md'>Bestseller</div>
            <div className='bg-purple-300 text-purple-800 px-4 py-2 min-w-[10rem] text-center font-medium rounded-md'>Free</div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300 mb-8 border-b w-fit pb-4">
            <div className="flex items-center gap-1.5"><Clock size={16} /> Last update on {lastUpdated}</div>
            <span className='hidden sm:block'>|</span>
            <div className="flex items-center gap-1.5"><Globe size={16} /> {language}</div>
        </div>

            <AdBanner text={'Google Ads'} className='md:hidden mb-12 h-48' />
        {/* Ratings Block */}
      </div>
        <div className="md:absolute -bottom-20 z-999 bg-white text-gray-800 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 max-w-2xl shadow-lg md:ml-6 lg:ml-18">
            <div className="flex-shrink-0 bg-gradient-to-tr from-red-900 to-red-600 p-4 rounded-md">
                <Image src="/logo.png" alt="Logo" width={60} height={60} className="rounded-sm" />
            </div>
            <div className="flex-grow text-center sm:text-left">
                <p className="font-semibold text-gray-700 leading-tight">Access the best and the latest top content from Haryana Job Alert, with the <span className="font-bold text-red-600">Pro Subscription</span></p>
            </div>
            <div className="text-center flex-shrink-0 pl-4 sm:border-l border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{rating}</p>
                <div className="flex text-yellow-400 justify-center">
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

          <Button className="sm:w-[50%] md:w-[30%] w-full bg-gradient-to-r from-indigo-600 to-indigo-300 xl:hidden mt-8 md:mt-0 md:ml-18">
              Enroll Now
          </Button>

          {/* <div> */}
    <div className="absolute -bottom-[40%] min-w-md right-30">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div className="relative">
            <Image src={thumbnailUrl} alt="Course Thumbnail" width={400} height={225} className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
                <h3 className="font-bold text-2xl mb-4">RAILWAYS NTPS COURSE</h3>
                <p className='text-xs text-center'>{description}</p>
            <div className='bg-gray-200/20 mt-4 px-8 py-2 rounded-sm flex justify-between gap-4 items-center'>
                    <Image src='/js.png' className='w-16 h-16 object-cover border border-white rounded-full bg-white' alt={''} width={128} height={128}/>
                <p className="text-sm">By {instructorName}</p>
            </div>
            </div>
        </div>
        <div className="p-6">
            <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-300 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg">
                Enroll Now
            </button>
            <div className="mt-6 space-y-3 text-gray-600">
                <h4 className="font-bold text-gray-800">The course give you:</h4>
                <div className="flex items-center gap-3"><MonitorPlay size={18} className="text-indigo-500" /> Course Duration: {courseDuration}</div>
                <div className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" /> Articles attached: {articlesAttached}</div>
                <div className="flex items-center gap-3"><Download size={18} className="text-indigo-500" /> Downloadable resources: {downloadableResources}</div>
                <div className="flex items-center gap-3"><CheckCircle size={18} className="text-indigo-500" /> {freeCourse ? 'Free Course' : 'Paid Course'}</div>
                <div className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" /> Mock tests: {mockTests}</div>
            </div>
        </div>
      </div>
    </div>
    <div className='absolute bottom-0 right-0'>
    <Image src="/avatar.png" alt={''} width={120} height={120}/>
    </div>
    {/* </div> */}
    </section>
  );
}

