import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the type for a course tag
export type CourseTag = {
  id: string; // Assuming IDs are strings
  name: string;
  slug: string; // Include slug if provided by API
};

interface CourseTagsPageProps {
  initialTags: CourseTag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tags = await api.get('/course-tags');
    return { props: { initialTags: tags } };
  } catch (error) {
    console.error('Failed to fetch course tags:', error);
    return { props: { initialTags: [] } };
  }
};

const CourseTagsPage: NextPage<CourseTagsPageProps> = ({ initialTags }) => {
  const { token } = useAuth();
  const [tags, setTags] = useState<CourseTag[]>(initialTags);

  const [newName, setNewName] = useState('');

  const [editingTag, setEditingTag] = useState<CourseTag | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const authToken = token || undefined;
    try {
      const newTag = await api.post('/course-tags', { name: newName }, authToken);
      setTags((prev) => [...prev, newTag]);
      setNewName('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    setIsLoading(true);
    setError(null);
    const authToken = token || undefined;
    try {
      const updatedTag = await api.put(`/course-tags/${editingTag.id}`, { name: editingTag.name }, authToken);
      setTags(prev => prev.map(t => t.id === updatedTag.id ? updatedTag : t));
      setIsEditDialogOpen(false);
      setEditingTag(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!window.confirm('Are you sure you want to delete this course tag?')) return;
    const authToken = token || undefined;
    try {
      await api.delete(`/course-tags/${tagId}`, authToken);
      setTags(prev => prev.filter(t => t.id !== tagId));
    } catch (err: unknown) {
      alert(`Failed to delete tag: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  const openEditDialog = (tag: CourseTag) => {
    setEditingTag(tag);
    setIsEditDialogOpen(true);
    setError(null);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Course Tags</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ADD NEW TAG FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card>
              <CardHeader><CardTitle>Add New Tag</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newName">Tag Name</Label>
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
              {tags.length > 0 ? (
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
              ) : (
                 <p className="text-sm text-muted-foreground text-center py-4">No tags created yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Course Tag</DialogTitle></DialogHeader>
          {editingTag && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Name</Label>
                <Input id="editName" value={editingTag.name} onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })} required />
              </div>
               {error && <p className="text-sm text-red-600">{error}</p>}
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => { setIsEditDialogOpen(false); setEditingTag(null); }}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseTagsPage;