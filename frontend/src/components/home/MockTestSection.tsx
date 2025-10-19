'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, SlidersHorizontal, User, Loader2, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { MockSeries } from '@/pages/mock-tests';
import Image from 'next/image';

interface MockTestsHomePageProps {
  series: MockSeries[];
}

interface MockCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

type SeriesCategory = {
  name: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [series] = await Promise.all([
      api.get('/mock-series'),
    ]);
    return { props: { series } };
  } catch (error) {
    console.error("Failed to fetch mock data:", error);
    return { props: { series: [] } };
  }
};

const MockTestSection: NextPage<MockTestsHomePageProps> = ({ series }) => {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');
  console.log("rdcfgvbhjnertrvgtybhjxdrcfghvbjdrtfvygbh", series)

  const uniqueCategories = useMemo(() => {
    const categoriesMap = new Map<string, SeriesCategory>();

    series.forEach(s => {
      // Check if the series has a category and it hasn't been added yet
      if (s.mock_categories && !categoriesMap.has(s.mock_categories.slug)) {
        categoriesMap.set(s.mock_categories.slug, s.mock_categories);
      }
    });

    // Return an array of the unique category objects
    return Array.from(categoriesMap.values());
  }, [series]);

  const filteredSeries = useMemo(() => {
    if (selectedCategorySlug === 'all') {
      return series;
    }
    return series.filter(s => s.mock_categories?.slug === selectedCategorySlug);
  }, [series, selectedCategorySlug]);

  const getLogoText = (categoryName?: string) => {
    if (!categoryName) return 'MT';
    return categoryName.charAt(0).toUpperCase();
  };

  const getTestCount = (mockSeries: MockSeries) => {
    return mockSeries.mock_series_tests?.length || 0;
  };

  const getFreeTestCount = (mockSeries: MockSeries) => {
    const count = mockSeries.mock_series_tests?.filter(test => test.test.is_free).length || 0;
    return count;
  }

  const formatLanguages = (tags: { tag: { name: string } }[]) => {
    if (!tags || tags.length === 0) return 'English, Hindi';
    return tags.map((t) => t.tag.name).join(', ');
  };

  const formatPrice = (price: number | null) => {
    return price === null || price === 0 ? 'Free' : `₹${price}`;
  };

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Mock Tests</h2>
          <p className="text-gray-600">Prepare for your exams with our comprehensive test series</p>
        </div>

        {uniqueCategories.length > 0 && (
          <div className="mb-4 bg-white p-1 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategorySlug('all')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors
                  ${selectedCategorySlug === 'all'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                All
              </button>
              {uniqueCategories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategorySlug(category.slug)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                    ${selectedCategorySlug === category.slug
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="right-3 top-3 bottom-3 flex items-center 
                    bg-gradient-to-l from-white from-50% to-transparent 
                    pl-4 pointer-events-none">
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        )}

        {filteredSeries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {selectedCategorySlug === 'all'
                ? 'No mock test series available at the moment.'
                : 'No mock test series found in this category.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSeries.map((s) => {
              const testCount = getTestCount(s);
              const freeTestCount = getFreeTestCount(s);
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
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 px-1.5 py-1.5 rounded-full shadow-sm">
                                                                <Image src="/bolt.png" width={12} height={12} alt='bolt' />
                                                                <span className='text-[7px]'>1977+ Users</span>
                                                            </div>
                  </div>

                  <h3 className="font-bold text-gray-800 leading-tight mb-1.5 line-clamp-2">
                    {s.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2">
                    {testCount} Total Tests | {freeTestCount} Free Tests
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
                      <button className="w-full bg-gradient-to-r from-indigo-800 to-indigo-500 hover:from-indigo-700 hover:to-indigo-400 text-white md:text-center rounded-lg px-1 md:px-4 py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all">
                        <span className='text-xs md:text-sm text-wrap'>View test series</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MockTestSection;