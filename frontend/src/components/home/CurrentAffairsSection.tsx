'use client';

import { useState, useMemo } from 'react'; // 1. Import useMemo
import { ArrowUpRight, SlidersHorizontal, User, Loader2 } from 'lucide-react';
import AdBanner from '../shared/AdBanner';
import Link from 'next/link';
import Image from 'next/image';

const categories = ['Today', 'Popular', 'Week', 'Month'];

const articles = [
    {
        id: 1,
        category: 'Today',
        imageUrl: 'https://placehold.co/600x400/334155/ffffff?text=News+Image+1',
        title: 'From Headlines to Insights: Understanding Global Trends',
    },
    {
        id: 2,
        category: 'Today',
        imageUrl: 'https://placehold.co/600x400/c2410c/ffffff?text=Breaking+News',
        title: 'Politics, Power, and People: Current Affairs Uncovered',
    },
    {
        id: 3,
        category: 'Popular',
        imageUrl: 'https://placehold.co/600x400/1d4ed8/ffffff?text=News+Image+3',
        title: 'Navigating the Now: Key Developments Across the Globe',
    },
    {
        id: 4,
        category: 'Week',
        imageUrl: 'https://placehold.co/600x400/be123c/ffffff?text=Govt+Order',
        title: "Today's World in Focus: Breaking Down the Big Stories",
    },
    {
        id: 5,
        category: 'Month',
        imageUrl: 'https://placehold.co/600x400/4d7c0f/ffffff?text=Politics',
        title: 'The Current Lens: Stories Defining Our Time',
    },
    {
        id: 6,
        category: 'Popular',
        imageUrl: 'https://placehold.co/600x400/581c87/ffffff?text=World+News',
        title: 'Current Affairs Explained: News That Matters Today',
    },
    // Add more articles for testing if you like...
    {
        id: 7,
        category: 'Today',
        imageUrl: 'https://placehold.co/600x400/166534/ffffff?text=News+Image+4',
        title: 'Another article for today to fill the grid.',
    },
    {
        id: 8,
        category: 'Today',
        imageUrl: 'https://placehold.co/600x400/854d0e/ffffff?text=News+Image+5',
        title: 'Fourth article for the second row.',
    },
];

export default function CurrentAffairsSection() {
    const [activeCategory, setActiveCategory] = useState('All');

    // 2. Create the filtered list based on activeCategory
    const filteredArticles = useMemo(() => {
        // If 'All' is selected, return the full list
        if (activeCategory === 'All') {
            return articles;
        }
        // Otherwise, filter by the selected category
        return articles.filter(article => article.category === activeCategory);
    }, [activeCategory]);

    return (
        <section className="bg-gray-100 py-12 px-4 md:px-0">
            <div>
                <div className="text-center mb-20">
                    <Image
                        src="/ca.png"
                        alt="Mock Tests"
                        className="inline-block h-20 w-auto"
                        width={300}
                        height={80}
                    />
                </div>

                <div className="hidden md:flex items-center justify-start gap-4 pb-4">
                    <button
                        key="all"
                        onClick={() => setActiveCategory('All')}
                        className={`p-2 rounded-md transition-colors ${ // Added p-2 for better clicking
                            activeCategory === 'All'
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${activeCategory === category
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* 3. Conditional rendering based on filteredArticles */}
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No articles found for "{activeCategory}".
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3">
                            {/* Use filteredArticles for the first row */}
                            {filteredArticles.slice(0, 3).map((article) => (
                                <div key={article.id} className="bg-white p-2 rounded-2xl overflow-hidden flex flex-col mb-8">
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-48 object-cover rounded-2xl"
                                        width={600}
                                        height={400}
                                        unoptimized
                                    />
                                    <div className="py-5 px-2 flex flex-col flex-grow">
                                        <h3 className="md:font-bold font-medium md:text-lg text-gray-800 leading-tight flex-grow mb-4 text-sm">
                                            {article.title}
                                        </h3>
                                        <button className="w-full bg-gradient-to-r from-emerald-900 to-[#237856] text-white text-center rounded-lg px-4 py-2.5 font-semibold text-xs md:text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                            <span>Learn More</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='mt-10 mb-10 md:hidden'>
                            <AdBanner text="Google Ads Section" className="h-32" />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3">
                            {/* Use filteredArticles for the second row */}
                            {filteredArticles.slice(3, 6).map((article) => (
                                <div key={article.id} className="bg-white p-2 rounded-2xl overflow-hidden flex flex-col">
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-48 object-cover rounded-2xl"
                                        width={600}
                                        height={400}
                                        unoptimized
                                    />
                                    <div className="py-5 px-2 flex flex-col flex-grow">
                                        <h3 className="md:font-bold font-medium md:text-lg text-sm text-gray-800 leading-tight flex-grow mb-4">
                                            {article.title}
                                        </h3>
                                        <button className="w-full bg-gradient-to-r from-emerald-900 to-[#237856] text-white text-center rounded-lg px-4 py-2.5 font-semibold text-xs md:text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                            <span>Learn More</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="text-center mt-12">
                    <button className="bg-gray-100 border-2 border-gray-300 rounded-xl px-12 py-3 font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm">
                        View More
                    </button>
                </div>
                <div className='mt-10 mb-10 md:hidden'>
                    <AdBanner text="Google Ads Section" className="h-32" />
                </div>
            </div>
        </section>
    );
}