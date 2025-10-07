import { useState, useRef, useEffect } from "react";
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
import type { Post } from "@/pages/admin/posts"; 
import type { Category, PostTemplate, Tag } from "@/pages/admin/posts/new";

interface CreatePostFormProps {
  initialData?: Post;
  templates: PostTemplate[];
  categories: Category[];
  tags: Tag[];
}

// Removed unnecessary PROCESS variable; use process.env directly.

export function CreatePostForm({ initialData, templates, categories, tags }: CreatePostFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const isEditMode = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState<string | undefined>(initialData?.category_id?.toString());
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const [externalUrl, setExternalUrl] = useState(initialData?.external_url || "");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(initialData?.post_tags?.map((pt: { tag_id: number }) => pt.tag_id.toString()) || [])
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initialContent, setInitialContent] = useState(initialData?.content_html || "");

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
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

  const handleSubmit = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editorRef.current) return;
    setIsLoading(true);
    setError(null);
    
    const finalContentHtml = editorRef.current.getContent();
    const postData = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      category_id: Number(categoryId),
      content_html: finalContentHtml,
      thumbnail_url: thumbnailUrl || null,
      external_url: externalUrl || null,
      tags: Array.from(selectedTags).map(Number),
      content: initialData?.content || "Legacy content field, can be empty.",
    };

    try {
      if (isEditMode) {
        await api.put(`/posts/${initialData.id}`, postData, authToken);
      } else {
        await api.post('/posts', postData, authToken);
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
                <Select onValueChange={handleTemplateChange}>
                  <SelectTrigger><SelectValue placeholder="Load a template..." /></SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
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
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
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
                <Label htmlFor="thumbnail-url">Thumbnail URL</Label>
                <Input id="thumbnail-url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="external-url">External URL</Label>
                <Input id="external-url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://example.com/source" />
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
                    checked={selectedTags.has(tag.id)}
                    onCheckedChange={() => handleTagChange(tag.id)}
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