import Image from 'next/image';
import { FileText, Download, CheckCircle, MonitorPlay, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';

type CourseEnrollmentCardProps = {
  // courseId: number;
  title: string;
  isEnrolled: boolean;
  thumbnailUrl: string;
  instructorName: string;
  courseDuration: string;
  articlesAttached: number;
  downloadableResources: number;
  mockTests: number;
  pricingModel: string;
  price: number | null;
  regularPrice: number | null;
  onEnrollOrPurchase: () => void;
  isLoading: boolean;
  error?: string | null;
  slug: string;
};

export default function CourseEnrollmentCard({
  slug,
  title,
  isEnrolled,
  thumbnailUrl,
  instructorName,
  courseDuration,
  articlesAttached,
  downloadableResources,
  mockTests,
  pricingModel,
  price,
  regularPrice,
  onEnrollOrPurchase,
  isLoading,
  error,
}: CourseEnrollmentCardProps) {

  const router = useRouter(); 

  const handleGoToCourse = () => {
    // --- FIX: Use slug to navigate, not courseId ---
    router.push(`/learn/courses/${slug}`);
  };

  const renderEnrollButton = () => {
    if (isEnrolled) {
      return (
        <Button
          className="w-full text-lg shine bg-gradient-to-r from-green-600 to-green-800"
          onClick={handleGoToCourse} // <-- This is the navigation function
        >
          Go to Course <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      );
    }
    
  return (
      <Button
        className="w-full text-lg shine bg-gradient-to-r from-indigo-600 to-indigo-300 hover:from-indigo-700"
        onClick={onEnrollOrPurchase} // <-- This is the purchase function
        disabled={isLoading}
      >
        {isLoading
          ? 'Processing...'
          : pricingModel === 'free'
          ? 'Enroll Now'
          : 'Purchase Now'}
      </Button>
    );
  };
  
  return (
    <div>
      {/* This div was causing layout issues, removed sticky/absolute positioning */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div className="relative">
          <Image
            src={thumbnailUrl}
            alt={title} // Use dynamic title
            width={400}
            height={225}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
            <h3 className="font-bold text-2xl mb-4 line-clamp-2">{title}</h3> {/* Use dynamic title */}
            {/* <p className="text-xs text-center">{description}</p> */} {/* Description removed for cleaner card */}
            <div className="bg-gray-200/20 mt-4 px-8 py-2 rounded-sm flex justify-between gap-4 items-center">
              <Image
                src="/js.png" // Placeholder avatar
                className="w-16 h-16 object-cover border border-white rounded-full bg-white"
                alt={instructorName}
                width={64}
                height={64}
              />
              <p className="text-sm">By {instructorName}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* --- FIX: Dynamic Price Display --- */}
          <div className="text-3xl font-bold text-gray-800 mb-4 text-right">
            {pricingModel === 'free' ? 'Free' : `₹${price}`}
            {pricingModel === 'paid' && price && regularPrice && price < regularPrice && (
                <span className="ml-2 text-base text-muted-foreground line-through">₹{regularPrice}</span>
            )}
          </div>
          
          {/* --- FIX: Call the renderEnrollButton function --- */}
          {renderEnrollButton()}

          {/* Display error if it exists */}
          {error ? (
            <div className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </div>
          ) : null}

          <div className="mt-6 space-y-3 text-gray-600">
            <h4 className="font-bold text-gray-800">This course gives you:</h4>
            <div className="flex items-center gap-3 text-sm">
              <MonitorPlay size={16} className="text-indigo-500" /> Course Duration: {courseDuration}
            </div>
            {articlesAttached > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <FileText size={16} className="text-indigo-500" /> Articles attached: {articlesAttached}
              </div>
            )}
            {downloadableResources > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <Download size={16} className="text-indigo-500" /> Downloadable resources: {downloadableResources}
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
                <CheckCircle size={16} className="text-indigo-500" /> {pricingModel === 'free' ? 'Free Course' : 'Paid Course'}
            </div>
            {mockTests > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <FileText size={16} className="text-indigo-500" /> Mock tests: {mockTests}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* This image was positioned absolutely, which is likely not what you want. Removed. */}
      {/* <div className="absolute bottom-46 right-0">
        <Image src="/avatar.png" alt="" width={120} height={120} />
      </div> */}
    </div>
  );
}