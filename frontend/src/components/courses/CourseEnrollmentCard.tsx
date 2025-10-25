import Image from 'next/image';
import { FileText, Download, CheckCircle, MonitorPlay, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';

type CourseEnrollmentCardProps = {
  courseId: number;
  title: string;
  isEnrolled: boolean;
  thumbnailUrl: string;
  instructorName: string;
  courseDuration: string;
  articlesAttached: number;
  downloadableResources: number;
  freeCourse: boolean;
  mockTests: number;
  description: string;
  pricingModel: string;
  price: number | null;
  regularPrice: number | null;
  onEnrollOrPurchase: () => void;
  isLoading: boolean;
  error?: string | null;
  slug: string;
};

export default function CourseEnrollmentCard({
  courseId,
slug,
  isEnrolled,
  thumbnailUrl,
  instructorName,
  courseDuration,
  articlesAttached,
  downloadableResources,
  freeCourse,
  mockTests,
  description,
  pricingModel,
  price,
  regularPrice,
  onEnrollOrPurchase,
  isLoading,
  error,
}: CourseEnrollmentCardProps) {

  const router = useRouter(); // Initialize router

    const handleGoToCourse = () => {
        // You will create this page later. This is where users watch lessons.
        // For now, it can just be an alert or a placeholder.
        alert('Navigating to course content...');
        router.push(`/learn/courses/${courseId}`); // <-- Uncomment this line when you build the page
    };

    const renderEnrollButton = () => {
        if (isEnrolled) {
             return (
                 <Button
                    className="w-full text-lg shine bg-gradient-to-r from-green-600 to-green-800"
                    onClick={handleGoToCourse} // <-- ADD THIS OnClick
                 >
                     Go to Course <ExternalLink className="ml-2 h-4 w-4"/>
                 </Button>
             );
        }
    };
    
  return (
    <div>
      <div className="absolute top-[25vh] min-w-sm right-30">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden">
          <div className="relative">
            <Image
              src={thumbnailUrl}
              alt="Course Thumbnail"
              width={400}
              height={225}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
              <h3 className="font-bold text-2xl mb-4">RAILWAYS NTPS COURSE</h3>
              <p className="text-xs text-center">{description}</p>
              <div className="bg-gray-200/20 mt-4 px-8 py-2 rounded-sm flex justify-between gap-4 items-center">
                <Image
                  src="/js.png"
                  className="w-16 h-16 object-cover border border-white rounded-full bg-white"
                  alt=""
                  width={128}
                  height={128}
                />
                <p className="text-sm">By {instructorName}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-600">Pricing</div>
                  <div className="flex items-baseline gap-2">
                    {freeCourse ? (
                      <span className="font-bold text-green-600">Free</span>
                    ) : (
                      <>
                        <span className="font-bold text-gray-900 text-lg">
                          {pricingModel === 'fixed' ? price : price}
                        </span>
                        {regularPrice ? (
                          <span className="text-sm text-gray-500 line-through">
                            {regularPrice}
                          </span>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right text-sm text-gray-500">
                  <div>Course ID: {courseId}</div>
                  <div className="mt-1">{pricingModel}</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isLoading) onEnrollOrPurchase();
              }}
              disabled={isLoading}
              className={`w-full text-white font-bold py-3 rounded-lg text-lg transition-colors ${
                isEnrolled
                  ? 'bg-gray-600 cursor-default'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-300 hover:from-indigo-700'
              } ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading
                ? 'Processing...'
                : isEnrolled
                ? 'Go to Course'
                : freeCourse
                ? 'Enroll Now'
                : 'Purchase Now'}
            </button>

            {error ? (
              <div className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </div>
            ) : null}

            <div className="mt-6 space-y-3 text-gray-600">
              <h4 className="font-bold text-gray-800">The course gives you:</h4>
              <div className="flex items-center gap-3">
                <MonitorPlay size={18} className="text-indigo-500" /> Course Duration: {courseDuration}
              </div>
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-indigo-500" /> Articles attached: {articlesAttached}
              </div>
              <div className="flex items-center gap-3">
                <Download size={18} className="text-indigo-500" /> Downloadable resources: {downloadableResources}
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-indigo-500" /> {freeCourse ? 'Free Course' : 'Paid Course'}
              </div>
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-indigo-500" /> Mock tests: {mockTests}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-46 right-0">
        <Image src="/avatar.png" alt="" width={120} height={120} />
      </div>
    </div>
  );
}
