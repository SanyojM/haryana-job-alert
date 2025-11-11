import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { api } from "@/lib/api";
import { Post } from "@/pages/admin/posts"; 
import { Category } from "@/pages/admin/getting-started/categories"; // Import the Category type

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import ProfileCard from '@/components/home/ProfileCard';
import AdBanner from '@/components/shared/AdBanner';
import AboutSection from '@/components/home/AboutSection';
import TopLinksSection from '@/components/home/TopLinksSection';
import PostsSection from '@/components/home/PostsSection';
import MidCards from '@/components/home/MidCards';
import MockTestSection from '@/components/home/MockTestSection';
import CurrentAffairsSection from '@/components/home/CurrentAffairsSection';
import CourseSection from '@/components/home/CourseSection';
import FaqSection from '@/components/home/FaqSection';
import { MockSeries } from "./mock-tests";
import FloatingSocials from "@/components/shared/FloatingSocials";
import FancyContainer from "@/components/about/FancyContainer";
import BannerHeader from "@/components/shared/BannerHeader";
import { useEffect, useState } from "react";
import type { Course } from "@/components/admin/courses/CreateCourseForm";
import type { CourseCategory } from "@/pages/admin/course-categories";

interface PublicCourse extends Omit<Course, 'tags' | 'authors'> {
    slug: string;
    thumbnail_url: string | null;
    category: CourseCategory | undefined;
    authors: { full_name: string; avatar_url: string }[];
    tags: { tag: { name: string } }[];
    enrolled_users_count?: number;
    lesson_count?: number;
    total_duration_hhmm?: string | null;
    rating: number;
    reviews: number;
    offerEndsSoon: boolean;
}

interface HomePageProps {
  posts: Post[];
  categories: Category[]; // Add categories to the props
  series: MockSeries[]; // Add series to the props
  courses: PublicCourse[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [categories, series, course] = await Promise.all([
      api.get('/categories'),
      api.get('/mock-series'),
      api.get('/courses?status=published'),
    ]);

    const courses = course.data || course;
    return { props: { categories, series, courses } };
  } catch (error) {
    console.error("Failed to fetch data for homepage:", error);
    return { props: { categories: [], series: [], courses: [] } };
  }
};

const HomePage: NextPage<HomePageProps> = ({ categories, series, courses }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="bg-white overflow-x-hidden">
      <Head>
        <title>Haryana Job Alert - Latest Govt Jobs, Results, Admit Cards</title>
        <meta name="description" content="Your one-stop destination for the latest government job alerts, exam results, and admit cards in Haryana and across India." />
      </Head>
      <Header />
      <TopLinksSection categories={categories} />
      <main className="md:p-4 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
            <div className="lg:col-span-3 flex flex-col gap-6">
            {loadingPosts ? (
              <div className="text-center py-10 text-gray-500">Loading posts...</div>
            ) : (
              <PostsSection posts={posts.slice(0, 8)} />
            )}
            {/* <AdBanner text="Google Ads Section" className="h-88" /> */}
            <MidCards 
              categories={categories}
              posts={posts}
            />
            <MockTestSection series={series} />
            {/* <AdBanner text="Google Ads Section" className="h-32" /> */}
            {/* <CurrentAffairsSection /> */}
            {/* <CourseSection courses={courses} /> */}
            <AboutSection />
            <FaqSection />
            </div>
          <div className="lg:col-span-1 ml-18">
            <Sidebar courses={courses} />
          </div>
        </div>
        <div>
          {/* <ProfileCard /> */}
          {/* <FancyContainer/> */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;