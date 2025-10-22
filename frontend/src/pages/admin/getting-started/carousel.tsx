import { useEffect, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type CarouselItem = {
  id: string;
  text: string;
  link?: string | null;
  is_active: boolean;
};

const CarouselPage: NextPage = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items when the component mounts and when token changes
  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (token) {
          const fetchedItems = await api.get('/carousel/all', token);
          setItems(fetchedItems);
        }
      } catch (error) {
        console.error('Failed to fetch carousel items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [token]);

  // State for the "Add New" form
  const [newText, setNewText] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newIsActive, setNewIsActive] = useState(false);

  // State for the "Edit" dialog
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Function to handle creating a new item
  const handleCreateItem = async () => {
    try {
      const response = await api.post('/carousel', {
        text: newText,
        link: newLink || undefined,
        is_active: newIsActive
      }, token || undefined);

      setItems([...items, response]);
      setNewText('');
      setNewLink('');
      setNewIsActive(false);
    } catch (error) {
      console.error('Failed to create carousel item:', error);
    }
  };

  // Function to handle updating an item
  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const response = await api.put(`/carousel/${editingItem.id}`, {
        text: editingItem.text,
        link: editingItem.link || undefined,
        is_active: editingItem.is_active
      }, token || undefined);

      setItems(items.map(item => 
        item.id === editingItem.id ? response : item
      ));
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update carousel item:', error);
    }
  };

  // Function to handle deleting an item
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/carousel/${id}`, token || undefined);

      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete carousel item:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Add New Item Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Carousel Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter carousel text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link (Optional)</Label>
              <Input
                id="link"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Enter URL"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newIsActive}
                onCheckedChange={setNewIsActive}
                id="active"
              />
              <Label htmlFor="active">Active</Label>
            </div>
            <Button onClick={handleCreateItem} disabled={!newText}>
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List of Items Card */}
      <Card>
        <CardHeader>
          <CardTitle>Carousel Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{item.text}</p>
                  {item.link && (
                    <p className="text-sm text-gray-500">{item.link}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${item.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-500">
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingItem(item);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Carousel Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-text">Text</Label>
              <Input
                id="edit-text"
                value={editingItem?.text ?? ''}
                onChange={(e) =>
                  setEditingItem(
                    prev => prev ? { ...prev, text: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-link">Link (Optional)</Label>
              <Input
                id="edit-link"
                value={editingItem?.link ?? ''}
                onChange={(e) =>
                  setEditingItem(
                    prev => prev ? { ...prev, link: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editingItem?.is_active ?? false}
                onCheckedChange={(checked) =>
                  setEditingItem(
                    prev => prev ? { ...prev, is_active: checked } : null
                  )
                }
                id="edit-active"
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarouselPage;
