import React, { useState, useEffect } from 'react';
import {Alert, Button, Card, CardHeader, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Switch, Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell} from "@heroui/react";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, ExternalLink, Download, Upload, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface DownloadableFile {
  id: string;
  title: string;
  slug: string;
  description?: string;
  file_url: string;
  thumbnail_url?: string;
  price: number;
  is_published: boolean;
  downloads_count: number;
  created_at: string;
  _count?: {
    purchases: number;
    payments: number;
  };
}

interface FileFormData {
  title: string;
  slug: string;
  description: string;
  file_url: string;
  thumbnail_url: string;
  price: number;
  is_published: boolean;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

interface Purchase {
  id: string;
  file_id: string;
  user_id: number;
  purchased_at: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
}

const AdminFilesManagement: React.FC = () => {
  const [files, setFiles] = useState<DownloadableFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [editingFile, setEditingFile] = useState<DownloadableFile | null>(null);
  const [fileDialogOpen, setFileDialogOpen] = useState<boolean>(false);
  const [purchasesDialogOpen, setPurchasesDialogOpen] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState<boolean>(false);

  const [formData, setFormData] = useState<FileFormData>({
    title: '',
    slug: '',
    description: '',
    file_url: '',
    thumbnail_url: '',
    price: 0,
    is_published: false,
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await api.get('/files/admin/all');
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage({ type: 'error', text: 'Failed to fetch files' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = () => {
    setEditingFile(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      file_url: '',
      thumbnail_url: '',
      price: 0,
      is_published: false,
    });
    setFileDialogOpen(true);
  };

  const handleEditFile = (file: DownloadableFile) => {
    setEditingFile(file);
    setFormData({
      title: file.title,
      slug: file.slug,
      description: file.description || '',
      file_url: file.file_url,
      thumbnail_url: file.thumbnail_url || '',
      price: file.price,
      is_published: file.is_published,
    });
    setFileDialogOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'thumbnail') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (type === 'file') {
        setUploadingFile(true);
      } else {
        setUploadingThumbnail(true);
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', type === 'file' ? 'files' : 'thumbnails');

      const token = localStorage.getItem('token') || undefined;
      const response = await api.postFormData('/files/upload', uploadFormData, token);

      if (type === 'file') {
        setFormData({ ...formData, file_url: response.publicUrl });
      } else {
        console.log('Thumbnail upload response:', response);
        setFormData({ ...formData, thumbnail_url: response.publicUrl });
      }

      setMessage({ type: 'success', text: `${type === 'file' ? 'File' : 'Thumbnail'} uploaded successfully` });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally {
      if (type === 'file') {
        setUploadingFile(false);
      } else {
        setUploadingThumbnail(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' }); // Clear previous messages

      if (editingFile) {
        await api.put(`/files/${editingFile.id}`, formData);
        setMessage({ type: 'success', text: 'File updated successfully' });
      } else {
        await api.post('/files', formData);
        setMessage({ type: 'success', text: 'File created successfully' });
      }

      setFileDialogOpen(false);
      fetchFiles();
    } catch (error: any) {
      console.error('File operation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await api.delete(`/files/${id}`);
      setMessage({ type: 'success', text: 'File deleted successfully' });
      fetchFiles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete file' });
    }
  };

  const handleViewPurchases = async (fileId: string) => {
    try {
      const data = await api.get(`/files/${fileId}/purchases`);
      setPurchases(data);
      setPurchasesDialogOpen(true);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch purchases' });
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="container mx-auto p-6">
      <Card className='bg-white p-4 shadow-sm'>
        <CardHeader className='w-full'>
          <div className="flex justify-between items-center w-full">
            <div>
              <h1 className='font-bold text-lg'>Files Management</h1>
              <p className='text-sm text-gray-700'>Manage downloadable files and track purchases</p>
            </div>
            <Button onPress={handleCreateFile} className='bg-[#7828C8] text-white'>
              <Plus className="w-4 h-4 mr-2" />
              Add New File
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {message.text && (
            <Alert
              className="mb-4"
              color={message.type === 'error' ? 'danger' : 'success'}
            >
              {message.text}
            </Alert>
          )}

          <Table isStriped={true}>
            <TableHeader>
                <TableColumn>Title</TableColumn>
                <TableColumn>Slug</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Downloads</TableColumn>
                <TableColumn>Published</TableColumn>
                <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {loading && files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No files found. Create your first file to get started.
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium text-sm">{file.title}</TableCell>
                    <TableCell className="text-sm text-gray-600">{file.slug}</TableCell>
                    <TableCell>₹{file.price}</TableCell>
                    <TableCell>{file.downloads_count}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${file.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {file.is_published ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" onPress={() => handleEditFile(file)} className='bg-gray-100 border border-gray-200'>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" onPress={() => handleViewPurchases(file.id)} className='bg-gray-100 border border-gray-200'>
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" onPress={() => window.open(`/offline-forms/${file.slug}`, '_blank')} className='bg-gray-100  border border-gray-200'>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button size="sm" onPress={() => handleDelete(file.id)} className="bg-[#DC6C6C] text-white">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Create/Edit Dialog */}
      <Modal isOpen={fileDialogOpen} onOpenChange={setFileDialogOpen} className='shadow-sm bg-white'>
        <ModalContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <ModalHeader className='flex flex-col'>
            <h1>{editingFile ? 'Edit File' : 'Create New File'}</h1>
            <p className='text-sm font-light text-gray-700'>
              {editingFile ? 'Update file details and settings' : 'Add a new downloadable file'}
            </p>
          </ModalHeader>
          <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  if (!editingFile) {
                    setFormData({ ...formData, title: newTitle, slug: generateSlug(newTitle) });
                  } else {
                    setFormData({ ...formData, title: newTitle });
                  }
                }}
                placeholder="Enter file title"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="file-slug"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter file description"
                rows={4}
              />
            </div>

            <div>
              <Input
                id="price"
                type="number"
                label="Price (₹)"
                labelPlacement='outside-top'
                value={String(formData.price)}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="file">Upload File</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'file')}
                  disabled={uploadingFile}
                />
                {uploadingFile && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {formData.file_url && (
                <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>
              )}
            </div>

            <div>
              <Label htmlFor="thumbnail">Upload Thumbnail (Optional)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  disabled={uploadingThumbnail}
                />
                {uploadingThumbnail && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {formData.thumbnail_url && (
                <p className="text-xs text-green-600 mt-1">✓ Thumbnail uploaded</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.is_published}
                onValueChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="published">Publish file</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 flex-col">
            {!formData.title && (
              <p className="text-xs text-red-600 text-right">* Title is required</p>
            )}
            {!formData.file_url && (
              <p className="text-xs text-red-600 text-right">* Please upload a file first</p>
            )}
              </div>
            </ModalBody>
          <ModalFooter className='flex justify-start'>
            <div className="flex gap-2">
              <Button onPress={() => setFileDialogOpen(false)} className='border border-gray-200'>Cancel</Button>
              <Button 
                onPress={handleSubmit} 
                isDisabled={loading || !formData.title || !formData.file_url}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingFile ? 'Update' : 'Create')}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Purchases Dialog */}
      <Modal isOpen={purchasesDialogOpen} onOpenChange={setPurchasesDialogOpen} className='py-2'>
        <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ModalHeader className='flex flex-col'>
            <h1>File Purchases</h1>
            <p className='text-sm text-gray-700 font-light'>List of users who purchased this file</p>
          </ModalHeader>
          <ModalBody>
          <Table>
            <TableHeader>
                <TableColumn>User</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Purchased At</TableColumn>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No purchases yet
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.user.full_name}</TableCell>
                    <TableCell>{purchase.user.email}</TableCell>
                    <TableCell>{new Date(purchase.purchased_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminFilesManagement;
