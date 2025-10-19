'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, User, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from 'next/image';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Latest Jobs', href: '/category/latest-jobs' },
  { name: 'Admit Cards', href: '/category/admit-cards' },
  { name: 'Offline Forms', href: '/offline-forms' },
  { name: 'Online Forms', href: '/online-forms' },
  { name: 'Answer Keys', href: '/category/answer-keys' },
  { name: 'Mock Test', href: '/mock-tests' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentPath = usePathname();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
  }, [isMenuOpen]);

  return (
    <>
      <style jsx>{`
        .marquee-content {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <header className='bg-gray-100'>
        <div className="bg-black text-white py-1 overflow-hidden whitespace-nowrap text-sm">
          <div className="marquee-content flex">
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
          </div>
        </div>

        <nav className="lg:container mx-auto px-4 mt-5">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0">
              <img className="h-14 w-14 rounded-full" src="/logo.png" alt="Haryana Job Alert Logo" />
            </Link>

            <div className="hidden lg:flex items-center justify-center flex-1 mr-14">
              <div className='p-2 rounded-xl border'>
                <div className="bg-white rounded-xl shadow-lg px-4 py-2 flex items-center space-x-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-2 rounded-xl text-md font-medium transition-colors ${link.href === currentPath
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-l border-gray-200 ml-2 pl-4 flex items-center space-x-3">
                    <HoverCard openDelay={0} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        {/* This is the trigger element (your profile icon) */}
                        <button className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 rounded-md">
                          <Image src="/profile.png" width={18} height={18} alt='profile'/>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-48 p-2" side="top">
                        {/* This is the menu content */}
                        <div className="flex flex-col space-y-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>

                          {/* This is the divider */}
                          <hr className="my-1" />

                          <button
                            onClick={() => logout()} // Call your logout function
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-red-50 text-sm font-medium text-red-600 w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <Link href="#" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                      <Search className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:hidden" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-200">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden bg-gray-100 shadow-lg absolute w-full z-999 origin-top-right">
            <div className="flex flex-col space-y-1 px-2 pt-2 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${link.href === currentPath
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {link.name}
                </Link>

              ))}
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md text-base font-medium">
                Profile
              </Link>
              <button onClick={() => logout()} className="flex items-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-md text-base font-medium">
                Logout
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

