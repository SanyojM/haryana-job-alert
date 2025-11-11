import { CheckCircle2, ArrowRight, ArrowUpRight } from 'lucide-react';
import AdBanner from '../shared/AdBanner';
import { Post } from '@/pages/admin/posts'; // Import the Post type
import Link from 'next/link';
import { Category } from '@/pages/admin/getting-started/categories';

// Define the props for the main section component
interface MidCardSectionProps {
  categories: Category[];
  posts: Post[];
}

// Define the props for a single card
interface MidCardProps {
  title: string;
  description: string;
  posts: Post[];
  index: number;
  categorySlug: string;
}

// Reusable component for a single card
const MidCard = ({ title, description, posts, index, categorySlug }: MidCardProps) => {
  const maxPosts = 25;
  const displayedPosts = posts.slice(0, maxPosts);
  const hasMorePosts = posts.length > maxPosts;

  return (
    <div className="flex flex-col h-full">
        {(() => {
          const gradientOptions = [
            'from-[#ed213a] to-[#93291e]',
            'from-[#ed213a] to-[#93291e]',
            'from-[#4e54c8] to-[#8f94fb]',
            'from-[#4e54c8] to-[#8f94fb]',
            'from-[#093028] to-[#237a57]',
            'from-[#093028] to-[#237a57]',
          ];
          const chosen = gradientOptions[index % gradientOptions.length];
          return (
            <div className={`bg-gradient-to-r ${chosen} text-white text-center md:font-bold font-bold text-lg md:text-2xl py-4 rounded-t-2xl shadow-lg`}>
              {title}
            </div>
          );
        })()}
        <div className="bg-black shadow text-white text-center text-xs py-2 px-2 whitespace-nowrap truncate">
            {description}
        </div>
        <div className="bg-white shadow-lg py-6 px-2 sm:px-4 rounded-b-2xl flex-grow">
            <ul className="space-y-4">
                {displayedPosts.map(post => (
                    <li key={post.id}>
                        <Link href={`/posts/${post.slug}`} legacyBehavior>
                            <a className="flex items-start gap-2 text-gray-700 hover:text-indigo-600 group text-xs md:text-sm">
                                <img src="/tick.jpg" alt="tick" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span className="flex-grow text-blue-500 hover:underline">{post.title} <ArrowUpRight className='w-4 h-4 inline' /></span>
                            </a>
                        </Link>
                    </li>
                ))}

                {posts.length === 0 && (
                    <li className="text-gray-500">No posts available</li>
                )}
            </ul>

            {hasMorePosts && (
                <div className="mt-6 text-center">
                    <Link href={`/category/${categorySlug}`} legacyBehavior>
                        <a className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                            View More
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </Link>
                </div>
            )}
        </div>
    </div>
  );
};


export default function MidCardSection({ categories, posts }: MidCardSectionProps) {
  return (
    <section className="bg-white pb-12 pt-0 sm:pt-5 px-2 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
          {categories.map((category, index) => (
            <MidCard 
              key={category.id}
              title={category.name}
              description={category.description || `Latest updates on ${category.name}`}
              index={index}
              categorySlug={category.name.toLowerCase().replace(/\s+/g, '-')}
              posts={posts.filter(post => post.category_id?.toString() === category.id.toString()) || []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}