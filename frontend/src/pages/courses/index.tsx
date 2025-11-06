import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Users } from "lucide-react"; // Import icons

// Reuse the Course type, ensure it includes necessary fields for display
import type { Course } from "@/components/admin/courses/CreateCourseForm";
import type { CourseCategory } from "@/pages/admin/course-categories";

// Define the shape of data coming from GET /courses (public)
interface PublicCourse extends Omit<Course, 'tags' | 'authors'> { // Omit admin-specific relations if needed
    slug: string; // Ensure slug is included
    thumbnail_url: string | null;
    category: CourseCategory | undefined; // Expect category object
    authors: { full_name: string; avatar_url: string }[]; // Expect authors with names
    tags: { tag: { name: string } }[]; // Expect tags nested like this
    enrolled_users_count?: number; // Optional count
    lesson_count?: number; // Optional count
    total_duration_hhmm?: string | null; // Optional duration
    rating: number;
    reviews: number;
    offerEndsSoon: boolean;
    // Add calculated rating if provided by API, otherwise handle client-side if needed
}

interface CoursesHomePageProps {
    courses: PublicCourse[];
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        // Fetch only published courses for the public page
        const courses = await api.get('/courses?status=published');
        return { props: { courses } };
    } catch (error) {
        console.error("Failed to fetch published courses:", error);
        return { props: { courses: [] } };
    }
};

const CoursesHomePage: NextPage<CoursesHomePageProps> = ({ courses }) => {
    return (
        <div className="bg-white min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Available Courses</h1>
                <div className="flex overflow-x-auto scrollbar-hide gap-3 py-2">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white p-2 rounded-2xl overflow-hidden flex flex-col flex-shrink-0 w-[70%] md:w-[32%] shadow-sm">
                            <div className="relative">
                                <Image
                                    src={course?.thumbnail_url || ''}
                                    alt={course?.title}
                                    className="w-full h-auto object-cover aspect-video rounded-2xl"
                                    width={600}
                                    height={400}
                                    unoptimized
                                />
                            </div>

                            <div className="py-5 px-1 flex flex-col flex-grow justify-between">
                                <div className="flex justify-between items-start mb-2 flex-col sm:flex-row">
                                    <h3 className="md:text-md text-sm font-bold text-gray-800 leading-tight">
                                        {course?.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0 ml-2">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span>{course?.rating} ({course?.reviews})</span>
                                    </div>
                                </div>
                                <p className="md:text-sm text-xs text-gray-500 mb-3">{course?.description}</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <Image src={course.authors?.[0]?.avatar_url || ''} width={40} height={40} alt={course.authors?.[0]?.full_name || 'Instructor'} className="w-7 h-7 rounded-full" unoptimized />
                                    <span className="text-sm text-gray-700">By {course.authors.map(name => name.full_name) || 'Unknown Instructor'}</span>
                                </div>

                                <div className="flex md:items-center gap-3 mb-5 flex-col sm:flex-row">
                                    <span className="text-2xl font-bold text-gray-800">
                                        {course.pricing_model === 'free'
                                            ? 'Free'
                                            : `₹${course.sale_price ?? course.regular_price}`
                                        }
                                        {course.pricing_model === 'paid' && course.sale_price && course.regular_price && course.sale_price < course.regular_price && (
                                            <span className="ml-2 text-sm text-muted-foreground line-through">₹{course.regular_price}</span>
                                        )}
                                    </span>
                                    {course.offerEndsSoon && (
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-md">
                                            Free offer will end soon
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto flex items-center gap-3">
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="shine flex-grow bg-gradient-to-r from-red-600 to-gray-800 text-white text-center rounded-lg px-4 py-3 font-semibold text-xs md:text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                                    >
                                        View Course
                                    </Link>
                                    <button className="p-3 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CoursesHomePage;
