import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/shared/Sidebar";
import TestHeader from "@/components/mock-test/TestHeader";
import TestLists from "@/components/mock-test/TestLists";
import FaqSection from "@/components/home/FaqSection";
import AdBanner from "@/components/shared/AdBanner";
import { useState, useEffect } from "react";
import Link from "next/link";
import SeriesSection from "@/components/mock-test/SeriesSection";
import MockTestSection from "@/components/home/MockTestSection";
import { MockSeries } from "@/pages/mock-tests";


export type MockTest = {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
  slug: string;
};

export type MockSeriesDetails = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  created_at: string;
  mock_series_tests: {
      test: MockTest;
      full_slug: string;
  }[];
  mock_categories: {
    name: string;
    slug: string;
  };
};

interface MockTestPageProps {
  series: MockSeriesDetails;
  categories: MockSeries[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { categorySlug, seriesSlug } = context.params!;
  try {
    const [categories, series] = await Promise.all([
        api.get('/mock-series'),
        api.get(`/mock-series/slug/${categorySlug}/${seriesSlug}`)
    ]);
    return { props: { categories, series } };
  } catch (error) {
    console.error(`Failed to fetch mock series with slug /${categorySlug}/${seriesSlug}:`, error);
    console.error("Failed to fetch data for homepage:", error);
    return { props: { categories: [], series: [] } };
  }
};

const MockTestSeriesPage: NextPage<MockTestPageProps> = ({ series, categories }) => {
  const testsInSeries = series.mock_series_tests.map(join => ({
    ...join.test,
    full_slug: join.full_slug
  }));

  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(series.created_at).toLocaleDateString());
  }, [series.created_at]);


  return (
    <div className="bg-gray-100 ">
      <Header />
      <div className="px-4 py-8 container mx-auto max-w-6xl">
        <TestHeader
          seriesId={series.id}
          seriesCategory={series.mock_categories.name}
          seriesName={series.title}
          title={series.title}
          price={series.price}
          lastUpdated={formattedDate}
          totalTests={testsInSeries.length}
          freeTests={testsInSeries.filter(t => t.is_free).length}
          users={0} 
          level="Beginner"
          language="English, Hindi"
          features={[]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
          <main className="lg:col-span-4 space-y-8 md:ml-24">
            <TestLists tests={testsInSeries} seriesId={series.id} />
            <AdBanner text={"Google Ads"} className="h-48"/>
            <SeriesSection series={categories} />
            <FaqSection />
          </main>
          <aside className="space-y-8 col-span-1">
            <Sidebar />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MockTestSeriesPage;