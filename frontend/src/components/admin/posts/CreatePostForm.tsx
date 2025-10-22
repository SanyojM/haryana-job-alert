import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { Post } from "@/pages/admin/posts";
import type { Category, PostTemplate, Tag } from "@/pages/admin/posts/new";

interface CreatePostFormProps {
  initialData?: Post;
  templates: PostTemplate[];
  categories: Category[];
  tags: Tag[];
}

export function CreatePostForm({ initialData, templates, categories, tags }: CreatePostFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const isEditMode = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState<string | undefined>(initialData?.category_id?.toString());
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData?.meta_keywords || "");
  
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(initialData?.post_tags?.map((pt: { tag_id: number }) => pt.tag_id.toString()) || [])
  );
  const [templateId, setTemplateId] = useState<string>(initialData?.template_id?.toString() || "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initialContent, setInitialContent] = useState(initialData?.content_html || "");

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id.toString() === templateId);
    setTemplateId(templateId);
    if (template && editorRef.current) {
        editorRef.current.setContent(template.structure);
    }
  };

  const handleTagChange = (tagId: string) => {
    setSelectedTags(prev => {
        const newSet = new Set(prev);
        newSet.has(tagId) ? newSet.delete(tagId) : newSet.add(tagId);
        return newSet;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editorRef.current || !categoryId) {
        setError("Category and content are required.");
        return;
    }
    setIsLoading(true);
    setError(null);
    
    const finalContentHtml = editorRef.current.getContent();
    
    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('slug', slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
    formData.append('category_id', categoryId);
    formData.append('content_html', finalContentHtml);
    
    if (templateId) {
        formData.append('template_id', templateId);
    }
    
    const tagsString = Array.from(selectedTags).join(',');
    if (tagsString) {
        formData.append('tags', tagsString);
    }
    
    if (metaTitle) formData.append('meta_title', metaTitle);
    if (metaDescription) formData.append('meta_description', metaDescription);
    if (metaKeywords) formData.append('meta_keywords', metaKeywords);
    
    if (thumbnailFile) {
        formData.append('file', thumbnailFile);
    }

    try {
      if (isEditMode) {
        await api.put(`/posts/${initialData.id}`, formData, authToken);
      } else {
        await api.postFormData('/posts', formData, authToken);
      }
      router.push('/admin/posts');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save post.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>Load a template and then edit the content visually.</CardDescription>
            </CardHeader>
            <CardContent>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={initialContent}
                init={{
                  height: 700,
                  menubar: true,
                  plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                  content_style: 'body { font-family:Poppins,sans-serif; font-size:16px }'
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Load Template</Label>
                <Select value={templateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger><SelectValue placeholder="Load a template..." /></SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id.toString()}>{template.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-title">Post Title</Label>
                <Input id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-slug">Slug</Label>
                <Input id="post-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated-from-title" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger><SelectValue placeholder="Choose a category..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Meta Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail-file">Thumbnail Image</Label>
                <Input id="thumbnail-file" type="file" onChange={handleFileChange} accept="image/*" />
                {!thumbnailFile && initialData?.thumbnail_url && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Current thumbnail:</p>
                    <img src={initialData.thumbnail_url} alt="Current thumbnail" className="w-32 h-32 object-cover rounded-md border" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input id="meta-title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO-friendly title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea id="meta-description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="SEO-friendly description for search results" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input id="meta-keywords" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder="comma, separated, keywords" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tag-${tag.id}`}
                    checked={selectedTags.has(tag.id.toString())}
                    onCheckedChange={() => handleTagChange(tag.id.toString())}
                  />
                  <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="w-full text-lg">
            {isLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post')}
          </Button>
          {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </div>
    </form>
  );
}