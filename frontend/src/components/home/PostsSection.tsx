import { ArrowUpRight, Newspaper, ShieldCheck, FilePlus, Heart, Trophy } from 'lucide-react';
import Link from 'next/link'; // Import the Link component
import { Post } from '@/pages/admin/posts'; // Import the Post type

// An array of colors to cycle through for a dynamic but consistent look
const colors = [
  'from-blue-400 to-indigo-500',
  'from-teal-400 to-cyan-500',
  'from-emerald-500 to-green-600',
  'from-red-500 to-rose-600',
  'from-gray-700 to-gray-800',
  'from-purple-400 to-violet-500',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
];

const features = [
    { icon: Newspaper, title: 'Current Affairs', subtitle: 'Daily Learning Content' },
    { icon: ShieldCheck, title: 'Quality Mock Tests', subtitle: 'Test your Knowledge' },
    { icon: FilePlus, title: 'Request Any Material', subtitle: 'Study Material ( All Type )' },
    { icon: Heart, title: 'Loved by Students', subtitle: 'Over 1000+ positive reviews' },
    { icon: Trophy, title: 'We Deliver Quality', subtitle: 'Quality Information' },
];

// The component now accepts a 'posts' prop
export default function PostsSection({ posts }: { posts: Post[] }) {
  return (
    <section className="bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {/* We now map over the 'posts' from the props */}
          {posts.slice(0, 8).map((post, index) => ( // Show up to 8 posts
            <Link
              key={post.id}
              href={`/posts/${post.slug}`} // Use the dynamic slug for the link
              passHref
              legacyBehavior>
              <a
                className={`relative p-5 rounded-xl text-white overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${colors[index % colors.length]}`} // Cycle through colors
              >
                <div className="relative z-10">
                  <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
                  {/* The 'count' property doesn't exist on our dynamic posts, so it's removed */}
                </div>
                <div className="absolute top-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </a>
            </Link>
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