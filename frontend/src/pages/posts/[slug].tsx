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
import BannerHeader from "@/components/shared/BannerHeader";

interface PostPageProps {
  post: Post;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  try {
    const post = await api.get(`/posts/slug/${slug}`);
    return { props: { post } };
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return { notFound: true };
  }
};

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  const categorySlug = post.categories?.name.toLowerCase().replace(/\s+/g, '-') || 'uncategorized';

  return (
    <div className="bg-gray-100">
      <Head>
        <title>{`${post.title} | Haryana Job Alert`}</title>
        {/* You can also add dynamic meta descriptions for SEO */}
        <meta name="description" content={`Details & Information about ${post.title}.`} />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* NEW: Breadcrumb Navigation */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
          asChild
          className="hover:text-blue-600 data-[current=true]:text-blue-600"
          data-current={false}
              >
          <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {post.categories && (
              <>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="hover:text-blue-600 data-[current=true]:text-blue-600"
              data-current={false}
            >
              <Link href={`/category/${categorySlug}`}>{post.categories.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-blue-600">{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-3">
                <article>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                    <div 
                        className="prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: post.content_html || '' }}
                    />
                </article>
            </div>
            <aside>
                <Sidebar />
            </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;