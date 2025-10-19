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

interface HomePageProps {
  posts: Post[];
  categories: Category[]; // Add categories to the props
  series: MockSeries[]; // Add series to the props
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch both posts and categories at the same time
    const [posts, categories, series] = await Promise.all([
        api.get('/posts'),
        api.get('/categories'),
        api.get('/mock-series'),
    ]);
    return { props: { posts, categories, series } };
  } catch (error) {
    console.error("Failed to fetch data for homepage:", error);
    return { props: { posts: [], categories: [], series: [] } };
  }
};

const HomePage: NextPage<HomePageProps> = ({ posts, categories, series }) => {
  console.log("Categories fetched for homepage:", categories);
  console.log("Posts fetched for homepage:", posts);
  console.log("Mock series fetched for homepage:", series);

  const answerKeyPosts = posts.filter(p => p.categories?.name === 'Answer Key').slice(0, 6);
  const admitCardPosts = posts.filter(p => p.categories?.name === 'Admit Cards').slice(0, 5);
  const admissionPosts = posts.filter(p => p.categories?.name === 'Admissions').slice(0, 5);

  return (
    <div className='bg-gray-100'>
      <Head>
        <title>Haryana Job Alert - Latest Govt Jobs, Results, Admit Cards</title>
        <meta name="description" content="Your one-stop destination for the latest government job alerts, exam results, and admit cards in Haryana and across India." />
      </Head>
      <Header />
      {/* Pass the dynamic categories data to the component */}
      <TopLinksSection categories={categories} />
      <main className="md:p-4 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
            <div className="lg:col-span-3 flex flex-col gap-6">
            {/* <AdBanner text="Google Ads Section" className="h-24" /> */}
            <PostsSection posts={posts.slice(0, 8)} />
            <AdBanner text="Google Ads Section" className="h-88" />
            <MidCards 
              categories={categories}
            />
            <MockTestSection series={series} />
            <AdBanner text="Google Ads Section" className="h-32" />
            <CurrentAffairsSection />
            <CourseSection />
            <AboutSection />
            <FaqSection />
            </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
        <div>
          <ProfileCard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;