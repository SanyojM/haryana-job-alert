import AdBanner from "../home/AdBanner";
import CourseSection from "../sidebar/CourseSection";
import HaryanaYojnaSection from "../sidebar/HaryanaYojnaSection";

export default function Sidebar() {
    return (
        <>
        <aside className="w-full hidden lg:flex flex-col gap-6">
            <HaryanaYojnaSection />
            <AdBanner text="Google Ad Section" className="h-88" />
            <CourseSection />
            <AdBanner text="Google Ad Section" className="h-64" />
            <AdBanner text="Google Ad Section" className="h-220" />
            <AdBanner text="Google Ad Section" className="h-422" />
            <AdBanner text="Google Ad Section" className="h-112" />
        </aside>
        </>
    );
}
