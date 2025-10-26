import { Lesson } from "@/pages/admin/courses/[id]"; // Reuse this type
import { AlertCircle, Video } from "lucide-react";

type LessonContentProps = {
  lesson: Lesson | null;
  courseTitle: string;
};

// Helper function to extract YouTube embed ID
const getYouTubeEmbedUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    let videoId: string | null = null;
    
    // Check for standard watch URL
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
        videoId = watchMatch[1];
    } else {
        // Check for youtu.be short URL
        const shortMatch = url.match(/youtu\.be\/([^?]+)/);
        if (shortMatch) {
            videoId = shortMatch[1];
        } else {
             // Check for embed URL
             const embedMatch = url.match(/embed\/([^?]+)/);
             if(embedMatch) {
                videoId = embedMatch[1];
             }
        }
    }
    
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null; // Return null if no valid ID found
};


export default function LessonContent({ lesson, courseTitle }: LessonContentProps) {
  if (!lesson) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold">Welcome to {courseTitle}!</h2>
        <p className="text-gray-500">Select a lesson from the sidebar to get started.</p>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(lesson.video_url);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      {embedUrl ? (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg mb-6">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
         <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center mb-6">
            <Video className="h-12 w-12 text-gray-400" />
         </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h1>
      
      {lesson.description && (
        <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: lesson.description }}
        />
      )}
    </div>
  );
}