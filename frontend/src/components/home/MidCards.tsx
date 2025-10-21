import { CheckCircle2, ArrowRight } from 'lucide-react';
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
}

// Reusable component for a single card
const MidCard = ({ title, description, posts, index }: MidCardProps) => (
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
            <div className={`bg-gradient-to-r ${chosen} text-white text-center md:font-bold font-medium text-sm md:text-2xl py-4 rounded-t-2xl shadow-lg`}>
              {title}
            </div>
          );
        })()}
        <div className="bg-black shadow text-white text-center text-xs py-2 px-2">
            {description}
        </div>
        <div className="bg-white shadow-lg py-6 px-4 rounded-b-2xl flex-grow">
            <ul className="space-y-4">
                {posts.map(post => (
                    <li key={post.id}>
                        <Link href={`/posts/${post.slug}`} legacyBehavior>
                            <a className="flex items-start gap-2 text-gray-700 hover:text-indigo-600 group text-xs md:text-sm">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="flex-grow">{post.title}</span>
                                <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 ml-2 group-hover:bg-indigo-600 transition-colors">
                                    <ArrowRight className="w-3 h-3 text-white" />
                                </div>
                            </a>
                        </Link>
                    </li>
                ))}

                {posts.length === 0 && (
                    <li className="text-gray-500">No posts available</li>
                )}
            </ul>
        </div>
    </div>
);


export default function MidCardSection({ categories, posts }: MidCardSectionProps) {
  return (
    <section className="bg-white py-12 px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
          {categories.map((category, index) => (
            <MidCard 
              key={category.id}
              title={category.name}
              description={category.description || `Latest updates on ${category.name}`}
              index={index}
              posts={posts.filter(post => post.category_id?.toString() === category.id.toString()) || []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}