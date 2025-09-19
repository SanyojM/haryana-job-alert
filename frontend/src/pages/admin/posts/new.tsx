import { api } from "@/lib/api";
import { GetServerSideProps, NextPage } from "next";
import { CreatePostForm } from "@/components/admin/posts/CreatePostForm";

export type PostTemplate = {
  id: string;
  name: string;
  structure: {
    placeholders?: any[];
    blocks?: any[];
  };
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
    // The layout is now handled automatically by _app.tsx
    <CreatePostForm templates={templates} categories={categories} tags={tags} />
  );
};

export default CreatePostPage;