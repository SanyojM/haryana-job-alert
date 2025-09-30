'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Latest Jobs', href: '#' },
  { name: 'Admit Card', href: '#' },
  { name: 'Result', href: '#' },
  { name: 'Yojna', href: '#' },
  { name: 'Offline form', href: '#' },
  { name: 'Answer Key', href: '#' },
  { name: 'Mock Test', href: '#' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        <div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap">
          <div className="marquee-content flex">
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Haryana Job Alert for FREE.</p>
          </div>
        </div>

        <nav className="lg:container mx-auto px-4 mt-5">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex-shrink-0">
              <img className="h-14 w-14" src="LOGO.png" alt="Haryana Job Alert Logo" />
            </a>

            <div className="hidden lg:flex items-center justify-center flex-1">
                <div className='p-2 rounded-xl border'>
              <div className="bg-white rounded-xl shadow-lg px-4 py-2 flex items-center space-x-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      link.name === 'Home'
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="border-l border-gray-200 ml-2 pl-4 flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black" />
                    <Search className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black" />
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
                <a
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    link.name === 'Home'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </a>
              ))}
               <div className="border-t border-gray-200 mt-2 pt-2 flex items-center space-x-4 px-3">
                    <a href="#" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                        <Search className="w-5 h-5" />
                        <span>Search</span>
                    </a>
                </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

