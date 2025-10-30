import { useState, useEffect, useRef } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Edit, Trash2, GripVertical } from 'lucide-react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    ResponderProvided,
    DroppableProvided,
    DraggableProvided
} from '@hello-pangea/dnd'; // Use @hello-pangea/dnd

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import type { Course } from '@/components/admin/courses/CreateCourseForm';

// Define Topic and Lesson types based on API
export type Lesson = {
    id: string;
    title: string;
    description?: string | null;
    video_url?: string | null;
    video_duration_sec?: number | null;
    featured_image_url?: string | null;
    order: number;
};

export type Topic = {
    id: string;
    title: string;
    description?: string | null;
    order: number;
    lessons: Lesson[];
};

// Extend Course type to include topics
interface CourseWithContent extends Course {
    course_topics: Topic[];
}

interface ManageCourseContentPageProps {
  courseId: string; // We only pass the ID from the server
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    if (typeof id !== 'string') {
        return { notFound: true };
    }
    // Only pass the ID prop
    return { props: { courseId: id } };
};

// We move the entire UI into a separate component to handle data loading
const ManageCourseContentPage: NextPage<ManageCourseContentPageProps> = ({ courseId }) => {
    const { token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    
    const [course, setCourse] = useState<CourseWithContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseContent = async () => {
             if (!isAuthLoading && token) {
                try {
                    setIsLoading(true);
                    setError(null);
                    
                    const courseData = await api.get(`/courses/id/${courseId}`, token);
                    
                    // Ensure topics and lessons are sorted
                    const sortedTopics = (courseData.course_topics || []).sort((a: Topic, b: Topic) => a.order - b.order);
                    sortedTopics.forEach((topic: Topic) => {
                        if (topic.lessons) {
                            topic.lessons.sort((a, b) => a.order - b.order);
                        }
                    });
                    courseData.course_topics = sortedTopics;

                    setCourse(courseData);
                } catch (err: unknown) {
                    console.error("Failed to fetch course content:", err);
                    setError(err instanceof Error ? err.message : "Failed to load data");
                } finally {
                    setIsLoading(false);
                }
             } else if (!isAuthLoading && !token) {
                 router.push('/login');
             }
        };

        fetchCourseContent();
    }, [token, isAuthLoading, courseId, router]);

    if (isLoading || isAuthLoading) {
        return <div className="flex h-screen items-center justify-center">Loading course content...</div>;
    }

    if (error) {
         return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>;
    }

    if (!course) {
         return <div className="flex h-screen items-center justify-center">Course not found.</div>;
    }

    // Render the UI component once data is loaded
    return <ManageCourseContentUI initialCourse={course} />;
};

