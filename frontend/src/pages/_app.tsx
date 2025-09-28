import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import AdminLayout from "../components/admin/AdminLayout"; // adjust path if different
import FloatingSocials from "@/components/shared/FloatingSocials";

type ComponentWithLayout = AppProps['Component'] & {
  Layout?: React.ElementType;
};

type AppPropsWithLayout = AppProps & {
  Component: ComponentWithLayout;
};

// Configure Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  // Check if current route is inside /admin/*
  const isAdminRoute = router.pathname.startsWith("/admin");

  // Use the layout defined at the page level, if available
  const PageLayout = Component.Layout || (({ children }) => <>{children}</>);

  // Use AdminLayout for admin routes, otherwise use page-level layout
  const Layout = isAdminRoute
    ? ({ children }: { children: React.ReactNode }) => (
        <AdminLayout>{children}</AdminLayout>
      )
    : PageLayout;

  return (
    <main className={poppins.className}>
      <Layout>
        <FloatingSocials />
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}
