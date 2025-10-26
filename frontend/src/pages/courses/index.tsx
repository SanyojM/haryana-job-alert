import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react"; // Import icons

// Reuse the Course type, ensure it includes necessary fields for display
import type { Course } from "@/components/admin/courses/CreateCourseForm";
import type { CourseCategory } from "@/pages/admin/course-categories";

// Define the shape of data coming from GET /courses (public)
interface PublicCourse extends Omit<Course, 'tags' | 'authors'> { // Omit admin-specific relations if needed
    slug: string; // Ensure slug is included
    thumbnail_url: string | null;
    category: CourseCategory | undefined; // Expect category object
    authors: { full_name: string }[]; // Expect authors with names
    tags: { tag: { name: string } }[]; // Expect tags nested like this
    enrolled_users_count?: number; // Optional count
    lesson_count?: number; // Optional count
    total_duration_hhmm?: string | null; // Optional duration
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
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Available Courses</h1>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`} legacyBehavior>
                <a className="block h-full">
                  <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                    {course.thumbnail_url ? (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-xl"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gray-200 rounded-t-xl flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      {course.authors && course.authors.length > 0 && (
                        <CardDescription>By {course.authors.map(a => a.full_name).join(', ')}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <div>
                        {/* Add Rating and Student Count if available */}
                        {/* <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.5</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.enrolled_users_count || 0} students</span>
                        </div> */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.tags?.map(({ tag }) => (
                            <Badge key={tag.name} variant="secondary" className="text-xs">{tag.name}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-auto font-bold text-lg text-right">
                        {course.pricing_model === 'free'
                            ? 'Free'
                            : `₹${course.sale_price ?? course.regular_price}`
                        }
                        {course.pricing_model === 'paid' && course.sale_price && course.regular_price && course.sale_price < course.regular_price && (
                             <span className="ml-2 text-sm text-muted-foreground line-through">₹{course.regular_price}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No courses published yet. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CoursesHomePage;