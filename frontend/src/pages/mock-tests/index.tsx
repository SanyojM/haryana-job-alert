import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { ArrowUpRight, User } from "lucide-react";
import BannerHeader from "@/components/shared/BannerHeader";

export type MockSeries = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  mock_categories: {
    name: string;
    slug: string;
  } | null;
  mock_series_tags: {
    tag: {
      name: string;
    };
  }[];
  mock_series_tests?: Array<{
    test_id: number;
    slug: string;
    test: {
      created_at: string;
      description: string | null;
      duration_minutes: number;
      id: string;
      is_free: boolean;
      slug: string;
      title: string;
      total_marks: number;
    };
  }>;
};

interface MockTestsHomePageProps {
  series: MockSeries[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const series = await api.get('/mock-series');
    return { props: { series } };
  } catch (error) {
    console.error("Failed to fetch mock series:", error);
    return { props: { series: [] } };
  }
};

const MockTestsHomePage: NextPage<MockTestsHomePageProps> = ({ series }) => {
  const getLogoText = (categoryName?: string) => {
    if (!categoryName) return 'MT';
    return categoryName.charAt(0).toUpperCase();
  };

  const getTestCount = (mockSeries: MockSeries) => {
    return mockSeries.mock_series_tests?.length || 0;
  };

  const formatLanguages = (tags: { tag: { name: string } }[]) => {
    if (!tags || tags.length === 0) return 'English, Hindi';
    return tags.map((t) => t.tag.name).join(', ');
  };

  const formatPrice = (price: number | null) => {
    return price === null || price === 0 ? 'Free' : `₹${price}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <BannerHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            All Mock Test Series
          </h1>
          <p className="text-gray-600 text-lg">
            Choose from our comprehensive collection of mock test series
          </p>
        </div>

        {series.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No mock test series available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s) => {
              const testCount = getTestCount(s);
              const categorySlug = s.mock_categories?.slug || 'category';
              const detailUrl = `/mock-tests/${categorySlug}/${s.slug}`;
              const logoText = getLogoText(s.mock_categories?.name);

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm p-5 flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <span className="text-slate-700 font-bold text-lg">{logoText}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      <User className="w-3 h-3" />
                      <span>1000+ Users</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-800 leading-tight mb-1.5 line-clamp-2">
                    {s.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {testCount} Total Tests | {testCount > 0 ? '5' : '0'} Free Tests
                  </p>

                  {s.mock_categories && (
                    <div className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md self-start mb-3">
                      {s.mock_categories.name}
                    </div>
                  )}

                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md self-start mb-4">
                    {formatLanguages(s.mock_series_tags)}
                  </div>

                  <ul className="space-y-1.5 text-sm text-gray-600 mb-5 flex-grow">
                    {s.description ? (
                        s.description
                        .split(/\r?\n/)
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span className="line-clamp-3">{line}</span>
                            </li>
                        ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Comprehensive test series</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Pattern-based questions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Detailed solutions provided</span>
                        </li>
                      </>
                    )}
                  </ul>

                  <div className="space-y-2">
                    <div className="text-lg font-bold text-gray-800">
                      {formatPrice(s.price)}
                    </div>
                    <Link href={detailUrl}>
                      <button className="w-full bg-gradient-to-r from-indigo-800 to-indigo-500 hover:from-indigo-700 hover:to-indigo-400 text-white text-center rounded-lg px-4 py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all">
                        <span>View test series</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MockTestsHomePage;