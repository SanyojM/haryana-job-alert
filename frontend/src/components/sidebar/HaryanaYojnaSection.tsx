import { ArrowUpRight, Bookmark, Send } from 'lucide-react';
import AdBanner from '../shared/AdBanner'; // Assuming this path is correct
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api'; // Assuming this path is correct
import Link from 'next/link';

// Helper function to get YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return (match && match[1]?.length === 11) ? match[1] : null;
}

// Your Post type definition
export type Post = {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  created_at: string;
  category_id?: number;
  content_html?: string;
  thumbnail_url?: string | null;
  external_url?: string | null; // This will be used for video links
  content?: string;
  post_tags?: { post_id: string; tag_id: number }[];
  categories: {
    name: string;
  } | null;
};

export default function HaryanaYojnaSection() {
  // --- Hooks moved inside the component ---
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await api.get('/posts'); // Ensure your API returns an array
        setAllPosts(Array.isArray(posts) ? posts : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const yojnaVideos = useMemo(() => {
    return allPosts.filter(post => post.categories?.name.toLowerCase() === 'yojna');
  }, [allPosts]);
  // --- End of moved hooks ---

  // --- Added Loading and Error states ---
  if (isLoading) {
    return (
      <section className="bg-white p-4">
        <div className="text-center text-gray-500">Loading Yojna...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white p-4">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Haryana Yojna
        </h2>

        {/* --- Combined into a SINGLE grid --- */}
        <div className="grid grid-cols-1 gap-8">
          {yojnaVideos.length > 0 ? (
            yojnaVideos.map((post) => {
              // --- Logic to check if it's a video ---
              const videoId = post.external_url ? getYouTubeVideoId(post.external_url) : null;
              
              // --- Dynamic thumbnail logic ---
              const thumbnailUrl = videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : post.thumbnail_url; // Fallback to post thumbnail

              return (
                <div key={post.id} className="rounded-2xl overflow-hidden p-2 bg-white shadow-sm">
                  <Image
                    src={thumbnailUrl || 'https://placehold.co/600x400/cccccc/333333?text=Thumbnail+Missing'} 
                    alt={post.title || 'Post thumbnail'}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover aspect-video rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/cccccc/333333?text=Thumbnail+Error';
                    }}
                    unoptimized
                  />
                  <div className="py-2 flex items-center justify-between gap-2">
                    
                    {/* --- Dynamic Link: External for video, Internal for post --- */}
                    {videoId && post.external_url ? (
                      // It's a video, link externally
                      <a
                        href={post.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow bg-black text-white text-center rounded-lg p-2.5 font-medium text-wrap text-[10px] inline-flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                      >
                        View Yojna
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      // It's an article, link internally
                      <Link
                        href={`/posts/${post.slug}`} // <-- Fixed hardcoded slug
                        passHref
                        className="flex-grow bg-black text-white text-center rounded-lg p-2.5 font-medium text-wrap text-[10px] inline-flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                      >
                        View Yojna
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                        <Bookmark className="w-3 h-3" />
                      </button>
                      <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500">No Yojna posts found.</div>
          )}
        </div>

        <div className="text-center mt-8 mb-8">
          <button className="bg-gray-100 border-2 border-gray-300 rounded-xl w-full py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all ">
            View all Yojna
          </button>
        </div>

        <AdBanner text="Google Ad Section" className="h-88" />
      </div>
    </section>
  );
}