import { FullCourseDetails } from "@/pages/courses/[slug]"; // Reuse this type
import { Lesson } from "@/pages/admin/courses/[id]"; // Reuse this type
import { ChevronRight, PlayCircle, FileText } from "lucide-react";
import { useState } from "react";

type LearnSidebarProps = {
  course: FullCourseDetails;
  selectedLessonId: string | null;
  onSelectLesson: (lesson: Lesson) => void;
};

export default function LearnSidebar({ course, selectedLessonId, onSelectLesson }: LearnSidebarProps) {
  // Keep all sections open by default in the learn view
  const [openSections, setOpenSections] = useState<string[]>(
    course.course_topics.map(t => t.id)
  );

  const handleToggleSection = (topicId: string) => {
    setOpenSections(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Helper function for class names
  const cn = (...classes: (string | boolean)[]) => classes.filter(Boolean).join(' ');

  return (
    <aside className="w-full h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold truncate">Course content</h2>
      </div>
      <div className="flex flex-col">
        {course.course_topics.map((topic) => {
          const isOpen = openSections.includes(topic.id);
          return (
            <div key={topic.id} className="border-b">
              {/* This is the collapsible trigger button */}
              <button
                onClick={() => handleToggleSection(topic.id)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <span className="font-medium text-left">{topic.title}</span>
                <ChevronRight className={cn(
                  "h-5 w-5 transition-transform",
                  isOpen && "rotate-90"
                )} />
              </button>
              
              {/* This is the collapsible content */}
              {isOpen && (
                <div className="flex flex-col border-t">
                  {topic.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className={cn(
                        "flex items-center gap-3 p-4 text-left text-sm hover:bg-gray-100",
                        selectedLessonId === lesson.id && "bg-blue-50 font-medium text-blue-700"
                      )}
                    >
                      {lesson.video_url ? (
                          <PlayCircle className="h-4 w-4 flex-shrink-0" />
                      ) : (
                          <FileText className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="flex-1">{lesson.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}