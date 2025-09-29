import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import AdminLayout from "../components/admin/AdminLayout"; // adjust path if different

type ComponentWithLayout = AppProps['Component'] & {
  Layout?: React.ElementType;
};

type AppPropsWithLayout = AppProps & {
  Component: ComponentWithLayout;
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const isAdminRoute = router.pathname.startsWith("/admin");

  const PageLayout = Component.Layout || (({ children }) => <>{children}</>);

  const Layout = isAdminRoute
    ? ({ children }: { children: React.ReactNode }) => (
        <AdminLayout>{children}</AdminLayout>
      )
    : PageLayout;

  return (
    <main className={poppins.className}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}
