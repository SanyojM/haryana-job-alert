'use client';

import { useState } from 'react';
import { ChevronRight, Clock, HelpCircle, FileText, Lock } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface TestItem {
  id: number;
  title: string;
  totalTests: number;
  users: number;
  duration: number;
  questions: number;
  marks: number;
  language: string;
  isFree: boolean;
}

// --- MOCK DATA ---
const testCategories = ["Railways Exam", "SSC Exam", "NDA Exam", "CTET Exam", "CDS Exam", "HPSC Exam", "JBT Exam"];

const allTests: TestItem[] = [
  // Paid Tests
  { id: 1, title: 'SSC CGL Mock Test Series 2025 (Tier I & Tier II) All Tests', totalTests: 2167, users: 2256, duration: 60, questions: 100, marks: 100, language: 'English, Hindi', isFree: false },
  { id: 2, title: 'SSC CGL Mock Test Series 2025 (Tier I & Tier II) All Tests', totalTests: 2167, users: 2256, duration: 60, questions: 100, marks: 100, language: 'English, Hindi', isFree: false },
  { id: 3, title: 'SSC CGL Mock Test Series 2025 (Tier I & Tier II) All Tests', totalTests: 2167, users: 2256, duration: 60, questions: 100, marks: 100, language: 'English, Hindi', isFree: false },
  // Free Tests
  { id: 4, title: 'SSC CGL Free Mock Test 1', totalTests: 2167, users: 2256, duration: 60, questions: 100, marks: 100, language: 'English, Hindi', isFree: true },
  { id: 5, title: 'SSC CGL Free Mock Test 2', totalTests: 2167, users: 2256, duration: 60, questions: 100, marks: 100, language: 'English, Hindi', isFree: true },
];

// --- MAIN COMPONENT ---
export default function TestLists() {
  const [activeTab, setActiveTab] = useState('Paid Tests');
  const [activeCategory, setActiveCategory] = useState('SSC Exam');

  const filteredTests = allTests.filter(test => activeTab === 'Paid Tests' ? !test.isFree : test.isFree);

  return (
    <section className="bg-gray-100">
      {/* Category Filter Tabs */}
      <div className="relative border border-gray-400 mb-6 rounded-xl py-2 px-4">
        <div className="flex items-center gap-8 overflow-x-auto">
          {testCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-2 px-1 text-sm font-semibold whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full">
            <ChevronRight size={18} />
        </button>
      </div>

      {/* Free/Paid Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('Free tests')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeTab === 'Free tests' ? 'bg-white text-indigo-600 border border-indigo-200 shadow-sm' : 'bg-transparent text-gray-600'
          }`}
        >
          Free tests
        </button>
        <button
          onClick={() => setActiveTab('Paid Tests')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeTab === 'Paid Tests' ? 'bg-red-600 text-white shadow-sm' : 'bg-transparent text-gray-600'
          }`}
        >
          Paid Tests
        </button>
      </div>

      {/* List of Tests */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-gray-100 rounded-lg shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-2 mt-8">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{test.title} ({test.totalTests})</h3>
                    <div className="flex items-center text-xs text-blue-500 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.875-.433L6.31 9H2.5a.5.5 0 0 1-.395-.807l7-9z"/></svg>
                        <span>{test.users} Users</span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1.5"><Clock size={14} /> {test.duration} Mins</div>
                  <div className="flex items-center gap-1.5"><HelpCircle size={14} /> {test.questions} Questions</div>
                  <div className="flex items-center gap-1.5"><FileText size={14} /> {test.marks} Marks</div>
                </div>
              </div>
              <button className="flex-shrink-0 w-full sm:w-auto bg-gradient-to-r from-red-600 to-gray-800 text-white font-semibold py-2.5 px-6 rounded-lg inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <Lock size={16} />
                Unlock Test
              </button>
            </div>
            <div className="p-1 border-t border-gray-200/80 bg-green-200 rounded-bl-xl rounded-br-xl">
                <span className="text-xs font-semibold text-green-700 px-2.5 py-1 rounded-md">{test.language}</span>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-8">
        <button className="bg-gray-100 border-2 border-gray-300 rounded-xl px-12 py-3 font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
            View More
        </button>
      </div>

    </section>
  );
}