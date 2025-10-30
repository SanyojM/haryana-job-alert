import { useEffect, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button, Card, CardHeader, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Switch} from "@heroui/react";

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
    <div className="container mx-auto p-4 space-y-8">
      {/* Add New Item Card */}
      <Card className='p-2'>
        <CardHeader>
          <h1>Add New Carousel Item</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="text"
                label="Text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter carousel text"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="link"
                label="Link (Optional)"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Enter URL"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newIsActive}
                onValueChange={setNewIsActive}
                id="active"
                defaultSelected>
                  Active
                </Switch>
            </div>
            <Button onPress={handleCreateItem} isDisabled={!newText} className='bg-[#7828C8] text-white rounded-lg'>
              Add Item
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* List of Items Card */}
      <Card className='p-2'>
        <CardHeader>
          Carousel Items
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
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
                <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        variant="ghost"
                        onPress={() => {
                      setEditingItem(item);
                      setIsEditDialogOpen(true);
                    }}
                        aria-label="Edit category"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onPress={() => handleDeleteItem(item.id)}
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Edit Dialog */}
      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='bg-white shadow-sm p-4 rounded-xl border border-gray-300'>
        <ModalContent>
          <ModalHeader className='pl-0'>
            <h1>Edit Carousel Item</h1>
          </ModalHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="edit-text"
                label="Text"
                value={editingItem?.text ?? ''}
                onChange={(e) =>
                  setEditingItem(
                    prev => prev ? { ...prev, text: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                id="edit-link"
                label="Link (Optional)"
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
                onValueChange={(checked) =>
                  setEditingItem(
                    prev => prev ? { ...prev, is_active: checked } : null
                  )
                }
                id="edit-active"
                defaultSelected>
                  Active
                </Switch>
            </div>
          </div>
          <ModalFooter>
            <Button onPress={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onPress={handleUpdateItem} className='bg-[#7828C8] text-white'>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CarouselPage;
