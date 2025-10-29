import { CreatePostForm } from "@/components/admin/posts/CreatePostForm";
import { api } from "@/lib/api";
import { GetServerSideProps, NextPage } from "next";

export type PostTemplate = {
  id: string;
  name: string;
  structure: string; // FIX: This is now a string to hold HTML
};

export type Category = {
  id: string;
  name: string;
};

export type Tag = {
  id: string;
  name: string;
};

interface CreatePostPageProps {
  templates: PostTemplate[];
  categories: Category[];
  tags: Tag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [templates, categories, tags] = await Promise.all([
      api.get('/post-templates'),
      api.get('/categories'),
      api.get('/tags'),
    ]);

    return {
      props: {
        templates,
        categories,
        tags,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data for create post page:", error);
    return {
      props: {
        templates: [],
        categories: [],
        tags: [],
      },
    };
  }
};

const CreatePostPage: NextPage<CreatePostPageProps> = ({ templates, categories, tags }) => {
  return (
    <div className="container mx-auto py-4 px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Post</h1>
        <CreatePostForm templates={templates} categories={categories} tags={tags} />
    </div>
  );
};

export default CreatePostPage;