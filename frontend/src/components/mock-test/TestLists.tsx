import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, HelpCircle, BarChart2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';

// MODIFICATION: Renamed to reflect we are using the test's own slug
type MockTestWithSlug = {
  id: string;
  title: string;
  slug: string; // We will use this slug
  description: string | null;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
};

const TestListItem = ({ test, onStart, isLoading }: { test: MockTestWithSlug, onStart: (test: MockTestWithSlug) => void, isLoading: boolean }) => {
  return (
    <Card className="flex flex-col sm:flex-row items-center justify-between p-4 relative">
      <div>
        <h3 className="font-bold text-lg">{test.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
          <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> {test.total_marks} Questions</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {test.duration_minutes} Mins</span>
          <span className="flex items-center gap-1"><BarChart2 className="w-4 h-4" /> {test.total_marks} Marks</span>
        </div>
      </div>
      <div className="mt-4 sm:mt-0">
        <Button onClick={() => onStart(test)} disabled={isLoading}>
          {test.is_free ? 'Start Free Test' : 'Start Test'}
        </Button>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
          <p>Checking access...</p>
        </div>
      )}
    </Card>
  );
};

export default function TestLists({ tests, seriesId }: { tests: MockTestWithSlug[], seriesId: string }) {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All Tests');
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);

  const handleStartTest = async (test: MockTestWithSlug) => {
    const authToken = token || undefined;
    
    // --- MODIFICATION START ---
    // Construct the URL using the current path and the test's specific slug
    const testUrl = `${router.asPath}/${test.slug}`;
    // --- MODIFICATION END ---

    if (test.is_free) {
      router.push(testUrl);
      return;
    }

    if (!user) {
      router.push(`/auth/login?redirect=${router.asPath}`);
      return;
    }

    setLoadingTestId(test.id);
    try {
      const { enrolled } = await api.get(`/mock-series/${seriesId}/check-enrollment`, authToken);
      
      if (enrolled) {
        router.push(testUrl);
      } else {
        alert("You have not purchased this test series. Please buy a package to continue.");
      }
    } catch (error) {
      alert("Could not verify your enrollment status. Please try again.");
      console.error("Enrollment check failed:", error);
    } finally {
      setLoadingTestId(null);
    }
  };

  if (isAuthLoading) {
    return <div>Loading user status...</div>;
  }

  const freeTests = tests.filter(test => test.is_free);
  const paidTests = tests.filter(test => !test.is_free);

  const renderTestList = (testList: MockTestWithSlug[]) => {
    if (testList.length === 0) {
      return <p className="text-center text-gray-500 py-8">No tests available in this section.</p>;
    }
    return (
      <div className="space-y-4">
        {testList.map(test => (
          <TestListItem 
            key={test.id} 
            test={test} 
            onStart={handleStartTest} 
            isLoading={loadingTestId === test.id}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Series Content</CardTitle>
        <div className="border-b">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button onClick={() => setActiveTab('All Tests')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'All Tests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>All Tests ({tests.length})</button>
            <button onClick={() => setActiveTab('Free Tests')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'Free Tests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Free Tests ({freeTests.length})</button>
            <button onClick={() => setActiveTab('Paid Tests')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'Paid Tests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Paid Tests ({paidTests.length})</button>
          </nav>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'All Tests' && renderTestList(tests)}
        {activeTab === 'Free Tests' && renderTestList(freeTests)}
        {activeTab === 'Paid Tests' && renderTestList(paidTests)}
      </CardContent>
    </Card>
  );
}