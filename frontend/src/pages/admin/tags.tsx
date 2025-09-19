import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';

type Tag = {
  id: string;
  name: string;
};

interface TagsPageProps {
  initialTags: Tag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tags = await api.get('/tags');
    return { props: { initialTags: tags } };
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return { props: { initialTags: [] } };
  }
};

const TagsPage: NextPage<TagsPageProps> = ({ initialTags }) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newTag = await api.post('/tags', { name });
      setTags((prev) => [...prev, newTag]);
      setName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Tags</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Add New Tag</h2>
            <div className="mb-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Save Tag'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">
          <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Existing Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag.id} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsPage;