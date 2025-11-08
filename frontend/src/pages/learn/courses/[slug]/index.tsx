import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import LearnSidebar from "@/components/courses/LearnSidebar";
import LessonContent from "@/components/courses/LessonContent";
import { FullCourseDetails } from "@/pages/courses/[slug]"; // Reuse this type
import { Lesson, Topic } from "@/pages/admin/courses/[id]"; // Reuse this type
import { AlertCircle, AlertTriangle, Book, Video } from "lucide-react";
import { Button } from "@heroui/button";
import {Tabs, Tab} from "@heroui/tabs";
import Link from "next/link";

interface CourseLearnPageProps {
  slug: string;
}

// 1. getServerSideProps only passes the slug. Data fetching is done client-side.
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params!;
    if (typeof slug !== 'string') {
        return { notFound: true };
    }
    return { props: { slug } };
};


const CourseLearnPage: NextPage<CourseLearnPageProps> = ({ slug }) => {
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // State for data
    const [course, setCourse] = useState<FullCourseDetails | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. useEffect handles fetching data and checking auth/enrollment
    useEffect(() => {
        const loadCourseData = async () => {
            if (!isAuthLoading && !token) {
                // Not logged in, redirect to login
                router.replace(`/auth/login?redirect=${router.asPath}`);
                return;
            }

            if (token) {
                try {
                    setIsLoading(true);
                    setError(null);

                    // First, get course ID and check enrollment (requires backend endpoints)
                    const basicCourse = await api.get(`/courses/slug/${slug}`, token);
                    if (!basicCourse || !basicCourse.id) {
                         throw new Error("Course not found.");
                    }

                    const enrollmentStatus = await api.get(`/courses/${basicCourse.id}/check-enrollment`, token);
                    
                    if (!enrollmentStatus.enrolled) {
                        // Not enrolled, redirect back to course info page
                        setError("You are not enrolled in this course.");
                        router.replace(`/courses/${slug}`);
                        return;
                    }

                    // Enrolled! Set the full course data
                    // We sort topics/lessons here
                    const sortedTopics = (basicCourse.course_topics || []).sort((a: Topic, b: Topic) => a.order - b.order);
                    sortedTopics.forEach((topic: Topic) => {
                        if (topic.lessons) {
                            topic.lessons.sort((a, b) => a.order - b.order);
                        }
                    });
                    basicCourse.course_topics = sortedTopics;

                    setCourse(basicCourse);
                    // Set the first lesson as the default
                    setSelectedLesson(basicCourse.course_topics?.[0]?.lessons?.[0] || null);

                } catch (err: unknown) {
                    console.error("Failed to load course content:", err);
                    setError(err instanceof Error ? err.message : "Failed to load course content.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadCourseData();
    }, [slug, token, isAuthLoading, router]);

    // 3. Render loading/error/content states
    if (isLoading || isAuthLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h2 className="text-xl font-semibold">Loading Course...</h2>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="flex h-screen items-center justify-center flex-col gap-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-semibold">Error Loading Course</h2>
                <p className="text-gray-500">{error}</p>
                <Button onPress={() => router.push('/courses')}>Go back to Courses</Button>
            </div>
        );
    }
    
    if (!course) {
        return <div className="flex h-screen items-center justify-center">Course not found.</div>;
    }

    // 4. Render the NEW two-column layout
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Head>
                <title>Learning: {course.title}</title>
            </Head>
            
            {/* Enhanced header for the learn page */}
            <header className="flex-shrink-0 bg-gray-950 shadow-sm">
                <div className="px-4 py-4 flex justify-between items-center">
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-2 hover:text-gray-400 transition-colors group text-white pr-5 pl-2 rounded-full py-1"
                    >
                        <svg 
                            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg md:text-xl text-white truncate hidden md:block max-w-md lg:max-w-2xl">
                            {course.title}
                        </h1>
                    </div>
                </div>
            </header>
            
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
                {/* Main Content (Video + Tabs) */}
                <main className="col-span-12 lg:col-span-9 flex flex-col overflow-y-auto bg-white">
                    {/* Enhanced Video Player Area */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        <LessonContent lesson={selectedLesson} />
                    </div>

                    {/* Enhanced Tabs Area */}
                    <div className="p-4 md:p-8 lg:p-10 flex flex-col items-center">
                        <Tabs 
                            aria-label="Course content tabs"
                            classNames={{
                                tabList: "bg-gray-100 p-1 rounded-xl shadow-inner border border-gray-200",
                                cursor: "bg-gradient-to-r from-[#4e54c8] to-[#8f94fb] shadow-md",
                                tab: "px-6 py-3 font-semibold transition-all",
                                tabContent: "group-data-[selected=true]:text-white"
                            }}
                        >
                            <Tab 
                                key="overview" 
                                className="w-full"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Book className="w-4 h-4" />
                                        <span>Overview</span>
                                    </div>
                                }
                            >
                                <div className="mt-6 space-y-6">
                                    {selectedLesson ? (
                                        <>
                                            <div className="border-l-4 border-gray-800 pl-6">
                                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                                    {selectedLesson.title}
                                                </h1>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
                                                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                                                        <Video className="w-4 h-4 text-gray-700" />
                                                        Lesson {selectedLesson.order}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedLesson.description ? (
                                                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                                                    <div 
                                                        className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-gray-800 hover:prose-a:text-gray-900 prose-strong:text-gray-900"
                                                        dangerouslySetInnerHTML={{ __html: selectedLesson.description }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-gray-500 text-lg">No description available for this lesson.</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-16 bg-gray-100 rounded-xl border border-gray-200">
                                            <div className="animate-pulse mb-4">
                                                <Video className="w-16 h-16 text-gray-400 mx-auto" />
                                            </div>
                                            <p className="text-gray-600 text-lg font-medium">Select a lesson from the sidebar to begin</p>
                                        </div>
                                    )}
                                </div>
                            </Tab>
                            <Tab 
                                key="notes" 
                                className="w-full"
                                title={
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Notes</span>
                                    </div>
                                }
                            >
                                <div className="mt-6 text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-200">
                                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Notes Feature</h2>
                                    <p className="text-gray-600 text-lg">Coming soon - Take notes while learning!</p>
                                </div>
                            </Tab>
                            <Tab 
                                key="announcements" 
                                className="w-full"
                                title={
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                        <span>Announcements</span>
                                    </div>
                                }
                            >
                                <div className="mt-6 text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-200">
                                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Announcements</h2>
                                    <p className="text-gray-600 text-lg">Stay tuned for important updates!</p>
                                </div>
                            </Tab>
                            <Tab 
                                key="reviews" 
                                className="w-full"
                                title={
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <span>Reviews</span>
                                    </div>
                                }
                            >
                                <div className="mt-6 text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-200">
                                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews & Ratings</h2>
                                    <p className="text-gray-600 text-lg">Share your feedback soon!</p>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </main>
                
                {/* Enhanced Sidebar (now on the right) */}
                <aside className="col-span-12 lg:col-span-3 h-full overflow-y-auto bg-white shadow-sm hidden lg:block">
                    <LearnSidebar
                        course={course}
                        selectedLessonId={selectedLesson?.id || null}
                        onSelectLesson={(lesson) => setSelectedLesson(lesson)}
                    />
                </aside>
            </div>
        </div>
    );
};

export default CourseLearnPage;