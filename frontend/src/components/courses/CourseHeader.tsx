'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe, Star, Users, Award, ChevronRight } from 'lucide-react'; // Removed unused icons
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { FileText, Download, CheckCircle, MonitorPlay, ExternalLink } from 'lucide-react';
import CourseEnrollmentCard from './CourseEnrollmentCard';
import { FullCourseDetails } from '@/pages/courses/[slug]';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
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
  course: FullCourseDetails;
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
  course
}: CourseHeaderProps) { // Removed unused props from function signature
  // State to hold the formatted numbers, initialized with the raw numbers
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [formattedRatingCount, setFormattedRatingCount] = useState<string | number>(ratingCount);
  const [formattedStudentCount, setFormattedStudentCount] = useState<string | number>(studentCount);
    const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled || false);
    const [isProcessingEnrollment, setIsProcessingEnrollment] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const firstAuthor = course.authors?.[0];

  // This effect runs only on the client, after the initial render
  useEffect(() => {
    setFormattedRatingCount(ratingCount.toLocaleString());
    setFormattedStudentCount(studentCount.toLocaleString());
  }, [ratingCount, studentCount]);

  // --- MODIFICATION START ---
  // Removed the CourseEnrollmentCard JSX from this component.
  // It should be rendered separately on the page ([slug].tsx).
  // --- MODIFICATION END ---

  const formatDuration = (totalSeconds?: number | null, hhmm?: string | null): string => {
    if (hhmm) return hhmm;
    if (!totalSeconds || totalSeconds <= 0) return "N/A";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
     // Simple format, adjust as needed
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "< 1m";
};

  const handleEnrollOrPurchase = async () => {
          setIsProcessingEnrollment(true);
          setError(null); // Assuming you add an error state if needed
  
          if (!user) {
              router.push(`/auth/login?redirect=${router.asPath}`);
              setIsProcessingEnrollment(false);
              return;
          }
  
          const authToken = token || undefined;
  
          try {
              if (course.pricing_model === 'free') {
                  // Call free enrollment endpoint (needs backend implementation)
                  await api.post(`/courses/${course.id}/enroll`, {}, authToken);
                  alert("Successfully enrolled!"); // Placeholder
                  setIsEnrolled(true); // Update UI
                  // Optionally reload or redirect to a 'learning' page
                  router.push(`/learn/courses/${course.slug}`);
  
              } else { // Paid course
                  // 1. Create Order
                  const orderPayload = { course_id: parseInt(course.id) }; // Ensure ID is number if needed
                  const order = await api.post('/payments/create-order', orderPayload, authToken);
  
                   // 2. Open Razorpay Checkout
                  const options = {
                      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                      amount: order.amount, // Amount from backend (in paise)
                      currency: "INR",
                      name: "Haryana Job Alert",
                      description: `Course Purchase: ${order.course_title || course.title}`, // Get title from order or course
                      order_id: order.order_id, // From backend
                      handler: function (response: any) {
                          // This function runs on successful payment
                          console.log("Razorpay Response:", response);
                          alert("Payment successful! You are now enrolled.");
                          setIsEnrolled(true); // Update UI
                          // You might want to verify payment on backend here before confirming enrollment fully
                          // Optionally reload or redirect
                          // router.push(`/learn/courses/${course.slug}`);
                      },
                      prefill: {
                          name: user.full_name,
                          email: user.email,
                          // contact: user.phone // If you have phone number
                      },
                      theme: {
                          color: "#3399cc" // Your brand color
                      }
                  };
  
                   // Check if Razorpay is loaded (it's loaded via script in _document.tsx)
                   if (!(window as any).Razorpay) {
                      throw new Error("Razorpay SDK not loaded");
                   }
  
                  const rzp = new (window as any).Razorpay(options);
  
                   // Handle payment failure
                   rzp.on('payment.failed', function (response: any){
                          console.error("Razorpay Payment Failed:", response.error);
                          alert(`Payment failed: ${response.error.description || 'Please try again.'}`);
                          // setError(`Payment failed: ${response.error.description}`);
                   });
  
                  rzp.open(); // Open the checkout modal
  
              }
          } catch (err: unknown) {
               console.error("Enrollment/Purchase Error:", err);
               const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
               alert(`Error: ${errorMessage}`);
               // setError(errorMessage);
          } finally {
              setIsProcessingEnrollment(false);
          }
      }; 

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
      <div className="absolute -bottom-16 left-0 right-0 px-4 md:px-10 lg:px-24 z-20 hidden xl:block">
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
        {/* <div className="absolute -bottom-[40%] min-w-md right-30">
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
          <button className="shine w-full bg-gradient-to-r from-indigo-600 to-indigo-300 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg">
                Enroll Now
            </button>
            <div className="mt-6 space-y-3 text-gray-600">
                <h4 className="font-bold text-gray-800">The course give you:</h4>
                <div className="flex items-center gap-3"><MonitorPlay size={18} className="text-indigo-500" /> Course Duration: {courseDuration}</div>
                <div className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" /> Articles attached: {articlesAttached}</div>
                <div className="flex items-center gap-3"><CheckCircle size={18} className="text-indigo-500" /> {isFree ? 'Free Course' : 'Paid Course'}</div>
                <div className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" /> Mock tests: {mockTests}</div>
            </div>
        </div>
      </div>
    </div>
    <div className='absolute bottom-0 right-0'>
    <Image src="/avatar.png" alt={''} width={120} height={120}/>
    </div> */}

<div className="absolute -bottom-[40%] xl:max-w-lg min-w-md right-45 hidden xl:block">
      <CourseEnrollmentCard
        // --- CORRECTED PROPS ---
        // courseId={Number(course.id)}                // Pass ID as a number
        slug={course.slug}                            // <-- ADDED: Pass the slug for navigation
        isEnrolled={isEnrolled}
        pricingModel={course.pricing_model}
        price={course.sale_price ?? course.regular_price}
        regularPrice={course.regular_price}
        onEnrollOrPurchase={handleEnrollOrPurchase}
        isLoading={isProcessingEnrollment || isAuthLoading}
        error={error}
        title={course.title}
        thumbnailUrl={course.thumbnail_url || "https://via.placeholder.com/400x225"}
        instructorName={firstAuthor?.full_name || 'HJA Team'}
        courseDuration={formatDuration(null, course.total_duration_hhmm)}
        articlesAttached={0}
        downloadableResources={0}
        mockTests={0}
      // --- REMOVED description and freeCourse props ---
      />
      </div>
      <div className='hidden bottom-0 right-15 xl:block absolute'>
    <Image src="/avatar.png" alt={''} width={120} height={120}/>
    </div>
    </section>
  );
}