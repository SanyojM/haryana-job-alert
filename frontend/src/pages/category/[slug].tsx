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
import AdBanner from "@/components/home/AdBanner";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

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

  const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');

  const cardColors = [
    { bg: 'bg-gradient-to-r from-slate-600 to-slate-400', hover: 'hover:from-slate-700 hover:to-slate-500' },
    { bg: 'bg-gradient-to-r from-orange-600 to-orange-400', hover: 'hover:from-orange-700 hover:to-orange-500' },
    { bg: 'bg-gradient-to-r from-blue-600 to-blue-400', hover: 'hover:from-blue-700 hover:to-blue-500' },
    { bg: 'bg-gradient-to-r from-emerald-600 to-emerald-400', hover: 'hover:from-emerald-700 hover:to-emerald-500' },
    { bg: 'bg-gradient-to-r from-purple-600 to-purple-400', hover: 'hover:from-purple-700 hover:to-purple-500' },
    { bg: 'bg-gradient-to-r from-rose-600 to-rose-400', hover: 'hover:from-rose-700 hover:to-rose-500' },
  ];

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(query);

    const tagMatch = post.post_tags?.some(pt =>
      (pt as any).tags.name.toLowerCase().includes(query)
    );

    return titleMatch || tagMatch;
  });

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
      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
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

          <div className="border-b border-slate-200 pb-4 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-6 pb-4">
              {category.logoUrl ? (
                <Image
                  src={category.logoUrl}
                  alt={`${category.organization} logo`}
                  width={80}
                  height={80}
                  className="rounded-full border p-1 object-contain flex-shrink-0"
                />
              ) : (
                <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full border bg-gray-200 text-gray-600 text-2xl font-bold flex-shrink-0">
                  {category.name
                    ?.split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
              )}
              <div className="flex-grow">
                <h1 className="text-3xl font-extrabold text-gray-800">
                  {category.name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">{category.organization}</p>
              </div>
            </div>
            {category.description && (
              <p className="text-gray-700 mb-6 text-xs">{category.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 mb-6">
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
            <div className="flex justify-end items-center">
              <div className="flex gap-4 w-full md:w-auto md:flex-shrink-0 justify-end md:justify-start">

                <div className="md:flex-1 ml-4 md:ml-0">
                  <DropdownMenu>

                    <DropdownMenuTrigger className="p-3 bg-white rounded-full shadow-lg">
                      <ListFilter className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 rounded-3xl border-gray-400 shadow-xl">
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
                    <DropdownMenuContent className="bg-white p-4 rounded-3xl border-gray-400 shadow-xl">
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
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {processedPosts.map((post, index) => {
                  const colorScheme = cardColors[index % cardColors.length];

                  return (
                    <Card
                      key={post.id}
                      className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                      <CardContent className="md:px-6 md:py-6 flex flex-col flex-grow">
                        <h3 className="md:text-xl font-bold text-gray-900 mb-4 line-clamp-2 flex-grow">
                          {post.title}
                        </h3>

                        {post.post_tags && post.post_tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.post_tags.slice(0, 2).map((pt) => (
                              <span
                                key={(pt as any).tags.id}
                                className={`px-2 py-1 text-xs rounded font-medium ${(pt as any).tags.name === selectedTag
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-blue-50 text-blue-600'
                                  }`}
                              >
                                {(pt as any).tags.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* {post.created_at && (
                          <p className="text-xs text-gray-500 mb-4">
                            Created: {new Date(post.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        )} */}

                        <Link
                          href={`/posts/${post.slug}`}
                          className={`${colorScheme.bg} ${colorScheme.hover} text-white md:px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 group mt-auto text-sm md:text-md`}
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
        </div>
        <div className="lg:col-span-1">
          <AdBanner text="Google Ads Section" className="h-88" />
          <div className="mt-12">
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;