// This new component contains all the UI logic from your original file
const ManageCourseContentUI = ({ initialCourse }: { initialCourse: CourseWithContent }) => {
    const { token } = useAuth();
    const router = useRouter();
    // State is initialized from the fetched data
    const [course, setCourse] = useState<CourseWithContent>(initialCourse);
    const [topics, setTopics] = useState<Topic[]>(initialCourse.course_topics || []);

    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Partial<Topic> | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
    const [currentTopicIdForLesson, setCurrentTopicIdForLesson] = useState<string | null>(null);
    const featuredImageFileRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reloadData = async () => {
        const authToken = token || undefined;
        try {
            const courseData = await api.get(`/courses/id/${course.id}`, authToken);
            // Ensure sorting
            const sortedTopics = (courseData.course_topics || []).sort((a: Topic, b: Topic) => a.order - b.order);
            sortedTopics.forEach((topic: Topic) => {
                if (topic.lessons) topic.lessons.sort((a,b) => a.order - b.order);
            });
            courseData.course_topics = sortedTopics;
            
            setCourse(courseData);
            setTopics(courseData.course_topics || []);
        } catch (err) {
            console.error("Failed to reload data", err);
            alert("Failed to refresh data. Please refresh the page.");
        }
    }

    const openTopicModal = (topic: Partial<Topic> | null = null) => {
        setEditingTopic(topic ? { ...topic } : { title: '', description: '' });
        setIsTopicModalOpen(true);
        setError(null);
    };

    const handleSaveTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTopic || !editingTopic.title) return;
        setIsLoading(true);
        setError(null);
        const authToken = token || undefined;
        const isEditMode = !!editingTopic.id;

        try {
            const endpoint = isEditMode
                ? `/courses/topics/${editingTopic.id}`
                : `/courses/${course.id}/topics`;
            const method = isEditMode ? 'put' : 'post';
            const payload = { title: editingTopic.title, description: editingTopic.description || null };

            await api[method](endpoint, payload, authToken);
            await reloadData(); // Reload all data to ensure order is correct

            setIsTopicModalOpen(false);
            setEditingTopic(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : `Failed to save topic.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        if (!window.confirm('Are you sure you want to delete this topic and ALL its lessons?')) return;
        setIsLoading(true);
        const authToken = token || undefined;
        try {
            await api.delete(`/courses/topics/${topicId}`, authToken);
            await reloadData(); // Reload
        } catch (err: unknown) {
            alert(`Failed to delete topic: ${err instanceof Error ? err.message : "Error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const openLessonModal = (topicId: string, lesson: Partial<Lesson> | null = null) => {
        setCurrentTopicIdForLesson(topicId);
        setEditingLesson(lesson ? { ...lesson } : { title: '', description: '', video_url: ''});
        setImagePreview(lesson?.featured_image_url || null);
         if (featuredImageFileRef.current) {
            featuredImageFileRef.current.value = "";
        }
        setIsLessonModalOpen(true);
        setError(null);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(editingLesson?.featured_image_url || null);
        }
    };

     const handleSaveLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLesson || !editingLesson.title || !currentTopicIdForLesson) return;
        setIsLoading(true);
        setError(null);
        const authToken = token || undefined;
        const isEditMode = !!editingLesson.id;

        const formData = new FormData();
        formData.append('title', editingLesson.title);
        if (editingLesson.description) formData.append('description', editingLesson.description);
        if (editingLesson.video_url) formData.append('video_url', editingLesson.video_url);
        if (editingLesson.video_duration_sec) formData.append('video_duration_sec', editingLesson.video_duration_sec.toString());

        const imageFile = featuredImageFileRef.current?.files?.[0];
        if (imageFile) {
            formData.append('featuredImageFile', imageFile);
        }

        try {
             const endpoint = isEditMode
                ? `/courses/lessons/${editingLesson.id}`
                : `/courses/topics/${currentTopicIdForLesson}/lessons`;
             const method = isEditMode ? 'PUT' : 'POST';
            // Use api helper methods for FormData requests (they add base URL and auth header)
            if (isEditMode) {
                await api.putFormData(endpoint, formData, authToken);
            } else {
                await api.postFormData(endpoint, formData, authToken);
            }

            await reloadData(); // Reload data to get new order and image URL

            setIsLessonModalOpen(false);
            setEditingLesson(null);
            setCurrentTopicIdForLesson(null);
            setImagePreview(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : `Failed to save lesson.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;
        setIsLoading(true);
        const authToken = token || undefined;
        try {
            await api.delete(`/courses/lessons/${lessonId}`, authToken);
            await reloadData(); // Reload
        } catch (err: unknown) {
            alert(`Failed to delete lesson: ${err instanceof Error ? err.message : "Error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const onDragEnd = async (result: DropResult, provided: ResponderProvided) => {
        const { source, destination, type } = result;
        const authToken = token || undefined;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'TOPIC') {
            const reorderedTopics = Array.from(topics);
            const [movedTopic] = reorderedTopics.splice(source.index, 1);
            reorderedTopics.splice(destination.index, 0, movedTopic);
            setTopics(reorderedTopics); // Optimistic update

            const orderedTopicIds = reorderedTopics.map(t => parseInt(t.id));
            try {
                await api.patch(`/courses/${course.id}/topics/reorder`, { orderedTopicIds }, authToken);
            } catch (err) {
                console.error("Failed to reorder topics:", err);
                alert("Failed to save new topic order.");
                setTopics(initialCourse.course_topics || []); // Revert
            }
        }

        if (type === 'LESSON') {
            const sourceTopicId = source.droppableId.replace('lessons-', '');
            const destTopicId = destination.droppableId.replace('lessons-', '');
            const sourceTopicIndex = topics.findIndex(t => t.id === sourceTopicId);
            
            if (sourceTopicIndex === -1) return;
            if (sourceTopicId !== destTopicId) {
                 alert("Moving lessons between topics is not supported.");
                 return;
            }

            const topic = topics[sourceTopicIndex];
            const reorderedLessons = Array.from(topic.lessons || []);
            const [movedLesson] = reorderedLessons.splice(source.index, 1);
            reorderedLessons.splice(destination.index, 0, movedLesson);

            const updatedTopics = [...topics];
            updatedTopics[sourceTopicIndex] = { ...topic, lessons: reorderedLessons };
            setTopics(updatedTopics); // Optimistic update

            const orderedLessonIds = reorderedLessons.map(l => parseInt(l.id));
            try {
                 await api.patch(`/courses/topics/${sourceTopicId}/lessons/reorder`, { orderedLessonIds }, authToken);
            } catch (err) {
                console.error("Failed to reorder lessons:", err);
                alert("Failed to save new lesson order.");
                setTopics(initialCourse.course_topics || []); // Revert
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Course Content</h1>
                    <p className="text-muted-foreground">Course: {course.title}</p>
                </div>
                <Button onClick={() => openTopicModal()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Topic
                </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-topics" type="TOPIC">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                             {topics.map((topic, index) => (
                                <Draggable key={topic.id} draggableId={`topic-${topic.id}`} index={index}>
                                    {(providedDraggable) => (
                                        <Card ref={providedDraggable.innerRef} {...providedDraggable.draggableProps}>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                 <div className="flex items-center gap-2">
                                                    <div {...providedDraggable.dragHandleProps}>
                                                         <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                                    </div>
                                                    <CardTitle className="text-lg font-medium">{topic.title}</CardTitle>
                                                 </div>
                                                <div className="flex items-center gap-2">
                                                      <Button variant="outline" size="sm" onClick={() => openTopicModal(topic)}>
                                                        <Edit className="h-3 w-3 mr-1" /> Edit Topic
                                                    </Button>
                                                     <Button variant="outline" size="sm" onClick={() => openLessonModal(topic.id)}>
                                                        <PlusCircle className="h-3 w-3 mr-1" /> Add Lesson
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteTopic(topic.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                 {topic.description && <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>}
                                                <Droppable droppableId={`lessons-${topic.id}`} type="LESSON">
                                                     {(providedLessons) => (
                                                        <div ref={providedLessons.innerRef} {...providedLessons.droppableProps} className="space-y-3 pl-4 border-l ml-[10px] min-h-[50px]">
                                                            {(topic.lessons || []).map((lesson, lessonIndex) => (
                                                                <Draggable key={lesson.id} draggableId={`lesson-${lesson.id}`} index={lessonIndex}>
                                                                     {(providedLessonDraggable) => (
                                                                        <div ref={providedLessonDraggable.innerRef} {...providedLessonDraggable.draggableProps} className="flex items-center justify-between p-2 rounded-md bg-white border hover:bg-slate-50">
                                                                             <div className="flex items-center gap-2 text-sm">
                                                                                 <div {...providedLessonDraggable.dragHandleProps}>
                                                                                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                                                </div>
                                                                                <span>{lesson.title}</span>
                                                                                {lesson.video_url && <span className="text-xs text-blue-500">(Video)</span>}
                                                                                {lesson.featured_image_url && <img src={lesson.featured_image_url} alt="thumb" className="h-6 w-auto rounded ml-2"/>}
                                                                             </div>
                                                                            <div className="flex items-center gap-1">
                                                                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openLessonModal(topic.id, lesson)}>
                                                                                    <Edit className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDeleteLesson(lesson.id)}>
                                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                             {providedLessons.placeholder}
                                                             {(topic.lessons || []).length === 0 && ( <p className="text-xs text-muted-foreground p-2">Drag lessons here or click "Add Lesson".</p> )}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </CardContent>
                                        </Card>
                                     )}
                                </Draggable>
                             ))}
                             {provided.placeholder}
                             {topics.length === 0 && ( <p className="text-sm text-muted-foreground text-center py-8">No topics created yet.</p> )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

             {/* Topic Add/Edit Modal */}
            <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
                 <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTopic?.id ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
                    </DialogHeader>
                    {editingTopic && (
                        <form onSubmit={handleSaveTopic} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic-title">Title</Label>
                                <Input id="topic-title" value={editingTopic.title || ''} onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="topic-description">Description (Optional)</Label>
                                <Textarea id="topic-description" value={editingTopic.description || ''} onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })} />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => setIsTopicModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Topic'}</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

             {/* Lesson Add/Edit Modal */}
            <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
                 <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingLesson?.id ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
                         {currentTopicIdForLesson && !editingLesson?.id && <CardDescription>Adding to: {topics.find(t=>t.id === currentTopicIdForLesson)?.title}</CardDescription>}
                    </DialogHeader>
                    {editingLesson && (
                        <form onSubmit={handleSaveLesson} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
                             <div className="space-y-2">
                                <Label htmlFor="lesson-title">Lesson Title</Label>
                                <Input id="lesson-title" value={editingLesson.title || ''} onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lesson-description">Description (Optional)</Label>
                                <Textarea id="lesson-description" value={editingLesson.description || ''} onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="lesson-video-url">Video URL (YouTube, Optional)</Label>
                                <Input id="lesson-video-url" value={editingLesson.video_url || ''} onChange={(e) => setEditingLesson({ ...editingLesson, video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lesson-image">Featured Image (Optional)</Label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md mb-2 object-cover aspect-video"/>
                                )}
                                <Input
                                    id="lesson-image"
                                    type="file"
                                    accept="image/*"
                                    ref={featuredImageFileRef}
                                    onChange={handleImageChange}
                                />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
                                <Button type="button" variant="secondary" onClick={() => setIsLessonModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Lesson'}</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}


export default ManageCourseContentPage;