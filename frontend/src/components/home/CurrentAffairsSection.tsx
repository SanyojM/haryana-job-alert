'use client';

import { useState } from 'react';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import AdBanner from './AdBanner';
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
];

export default function CurrentAffairsSection() {
    const [activeCategory, setActiveCategory] = useState('Today');

    return (
        <section className="bg-gray-100 py-12">
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

                <div className="hidden md:flex items-center justify-start gap-4 md:gap-6 mb-10 pb-4">
                    <SlidersHorizontal className="w-5 h-5 text-gray-500 hidden sm:block" />
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

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.slice(0, 3).map((article) => (
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.slice(3, 6).map((article) => (
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
