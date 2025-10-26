import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/shared/Header";
import LearnSidebar from "@/components/courses/LearnSidebar";
import LessonContent from "@/components/courses/LessonContent";
import { FullCourseDetails } from "@/pages/courses/[slug]"; // Reuse this type
import { Lesson, Topic } from "@/pages/admin/courses/[id]"; // Reuse this type
import { HashLoader } from "react-spinners";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

                    // We fetch the course data *with* the token.
                    // The backend MUST be configured to check enrollment
                    // and only return data if the user is enrolled.
                    
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
                <HashLoader color="#8a79ab" size={100} />
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="flex h-screen items-center justify-center flex-col gap-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-semibold">Error Loading Course</h2>
                <p className="text-gray-500">{error}</p>
                <Button onClick={() => router.push('/courses')}>Go back to Courses</Button>
            </div>
        );
    }
    
    if (!course) {
        return <div className="flex h-screen items-center justify-center">Course not found.</div>;
    }

    // 4. Render the two-column layout
    return (
        <div className="flex flex-col h-screen">
            <Head>
                <title>Learning: {course.title}</title>
            </Head>
            {/* A simple header for the learn page */}
            <header className="flex-shrink-0 bg-white border-b p-4 flex justify-between items-center">
                 <Link href="/dashboard" className="font-semibold text-lg hover:text-blue-600">
                    &larr; Back to Dashboard
                 </Link>
                 <h1 className="text-lg font-bold text-gray-700 truncate hidden md:block">{course.title}</h1>
                 {/* You can add a "Next Lesson" button here */}
            </header>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-full max-w-xs h-full overflow-y-auto hidden md:block">
                    <LearnSidebar
                        course={course}
                        selectedLessonId={selectedLesson?.id || null}
                        onSelectLesson={(lesson) => setSelectedLesson(lesson)}
                    />
                </div>
                
                {/* Main Content */}
                <main className="flex-1 h-full overflow-y-auto bg-gray-50">
                    <LessonContent 
                        lesson={selectedLesson} 
                        courseTitle={course.title}
                    />
                </main>
            </div>
        </div>
    );
};

export default CourseLearnPage;