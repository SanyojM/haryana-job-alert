import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type MockSeries = {
  id: string;
  title: string;
  slug: string; // Added slug
  description: string | null;
  price: number | null;
  mock_categories: {
    name: string;
    slug: string; // Added slug
  } | null;
  mock_series_tags: {
    tag: {
      name: string;
    };
  }[];
};

interface MockTestsHomePageProps {
  series: MockSeries[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const series = await api.get('/mock-series');

    // Add this line to debug
    console.log('API Response for /mock-series:', JSON.stringify(series, null, 2));

    return { props: { series } };
  } catch (error) {
    console.error("Failed to fetch mock series:", error);
    return { props: { series: [] } };
  }
};

const MockTestsHomePage: NextPage<MockTestsHomePageProps> = ({ series }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">All Mock Test Series</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.map((s) => (
            <Link
              key={s.id}
              // Updated href to use the new slug structure
              href={`/mock-tests/${s.mock_categories?.slug || 'uncategorized'}/${s.slug}`}
              legacyBehavior
            >
              <a className="block">
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle>{s.title}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {s.mock_series_tags.map(({ tag }) => (
                        <Badge key={tag.name} variant="secondary">{tag.name}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 font-bold text-lg">
                      {s.price && s.price > 0 ? `₹${s.price}` : 'Free'}
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MockTestsHomePage;