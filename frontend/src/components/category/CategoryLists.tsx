import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

type CategoryCategory = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  title: string;
  department: string;
  lastDate: string;
  qualification: string;
  category: string; // Used for filtering
  detailsUrl: string;
};

const categories: CategoryCategory[] = [
  { id: 'all-jobs', name: 'All Jobs' },
  { id: 'latest', name: 'Latest' },
  { id: 'govt-jobs', name: 'Govt Jobs' },
  { id: 'private-jobs', name: 'Private Jobs' },
  { id: 'teaching', name: 'Teaching' },
  { id: 'railway', name: 'Railway' },
];

const category: Category[] = [
  {
    id: '1',
    title: 'Haryana Police Constable Recruitment 2025',
    department: 'Haryana Staff Selection Commission (HSSC)',
    lastDate: '2025-11-20',
    qualification: '12th Pass',
    category: 'govt-jobs',
    detailsUrl: '#',
  },
  {
    id: '2',
    title: 'Software Engineer - Next.js',
    department: 'Tech Solutions Pvt. Ltd.',
    lastDate: '2025-11-30',
    qualification: 'B.Tech in CS/IT',
    category: 'private-jobs',
    detailsUrl: '#',
  },
  {
    id: '3',
    title: 'Railway Group D Vacancy',
    department: 'Railway Recruitment Board (RRB)',
    lastDate: '2025-12-15',
    qualification: '10th Pass + ITI',
    category: 'railway',
    detailsUrl: '#',
  },
  {
    id: '4',
    title: 'Primary School Teacher (PRT)',
    department: 'Board of School Education Haryana (BSEH)',
    lastDate: '2025-11-25',
    qualification: 'D.El.Ed / JBT',
    category: 'teaching',
    detailsUrl: '#',
  },
    {
    id: '5',
    title: 'Clerk - High Court of Punjab & Haryana',
    department: 'High Court Recruitment Board',
    lastDate: '2025-12-05',
    qualification: 'Any Graduate',
    category: 'govt-jobs',
    detailsUrl: '#',
  },
];

export default function CategoryList() {
      const [activeCategory, setActiveCategory] = useState('all-jobs');
    
      // Logic to filter jobs based on the selected category
      const filteredCategory = category.filter(category => {
        if (activeCategory === 'all-jobs' || activeCategory === 'latest') {
          return true; // Show all jobs for 'All Jobs' and 'Latest'
        }
        return category.category === activeCategory;
      });
    return (
        <section className="mb-8 mt-8">
         <div className="flex items-center flex-wrap gap-3">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${activeCategory === category.id
                        ? 'bg-blue-600 text-white' // Using a different color for better contrast
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
        
      </section>
    );
}