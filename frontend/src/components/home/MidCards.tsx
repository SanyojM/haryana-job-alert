import { CheckCircle2, ArrowRight } from 'lucide-react';
import AdBanner from './AdBanner';
import { Post } from '@/pages/admin/posts'; // Import the Post type
import Link from 'next/link';

// Define the props for the main section component
interface MidCardSectionProps {
  answerKeyPosts: Post[];
  admitCardPosts: Post[];
  admissionPosts: Post[];
}

// Define the props for a single card
interface MidCardProps {
  title: string;
  description: string;
  color: string;
  posts: Post[];
}

// Reusable component for a single card
const MidCard = ({ title, description, color, posts }: MidCardProps) => (
    <div className="flex flex-col h-full">
        <div className={`bg-gradient-to-r ${color} text-white text-center font-bold text-2xl py-4 rounded-t-2xl`}>
            {title}
        </div>
        <div className="bg-black text-white text-center text-sm py-2">
            {description}
        </div>
        <div className="bg-gray-100 py-6 px-4 rounded-b-2xl flex-grow">
            <ul className="space-y-4">
                {posts.map(post => (
                    <li key={post.id}>
                        <Link href={`/posts/${post.slug}`} legacyBehavior>
                            <a className="flex items-start gap-2 text-gray-700 hover:text-indigo-600 group">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="flex-grow">{post.title}</span>
                                <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 ml-2 group-hover:bg-indigo-600 transition-colors">
                                    <ArrowRight className="w-3 h-3 text-white" />
                                </div>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


export default function MidCardSection({ answerKeyPosts, admitCardPosts, admissionPosts }: MidCardSectionProps) {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <MidCard 
            title="Answer Keys"
            description="Links for Government exam answer keys"
            color="from-red-500 to-red-800"
            posts={answerKeyPosts}
          />
          <MidCard 
            title="Admit Cards"
            description="Links for exam admit cards and hall tickets"
            color="from-red-500 to-red-800"
            posts={admitCardPosts}
          />
          <AdBanner text="Google Ads Section" className="h-24 md:hidden" />
          <MidCard
            title="Admissions"
            description="Links for university and college admissions"
            color="from-red-500 to-red-800"
            posts={admissionPosts}
          />
        </div>
      </div>
    </section>
  );
}