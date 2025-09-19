import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';

// Define the type for a single category
type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

interface CategoriesPageProps {
  initialCategories: Category[];
}

// This function runs on the server for every request
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const categories = await api.get('/categories');
    return {
      props: {
        initialCategories: categories,
      },
    };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return {
      props: {
        initialCategories: [],
      },
    };
  }
};

const CategoriesPage: NextPage<CategoriesPageProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const newCategory = await api.post('/categories', { name, description });
      setCategories((prev) => [...prev, newCategory]);
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Add New Category</h2>
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
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">
          <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Existing Categories</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id} className="p-3 bg-gray-50 rounded-md flex border justify-between text-black items-center">
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;