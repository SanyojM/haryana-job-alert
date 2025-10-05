import Sidebar from "@/components/shared/Sidebar";
import CurrentAffairsSection from "@/components/home/CurrentAffairsSection";
import CourseSection from "@/components/home/CourseSection";
import FaqSection from "@/components/home/FaqSection";
import TestLists from "@/components/mock-test/TestLists";
import MockTestSection from "@/components/home/MockTestSection";
import AboutTestSection from "@/components/mock-test/AboutTestSection";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import TestHeader from "@/components/mock-test/TestHeader";
import { useRouter } from "next/router";
import AdBanner from "@/components/home/AdBanner";

const getTestData = (id: string | string[] | undefined) => {
  if (!id) return null; // Handle case where id is not ready
  console.log("Fetching data for test with id:", id);

  return {
    title: "SSC CGL Mock Test Series (Tier I & Tier II) 2025",
    language: "English, Hindi",
    logo: "",
    level: "Beginner",
    totalTests: 2182,
    freeTests: 27,
    fullTests: 15,
    previousYearPapers: 10,
    chapterTests: 50,
    logoUrl: "https://placehold.co/60x60/e2e8f0/334155?text=SSC",
    description: "This comprehensive test series for SSC CGL Tier I & Tier II is designed by our expert faculty to help you crack the exam with a good score. The tests are based on the latest exam pattern and include a wide variety of questions to give you a real-time exam experience.",
    lastUpdated: "22 june 2025",
    totalUsers: 2565,
        features: [ // Added this required field
        "25 Ultimate Marathon Live Test",
        "15 Eduquity Pattern-Based Full Test",
        "20 Eduquity Pattern-Based Sectional Test",
        "+2102 more tests",
        "+2102 more tests",
        "+2102 more tests",
        "+2102 more tests",
        "+2102 more tests",
    ],
    packages: [
      { id: 1, name: "SSC CGL Full Test Series", price: 499, originalPrice: 999, validity: "1 Year" },
      { id: 2, name: "SSC CGL Tier I Only", price: 299, originalPrice: 599, validity: "6 Months" },
    ],
    syllabus: [
        { title: "General Intelligence & Reasoning", topics: ["Analogies", "Similarities and differences", "Spatial visualization", "Problem solving"] },
        { title: "General Awareness", topics: ["History", "Culture", "Geography", "Economic Scene", "General Policy & Scientific Research"] },
        { title: "Quantitative Aptitude", topics: ["Whole numbers, decimals, fractions", "Percentages", "Ratio & Proportion", "Square roots", "Averages"] },
        { title: "English Comprehension", topics: ["Reading Comprehension", "Synonyms & Antonyms", "Fill in the Blanks", "Error Spotting"] },
    ]
  };
};

export default function MockTestPage() {
  const router = useRouter();
  const { id } = router.query; // Get the id from the URL query

  // The id might not be available on the very first render, so we wait.
  if (!router.isReady) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }
  
  const testData = getTestData(id);

  if (!testData) {
    return <div>Test data not found.</div>;
  }

  return (
    <div className="bg-gray-100">
        <Header />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <TestHeader title={testData.title} lastUpdated={testData.lastUpdated} totalTests={testData.totalTests} freeTests={testData.freeTests} users={testData.totalUsers} level={testData.level} language={testData.language} features={testData.features} isUserLoggedIn={false}/>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-8">
            <TestLists />
            {/* Reusing some components from the homepage for extra content */}
            <AdBanner text={"Google Ads"} className="h-48"/>
            <MockTestSection />
            <AboutTestSection />
            {/* You would create MockTestInfo as a new component similar to AboutSection */}

            <FaqSection />

          </main>

          {/* Sidebar Area */}
          <aside className="space-y-8">
            <Sidebar />
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  );
}

