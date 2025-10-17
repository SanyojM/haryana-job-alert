import { CheckCircle2, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Category } from '@/pages/admin/getting-started/categories'; // Import the Category type
import Link from 'next/link'; // Import Link for navigation
import Image from 'next/image';

interface TopLinksSectionProps {
  categories: Category[];
}

export default function TopLinksSection({ categories }: TopLinksSectionProps) {
  return (
    <section className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="sm:text-4xl md:text-4xl font-bold text-gray-800 tracking-tight">
          Haryana <span className="text-yellow-500">Job</span> Alert is a <span className="text-yellow-500">FREE</span> Website to get
        </h1>

        <div className="mt-8 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4">
          {/* Map over the dynamic categories to create links */}
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
              passHref
              legacyBehavior
            >
              <a className="group inline-flex items-center md:justify-center text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="underline decoration-gray-300 group-hover:decoration-gray-700 transition-all text-xs">
                  {category.name}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-gray-800 font-semibold text-md flex items-center justify-center gap-2">
          You can freely use this website without registration or login
          <span className="relative inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600 animate-ping"></span>
            LIVE
          </span>
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-white rounded-xl shadow-md px-6 py-3 flex items-center justify-between font-semibold text-gray-800 hover:shadow-lg transition-shadow">
            <span className='sm:text-sm text-xs'>Login / Register</span>
            <span className="ml-4 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-white" />
            </span>
          </button>
          
          <button className="w-full sm:w-auto bg-white rounded-xl shadow-md px-6 py-3 flex items-center justify-between font-semibold text-gray-800 hover:shadow-lg transition-shadow">
            <span className='text-sm'>Contact Us</span>
            <Image
              src="https://placehold.co/40x40/60a5fa/ffffff?text=🧑&font=noto" 
              alt="Contact avatar"
              className="w-5 h-5 rounded-full ml-4"
              width={32}
              height={32}
              unoptimized
            />
          </button>
        </div>
      </div>
    </section>
  );
}
