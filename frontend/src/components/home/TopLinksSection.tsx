import { CheckCircle2, ArrowUpRight, ArrowRight } from 'lucide-react';

const links = [
  { name: 'Online Form', href: '#' },
  { name: 'Admit Card', href: '#' },
  { name: 'Answer keys', href: '#' },
  { name: 'Syllabus & Career News', href: '#' },
  { name: 'Sarkari Yojna & Notices', href: '#' },
  { name: 'Scholarships', href: '#' },
  { name: 'Mock Tests', href: '#' },
  { name: 'Currents Affairs', href: '#' },
  { name: 'Study Material', href: '#' },
];

export default function TopLinksSection() {
  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
          Haryana <span className="text-yellow-500">Job</span> Alert is a <span className="text-yellow-500">FREE</span> Website to get
        </h1>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center text-gray-700 font-medium"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="underline decoration-gray-300 group-hover:decoration-gray-700 transition-all">
                {link.name}
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        <p className="mt-10 text-gray-800 font-semibold text-lg flex items-center justify-center gap-2">
          You can freely use this website without registration or login
          <span className="relative inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600 animate-ping"></span>
            LIVE
          </span>
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-white rounded-xl shadow-md px-6 py-3 flex items-center justify-between font-semibold text-gray-800 hover:shadow-lg transition-shadow">
            <span>Login / Register</span>
            <span className="ml-4 w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white" />
            </span>
          </button>
          
          <button className="w-full sm:w-auto bg-white rounded-xl shadow-md px-6 py-3 flex items-center justify-between font-semibold text-gray-800 hover:shadow-lg transition-shadow">
            <span>Contact Us</span>
            <img 
              src="https://placehold.co/40x40/60a5fa/ffffff?text=🧑&font=noto" 
              alt="Contact avatar"
              className="w-8 h-8 rounded-full ml-4"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
