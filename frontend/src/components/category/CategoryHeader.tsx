// src/components/JobPostHeader.tsx

import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, ClipboardList, MapPin, ChevronRight } from 'lucide-react';

interface categoryHeaderProps {
  title: string;
  organization: string;
  logoUrl: string;
  lastDate: string;
  totalVacancies: number;
  location: string;
}

export default function CategoryHeader({
  title,
  organization,
  logoUrl,
  lastDate,
  totalVacancies,
  location,
}: categoryHeaderProps) {
  return (
    <section className="bg-gray-100 border-b border-slate-200 py-8">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-12 hidden md:block">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
              <li><span className="text-gray-400"><ChevronRight /></span></li>
              <li><Link href="/category" className="hover:text-indigo-600">Category</Link></li>
            </ol>
          </nav>

        {/* Main Header Content */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Image
            src={logoUrl}
            alt={`${organization} logo`}
            width={80}
            height={80}
            className="rounded-full border p-1 object-contain flex-shrink-0"
          />
          <div className="flex-grow">
            <h1 className="text-3xl font-extrabold text-gray-800">
              {title}
            </h1>
            <p className="text-lg text-gray-600 mt-1">{organization}</p>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Last Date to Apply: {lastDate}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 text-md font-medium text-gray-700">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <span>{totalVacancies.toLocaleString()} Total Posts</span>
          </div>
          <div className="flex items-center gap-2 text-md font-medium text-gray-700">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>Job Location: {location}</span>
          </div>
          {/* You can add more stats here as needed */}
        </div>

      </div>
    </section>
  );
}