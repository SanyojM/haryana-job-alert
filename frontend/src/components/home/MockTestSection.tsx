'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, SlidersHorizontal, User, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import AdBanner from './AdBanner';
import Link from 'next/link';
import Image from 'next/image';

interface MockCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface MockSeries {
  id: number;
  title: string;
  description?: string;
  slug: string;
  price: number;
  category_id: number;
  created_at: string;
  mock_categories?: {
    name: string;
    slug: string;
  };
  mock_series_tags?: Array<{
    tag: {
      id: number;
      name: string;
    };
  }>;
  mock_series_tests?: Array<{
    test_id: number;
    slug: string;
  }>;
}

export default function MockTestSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [categories, setCategories] = useState<MockCategory[]>([]);
  const [mockSeries, setMockSeries] = useState<MockSeries[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<MockSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/mock-categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch mock series
  useEffect(() => {
    const fetchMockSeries = async () => {
      try {
        setLoading(true);
        const data = await api.get('/mock-series');
        setMockSeries(data);
        setFilteredSeries(data);
      } catch (err) {
        console.error('Error fetching mock series:', err);
        setError('Failed to load mock tests');
      } finally {
        setLoading(false);
      }
    };

    fetchMockSeries();
  }, []);

  // Filter series based on active category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredSeries(mockSeries);
    } else {
      const filtered = mockSeries.filter(
        (series) => Number(series.category_id) === Number(activeCategory)
      );
      setFilteredSeries(filtered);
    }
    setVisibleCount(6); // Reset visible count when category changes
  }, [activeCategory, mockSeries]);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const getLogoText = (categoryName?: string) => {
    if (!categoryName) return 'MT';
    return categoryName.charAt(0).toUpperCase();
  };

  const getTestCount = (series: MockSeries) => {
    return series.mock_series_tests?.length || 0;
  };

  const formatLanguages = (tags?: Array<{ tag: { name: string } }>) => {
    if (!tags || tags.length === 0) return 'English, Hindi';
    return tags.map((t) => t.tag.name).join(', ');
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `₹${price}`;
  };

  if (error) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Mock Tests</h2>
          <p className="text-gray-600">Prepare for your exams with our comprehensive test series</p>
        </div>

        {/* Category Filter */}
        <div className="hidden md:flex items-center flex-wrap gap-3 mb-10">
          <button title='test' className="p-2.5 rounded-full bg-gray-100 text-gray-700">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors ${
              activeCategory === 'all'
                ? 'bg-green-100 text-green-700'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id.toString())}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors ${
                activeCategory === category.id.toString()
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {/* Mock Test Cards - First 3 */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:mb-10">
              {filteredSeries.slice(0, Math.min(3, visibleCount)).map((series) => (
                <MockSeriesCard key={series.id} series={series} getLogoText={getLogoText} getTestCount={getTestCount} formatLanguages={formatLanguages} formatPrice={formatPrice} />
              ))}
            </div>

            {/* Ad Banner - Mobile Only */}
            {visibleCount > 3 && (
              <div className="mt-10 mb-10 md:hidden">
                <AdBanner text="Google Ads Section" className="h-32" />
              </div>
            )}

            {/* Mock Test Cards - Next 3 */}
            {visibleCount > 3 && filteredSeries.length > 3 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeries.slice(3, Math.min(6, visibleCount)).map((series) => (
                  <MockSeriesCard key={series.id} series={series} getLogoText={getLogoText} getTestCount={getTestCount} formatLanguages={formatLanguages} formatPrice={formatPrice} />
                ))}
              </div>
            )}

            {/* Additional cards if visible count is more than 6 */}
            {visibleCount > 6 && filteredSeries.length > 6 && (
              <>
                <div className="mt-10 mb-10 md:hidden">
                  <AdBanner text="Google Ads Section" className="h-32" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredSeries.slice(6, visibleCount).map((series) => (
                    <MockSeriesCard key={series.id} series={series} getLogoText={getLogoText} getTestCount={getTestCount} formatLanguages={formatLanguages} formatPrice={formatPrice} />
                  ))}
                </div>
              </>
            )}

            {/* Ad Banner - Mobile Only (after additional cards) */}
            {visibleCount > 6 && (
              <div className="mt-10 mb-10 md:hidden">
                <AdBanner text="Google Ads Section" className="h-32" />
              </div>
            )}

            {/* No Results */}
            {filteredSeries.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No mock test series found for this category.</p>
              </div>
            )}

            {/* View More Button */}
            {visibleCount < filteredSeries.length && (
              <div className="text-center mt-12">
                <button
                  onClick={handleViewMore}
                  className="bg-gray-100 border-2 border-gray-300 rounded-xl px-12 py-3 font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                >
                  View More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// Separate component for Mock Series Card
function MockSeriesCard({
  series,
  getLogoText,
  getTestCount,
  formatLanguages,
  formatPrice,
}: {
  series: MockSeries;
  getLogoText: (name?: string) => string;
  getTestCount: (series: MockSeries) => number;
  formatLanguages: (tags?: Array<{ tag: { name: string } }>) => string;
  formatPrice: (price: number) => string;
}) {
  const testCount = getTestCount(series);
  const categorySlug = series.mock_categories?.slug || 'category';
  const seriesSlug = series.slug;
  const detailUrl = `/mock-tests/${categorySlug}/${seriesSlug}`;
  const logoText = getLogoText(series.mock_categories?.name);

  return (
    <div className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm p-5 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          <span className="text-slate-700 font-bold text-lg">{logoText}</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          <User className="w-3 h-3" />
          <span>1000+ Users</span>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 leading-tight mb-1.5 line-clamp-2">
        {series.title}
      </h3>
      <p className="text-xs nd:text-sm text-gray-500 mb-2">
        {testCount} Total Tests | {testCount > 0 ? '5' : '0'} Free Tests
      </p>
      <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md self-start mb-4">
        {formatLanguages(series.mock_series_tags)}
      </div>

      <ul className="space-y-1.5 text-sm text-gray-600 mb-5 flex-grow">
        {series.description ? (
            series.description
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs md:text-sm">
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
          {formatPrice(Number(series.price))}
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
}