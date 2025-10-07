import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import { PostsClient } from "@/components/admin/posts/PostsClient"; // We will create this next

export type Post = {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  created_at: string;

  category_id?: number;
  content_html?: string;
  thumbnail_url?: string | null;
  external_url?: string | null;
  content?: string;
  post_tags?: { post_id: string; tag_id: number }[];
  categories: {
    name: string;
  } | null;
};
interface PostsPageProps {
  posts: Post[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const posts = await api.get('/posts');
    return {
      props: { posts },
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return {
      props: { posts: [] },
    };
  }
};

const AllPostsPage: NextPage<PostsPageProps> = ({ posts }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">All Posts</h1>
        {/* We can add a "Create New" button here later */}
      </div>
      <PostsClient data={posts} />
    </div>
  );
};

export default AllPostsPage;