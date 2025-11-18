import { createContext, useContext, useState, ReactNode } from 'react';

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

interface YojnaContextType {
  yojnaPosts: Post[];
  setYojnaPosts: (posts: Post[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const YojnaContext = createContext<YojnaContextType | undefined>(undefined);

export function YojnaProvider({ children }: { children: ReactNode }) {
  const [yojnaPosts, setYojnaPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <YojnaContext.Provider value={{ yojnaPosts, setYojnaPosts, isLoading, setIsLoading }}>
      {children}
    </YojnaContext.Provider>
  );
}

export function useYojna() {
  const context = useContext(YojnaContext);
  if (context === undefined) {
    throw new Error('useYojna must be used within a YojnaProvider');
  }
  return context;
}
