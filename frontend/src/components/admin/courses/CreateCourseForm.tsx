import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { CourseCategory } from "@/pages/admin/course-categories";
import type { CourseTag } from "@/pages/admin/course-tags";
import type { User } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the Course type based on your API
export type Course = {
    id: string;
    title: string;
    slug?: string;
    description?: string | null;
    thumbnail_url?: string | null;
    intro_video_url?: string | null;
    pricing_model: 'free' | 'paid';
    regular_price?: number | null;
    sale_price?: number | null;
    category_id: string; // Assuming string ID from frontend
    status?: 'draft' | 'published';
    total_duration_hhmm?: string | null;
    category?: CourseCategory; // For displaying category name
    authors?: User[]; // Assuming User type matches admin users
    tags?: { tag: CourseTag }[]; // Assuming structure from API
};

// Define props for the form
interface CreateCourseFormProps {
    initialData?: Course;
    categories: CourseCategory[];
    tags: CourseTag[];
    authors: User[]; // Assuming admins are fetched as Users
}

export function CreateCourseForm({ initialData, categories, tags, authors }: CreateCourseFormProps) {
    const { token, isLoading: isAuthLoading } = useAuth(); // Get token and auth loading state
    const [fetchedAuthors, setFetchedAuthors] = useState<User[]>([]); // State for fetched authors
    const [authorFetchError, setAuthorFetchError] = useState<string | null>(null);

    const router = useRouter();
    const thumbnailFileRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!initialData;

    // Form State
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [introVideoUrl, setIntroVideoUrl] = useState(initialData?.intro_video_url || "");
    const [pricingModel, setPricingModel] = useState<'free' | 'paid'>(initialData?.pricing_model || 'free');
    const [regularPrice, setRegularPrice] = useState<string>(initialData?.regular_price?.toString() || "");
    const [salePrice, setSalePrice] = useState<string>(initialData?.sale_price?.toString() || "");
    const [categoryId, setCategoryId] = useState<string | undefined>(initialData?.category_id?.toString());
    const [selectedTags, setSelectedTags] = useState<Set<string>>(
        new Set(initialData?.tags?.map(t => t.tag.id.toString()) || [])
    );
    const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(
        new Set(initialData?.authors?.map(a => a.id.toString()) || [])
    );
    const [totalDuration, setTotalDuration] = useState(initialData?.total_duration_hhmm || "");
    const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail_url || null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAuthors = async () => {
            if (token) { // Only fetch if token is available
                setAuthorFetchError(null);
                try {
                    const adminUsers = await api.get('/users/admins', token);
                    setFetchedAuthors(adminUsers || []);
                } catch (err) {
                    console.error("Failed to fetch admin users client-side:", err);
                    setAuthorFetchError("Could not load authors. Please try reloading.");
                    setFetchedAuthors([]); // Clear authors on error
                }
            } else if (!isAuthLoading) {
                 // Handle case where auth is resolved but no token (shouldn't happen on admin pages)
                 setAuthorFetchError("Authentication error. Cannot load authors.");
            }
        };

        // Don't run fetch until authentication is resolved
        if (!isAuthLoading) {
             loadAuthors();
        }

    }, [token, isAuthLoading]);

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setThumbnailPreview(initialData?.thumbnail_url || null);
        }
    };

    const handleTagChange = (tagId: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev);
            newSet.has(tagId) ? newSet.delete(tagId) : newSet.add(tagId);
            return newSet;
        });
    };

    const handleAuthorChange = (authorId: string) => {
        setSelectedAuthors(prev => {
            const newSet = new Set(prev);
            newSet.has(authorId) ? newSet.delete(authorId) : newSet.add(authorId);
            return newSet;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const authToken = token || undefined;

        // --- Client-side validation based on status ---
        if (status === 'published') {
            if (!description?.trim()) {
                 setError("Description is required for publishing.");
                 setIsLoading(false);
                 return;
            }
             if (!totalDuration?.trim()) {
                 setError("Total Duration is required for publishing.");
                 setIsLoading(false);
                 return;
            }
            if (pricingModel === 'paid' && (!regularPrice || parseFloat(regularPrice) <= 0)) {
                 setError("Regular price is required for paid, published courses.");
                 setIsLoading(false);
                 return;
            }
             if (!thumbnailPreview && !thumbnailFileRef.current?.files?.[0]) {
                 setError("Thumbnail image is required for publishing.");
                 setIsLoading(false);
                 return;
            }
        }
        if (!categoryId) {
            setError("Please select a category.");
            setIsLoading(false);
            return;
        }
        if (selectedAuthors.size === 0) {
             setError("Please select at least one author.");
             setIsLoading(false);
             return;
        }
        // --- End validation ---


        const formData = new FormData();
        formData.append('title', title);
        if (description) formData.append('description', description);
        if (introVideoUrl) formData.append('intro_video_url', introVideoUrl);
        formData.append('pricing_model', pricingModel);
        if (pricingModel === 'paid') {
            formData.append('regular_price', regularPrice || '0'); // Send 0 if empty but paid
            if (salePrice) formData.append('sale_price', salePrice);
        }
        formData.append('category_id', categoryId); // Category is always required
        if (selectedTags.size > 0) {
            formData.append('tagIds', Array.from(selectedTags).join(','));
        }
         formData.append('authorIds', Array.from(selectedAuthors).join(',')); // Authors always required
        if (totalDuration) formData.append('total_duration_hhmm', totalDuration);
        formData.append('status', status);

        const thumbnailFile = thumbnailFileRef.current?.files?.[0];
        if (thumbnailFile) {
            formData.append('thumbnailFile', thumbnailFile);
        }

        try {
            const endpoint = isEditMode ? `/courses/${initialData.id}` : '/courses';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: method,
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData,
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} course`);
            }

            await response.json();
            router.push('/admin/courses');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} course.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Course Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="course-title">Course Title</Label>
                                <Input id="course-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="course-description">
                                    Description {status === 'published' && <span className="text-red-500">*</span>}
                                </Label>
                                <Textarea
                                    id="course-description"
                                    value={description || ''}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    // Removed browser required, handle in handleSubmit
                                />
                                {status === 'draft' && <p className="text-xs text-muted-foreground">Required for publishing</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="intro-video-url">Intro Video URL (YouTube)</Label>
                                <Input id="intro-video-url" value={introVideoUrl || ''} onChange={(e) => setIntroVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="total-duration">
                                    Total Duration {status === 'published' && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="total-duration"
                                    value={totalDuration || ''}
                                    onChange={(e) => setTotalDuration(e.target.value)}
                                    placeholder="HH:MM (e.g., 02:30)"
                                 />
                                 {status === 'draft' && <p className="text-xs text-muted-foreground">Required for publishing</p>}
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <RadioGroup value={pricingModel} onValueChange={(value) => setPricingModel(value as 'free' | 'paid')}>
                                <div className="flex items-center space-x-2"> <RadioGroupItem value="free" id="price-free" /> <Label htmlFor="price-free">Free</Label> </div>
                                <div className="flex items-center space-x-2"> <RadioGroupItem value="paid" id="price-paid" /> <Label htmlFor="price-paid">Paid</Label> </div>
                            </RadioGroup>
                            {pricingModel === 'paid' && (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="regular-price">
                                            Regular Price (₹) {(pricingModel === 'paid' && status === 'published') && <span className="text-red-500">*</span>}
                                        </Label>
                                        <Input
                                            id="regular-price"
                                            type="number" value={regularPrice}
                                            onChange={(e) => setRegularPrice(e.target.value)}
                                            min="0"
                                            step="any"
                                        />
                                         {(status === 'draft' && pricingModel === 'paid') && <p className="text-xs text-muted-foreground">Required for publishing</p>}
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="sale-price">Sale Price (₹, Optional)</Label>
                                        <Input id="sale-price" type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} min="0" step="any" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1 space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Publish Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={(value) => setStatus(value as 'draft' | 'published')}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent> <SelectItem value="draft">Draft</SelectItem> <SelectItem value="published">Published</SelectItem> </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Set to 'Published' to make the course visible.</p>
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full text-lg">
                                {isLoading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Create Course')}
                            </Button>
                            {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader><CardTitle>Thumbnail</CardTitle></CardHeader>
                         <CardContent className="space-y-2">
                            {thumbnailPreview && ( <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-auto rounded-md mb-2 object-cover aspect-video" /> )}
                            <Label htmlFor="thumbnail-file">
                                Upload Image {(status === 'published' && !thumbnailPreview) && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                                id="thumbnail-file"
                                type="file"
                                accept="image/*"
                                ref={thumbnailFileRef}
                                onChange={handleThumbnailChange}
                             />
                              {(status === 'draft' && !thumbnailPreview) && <p className="text-xs text-muted-foreground">Required for publishing</p>}
                            <p className="text-xs text-muted-foreground">Recommended: 16:9 ratio.</p>
                         </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Category <span className="text-red-500">*</span></CardTitle></CardHeader>
                        <CardContent>
                            <Select value={categoryId} onValueChange={setCategoryId} required>
                                 <SelectTrigger><SelectValue placeholder="Choose a category..." /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => ( <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem> ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
                        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                            {tags.map(tag => (
                                <div key={tag.id} className="flex items-center space-x-2">
                                    <Checkbox id={`tag-${tag.id}`} checked={selectedTags.has(tag.id.toString())} onCheckedChange={() => handleTagChange(tag.id.toString())} />
                                    <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                                </div>
                            ))}
                            {tags.length === 0 && <p className="text-sm text-muted-foreground text-center">No tags created yet.</p>}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Authors <span className="text-red-500">*</span></CardTitle></CardHeader>
                         <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                             {isAuthLoading ? (
                                 <p className="text-sm text-muted-foreground text-center">Loading authors...</p>
                             ) : authorFetchError ? (
                                 <p className="text-sm text-red-600 text-center">{authorFetchError}</p>
                             ) : fetchedAuthors && fetchedAuthors.length > 0 ? (
                                fetchedAuthors.map(author => ( // Use fetchedAuthors here
                                    <div key={author.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`author-${author.id}`}
                                            checked={selectedAuthors.has(author.id.toString())}
                                            onCheckedChange={() => handleAuthorChange(author.id.toString())}
                                        />
                                        <Label htmlFor={`author-${author.id}`}>{author.full_name} ({author.email})</Label>
                                    </div>
                                ))
                             ) : (
                                <p className="text-sm text-muted-foreground text-center">No admin users found.</p>
                             )}
                         </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}