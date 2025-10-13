import { useEffect } from 'react';
import { NextPage } from 'next';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

const DashboardPage: NextPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // This effect protects the route. It runs on the client-side.
  useEffect(() => {
    if (!isLoading && !user) {
      // If the user is not logged in, redirect them to the login page
      router.replace('/auth/login'); 
    }
  }, [user, isLoading, router]);

  // Show a loading state while authentication is being verified
  if (isLoading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.full_name}!</h1>
                <p className="text-muted-foreground">Here's a summary of your activity.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>My Test History</CardTitle>
                        <CardDescription>A list of all the mock tests you have attempted.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Test Title</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Date Completed</TableHead>
                                    <TableHead className="text-right">View Results</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.mock_attempts && user.mock_attempts.length > 0 ? (
                                    user.mock_attempts.map(attempt => (
                                        <TableRow key={attempt.id}>
                                            <TableCell className="font-medium">{attempt.mock_tests?.title || 'Test Deleted'}</TableCell>
                                            <TableCell>
                                                <Badge>{attempt.score ?? 'N/A'}</Badge>
                                            </TableCell>
                                            <TableCell>{new Date(attempt.completed_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                {/* This button will eventually link to a detailed result page */}
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/dashboard/results/${attempt.id}`}>Details</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            You haven't attempted any tests yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
        <Footer />
    </div>
  );
};

export default DashboardPage;