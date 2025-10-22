import { useState } from 'react';
import Link from 'next/link';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type MockCategory = { id: string; name: string; };
type MockTag = { id: string; name: string; };
type MockSeries = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  price: number | null;
  category_id: string;
  mock_categories: { name: string; };
  mock_series_tags: { tag: { id: string; name: string; } }[];
};

interface MockSeriesPageProps {
  initialSeries: MockSeries[];
  mockCategories: MockCategory[];
  mockTags: MockTag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [series, categories, tags] = await Promise.all([
      api.get('/mock-series'),
      api.get('/mock-categories'),
      api.get('/mock-tags'),
    ]);
    return { props: { initialSeries: series, mockCategories: categories, mockTags: tags } };
  } catch (error) {
    console.error('Failed to fetch mock series data:', error);
    return { props: { initialSeries: [], mockCategories: [], mockTags: [] } };
  }
};

const MockSeriesPage: NextPage<MockSeriesPageProps> = ({ initialSeries, mockCategories, mockTags }) => {
  const { token } = useAuth();
  const [series, setSeries] = useState<MockSeries[]>(initialSeries);
  const [editingSeries, setEditingSeries] = useState<Partial<MockSeries> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const openDialog = (seriesData: Partial<MockSeries> | null = null) => {
    setEditingSeries(seriesData ? { ...seriesData } : { title: '', description: '', price: 0, category_id: '', mock_series_tags: [] });
    setThumbnailFile(null);
    setIsEditDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingSeries || !editingSeries.category_id) {
      alert("Category is required.");
      return;
    }
    setIsLoading(true);

    const isEditMode = !!editingSeries.id;
    const endpoint = isEditMode ? `/mock-series/${editingSeries.id}` : '/mock-series';

    const formData = new FormData();

    formData.append('title', editingSeries.title || '');
    formData.append('price', (editingSeries.price || 0).toString());
    formData.append('category_id', editingSeries.category_id);
    
    if (editingSeries.description) {
      formData.append('description', editingSeries.description);
    }

    const tagIds = editingSeries.mock_series_tags
      ?.map(t => t.tag.id)
      .join(',') || '';
      
    if (tagIds) {
      formData.append('tagIds', tagIds);
    }

    if (thumbnailFile) {
      formData.append('file', thumbnailFile);
    }

    try {
      let result;

      if (isEditMode) {
        result = await api.put(endpoint, formData, authToken);
      } else {
        result = await api.postFormData(endpoint, formData, authToken);
      }
      
      if (isEditMode) {
        setSeries(prev => prev.map(s => (s.id === result.id ? result : s)));
      } else {
        setSeries(prev => [...prev, result]);
      }
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      alert(`Failed to save series: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (seriesId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to delete this series? This will also delete all tests within it.')) return;
    try {
      await api.delete(`/mock-series/${seriesId}`, authToken);
      setSeries(prev => prev.filter(s => s.id !== seriesId));
    } catch (err: unknown) {
      alert(`Failed to delete series: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Test Series</h1>
        <Button onClick={() => openDialog()}>Create New Series</Button>
      </div>
      <Card>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {series.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/mock-tests/mock-test-series/${s.id}`} className="hover:underline">
                      {s.title}
                    </Link>
                  </TableCell>
                  <TableCell>{s.mock_categories?.name || 'N/A'}</TableCell>
                  <TableCell>{s.price ? `₹${s.price}` : 'Free'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(s)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{editingSeries?.id ? 'Edit' : 'Create'} Test Series</DialogTitle></DialogHeader>
          {editingSeries && (
            <form onSubmit={handleSave} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={editingSeries.title} onChange={(e) => setEditingSeries({ ...editingSeries, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={editingSeries.description || ''} onChange={(e) => setEditingSeries({ ...editingSeries, description: e.target.value })} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail-file">Thumbnail Image</Label>
                <Input 
                  id="thumbnail-file" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                {!thumbnailFile && editingSeries.id && editingSeries.thumbnail_url && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Current thumbnail:</p>
                    <img 
                      src={editingSeries.thumbnail_url} 
                      alt="Current thumbnail" 
                      className="w-24 h-24 object-cover rounded-md border" 
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" value={editingSeries.price || 0} onChange={(e) => setEditingSeries({ ...editingSeries, price: parseFloat(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editingSeries.category_id?.toString()} onValueChange={(value) => setEditingSeries({ ...editingSeries, category_id: value })} required>
                    <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                    <SelectContent>
                      {mockCategories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="grid grid-cols-3 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                  {mockTags.map(tag => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={editingSeries.mock_series_tags?.some(t => t.tag.id === tag.id)}
                        onCheckedChange={(checked) => {
                          const currentTags = editingSeries.mock_series_tags?.map(t => t.tag) || [];
                          const newTags = checked
                            ? [...currentTags, tag]
                            : currentTags.filter(t => t.id !== tag.id);
                          setEditingSeries({ ...editingSeries, mock_series_tags: newTags.map(t => ({ tag: t })) });
                        }}
                      />
                      <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                    </div>
                  ))}
                </div>
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

export default MockSeriesPage;