import { CheckCircle2, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Category } from '@/pages/admin/getting-started/categories'; // Import the Category type
import Link from 'next/link'; // Import Link for navigation
import Image from 'next/image';
import { AuthDialog } from '../auth/AuthDialog';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface TopLinksSectionProps {
  categories: Category[];
}

export default function TopLinksSection({ categories }: TopLinksSectionProps) {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const { user } = useAuth();
  return (
    <section className="bg-white pb-8 px-4 sm:px-6 lg:px-8 mt-0">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-6 mt-8 sm:-mt-6">

        <img src="/leftarrow.png" alt="" className='inline w-17 h-12 object-cover mt-10' />
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Haryana <span className="text-red-500">Job</span> Alert is a <span className="text-red-500">FREE</span> Website to get
        </h1>
        <img src="/rightarrow.png" alt="" className='inline w-17 h-12 object-cover mt-10' />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 justify-center">
          {/* Map over the dynamic categories to create links */}
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              passHref
              legacyBehavior
            >
              <a className="inline-flex items-center justify-center text-gray-700 font-semibold hover:scale-105 hover:text-gray-900 transition-transform duration-200">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap underline decoration-gray-300 transition-all text-md text-center">
                  {category.name}
                </span>
                <ArrowUpRight className="min-w-4 min-h-4 w-4 h-4 text-gray-400 ml-1" />
              </a>
            </Link>
          ))}
        </div>

        <p className="my-10 text-gray-800 font-semibold text-md text-center gap-2">
          You can freely use this website without registration or login
          <span className="relative inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full ml-2">
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600 animate-ping"></span>
            LIVE
          </span>
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          {
            user?.id ? 

              <button className="shine group w-full sm:w-auto bg-gradient-to-r from-[#222627] to-[#414245] rounded-xl shadow-md px-1 py-1 flex items-center justify-between font-semibold text-white hover:shadow-lg cursor-pointer hover:scale-105 group duration-300 transition-transform hover:bg-gradient-to-b hover:from-[#1c1e47] hover:via-[#2b2d6c] hover:to-[#34387e]" onClick={() => window.location.href= user.role === 'admin' ? '/admin' : '/dashboard'}>
              <span className='sm:text-sm text-sm pl-3 text-nowrap'>Dashboard</span>
              <span className="ml-4 w-10 h-10 rounded-lg bg-green-400 group-hover:bg-white object-cover flex items-center justify-center">
              <Image src="/arrow.png" width={48} height={48} alt='arrow' className='rounded-lg group-hover:hidden block' />
              <Image src="/white-arrow.jpg" width={48} height={48} alt='arrow' className='rounded-lg group-hover:block hidden' />
              </span>
              </button>
             : 
              <button className="shine group w-full sm:w-auto bg-gradient-to-r from-[#222627] to-[#414245] rounded-xl shadow-md px-1 py-1 flex items-center justify-between font-semibold text-white hover:shadow-lg cursor-pointer hover:scale-105 group duration-300 transition-transform hover:bg-gradient-to-b hover:from-[#1c1e47] hover:via-[#2b2d6c] hover:to-[#34387e]" onClick={() => setShowSignupForm(true)}>
              <span className='sm:text-sm text-sm pl-3 text-nowrap'>Login / Register</span>
              <span className="ml-4 w-10 h-10 rounded-lg bg-green-400 group-hover:bg-white object-cover flex items-center justify-center">
              <Image src="/arrow.png" width={48} height={48} alt='arrow' className='rounded-lg group-hover:hidden block' />
              <Image src="/white-arrow.jpg" width={48} height={48} alt='arrow' className='rounded-lg group-hover:block hidden' />
              </span>
              </button>
            
          }
              
          <button className="shine w-full sm:w-auto bg-gradient-to-r from-[#222627] to-[#414245] rounded-xl shadow-md p-1 flex items-center justify-between font-semibold text-white hover:shadow-lg transition-transform cursor-pointer hover:scale-105 group duration-300 hover:bg-gradient-to-b hover:from-[#1c1e47] hover:via-[#2b2d6c] hover:to-[#34387e]">
            <a href="https://whatsapp.com/channel/0029VbBbS0R7T8bTQRa9230i" target="_blank" rel="noopener noreferrer" className='w-full flex items-center justify-between'>
            <span className='text-sm pl-3 text-nowrap'>Join WhatsApp</span>
            <Image
              src="/wp.png" 
              alt="Contact avatar"
              className="w-10 h-10 rounded-lg ml-4 group-hover:hidden block"
              width={32}
              height={32}
              unoptimized
            />
            <Image
              src="/wp-icon.png" 
              alt="Contact avatar"
              className="w-10 h-10 p-1 rounded-lg ml-4 group-hover:block hidden"
              width={32}
              height={32}
              unoptimized
            />
            </a>
          </button>
        </div>
      </div>

      <AuthDialog open={showSignupForm} onOpenChange={setShowSignupForm} />
    </section>
  );
}
