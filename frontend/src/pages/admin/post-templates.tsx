import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';

type PostTemplate = {
  id: string;
  name: string;
  description: string | null;
  structure: Record<string, any>;
};

interface PostTemplatesPageProps {
  initialTemplates: PostTemplate[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const templates = await api.get('/post-templates');
    return { props: { initialTemplates: templates } };
  } catch (error) {
    console.error('Failed to fetch post templates:', error);
    return { props: { initialTemplates: [] } };
  }
};

const PostTemplatesPage: NextPage<PostTemplatesPageProps> = ({ initialTemplates }) => {
  const [templates, setTemplates] = useState<PostTemplate[]>(initialTemplates);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [structure, setStructure] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let parsedStructure;
    try {
      parsedStructure = JSON.parse(structure);
    } catch (jsonError) {
      setError('Invalid JSON in structure field.');
      setIsLoading(false);
      return;
    }

    try {
      const newTemplate = await api.post('/post-templates', {
        name,
        description,
        structure: parsedStructure,
      });
      setTemplates((prev) => [...prev, newTemplate]);
      setName('');
      setDescription('');
      setStructure('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Post Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Add New Template</h2>
            <div className="mb-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="structure" className="block text-sm font-medium text-gray-700">Structure (JSON)</label>
              <textarea
                id="structure"
                value={structure}
                onChange={(e) => setStructure(e.target.value)}
                rows={8}
                className="mt-1 block w-full font-mono text-sm px-3 py-2 border border-gray-300 rounded-md"
                placeholder='e.g., { "fields": [...] }'
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {isLoading ? 'Saving...' : 'Save Template'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">
          <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Existing Templates</h2>
            <ul className="space-y-2">
              {templates.map((template) => (
                <li key={template.id} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostTemplatesPage;
