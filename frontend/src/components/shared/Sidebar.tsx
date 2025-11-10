import AdBanner from "./AdBanner";
import CourseSection from "../sidebar/CourseSection";
import HaryanaYojnaSection from "../sidebar/HaryanaYojnaSection";
import { cn } from "@/lib/utils";

// Define the PublicCourse interface
interface CourseCategory {
  id: number | string;
  name: string;
}

interface PublicCourse {
  id: number | string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  description?: string | null;
  pricing_model: 'free' | 'paid';
  regular_price?: number | null;
  sale_price?: number | null;
  category?: CourseCategory;
  authors: { full_name: string; avatar_url: string }[];
  tags: { tag: { name: string } }[];
  enrolled_users_count?: number;
  lesson_count?: number;
  total_duration_hhmm?: string | null;
  rating: number;
  reviews: number;
  offerEndsSoon?: boolean;
}

interface SidebarProps {
  className?: string;
  courses?: PublicCourse[];
}

export default function Sidebar({ className, courses = [] }: SidebarProps) {
    return (
        <aside className={cn(
            "w-full hidden lg:flex flex-col gap-6",
            className
        )}>
            <HaryanaYojnaSection />
            {/* <AdBanner text="Google Ad Section" className="h-88" /> */}
            {/* <CourseSection courses={courses} /> */}
            {/* <AdBanner text="Google Ad Section" className="h-64" /> */}
            {/* <AdBanner text="Google Ad Section" className="h-220" /> */}
            {/* <AdBanner text="Google Ad Section" className="h-422" /> */}
            {/* <AdBanner text="Google Ad Section" className="h-112" /> */}
        </aside>
    );
}