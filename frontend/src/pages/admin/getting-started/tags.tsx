import { useState, useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      alert(`Failed to delete tag: ${err.message}`);
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
            <Card>
              <CardHeader><CardTitle>Add New Tag</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newName">Name</Label>
                  <Input id="newName" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Saving...' : 'Save Tag'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* EXISTING TAGS LIST */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Existing Tags</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="group flex items-center gap-1 bg-slate-100 text-slate-800 rounded-full border text-sm font-medium transition-all hover:bg-slate-200">
                    <span className="pl-3 pr-2 py-1">{tag.name}</span>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => openEditDialog(tag)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-red-500 hover:text-red-600" onClick={() => handleDelete(tag.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SINGLE, SHARED EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Tag</DialogTitle></DialogHeader>
          {editingTag && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Name</Label>
                <Input id="editName" value={editingTag.name} onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })} required />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagsPage;