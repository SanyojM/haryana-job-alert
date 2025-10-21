import CourseContentAccordion from "@/components/courses/CourseContentAccordion";
import CourseDescription from "@/components/courses/CourseDescription";
import CourseEnrollmentCard from "@/components/courses/CourseEnrollmentCard";
import CourseHeader from "@/components/courses/CourseHeader";
import AdBanner from "@/components/shared/AdBanner";
import BannerHeader from "@/components/shared/BannerHeader";
import Header from "@/components/shared/Header";

type CoursePageProps = {
    id: string;
};

const getCourseData = (id: string) => {
    console.log("Fetching data for course:", id);
    return {
        // Data for CourseHeader
        title: "SSC CGL 2025 (Tier I & Tier II) Latest Course",
        headerDescription: "The best SSC CGL Courses for 2025 exam available in the market, most affordable in the market.",
        instructorName: "Jaihind Sir",
        instructorAvatar: "/js.png",
        lastUpdated: "12 May, 2025",
        language: "English, Hindi",
        rating: 4.5,
        ratingCount: 189,
        studentCount: 100000,

        // Data for CourseEnrollmentCard
        thumbnailUrl: "https://plus.unsplash.com/premium_photo-1679400988748-f9d191256ef9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        courseDuration: "3.5 hours",
        articlesAttached: 12,
        downloadableResources: 19,
        freeCourse: true,
        mockTests: 5,
        description: "The best SSC CGL Course for 2025 exam available in the market",

        // Data for CourseDescription
        mainDescription: "The best SSC CGL Course for 2025 exam available in the market, most affordable in the market. The best SSC CL Course for 2025 exam available in the market, most affordable in the market. The best SSC CGL Course for 2025 exam available in the market, most affordable in the market. The best SSC CGL Course for 2025 exam available in the market, most affordable in the market.The best SSC CLCourse for 2025 exam available in the market, most affordable in the market",

        // Data for CourseContentAccordion
        content: {
            totalLectures: 36,
            totalSections: 12,
            totalLength: "12h 23m",
            sections: [
                { title: "The Complete guide on SSC CGL", lectures: 2, duration: "4 mins", items: [{ title: "Getting started with the exam of SSC", type: "video", duration: "2 mins" }, { title: "Syllabus of SSC CGL", type: "article", duration: "2 mins" }] },
                { title: "The Complete guide on SSC CGL", lectures: 2, duration: "4 mins", items: [{ title: "Getting started with the exam of SSC", type: "video", duration: "2 mins" }, { title: "Syllabus of SSC CGL", type: "article", duration: "2 mins" }] },
                { title: "The Complete guide on SSC CGL", lectures: 2, duration: "4 mins", items: [{ title: "Getting started with the exam of SSC", type: "video", duration: "2 mins" }, { title: "Syllabus of SSC CGL", type: "article", duration: "2 mins" }] },
            ]
        }
    };
};


export default function CoursePage({ id }: CoursePageProps) {
    const courseData = getCourseData(id);

    return (
        <div className="bg-gray-100">
            <BannerHeader />
            <div className="mt-6">
                <CourseHeader
                    title={courseData.title}
                    description={courseData.headerDescription}
                    instructorName={courseData.instructorName}
                    instructorAvatar={courseData.instructorAvatar}
                    lastUpdated={courseData.lastUpdated}
                    language={courseData.language}
                    rating={courseData.rating}
                    ratingCount={courseData.ratingCount}
                    studentCount={courseData.studentCount} isBestseller={false} isFree={false} 
                    thumbnailUrl={courseData.thumbnailUrl}
                    courseDuration={courseData.courseDuration}
                    articlesAttached={courseData.articlesAttached}
                    downloadableResources={courseData.downloadableResources}
                    freeCourse={courseData.freeCourse}
                    mockTests={courseData.mockTests}
                    />
            </div>
            <div className="mx-auto px-4 py-8 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
                    <main className="col-span-1 lg:col-span-2 mt-8">
                        <CourseDescription description={courseData.mainDescription} />
                        <CourseContentAccordion content={{
                            totalLectures: courseData.content.totalLectures,
                            totalSections: courseData.content.totalSections,
                            totalLength: courseData.content.totalLength,
                            sections: courseData.content.sections,
                        }} />
                    </main>
                    <aside className="hidden xl:block mt-36">
                        <AdBanner text={"Google Ads Section"} className="h-88 w-full"/>
                    </aside>

                </div>
            </div>
    );
}