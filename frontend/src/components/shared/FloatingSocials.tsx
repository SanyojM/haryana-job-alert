import { Youtube, Instagram, Phone } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function FloatingSocials() {
  const router = useRouter();
  
  // Hide on specific pages
  const shouldHide = 
    router.pathname.startsWith('/dashboard') || 
    router.pathname.startsWith('/learn/courses') ||
    router.pathname.startsWith('/offline-forms/');
  
  if (shouldHide) {
    return null;
  }

  return (
    <div className="fixed top-[30%] md:top[45%] left-0 z-100">
      <div className="bg-gradient-to-b from-gray-800 to-gray-600 p-2 rounded-r-2xl shadow-lg border-t border-r border-b border-gray-200/80">
        <div className="flex flex-col items-center gap-4 text-white py-3">
          <a
            href="#"
            aria-label="YouTube"
            className='hover:scale-105'
          >
            <Youtube size={21} />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className='hover:scale-105'
          >
            <Instagram size={21} />
          </a>
          <a
            href="#"
            aria-label="Contact"
            className='hover:scale-105'
          >
            <Image src='/wp-icon.png' width={24} height={24} alt='wp' />
          </a>
        </div>
      </div>
    </div>
  );
}
