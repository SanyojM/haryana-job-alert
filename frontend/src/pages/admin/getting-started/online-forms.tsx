import React, { useState, useEffect } from 'react';
import { Textarea } from '@heroui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical, Edit, ExternalLink, Users, Eye } from 'lucide-react';
import {Alert, Button, Card, CardHeader, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Switch, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@heroui/react";
import { api } from '@/lib/api';
import { Label } from '@/components/ui/label';

interface FormField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options: string[] | null;
  order: number;
  meta: Record<string, any>;
}

interface Form {
  id: string;
  title: string;
  slug: string;
  description?: string;
  published: boolean;
  price: number;
  fields?: FormField[];
  createdAt?: string;
  _count?: {
    submissions: number;
  };
}

interface Submission {
  id: string;
  form_id: string;
  user_id: number;
  data: Record<string, any>;
  paid: boolean;
  created_at: string;
  user?: {
    id: number;
    full_name: string;
    email: string;
  };
  payment?: {
    amount: number;
    status: string;
  };
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  published: boolean;
  price: number;
  fields: FormField[];
}

interface NewField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options: string;
  order: number;
  meta: Record<string, any>;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

const AdminFormsManagement: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [selectedFormTitle, setSelectedFormTitle] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    published: false,
    price: 0,
    fields: []
  });

  const [newField, setNewField] = useState<NewField>({
    key: '',
    label: '',
    type: 'text',
    required: false,
    options: '',
    order: 0,
    meta: {}
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await api.get('/forms/admin/all');
      setForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setMessage({ type: 'error', text: 'Failed to fetch forms' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (formId: string, formTitle: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get(`/forms/${formId}/submissions`);
      setSubmissions(response.submissions || []);
      setSelectedFormId(formId);
      setSelectedFormTitle(formTitle);
      setSubmissionsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setMessage({ type: 'error', text: 'Failed to fetch submissions' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = (): void => {
    setEditingForm(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      published: false,
      price: 0,
      fields: []
    });
    setFormDialogOpen(true);
  };

  const handleEditForm = (form: Form): void => {
    setEditingForm(form);
    setFormData({
      title: form.title,
      slug: form.slug,
      description: form.description || '',
      published: form.published,
      price: form.price,
      fields: form.fields || []
    });
    setFormDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setFormDialogOpen(false);
    setEditingForm(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      published: false,
      price: 0,
      fields: []
    });
    setMessage({ type: '', text: '' });
  };

  const handleDeleteForm = async (formId: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/forms/${formId}`);
      setMessage({ type: 'success', text: 'Form deleted successfully!' });
      fetchForms();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete form' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = (): void => {
    if (!newField.key || !newField.label) {
      setMessage({ type: 'error', text: 'Field key and label are required' });
      return;
    }

    const field: FormField = {
      ...newField,
      order: formData.fields.length,
      options: newField.options ? newField.options.split(',').map(o => o.trim()) : null
    };

    setFormData({
      ...formData,
      fields: [...formData.fields, field]
    });

    setNewField({
      key: '',
      label: '',
      type: 'text',
      required: false,
      options: '',
      order: 0,
      meta: {}
    });
    setMessage({ type: 'success', text: 'Field added successfully' });
  };

  const handleRemoveField = (index: number): void => {
    const updatedFields = formData.fields.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      fields: updatedFields.map((f, i) => ({ ...f, order: i }))
    });
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug) {
      setMessage({ type: 'error', text: 'Title and slug are required' });
      return;
    }

    if (formData.fields.length === 0) {
      setMessage({ type: 'error', text: 'At least one field is required' });
      return;
    }

    try {
      setLoading(true);
      
      if (editingForm) {
        // Update existing form
        await api.put(`/forms/${editingForm.id}`, formData);
        setMessage({ type: 'success', text: 'Form updated successfully!' });
        setEditingForm(null);
      } else {
        // Create new form
        await api.post('/forms', formData);
        setMessage({ type: 'success', text: 'Form created successfully!' });
      }
      
      setFormData({
        title: '',
        slug: '',
        description: '',
        published: false,
        price: 0,
        fields: []
      });
      fetchForms();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || `Failed to ${editingForm ? 'update' : 'create'} form` });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Forms Management</h1>
        <Button onClick={handleCreateNew} className='bg-[#8A79AB] text-white rounded-md'>
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {message.text && (
        <Alert
          className="mb-4"
          color={message.type === 'error' ? 'danger' : 'success'}
        >
          {message.text}
        </Alert>
      )}

      <Card className='bg-white p-4 rounded-2xl border border-gray-300 shadow-sm'>
        <CardHeader>
          <h1>All Forms ({forms.length})</h1>
          <p>
            Manage all your forms, view submissions, and update form details
          </p>
        </CardHeader>
        <CardBody>
          {loading && forms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading forms...</div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No forms created yet. Click "Create New Form" to get started!
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table isStriped={true}>
                <TableHeader>
                    <TableColumn>Title</TableColumn>
                    <TableColumn>Slug</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Fields</TableColumn>
                    <TableColumn>Price</TableColumn>
                    <TableColumn>Submissions</TableColumn>
                    <TableColumn className="text-right">Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.title}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{form.slug}</code>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          form.published 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {form.published ? 'Published' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell>{form.fields?.length || 0}</TableCell>
                      <TableCell>
                        {form.price > 0 ? (
                          <span className="font-semibold text-green-600">₹{form.price}</span>
                        ) : (
                          <span className="text-gray-500">Free</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => fetchSubmissions(form.id, form.title)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          {form._count?.submissions || 0}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {form.published && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(`/online-forms/${form.slug}`, '_blank')}
                              title="View Live Form"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditForm(form)}
                            title="Edit Form"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteForm(form.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Form"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Form Create/Edit Dialog */}
      <Modal isOpen={formDialogOpen} onOpenChange={setFormDialogOpen} className='shadow-sm bg-white p-4 rounded-2xl border border-gray-300' size='lg'>
        <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ModalHeader className='flex flex-col'>
            <h1>{editingForm ? 'Edit Form' : 'Create New Form'}</h1>
            <p className='text-xs font-medium'>
              {editingForm ? 'Update the form details and fields' : 'Build a custom form with dynamic fields'}
            </p>
          </ModalHeader>

              <form onSubmit={handleSubmitForm} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="title"
                      label="Form Title *"
                      labelPlacement='outside-top'
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        });
                      }}
                      placeholder="Registration Form"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      id="slug"
                      label="Slug *"
                      labelPlacement='outside-top'
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="registration-form"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Form description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="price"
                      // label="Price (INR)"
                      type="number"
                      value={String(formData.price)}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2 mt-8">
                    <Switch defaultSelected onValueChange={(checked) => setFormData({ ...formData, published: checked })}>Published</Switch>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
                  
                  {formData.fields.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.fields.map((field, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <div className="flex-1">
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-gray-500">
                              {field.key} • {field.type} {field.required && '• Required'}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveField(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Card className="bg-blue-50 shadow-sm">
                    <CardHeader>
                      <h1 className="text-base">Add New Field</h1>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Field Key</Label>
                          <Input
                            value={newField.key}
                            onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                            placeholder="email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Field Label</Label>
                          <Input
                            value={newField.label}
                            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                            placeholder="Email Address"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Field Type</Label>
                          <Select
                            value={newField.type}
                            onValueChange={(value) => setNewField({ ...newField, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="file">File</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2 mt-8">
                          <Switch defaultSelected onValueChange={(checked) => setNewField({ ...newField, required: checked })}>Required</Switch>
                        </div>
                      </div>

                      {(newField.type === 'select' || newField.type === 'radio') && (
                        <div className="space-y-2">
                          <Label>Options (comma-separated)</Label>
                          <Input
                            value={newField.options}
                            onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}

                      <Button type="button" onClick={handleAddField} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                      </Button>
                    </CardBody>
                  </Card>
                </div>

                <Button type="submit" className="w-full bg-[#8A79AB] rounded-md text-white" disabled={loading}>
                  {loading ? (editingForm ? 'Updating...' : 'Creating...') : (editingForm ? 'Update Form' : 'Create Form')}
                </Button>
              </form>
        </ModalContent>
      </Modal>

      {/* Submissions Dialog */}
      <Modal isOpen={submissionsDialogOpen} onOpenChange={setSubmissionsDialogOpen} className='shadow-sm bg-[#f8f7fa] border border-gray-300 rounded-2xl p-4' size='sm'>
        <ModalContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <ModalHeader className='flex flex-col'>
            <h1>Form Submissions - {selectedFormTitle}</h1>
            <p className='text-xs font-medium'>
              View all submissions for this form
            </p>
          </ModalHeader>
          
          {loading ? (
            <div className="text-center py-8">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No submissions yet
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className='bg-white p-2 rounded-xl border border-gray-200'>
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{submission.user?.full_name}</p>
                        <p className="text-sm text-gray-500">{submission.user?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          submission.paid 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {submission.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3 space-y-2">
                      {Object.entries(submission.data).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium text-gray-600">{key}:</span>
                          <span className="text-sm col-span-2 break-words">
                            {typeof value === 'string' && value.startsWith('http') ? (
                              <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                View File <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              String(value)
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminFormsManagement;