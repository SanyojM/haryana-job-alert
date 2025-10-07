'use client';

import { useState } from 'react';
import { ArrowUpRight, SlidersHorizontal, User } from 'lucide-react';
import AdBanner from './AdBanner';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
    { id: 'ssc', name: 'SSC Exam' },
    { id: 'civil', name: 'Civil Services Exam' },
    { id: 'banking', name: 'Banking Exam' },
    { id: 'teaching', name: 'Teaching Exam' },
    { id: 'railways', name: 'Railways Exam' },
];

const mockTests = [
    {
        id: 1,
        category: 'ssc',
        logoUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=SSC',
        title: 'SSC CGL Mock Test Series 2025 (Tier I & Tier II)',
        totalTests: 2182,
        freeTests: 27,
        users: 1977,
        language: 'English, Hindi',
        features: [
            '25 Ultimate Marathon Live Test',
            '15 Eduquity Pattern-Based Full Test',
            '20 Eduquity Pattern-Based Sectional Test',
            '2102 more tests',
        ],
    },
    {
        id: 2,
        category: 'ssc',
        logoUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=UP',
        title: 'UP Police SI (दरोगा) Mock Test Series 2025',
        totalTests: 2182,
        freeTests: 27,
        users: 1977,
        language: 'English, Hindi',
        features: [
            '25 Ultimate Marathon Live Test',
            '15 Eduquity Pattern-Based Full Test',
            '20 Eduquity Pattern-Based Sectional Test',
            '2102 more tests',
        ],
    },
    {
        id: 3,
        category: 'banking',
        logoUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=SBI',
        title: 'SBI Clerk Mock Test Series 2025 - 26 (Pre + Mains)',
        totalTests: 2182,
        freeTests: 27,
        users: 1977,
        language: 'English, Hindi',
        features: [
            '25 Ultimate Marathon Live Test',
            '15 Eduquity Pattern-Based Full Test',
            '20 Eduquity Pattern-Based Sectional Test',
            '2102 more tests',
        ],
    },
    {
        id: 4,
        category: 'banking',
        logoUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=IBPS',
        title: 'IBPS RRB Clerk 2025 Mock Test Series (Pre + Mains)',
        totalTests: 2182,
        freeTests: 27,
        users: 1977,
        language: 'English, Hindi',
        features: [
            '25 Ultimate Marathon Live Test',
            '15 Eduquity Pattern-Based Full Test',
            '20 Eduquity Pattern-Based Sectional Test',
            '2102 more tests',
        ],
    },
    { id: 5, category: 'ssc', logoUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=SSC', title: 'SSC CGL Mock Test Series 2025 (Tier I & Tier II)', totalTests: 2182, freeTests: 27, users: 1977, language: 'English, Hindi', features: ['25 Ultimate Marathon Live Test', '15 Eduquity Pattern-Based Full Test', '20 Eduquity Pattern-Based Sectional Test', '2102 more tests'] },
    { id: 6, category: 'ssc', logoUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=UP', title: 'UP Police SI (दरोगा) Mock Test Series 2025', totalTests: 2182, freeTests: 27, users: 1977, language: 'English, Hindi', features: ['25 Ultimate Marathon Live Test', '15 Eduquity Pattern-Based Full Test', '20 Eduquity Pattern-Based Sectional Test', '2102 more tests'] },
    { id: 7, category: 'banking', logoUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=SBI', title: 'SBI Clerk Mock Test Series 2025 - 26 (Pre + Mains)', totalTests: 2182, freeTests: 27, users: 1977, language: 'English, Hindi', features: ['25 Ultimate Marathon Live Test', '15 Eduquity Pattern-Based Full Test', '20 Eduquity Pattern-Based Sectional Test', '2102 more tests'] },
    { id: 8, category: 'banking', logoUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=IBPS', title: 'IBPS RRB Clerk 2025 Mock Test Series (Pre + Mains)', totalTests: 2182, freeTests: 27, users: 1977, language: 'English, Hindi', features: ['25 Ultimate Marathon Live Test', '15 Eduquity Pattern-Based Full Test', '20 Eduquity Pattern-Based Sectional Test', '2102 more tests'] },
];


export default function MockTestSection() {
    const [activeCategory, setActiveCategory] = useState('ssc');

    return (
        <section className="bg-gray-100 py-12">
            <div>
                <div className="text-center mb-20">
                    <Image
                        src="/mt.png"
                        alt="Mock Tests"
                        className="inline-block h-20 w-auto"
                    />
                </div>


                <div className="hidden md:flex items-center justify-around flex-wrap mb-10">
                    <button className="p-2.5 rounded-full bg-gray-100 text-gray-700 hidden sm:block">
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors ${activeCategory === category.id
                                ? 'bg-green-100 text-green-700'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mb-10">
                    {mockTests.slice(0, 3).map((test) => (
                        <div key={test.id} className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm p-5 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <Image src={test.logoUrl} alt="" className="w-10 h-10 rounded-md" />
                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                    <User className="w-3 h-3" />
                                    <span>{test.users}+ Users</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-800 leading-tight mb-1.5">{test.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">{test.totalTests} Total Tests | {test.freeTests} Free Tests</p>
                            <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md self-start mb-4">
                                {test.language}
                            </div>

                            <ul className="space-y-1.5 text-sm text-gray-600 mb-5">
                                {test.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link href={`/mock-test/${test.id}`}>
                                <button className="w-full bg-gradient-to-r from-indigo-800 to-indigo-500  hover:bg-indigo-100 text-white text-center rounded-lg px-4 py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors">
                                    <span>View test series</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='mt-10 mb-10 md:hidden'>
                    <AdBanner text="Google Ads Section" className="h-32" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockTests.slice(3, 6).map((test) => (
                        <div key={test.id} className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm p-5 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <Image src={test.logoUrl} alt="" className="w-10 h-10 rounded-md" />
                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                    <User className="w-3 h-3" />
                                    <span>{test.users}+ Users</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-800 leading-tight mb-1.5">{test.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">{test.totalTests} Total Tests | {test.freeTests} Free Tests</p>
                            <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md self-start mb-4">
                                {test.language}
                            </div>

                            <ul className="space-y-1.5 text-sm text-gray-600 mb-5">
                                {test.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <button className="w-full bg-gradient-to-r from-indigo-800 to-indigo-500  hover:bg-indigo-100 text-white text-center rounded-lg px-4 py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors">
                                    <span>View test series</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='mt-10 mb-10 md:hidden'>
                    <AdBanner text="Google Ads Section" className="h-32" />
                </div>

                <div className="text-center mt-12">
                    <button className="bg-gray-100 border-2 border-gray-300 rounded-xl px-12 py-3 font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm">
                        View More
                    </button>
                </div>
            </div>
        </section>
    );
}
