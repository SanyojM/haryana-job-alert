import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, HelpCircle, BarChart2 } from 'lucide-react';
import { MockTest } from '@/pages/mock-tests/[id]';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';

const TestListItem = ({ test, onStart, isLoading }: { test: MockTest, onStart: (test: MockTest) => void, isLoading: boolean }) => {
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

export default function TestLists({ tests }: { tests: MockTest[] }) {
  const { user, token, isLoading: isAuthLoading } = useAuth(); // Get user, token, and loading state
  const router = useRouter();
  const { id: seriesId } = router.query;
  const [activeTab, setActiveTab] = useState('All Tests');
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);

  const handleStartTest = async (test: MockTest) => {

    const authToken = token || undefined;
    // 1. If the test itself is marked as free, it's a demo. Let anyone start immediately.
    if (test.is_free) {
      router.push(`/test/${test.id}`);
      return;
    }

    // 2. If the test is not free, check if the user is logged in.
    if (!user) {
      router.push(`/auth/login?redirect=${router.asPath}`);
      return;
    }

    // 3. User is logged in and the test is not free. Check if they have purchased the series.
    setLoadingTestId(test.id);
    try {
      const { enrolled } = await api.get(`/mock-series/${seriesId}/check-enrollment`, authToken);
      
      if (enrolled) {
        // User has paid, proceed to test.
        router.push(`/test/${test.id}`);
      } else {
        // User has not paid, show a message.
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

  const renderTestList = (testList: MockTest[]) => {
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