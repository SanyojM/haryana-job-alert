import { GetServerSideProps, NextPage } from "next";
import Head from 'next/head';
import Link from "next/link";
import { api } from "@/lib/api";
import { Post } from "@/pages/admin/posts";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/shared/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

interface CategoryPageProps {
  category: Category;
  posts: Post[];
  totalPosts: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  
  try {
    // Fetch category with its posts using the new endpoint
    const data = await api.get(`/categories/slug/${slug}/posts`);
    
    // Serialize data to handle undefined values
    return { 
      props: JSON.parse(JSON.stringify({ 
        category: data.category,
        posts: data.posts,
        totalPosts: data.totalPosts
      }))
    };
  } catch (error) {
    console.error(`Failed to fetch category with slug ${slug}:`, error);
    return { notFound: true };
  }
};

const CategoryPage: NextPage<CategoryPageProps> = ({ category, posts, totalPosts }) => {
  const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');

  // Color schemes for cards (cycling through them)
const cardColors = [
    { bg: 'bg-gradient-to-r from-slate-600 to-slate-400', hover: 'hover:from-slate-700 hover:to-slate-500' },
    { bg: 'bg-gradient-to-r from-orange-600 to-orange-400', hover: 'hover:from-orange-700 hover:to-orange-500' },
    { bg: 'bg-gradient-to-r from-blue-600 to-blue-400', hover: 'hover:from-blue-700 hover:to-blue-500' },
    { bg: 'bg-gradient-to-r from-emerald-600 to-emerald-400', hover: 'hover:from-emerald-700 hover:to-emerald-500' },
    { bg: 'bg-gradient-to-r from-purple-600 to-purple-400', hover: 'hover:from-purple-700 hover:to-purple-500' },
    { bg: 'bg-gradient-to-r from-rose-600 to-rose-400', hover: 'hover:from-rose-700 hover:to-rose-500' },
];

  return (
    <div className="bg-gray-100">
      <Head>
        <title>{`${category.name} | Haryana Job Alert`}</title>
        <meta 
          name="description" 
          content={category.description || `Browse all posts in ${category.name} category`} 
        />
      </Head>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="hover:text-blue-600"
              >
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-blue-600">
                {category.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 text-lg mb-2">
              {category.description}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Posts List */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No posts found in this category yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post, index) => {
                  const colorScheme = cardColors[index % cardColors.length];
                  
                  return (
                    <Card 
                      key={post.id} 
                      className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >

                      <CardContent className="px-6 flex flex-col flex-grow">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 flex-grow">
                          {post.title}
                        </h3>

                        {/* Tags */}
                        {post.post_tags && post.post_tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.post_tags.slice(0, 2).map((pt) => (
                              <span
                                key={(pt as any).tags.id}
                                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded font-medium"
                              >
                                {(pt as any).tags.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Published Date */}
                        {post.published_at && (
                          <p className="text-xs text-gray-500 mb-4">
                            Published: {new Date(post.published_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        )}

                        {/* Learn More Button */}
                        <Link 
                          href={`/posts/${post.slug}`}
                          className={`${colorScheme.bg} ${colorScheme.hover} text-white px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 group mt-auto`}
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <Sidebar />
          </aside>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;