import { ArrowUpRight, Newspaper, ShieldCheck, FilePlus, Heart, Trophy } from 'lucide-react';

const posts = [
  { id: 1, title: 'UP Police SI Form', count: 4543, color: 'from-blue-400 to-indigo-500', href: '#' },
  { id: 2, title: 'BSF HC RO / RM Recruitment 2025', count: null, color: 'from-teal-400 to-cyan-500', href: '#' },
  { id: 3, title: 'Bihar BSSC Office Recruitment 2025', count: null, color: 'from-gray-700 to-gray-800', href: '#' },
  { id: 4, title: 'UP Police SI Form', count: 4543, color: 'from-emerald-500 to-green-600', href: '#' },
  { id: 5, title: 'UP Police SI Form', count: 4543, color: 'from-red-500 to-rose-600', href: '#' },
  { id: 6, title: 'UP Police SI Form', count: 4543, color: 'from-emerald-500 to-green-600', href: '#' },
  { id: 7, title: 'UP Police SI Form', count: 4543, color: 'from-blue-400 to-indigo-500', href: '#' },
  { id: 8, title: 'UP Police SI Form', count: 4543, color: 'from-red-500 to-rose-600', href: '#' },
];

const features = [
    { icon: Newspaper, title: 'Current Affairs', subtitle: 'Daily Learning Content' },
    { icon: ShieldCheck, title: 'Quality Mock Tests', subtitle: 'Test your Knowledge' },
    { icon: FilePlus, title: 'Request Any Material', subtitle: 'Study Material ( All Type )' },
    { icon: Heart, title: 'Loved by Students', subtitle: 'Over 1000+ positive reviews' },
    { icon: Trophy, title: 'We Deliver Quality', subtitle: 'Quality Information' },
];


export default function PostsSection() {
  return (
    <section className="bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.href}
              className={`relative p-5 rounded-xl text-white overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${post.color}`}
            >
              <div className="relative z-10">
                <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
                {post.count && <p className="text-sm opacity-90">({post.count} Post)</p>}
              </div>
              <div className="md:absolute top-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hidden">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </a>
          ))}
        </div>

        <div className="bg-gray-800 rounded-full px-4 py-2 shadow-xl hidden md:block">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white px-2">
                        <div className="flex-shrink-0">
                            <feature.icon className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-xs leading-tight">{feature.title}</p>
                            <p className="text-xs text-gray-400">{feature.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
}
