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

interface CategoryWithPosts {
  id: number;
  name: string;
  posts: Array<{
    id: number;
    title: string;
    slug: string;
    category_id: number;
    created_at: string;
  }>;
}

interface HomePageProps {
  posts: Post[];
  categories: Category[];
  categoriesWithPosts: CategoryWithPosts[];
  series: MockSeries[];
  courses: PublicCourse[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [categories, posts, categoriesWithPosts] = await Promise.all([
      api.get('/categories'),
      api.get(`/posts/latest?category=${encodeURIComponent('Latest Jobs')}&limit=8`),
      api.get('/posts/summary?limit=25'),
    ]);

    return { props: { categories, posts, categoriesWithPosts, series: [], courses: [] } };
  } catch (error) {
    console.error("Failed to fetch data for homepage:", error);
    return { props: { categories: [], posts: [], categoriesWithPosts: [], series: [], courses: [] } };
  }
};

const HomePage: NextPage<HomePageProps> = ({ categories, posts, categoriesWithPosts, series, courses }) => {
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
            <PostsSection posts={posts} />
            {/* <AdBanner text="Google Ads Section" className="h-88" /> */}
            <MidCards 
              categoriesWithPosts={categoriesWithPosts}
            />
            <AboutSection />
            <FaqSection />
            </div>
          <div className="lg:col-span-1 ml-18">
            <Sidebar/>
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