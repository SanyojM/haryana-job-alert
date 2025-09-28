import { Youtube, Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';

const importantPages = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Latest jobs', href: '#' },
    { name: 'About us', href: '#' },
    { name: 'Yojna', href: '#' },
    { name: 'Disclaimer', href: '#' },
    { name: 'Mock tests', href: '#' },
    { name: 'Disclaimer', href: '#' },
    { name: 'Current Affairs', href: '#' },
    { name: 'Contact us', href: '#' },
    { name: 'Results', href: '#' },
];


export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-8">
            <div className="md:flex items-center gap-4 mb-6 text-center md:text-start">
                <img src="./LOGO.png" alt="Logo" className="w-16 h-16 rounded-full hidden md:block" />
                <h2 className="text-4xl font-extrabold text-gray-900">Get in touch</h2>
                <div className="flex items-center gap-3 md:ml-4 justify-center md:justify-start mt-4 md:mt-0">
                    <a href="#" className="text-red-600 hover:opacity-80"><Youtube size={32} /></a>
                    <a href="#" className="text-pink-600 hover:opacity-80"><Instagram size={32} /></a>
                    <a href="#" className="text-green-500 hover:opacity-80"><MessageCircle size={32} /></a>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                    <img src="./illust.png" alt="Contact illustration" className="w-48 h-auto" />
                </div>
                <div className="text-lg space-y-2 font-medium">
                    <p><strong>Mobile No:</strong> +91 1234567890</p>
                    <p><strong>Email:</strong> test@softricity.in</p>
                    <p>Israna, Panipat, Haryana</p>
                </div>
            </div>
          </div>

          <div className="md:col-span-4 mx-auto md:mx-0">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Important Pages</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {importantPages.map((page) => (
                <a
                  key={page.name}
                  href={page.href}
                  className="inline-flex items-center gap-1.5 font-semibold text-gray-700 hover:text-indigo-600 transition-colors group"
                >
                  {page.name}
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <span>All Rights Reserved, Since 2025 © Developed by</span>
                <a href="#" className="inline-flex items-center gap-2 font-bold text-gray-800 hover:text-indigo-600">
                   <img src="https://placehold.co/24x24/334155/ffffff?text=S" alt="Softricity Logo" className="w-6 h-6 rounded" />
                   SOFTRICITY Pvt Ltd
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
}

