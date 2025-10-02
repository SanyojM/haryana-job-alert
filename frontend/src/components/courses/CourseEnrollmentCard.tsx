import Image from 'next/image';
import { PlayCircle, FileText, Download, CheckCircle, MonitorPlay } from 'lucide-react';

type CourseEnrollmentCardProps = {
    thumbnailUrl: string;
    instructorName: string;
    courseDuration: string;
    articlesAttached: number;
    downloadableResources: number;
    freeCourse: boolean;
    mockTests: number;
    description: string;
};

export default function CourseEnrollmentCard({
    thumbnailUrl,
    instructorName,
    courseDuration,
    articlesAttached,
    downloadableResources,
    freeCourse,
    mockTests,
    description,
}: CourseEnrollmentCardProps) {
  return (
    <div>
    <div className="absolute top-[25vh] min-w-sm right-30">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div className="relative">
            <Image src={thumbnailUrl} alt="Course Thumbnail" width={400} height={225} className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
                <h3 className="font-bold text-2xl mb-4">RAILWAYS NTPS COURSE</h3>
                <p className='text-xs text-center'>{description}</p>
            <div className='bg-gray-200/20 mt-4 px-8 py-2 rounded-sm flex justify-between gap-4 items-center'>
                    <Image src='/js.png' className='w-16 h-16 object-cover border border-white rounded-full bg-white' alt={''} width={128} height={128}/>
                <p className="text-sm">By {instructorName}</p>
            </div>
            </div>
        </div>
        <div className="p-6">
            <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg">
                Enroll Now
            </button>
            <div className="mt-6 space-y-3 text-gray-600">
                <h4 className="font-bold text-gray-800">The course give you:</h4>
                <div className="flex items-center gap-3"><MonitorPlay size={18} className="text-indigo-500" /> Course Duration: {courseDuration}</div>
                <div className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" /> Articles attached: {articlesAttached}</div>
                <div className="flex items-center gap-3"><Download size={18} className="text-indigo-500" /> Downloadable resources: {downloadableResources}</div>
                <div className="flex items-center gap-3"><CheckCircle size={18} className="text-indigo-500" /> {freeCourse ? 'Free Course' : 'Paid Course'}</div>
                <div className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" /> Mock tests: {mockTests}</div>
            </div>
        </div>
      </div>
    </div>
    <div className='absolute bottom-30 right-0'>
    <Image src="/avatar.png" alt={''} width={120} height={120}/>
    </div>
    </div>
  );
}
