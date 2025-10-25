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
import { Textarea } from '@/components/ui/textarea';

// Define the type for a course category
export type CourseCategory = {
  id: string; // Assuming IDs are strings based on other files
  name: string;
  slug: string; // Include slug if your API provides it
  description: string | null;
};

interface CourseCategoriesPageProps {
  initialCategories: CourseCategory[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const categories = await api.get('/course-categories');
    return { props: { initialCategories: categories } };
  } catch (error) {
    console.error('Failed to fetch course categories:', error);
    return { props: { initialCategories: [] } };
  }
};

const CourseCategoriesPage: NextPage<CourseCategoriesPageProps> = ({ initialCategories }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<CourseCategory[]>(initialCategories);

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const authToken = token || undefined;
    try {
      const newCategory = await api.post('/course-categories', {
        name: newName,
        description: newDescription || null
      }, authToken);
      setCategories((prev) => [...prev, newCategory]);
      setNewName('');
      setNewDescription('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsLoading(true);
    setError(null);
    const authToken = token || undefined;
    try {
      const updatedCategory = await api.put(`/course-categories/${editingCategory.id}`, {
        name: editingCategory.name,
        description: editingCategory.description || null
      }, authToken);
      setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      setIsEditDialogOpen(false);
      setEditingCategory(null); // Clear editing state
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this course category?')) return;
    const authToken = token || undefined;
    try {
      await api.delete(`/course-categories/${categoryId}`, authToken);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err: unknown) {
      alert(`Failed to delete category: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  const openEditDialog = (category: CourseCategory) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
    setError(null); // Clear previous errors
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Course Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD NEW CATEGORY FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card>
              <CardHeader><CardTitle>Add New Category</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newName">Name</Label>
                  <Input id="newName" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newDescription">Description</Label>
                  <Textarea id="newDescription" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Saving...' : 'Save Category'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* EXISTING CATEGORIES LIST */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Existing Categories</CardTitle></CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.id} className="p-3 bg-slate-50 border rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">{category.name}</p>
                        <p className="text-sm text-slate-500">{category.description || ''}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No categories created yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Course Category</DialogTitle></DialogHeader>
          {editingCategory && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Name</Label>
                <Input id="editName" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea id="editDescription" value={editingCategory.description || ''} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => { setIsEditDialogOpen(false); setEditingCategory(null); }}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseCategoriesPage;