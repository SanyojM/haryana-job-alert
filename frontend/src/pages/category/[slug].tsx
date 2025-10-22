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
import { ArrowDownUp, ArrowRight, CalendarDays, ListFilter, Search } from "lucide-react";
import AdBanner from "@/components/shared/AdBanner";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import BannerHeader from "@/components/shared/BannerHeader";

interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  logoUrl: string;
  organization: string;
}

interface CategoryPageProps {
  category: Category;
  posts: Post[];
  totalPosts: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  try {
    const data = await api.get(`/categories/slug/${slug}/posts`);

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
  console.log('Category:', category);
  console.log('Posts:', posts);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedTag, setSelectedTag] = useState("all");

  const getLogoText = (categoryName?: string) => {
    if (!categoryName) return 'MT';
    return categoryName.charAt(0).toUpperCase();
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.post_tags?.forEach(pt => {
        tagSet.add((pt as any).tags.name);
      });
    });
    return ['all', ...Array.from(tagSet).sort()];
  }, [posts]);

  const processedPosts = useMemo(() => {
    let tempPosts = [...posts];

    if (selectedTag !== "all") {
      tempPosts = tempPosts.filter(post =>
        post.post_tags?.some(pt => (pt as any).tags.name === selectedTag)
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      tempPosts = tempPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const tagMatch = post.post_tags?.some(pt =>
          (pt as any).tags.name.toLowerCase().includes(query)
        );
        return titleMatch || tagMatch;
      });
    }

    // 3. Sort
    switch (sortOrder) {
      case 'title-asc':
        tempPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        tempPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'oldest':
        tempPosts.sort((a, b) =>
          new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
        );
        break;
      case 'newest':
      default:
        tempPosts.sort((a, b) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        );
        break;
    }

    return tempPosts;
  }, [posts, selectedTag, searchQuery, sortOrder]);

  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <Head>
        <title>{`${category.name} | Haryana Job Alert`}</title>
        <meta
          name="description"
          content={category.description || `Browse all posts in ${category.name} category`}
        />
      </Head>

      <Header />
      <main className="max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        <div className="lg:col-span-3">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="hover:text-blue-600">
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
          
          <hr className="mb-4"/>

          <div className="grid grid-cols-2 mb-6">
            <div className="flex items-center">
              <div className="flex gap-4 w-full md:w-auto md:flex-shrink-0 justify-end md:justify-start">
                <div className="md:flex-1 ml-4 md:ml-0">
                  <DropdownMenu>

                    <DropdownMenuTrigger className="p-3 bg-white rounded-full shadow-lg">
                      <ListFilter className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 rounded-3xl border-gray-400 shadow-xl z-100">
                      {allTags.map(tag => (
                        <DropdownMenuItem
                          key={tag}
                          onSelect={() => setSelectedTag(tag)}
                          className="capitalize px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                        >
                          {tag === 'all' ? 'Select All' : tag}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="md:flex-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-3 bg-white rounded-full shadow-lg">
                      <ArrowDownUp className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 rounded-3xl border-gray-400 shadow-xl z-100">
                      <DropdownMenuItem
                        onSelect={() => setSortOrder('newest')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                      >
                        Newest
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSortOrder('oldest')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                      >
                        Oldest
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSortOrder('title-asc')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                      >
                        Title: A-Z
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSortOrder('title-desc')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                      >
                        Title: Z-A
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                id="search-posts"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${category.name}...`}
                className="w-full px-2 py-2 pl-10 rounded-3xl border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
          </div>

          <div>
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No posts found in this category yet.
                  </p>
                </CardContent>
              </Card>

            ) : processedPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No posts found matching your criteria.
                  </p>
                </CardContent>
              </Card>

            ) : (
              <div className="space-y-4">
                {processedPosts.map((post, index) => {
                  const logoText = getLogoText(post.title);
                  return (
                    <div key={post.id} className="bg-white rounded-lg shadow-xl border-gray-400 overflow-hidden relative">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4">
                        <div>
                          {post.thumbnail_url ? (
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                              <Image
                                src={post.thumbnail_url}
                                alt={post.title}
                                width={150}
                                height={100}
                                className="rounded-lg object-cover w-full h-24 sm:w-24"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center 
                                        w-24 h-24 sm:w-24 sm:h-24 rounded-lg bg-gray-200 text-gray-700 
                                        font-bold text-4xl leading-none">
                              {logoText}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                            {post.post_tags && post.post_tags.length > 0 && (
                              <div className="flex flex-wrap mt-2">
                                {post.post_tags.slice(0, 2).map((pt) => (
                                  <span
                                    key={(pt as any).tags.id}
                                    className='text-xs text-gray-500'
                                  >
                                    {(pt as any).tags.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            {post.created_at && (
                              <p className="text-xs text-gray-500 mt-2">
                                Created: {new Date(post.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            )}
                            {/* <div className="flex items-center gap-1.5"><FileText size={14} /> {post.total_marks} Marks</div> */}
                          </div>
                        </div>
                        <div>
                        <Link
                          href={`/posts/${post.slug}`}
                          className='bg-gradient-to-r from-red-600 to-gray-800 text-white md:px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 group mt-auto text-sm md:text-md'
                          >
                          Learn More
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                          </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <AdBanner text="Google Ads Section" className="h-88" />
          <div className="mt-12 ml-12">
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;