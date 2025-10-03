import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import ProfileCard from '@/components/home/ProfileCard';
import AdBanner from '@/components/home/AdBanner';
import About from '@/components/home/AboutSection';
import TopLinksSection from '@/components/home/TopLinksSection';
import PostsSection from '@/components/home/PostsSection';
import JobSection from '@/components/home/JobCard';
import MidCardSection from '@/components/home/MidCards';
import MockTestSection from '@/components/home/MockTestSection';
import CurrentAffairsSection from '@/components/home/CurrentAffairsSection';
import CourseSection from '@/components/home/CourseSection';
import FaqSection from '@/components/home/FaqSection';
import FoundersSection from '@/components/home/ProfileCard';

const latestJobs = [
  { title: 'HSSC Clerk Recruitment 2024', date: '25/09/2025', link: '#' },
  { title: 'Haryana Police Constable Online Form', date: '24/09/2025', link: '#' },
  { title: 'Punjab & Haryana High Court Clerk Vacancy', date: '23/09/2025', link: '#' },
  { title: 'HPSC Assistant Professor Recruitment', date: '22/09/2025', link: '#' },
];

const admitCards = [
    { title: 'HSSC Gram Sachiv Exam Admit Card', date: '26/09/2025', link: '#' },
    { title: 'Haryana TET Admit Card Download', date: '21/09/2025', link: '#' },
];


export default function HomePage() {
  return (
    <div className='bg-gray-100'>
      <Header />
      <TopLinksSection />
      <main className="p-4 md:p-6">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <AdBanner text="Google Ads Section" className="h-24" />
            <PostsSection />
            <JobSection />
            <AdBanner text="Google Ads Section" className="h-88" />
            <MidCardSection />
            <AdBanner text="Google Ads Section" className="h-32" />
            <MockTestSection />
            <AdBanner text="Google Ads Section" className="h-32" />
            <CurrentAffairsSection />
            <CourseSection />
            <About />
            <FaqSection />
          </div>

          <div className="lg:col-span-1 ">
            <Sidebar />
          </div>
        </div>
        <div>
            <FoundersSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

