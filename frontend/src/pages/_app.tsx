import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout'; // Corrected import
import { ReactNode, useEffect } from 'react'; // Import useEffect
import { HashLoader } from 'react-spinners'; // Loading spinner

// This component handles the protection logic
const AdminAuthGuard = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== 'admin') {
                router.replace('/login');
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

  return (
    <AuthProvider>
      {router.pathname.startsWith('/admin') ? (
        <AdminAuthGuard>
          <Component {...pageProps} />
        </AdminAuthGuard>
      ) : (
        // For public pages, render normally
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}