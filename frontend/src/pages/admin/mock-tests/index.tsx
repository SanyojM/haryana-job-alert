import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type MockTest = {
  id: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
};

interface AllMockTestsPageProps {
  initialTests: MockTest[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tests = await api.get('/mock-tests');
    return { props: { initialTests: tests } };
  } catch (error) {
    console.error('Failed to fetch mock tests:', error);
    return { props: { initialTests: [] } };
  }
};

const AllMockTestsPage: NextPage<AllMockTestsPageProps> = ({ initialTests }) => {
  const { token } = useAuth();
  const [tests, setTests] = useState<MockTest[]>(initialTests);
  const [editingTest, setEditingTest] = useState<Partial<MockTest> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = (testData: Partial<MockTest> | null = null) => {
    setEditingTest(testData ? { ...testData } : { title: '', duration_minutes: 90, total_marks: 100, is_free: false });
    setIsEditDialogOpen(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingTest) return;
    setIsLoading(true);

    const isEditMode = !!editingTest.id;
    const endpoint = isEditMode ? `/mock-tests/${editingTest.id}` : '/mock-tests';
    const method = isEditMode ? 'put' : 'post';
    
    try {
      const result = await api[method](endpoint, editingTest, authToken);
      if (isEditMode) {
        setTests(prev => prev.map(t => (t.id === result.id ? result : t)));
      } else {
        setTests(prev => [...prev, result]);
      }
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      alert(`Failed to save test: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to permanently delete this test?')) return;
    try {
      await api.delete(`/mock-tests/${testId}`, authToken);
      setTests(prev => prev.filter(t => t.id !== testId));
    } catch (err: unknown) {
      alert(`Failed to delete test: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage All Mock Tests</h1>
        <Button onClick={() => openDialog()}>Create New Test</Button>
      </div>
      <Card>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Free</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map(test => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium"><Link href={`/admin/mock-tests/${test.id}`} className="hover:underline">
                    {test.title}
                    </Link></TableCell>
                  <TableCell>{test.duration_minutes} min</TableCell>
                  <TableCell>{test.total_marks}</TableCell>
                  <TableCell>{test.is_free ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(test)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteTest(test.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingTest?.id ? 'Edit' : 'Create'} Mock Test</DialogTitle></DialogHeader>
          {editingTest && (
            <form onSubmit={handleSaveTest} className="space-y-4 py-4">
               <div className="space-y-2">
                <Label htmlFor="title">Test Title</Label>
                <Input id="title" value={editingTest.title || ''} onChange={(e) => setEditingTest({ ...editingTest, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Minutes)</Label>
                  <Input id="duration" type="number" value={editingTest.duration_minutes || 0} onChange={(e) => setEditingTest({ ...editingTest, duration_minutes: parseInt(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Total Marks</Label>
                  <Input id="marks" type="number" value={editingTest.total_marks || 0} onChange={(e) => setEditingTest({ ...editingTest, total_marks: parseInt(e.target.value) })} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_free" 
                    checked={editingTest.is_free} 
                    onCheckedChange={(checked) => setEditingTest({ ...editingTest, is_free: !!checked })}
                  />
                  <Label htmlFor="is_free">Is this a free test?</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Test'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllMockTestsPage;