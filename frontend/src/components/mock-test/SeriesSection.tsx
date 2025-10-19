'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, SlidersHorizontal, User, Loader2, ChevronRight, Bolt, Languages, ArrowRight } from 'lucide-react';
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

const SeriesSection: NextPage<MockTestsHomePageProps> = ({ series }) => {
    const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');

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
                    <div className="flex overflow-x-auto scrollbar-hide gap-3">
                        {filteredSeries.map((s) => {
                            const testCount = getTestCount(s);
                            const freeTestCount = getFreeTestCount(s);
                            const categorySlug = s.mock_categories?.slug || 'category';
                            const detailUrl = `/mock-tests/${categorySlug}/${s.slug}`;
                            const logoText = getLogoText(s.mock_categories?.name);

                            return (
                                <div
                                    key={s.id}
                                    className="bg-white flex-shrink-0 md:w-[30%] w-[70%] rounded-2xl border border-gray-200/90 shadow-lg p-3 flex flex-col hover:shadow-xl transition-shadow duration-300"
                                >
                                    {/* --- Card Header --- */}
                                    <div className="flex justify-between items-start mb-4">
                                        {/* Logo */}
                                        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                            <span className="text-slate-700 font-bold text-lg">{logoText}</span>
                                        </div>
                                        {/* User Count Pill */}
                                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 px-1.5 py-1.5 rounded-full shadow-sm">
                                            <Image src="/bolt.png" width={12} height={12} alt='bolt' />
                                            <span className='text-[7px]'>1977+ Users</span>
                                        </div>
                                    </div>

                                    {/* --- Title --- */}
                                    <h3 className="font-bold text-gray-800 text-md leading-tight mb-3 h-[40px]">
                                        {s.title}
                                    </h3>

                                    {/* --- Test Counts --- */}
                                    <p className="text-xs text-gray-600 mb-3">
                                        {testCount} Total Tests | <span className="text-green-600 font-semibold">{freeTestCount} Free Tests</span>
                                    </p>

                                    {/* --- Divider --- */}
                                    <hr className="mb-2" />

                                    {/* --- Language --- */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <Languages className="w-4 h-4 text-gray-500 text-xs" />
                                        <span className='text-xs'>{formatLanguages(s.mock_series_tags)}</span>
                                    </div>

                                    <hr className="mb-2" />

                                    {/* --- Features List --- */}
                                    <ul className="space-y-2 text-xs text-gray-600 mb-6">
                                        {s.description ? (
                                            s.description
                                                .split(/\r?\n/)
                                                .map((line) => line.trim())
                                                .filter(Boolean)
                                                .slice(0, 4) // Show first 4 features
                                                .map((line, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <span className="text-indigo-500 text-lg leading-none">•</span>
                                                        <span className="line-clamp-1">{line}</span>
                                                    </li>
                                                ))
                                        ) : (
                                            <>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-indigo-500 text-xs leading-none">•</span>
                                                    <span>Comprehensive test series</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-indigo-500 text-xs leading-none">•</span>
                                                    <span>Pattern-based questions</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-indigo-500 text-xs leading-none">•</span>
                                                    <span>Detailed solutions provided</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-indigo-500 text-xs leading-none">•</span>
                                                    <span>+2102 more tests</span>
                                                </li>
                                            </>
                                        )}
                                    </ul>

                                    {/* --- View Button --- */}
                                    <div className="mt-auto">
                                        <Link href={detailUrl}>
                                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs text-white text-center rounded-lg px-4 py-3 font-medium inline-flex items-center justify-center gap-2 transition-all group">
                                                <span>View test series</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

export default SeriesSection;