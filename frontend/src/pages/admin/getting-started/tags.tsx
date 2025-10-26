import { useState} from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button, Card, CardHeader, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input} from "@heroui/react";

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
  const { token } = useAuth();
  const [tags, setTags] = useState<Tag[]>(initialTags);
  
  const [newName, setNewName] = useState('');
  
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    const authToken = token ?? undefined;
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newTag = await api.post('/tags', { name: newName }, authToken);
      setTags((prev) => [...prev, newTag]);
      setNewName('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create tag.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    const authToken = token ?? undefined;

    e.preventDefault();
    if (!editingTag) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedTag = await api.put(`/tags/${editingTag.id}`, { name: editingTag.name }, authToken);
      setTags(prev => prev.map(t => t.id === updatedTag.id ? updatedTag : t));
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update tag.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    const authToken = token ?? undefined;

    if (!window.confirm('Are you sure you want to delete this tag?')) {
      return;
    }
    try {
      await api.delete(`/tags/${tagId}`, authToken);
      setTags(prev => prev.filter(t => t.id !== tagId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Failed to delete tag: ${err.message}`);
      } else {
        alert('Failed to delete tag.');
      }
    }
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setIsEditDialogOpen(true);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Tags</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD NEW TAG FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card className='bg-white p-4 rounded-xl border border-gray-300 shadow-sm'>
              <CardHeader><h1>Add New Tag</h1></CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-2">
                  <Input id="newName" label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </CardBody>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full bg-[#8979AB] text-white rounded-lg">
                  {isLoading ? 'Saving...' : 'Save Tag'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* EXISTING TAGS LIST */}
        <div className="lg:col-span-2">
          <Card className='bg-white p-4 rounded-xl border border-gray-300 shadow-sm'>
            <CardHeader><h1>Existing Tags</h1></CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="group flex items-center gap-1 bg-slate-100 text-slate-800 rounded-full border text-sm font-medium transition-all hover:bg-slate-200">
                    <span className="pl-3 pr-2 py-1">{tag.name}</span>
                    <div className="flex items-center">
                      <Button className='rounded-full' onPress={() => openEditDialog(tag)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button className="rounded-full text-red-500 hover:text-red-600" onPress={() => handleDelete(tag.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* SINGLE, SHARED EDIT DIALOG */}
      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='bg-white p-4 border border-gray-300 rounded-xl shadow-sm'>
        <ModalContent>
          <ModalHeader><h1>Edit Tag</h1></ModalHeader>
          {editingTag && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Input id="editName" label="Name" value={editingTag.name} onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })} required />
              </div>
              <ModalFooter>
                <Button type="button" className='bg-[#dfd9eb] rounded-lg' onPress={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className='bg-[#8979AB] text-white rounded-lg' isDisabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TagsPage;