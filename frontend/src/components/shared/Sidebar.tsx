import AdBanner from "./AdBanner";
import CourseSection from "../sidebar/CourseSection";
import HaryanaYojnaSection from "../sidebar/HaryanaYojnaSection";
import { cn } from "@/lib/utils"; // 1. Import the cn utility

// 2. Define the props interface
interface SidebarProps {
  className?: string;
}

// 3. Accept className as a prop
export default function Sidebar({ className }: SidebarProps) {
    return (
        // 4. Use cn to merge default classes with the passed prop
        <aside className={cn(
            "w-full hidden lg:flex flex-col gap-6", // Your default classes
            className  // Your conditional classes
        )}>
            <HaryanaYojnaSection />
            {/* <AdBanner text="Google Ad Section" className="h-88" /> */}
            <CourseSection />
            {/* <AdBanner text="Google Ad Section" className="h-64" /> */}
            {/* <AdBanner text="Google Ad Section" className="h-220" /> */}
            {/* <AdBanner text="Google Ad Section" className="h-422" /> */}
            {/* <AdBanner text="Google Ad Section" className="h-112" /> */}
        </aside>
    );
}