import { GetServerSideProps, NextPage } from "next";
import Head from 'next/head';
import Link from "next/link";
import { api } from "@/lib/api";
import { Post } from "@/pages/admin/posts";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/shared/Sidebar";
import { YojnaPost } from "@/components/sidebar/HaryanaYojnaSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BannerHeader from "@/components/shared/BannerHeader";
import Script from "next/script";

interface PostPageProps {
  post: Post;
  yojnaPosts: YojnaPost[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  try {
    const [post, yojnaData] = await Promise.all([
      api.get(`/posts/slug/${slug}`),
      api.get('/categories/slug/yojna/posts?limit=12'),
    ]);

    const yojnaPosts = yojnaData?.posts || [];

    return { props: { post, yojnaPosts } };
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return { notFound: true };
  }
};

const PostPage: NextPage<PostPageProps> = ({ post, yojnaPosts }) => {
  const categorySlug = post.categories?.name.toLowerCase().replace(/\s+/g, '-') || 'uncategorized';

  return (
    <div className="bg-white">
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
               <img src="/notes-offer.png" alt="" className="w-full my-3" />
                <article className="text-sm md:text-base h-max-content">
                  {/* <h1 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h1> */}
                   {/* <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8101539968683225" crossOrigin="anonymous"></Script>
       
                    <ins className="adsbygoogle"
                    style={{display: "block"}}
                    data-ad-format="fluid"
                    data-ad-layout-key="-hj+4+18-27-l"
                    data-ad-client="ca-pub-8101539968683225"
                    data-ad-slot="2207247899"></ins>
                   <Script>
          {
            `(adsbygoogle = window.adsbygoogle || []).push({});`
          }
        </Script> */}
                  <div 
                    className="prose max-w-none overflow-x-auto p-0 rendering-area" 
                    dangerouslySetInnerHTML={{ __html: post.content_html || '' }}
                  />
                  {/* <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8101539968683225" crossOrigin="anonymous"></Script>
       
                    <ins className="adsbygoogle"
                    style={{display: "block"}}
                    data-ad-format="fluid"
                    data-ad-layout-key="-hj+4+18-27-l"
                    data-ad-client="ca-pub-8101539968683225"
                    data-ad-slot="2207247899"></ins>
                   <Script>
          {
            `(adsbygoogle = window.adsbygoogle || []).push({});`
          }
        </Script> */}
                </article>
            </div>
            <aside>
                <Sidebar yojnaPosts={yojnaPosts} />
            </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;