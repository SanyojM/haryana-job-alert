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
import { AlertCircle, AlertTriangle, Video } from "lucide-react";
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
        <div className="flex flex-col h-screen">
            <Head>
                <title>Learning: {course.title}</title>
            </Head>
            
            {/* Simple header for the learn page */}
            <header className="flex-shrink-0 bg-white border-b p-4 flex justify-between items-center">
                 <Link href="/dashboard" className="font-semibold text-lg hover:text-blue-600">
                    &larr; Back to Dashboard
                 </Link>
                 <h1 className="text-lg font-bold text-gray-700 truncate hidden md:block">{course.title}</h1>
                 {/* You can add a "Next Lesson" button here */}
            </header>
            
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
                {/* Main Content (Video + Tabs) */}
                <main className="col-span-12 lg:col-span-9 flex flex-col overflow-y-auto">
                    {/* Video Player Area */}
                    <div className="bg-black">
                        <LessonContent lesson={selectedLesson} />
                    </div>

                    {/* Tabs Area */}
                    <div className="p-4 md:p-8">
                        <Tabs aria-label="Options">
                            <Tab key="overview" title="Overview">
                                {selectedLesson ? (
                                    <>
                                        <h1 className="text-2xl md:text-3xl font-bold mb-4">{selectedLesson.title}</h1>
                                        {selectedLesson.description ? (
                                            <div 
                                                className="prose max-w-none text-gray-700"
                                                dangerouslySetInnerHTML={{ __html: selectedLesson.description }}
                                            />
                                        ) : (
                                            <p className="text-gray-500">No description for this lesson.</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-gray-500">Please select a lesson to see its overview.</p>
                                )}
                            </Tab>
                            <Tab key="notes" title="Notes">
                                <h2 className="text-xl font-semibold">Notes</h2>
                                <p className="text-gray-500">(Feature coming soon)</p>
                            </Tab>
                            <Tab key="announcements" title="Announcements">
                                <h2 className="text-xl font-semibold">Announcements</h2>
                                <p className="text-gray-500">(Feature coming soon)</p>
                            </Tab>
                            <Tab key="reviews" title="Reviews">
                                <h2 className="text-xl font-semibold">Reviews</h2>
                                <p className="text-gray-500">(Feature coming soon)</p>
                            </Tab>
                        </Tabs>
                    </div>
                </main>
                
                {/* Sidebar (now on the right) */}
                <aside className="col-span-12 lg:col-span-3 h-full overflow-y-auto bg-white border-l hidden lg:block">
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