import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

// Types for our data
type MockTest = {
  id: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
};

type MockSeriesDetails = {
  id: string;
  title: string;
  description: string | null;
  mock_series_tests: { test: MockTest }[];
};

interface SingleSeriesPageProps {
  initialSeries: MockSeriesDetails;
  allTests: MockTest[]; // We now also fetch all available tests
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  try {
    const [series, allTests] = await Promise.all([
      api.get(`/mock-series/${id}`),
      api.get('/mock-tests'),
    ]);
    return { props: { initialSeries: series, allTests } };
  } catch (error) {
    console.error(`Failed to fetch data for mock series ${id}:`, error);
    return { notFound: true };
  }
};

const SingleSeriesPage: NextPage<SingleSeriesPageProps> = ({ initialSeries, allTests }) => {
  const { token } = useAuth();
  const router = useRouter();
  const [series, setSeries] = useState<MockSeriesDetails>(initialSeries);
  
  // State for the "Add Tests" dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  
  const [isLoading, setIsLoading] = useState(false);

  // Get a list of tests that are available to be added (i.e., not already in this series)
  const availableTests = allTests.filter(
    (test) => !series.mock_series_tests.some(({ test: seriesTest }) => seriesTest.id === test.id)
  );

  const handleAddTests = async () => {
    const authToken = token || undefined;
    setIsLoading(true);
    const testsToAdd = Array.from(selectedTests);
    
    try {
      // Create all the link records in parallel
      await Promise.all(
        testsToAdd.map(testId => api.post(`/mock-series/${series.id}/tests/${testId}`, {}, authToken))
      );
      router.reload();
    } catch (err: unknown) {
      alert(`Failed to add tests: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsAddDialogOpen(false);
    }
  };

  const handleRemoveTest = async (testId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to remove this test from the series? The test itself will not be deleted.')) return;
    try {
      await api.delete(`/mock-series/${series.id}/tests/${testId}`, authToken);
      router.reload();
    } catch (err: unknown) {
      alert(`Failed to remove test: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };
  
  const handleTagSelection = (testId: string) => {
    setSelectedTests(prev => {
        const newSet = new Set(prev);
        if (newSet.has(testId)) {
            newSet.delete(testId);
        } else {
            newSet.add(testId);
        }
        return newSet;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{series.title}</h1>
            <p className="text-muted-foreground">{series.description}</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Test(s) to Series
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Tests in this Series</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Title</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {series.mock_series_tests.map(({ test }) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                     <Link href={`/admin/mock-tests/${test.id}`} className="hover:underline">
                      {test.title}
                    </Link>
                  </TableCell>
                  <TableCell>{test.duration_minutes} min</TableCell>
                  <TableCell>{test.total_marks}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleRemoveTest(test.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ADD TESTS DIALOG */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Existing Tests to Series</DialogTitle></DialogHeader>
          <ScrollArea className="h-72 my-4">
            <div className="space-y-2 pr-4">
              {availableTests.length > 0 ? (
                availableTests.map(test => (
                  <div key={test.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50">
                    <Checkbox
                      id={`test-${test.id}`}
                      checked={selectedTests.has(test.id)}
                      onCheckedChange={() => handleTagSelection(test.id)}
                    />
                    <label htmlFor={`test-${test.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {test.title}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">No more tests available to add.</p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAddTests} disabled={isLoading || selectedTests.size === 0}>
                {isLoading ? 'Adding...' : `Add ${selectedTests.size} Test(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleSeriesPage;