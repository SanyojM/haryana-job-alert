import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { CourseCategory } from "@/pages/admin/course-categories";
import type { CourseTag } from "@/pages/admin/course-tags";
import type { User } from "@/context/AuthContext";

import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import {Select, SelectItem} from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import {RadioGroup, Radio} from "@heroui/radio";

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
    category_id: string; 
    status?: 'draft' | 'published';
    total_duration_hhmm?: string | null;
    category?: CourseCategory; 
    authors?: User[]; 
    tags?: { tag: CourseTag }[];
};

interface CreateCourseFormProps {
    initialData?: Course;
    categories: CourseCategory[];
    tags: CourseTag[];
    authors: User[]; // This prop isn't used, as authors are fetched client-side
}

export function CreateCourseForm({ initialData, categories, tags }: CreateCourseFormProps) {
    const { token, isLoading: isAuthLoading } = useAuth();
    const [fetchedAuthors, setFetchedAuthors] = useState<User[]>([]); 
    const [authorFetchError, setAuthorFetchError] = useState<string | null>(null);

    const router = useRouter();
    const thumbnailFileRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!initialData;

    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [introVideoUrl, setIntroVideoUrl] = useState(initialData?.intro_video_url || "");
    const [pricingModel, setPricingModel] = useState<'free' | 'paid'>(initialData?.pricing_model || 'free');
    const [regularPrice, setRegularPrice] = useState<string>(initialData?.regular_price?.toString() || "");
    const [salePrice, setSalePrice] = useState<string>(initialData?.sale_price?.toString() || "");
    const [categoryId, setCategoryId] = useState<string | undefined>(initialData?.category_id?.toString());
    const [selectedTags, setSelectedTags] = useState<Set<string>>(
        new Set(initialData?.tags?.map(t => t?.tag?.id?.toString()) || [])
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
            if (token) { 
                setAuthorFetchError(null);
                try {
                    const adminUsers = await api.get('/users/admins', token);
                    setFetchedAuthors(adminUsers || []);
                } catch (err) {
                    console.error("Failed to fetch admin users client-side:", err);
                    setAuthorFetchError("Could not load authors. Please try reloading.");
                    setFetchedAuthors([]); 
                }
            } else if (!isAuthLoading) {
                 setAuthorFetchError("Authentication error. Cannot load authors.");
            }
        };

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


        const formData = new FormData();
        formData.append('title', title);
        if (description) formData.append('description', description);
        if (introVideoUrl) formData.append('intro_video_url', introVideoUrl);
        formData.append('pricing_model', pricingModel);
        if (pricingModel === 'paid') {
            formData.append('regular_price', regularPrice || '0'); 
            if (salePrice) formData.append('sale_price', salePrice);
        }
        formData.append('category_id', categoryId); 
        if (selectedTags.size > 0) {
            formData.append('tagIds', Array.from(selectedTags).join(','));
        }
         formData.append('authorIds', Array.from(selectedAuthors).join(',')); 
        if (totalDuration) formData.append('total_duration_hhmm', totalDuration);
        formData.append('status', status);

        const thumbnailFile = thumbnailFileRef.current?.files?.[0];
        if (thumbnailFile) {
            formData.append('thumbnailFile', thumbnailFile);
        }

        try {
            const endpoint = isEditMode ? `/courses/${initialData.id}` : '/courses';
            const method = isEditMode ? 'PUT' : 'POST';

            // Use api helper methods which set the base URL and headers correctly
            if (isEditMode) {
                await api.putFormData(endpoint, formData, authToken);
            } else {
                await api.postFormData(endpoint, formData, authToken);
            }

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
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Course Details</h2>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="space-y-2">
                                <Input id="course-title" label='Course Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    id="course-description"
                                    label="Description"
                                    value={description || ''}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                />
                                {status === 'draft' && <p className="text-xs text-gray-500">Required for publishing</p>}
                            </div>
                             <div className="space-y-2">
                                <Input id="intro-video-url" label='Intro Video URL (YouTube)' value={introVideoUrl || ''} onChange={(e) => setIntroVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="total-duration"
                                    value={totalDuration || ''}
                                    label='Total Duration'
                                    onChange={(e) => setTotalDuration(e.target.value)}
                                    placeholder="HH:MM (e.g., 02:30)"
                                 />
                                 {status === 'draft' && <p className="text-xs text-gray-500">Required for publishing</p>}
                            </div>
                        </CardBody>
                    </Card>

                     <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Pricing</h2>
                        </CardHeader>
                        <CardBody className="space-y-4 items-start">
                            <RadioGroup
                                value={pricingModel}
                                onChange={(e) => setPricingModel(e.target.value as 'free' | 'paid')}
                                className="flex items-center space-x-4"
                            >
                                <Radio value="free">Free</Radio>
                                <Radio value="paid">Paid</Radio>
                            </RadioGroup>

                            {pricingModel === 'paid' && (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                     <div className="space-y-2">
                                        <Input
                                            id="regular-price"
                                            label='Regular Price (₹)'
                                            type="number" value={regularPrice}
                                            onChange={(e) => setRegularPrice(e.target.value)}
                                            min="0"
                                            step="any"
                                        />
                                         {(status === 'draft' && pricingModel === 'paid') && <p className="text-xs text-gray-500">Required for publishing</p>}
                                    </div>
                                     <div className="space-y-2">
                                        <Input id="sale-price" label='Sale Price (₹, Optional)' type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} min="0" step="any" />
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Publish Settings</h2>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="space-y-2">
                                <Select 
                                    label='Status' 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                                >
                                    <SelectItem key="draft">Draft</SelectItem>
                                    <SelectItem key="published">Published</SelectItem>
                                </Select>
                                <p className="text-xs text-gray-500">Set to 'Published' to make the course visible.</p>
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full text-lg bg-[#7828C8] text-white">
                                {isLoading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Create Course')}
                            </Button>
                            {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
                        </CardBody>
                    </Card>

                    <Card>
                         <CardHeader>
                            <h2 className="text-lg font-semibold">Thumbnail</h2>
                         </CardHeader>
                         <CardBody className="space-y-2">
                            {thumbnailPreview && ( <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-auto rounded-md mb-2 object-cover aspect-video" /> )}
                           <Input
                                id="thumbnail-file"
                                type="file"
                                label="Upload Image"
                                accept="image/*"
                                ref={thumbnailFileRef}
                                onChange={handleThumbnailChange}
                             />
                              {(status === 'draft' && !thumbnailPreview) && <p className="text-xs text-gray-500">Required for publishing</p>}
                            <p className="text-xs text-gray-500">Recommended: 16:9 ratio.</p>
                         </CardBody>
                    </Card>

                     <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Category <span className="text-red-500">*</span></h2>
                        </CardHeader>
                        <CardBody>
                            <Select 
                                label="Category" // Add label
                                placeholder="Choose a category..."
                                value={categoryId} 
                                onChange={(e) => setCategoryId(e.target.value)} 
                                required
                            >
                                {categories.map(category => ( 
                                    <SelectItem key={category.id.toString()}> 
                                        {category.name}
                                    </SelectItem> 
                                ))}
                            </Select>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Tags</h2>
                        </CardHeader>
                        <CardBody className="space-y-2 max-h-48 overflow-y-auto">
                            {tags.map(tag => (
                                <Checkbox 
                                    key={tag.id}
                                    isSelected={selectedTags.has(tag.id.toString())} 
                                    onChange={() => handleTagChange(tag.id.toString())}
                                >
                                    {tag.name}
                                </Checkbox>
                            ))}
                            {tags.length === 0 && <p className="text-sm text-gray-500 text-center">No tags created yet.</p>}
                        </CardBody>
                    </Card>

                     <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Authors <span className="text-red-500">*</span></h2>
                        </CardHeader>
                         <CardBody className="space-y-2 max-h-48 overflow-y-auto">
                             {isAuthLoading ? (
                                 <p className="text-sm text-gray-500 text-center">Loading authors...</p>
                             ) : authorFetchError ? (
                                 <p className="text-sm text-red-600 text-center">{authorFetchError}</p>
                             ) : fetchedAuthors && fetchedAuthors.length > 0 ? (
                                fetchedAuthors.map(author => ( 
                                    <Checkbox 
                                        key={author.id}
                                        isSelected={selectedAuthors.has(author.id.toString())}
                                        onChange={() => handleAuthorChange(author.id.toString())}
                                    >
                                        {author.full_name} ({author.email})
                                    </Checkbox>
                                ))
                             ) : (
                                <p className="text-sm text-gray-500 text-center">No admin users found.</p>
                             )}
                         </CardBody>
                    </Card>
                </div>
            </div>
        </form>
    );
}