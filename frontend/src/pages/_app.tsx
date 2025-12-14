import '@/styles/globals.css';
import '@/styles/main.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout'; // Corrected import
import { ReactNode, useEffect, useState } from 'react'; // Import useEffect
import { HashLoader } from 'react-spinners'; // Loading spinner
import Router from 'next/router';
import FloatingSocials from '@/components/shared/FloatingSocials';
import PopupModal from '@/components/shared/PopupModal';
import { HeroUIProvider } from '@heroui/react';
import { Poppins } from 'next/font/google'
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// This component handles the protection logic
const AdminAuthGuard = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== 'admin') {
                router.replace('/');
            }
        }
    }, [user, isLoading, router]);
    if (isLoading || !user || user.role !== 'admin') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <HashLoader color="#8a79ab" size={100} />
            </div>
        );
    }
    return <AdminLayout>{children}</AdminLayout>;
};



export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  const blockedRoutes = [
    "/admin",
    "/auth",
    "/dashboard",
    "/login",
    "/signup",
    "/profile",
    "/settings",
  ];

  const shouldBlockAds = blockedRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      (window as any).gtag('config', 'G-Y96FVJBE7W', {
      page_path: url,
      })
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])


  return (
    <AuthProvider>
      {loading && (
        <div className="max-h-screen min-h-screen max-w-screen min-w-screen fixed top-0 right-0 bg-white/60 flex justify-center items-center z-[999]">
        <div className="bg-white h-40 w-40 rounded-2xl flex items-center justify-center shadow-lg">
          <HashLoader color="#10B981" size={80} />
        </div>
      </div>
      )}
      {router.pathname.startsWith('/admin') ? (
      <HeroUIProvider>
        <AdminAuthGuard>
          <Component {...pageProps} />
        </AdminAuthGuard>
      </HeroUIProvider>
      ) : (
        <main className={poppins.className}>
                {!shouldBlockAds && (
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8101539968683225"
          crossOrigin="anonymous"
        />
      )}
        {/* <FloatingSocials /> */}
        {/* <PopupModal 
          imageSrc="/popup.png"  // Replace with your actual image path
          imageAlt="Promotional Banner"
          delay={5000}
          linkUrl="https://web.valuepluscampus.in/new-courses/75-haryana-cet-mains-2026-master-batch-haryana-special"  // Optional: Add link if you want the image to be clickable
        /> */}
        <Component {...pageProps} />
        </main>
      )}
    </AuthProvider>
  );
}

