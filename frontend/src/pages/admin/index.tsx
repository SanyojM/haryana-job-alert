import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { Card, CardHeader, CardBody } from "@heroui/card";
import { BookCopy, Library, FileText, LayoutDashboard, Users, UserCheck } from 'lucide-react'; // Added icons
import Link from 'next/link';
import { Button } from '@heroui/button';

interface AdminDashboardProps {
  courseCount: number;
  seriesCount: number;
  testCount: number;
  postCount: number;
  totalCourseEnrollments: number;
  totalSeriesEnrollments: number;
  recentPosts: { id: string; title: string }[];
  recentCourses: { id: string; title: string; slug: string }[];
}

const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
  <Card className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h2 className="text-sm font-medium text-gray-600">{title}</h2>
      {icon}
    </CardHeader>
    <CardBody>
      <div className="text-3xl font-bold">{value}</div>
    </CardBody>
  </Card>
);

const AdminIndex: NextPage<AdminDashboardProps> = ({ 
  courseCount, 
  seriesCount, 
  testCount, 
  postCount,
  totalCourseEnrollments,
  totalSeriesEnrollments,
  recentCourses,
  recentPosts,
}) => {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h1>
            
            {/* A grid to display the stat cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Courses" 
                    value={courseCount} 
                    icon={<BookCopy className="h-5 w-5 text-gray-500" />} 
                />
                <StatCard 
                    title="Test Series" 
                    value={seriesCount} 
                    icon={<Library className="h-5 w-5 text-gray-500" />} 
                />
                <StatCard 
                    title="Mock Tests" 
                    value={testCount} 
                    icon={<FileText className="h-5 w-5 text-gray-500" />} 
                />
                <StatCard 
                    title="Total Posts" 
                    value={postCount} 
                    icon={<LayoutDashboard className="h-5 w-5 text-gray-500" />} 
                />
                <StatCard 
                    title="Course Enrollments" 
                    value={totalCourseEnrollments} 
                    icon={<Users className="h-5 w-5 text-gray-500" />} 
                />
                <StatCard 
                    title="Series Enrollments" 
                    value={totalSeriesEnrollments} 
                    icon={<UserCheck className="h-5 w-5 text-gray-500" />} 
                />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-4 mt-4">Recent Activity</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Posts Card */}
                <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Recent Posts</h3>
                    </CardHeader>
                    <CardBody>
                        <ul className="divide-y divide-gray-200">
                            {recentPosts.length > 0 ? recentPosts.map(post => (
                                <li key={post.id} className="py-3">
                                    <p className="text-sm font-medium text-gray-900">{post.title}</p>
                                </li>
                            )) : (
                                <p className="text-sm text-gray-500">No recent posts found.</p>
                            )}
                        </ul>
                    </CardBody>
                </Card>

                {/* Recent Courses Card */}
                <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Recent Courses</h3>
                    </CardHeader>
                    <CardBody>
                        <ul className="divide-y divide-gray-200">
                            {recentCourses.length > 0 ? recentCourses.map(course => (
                                <li key={course.id} className="py-3 flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">{course.title}</p>
                                    <Link href={`/admin/courses/${course.id}`} passHref>
                                        <Button variant="light" size="sm">Manage</Button>
                                    </Link>
                                </li>
                            )) : (
                                <p className="text-sm text-gray-500">No recent courses found.</p>
                            )}
                        </ul>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {

  try {
    const [courses, mockSeries, mockTests, posts] = await Promise.all([
      api.get('/courses'), 
      api.get('/mock-series'),
      api.get('/mock-tests'),
      api.get('/posts'),
    ]);

    const courseData = courses.data || courses;
    const seriesData = mockSeries.data || mockSeries;
    const postData = posts.data || posts;

    const totalCourseEnrollments = courseData.reduce((sum: number, course: any) => 
        sum + (course.enrolled_users_count || 0), 0
    );
    
    const totalSeriesEnrollments = seriesData.reduce((sum: number, series: any) => 
        sum + (series.enrolled_users_count || 0), 0
    );

    const recentPosts = postData.slice(0, 5).map((post: any) => ({
        id: post.id,
        title: post.title
    }));
    
    const recentCourses = courseData.slice(0, 5).map((course: any) => ({
        id: course.id,
        title: course.title,
        slug: course.slug
    }));

    return {
      props: {
        courseCount: courses.data ? courses.data.length : courses.length,
        seriesCount: mockSeries.data ? mockSeries.data.length : mockSeries.length,
        testCount: mockTests.data ? mockTests.data.length : mockTests.length,
        postCount: posts.data ? posts.data.length : posts.length,
        totalCourseEnrollments,
        totalSeriesEnrollments,
        recentCourses,
        recentPosts,
      }
    };

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return {
      props: {
        courseCount: 0,
        seriesCount: 0,
        testCount: 0,
        postCount: 0,
        totalCourseEnrollments: 0,
        totalSeriesEnrollments: 0,
        recentPosts: [],
        recentCourses: []
      }
    };
  }
};

export default AdminIndex;