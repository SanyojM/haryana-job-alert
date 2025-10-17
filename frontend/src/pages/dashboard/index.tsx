import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { User, Mail, Calendar, Award, Clock, Target, TrendingUp } from 'lucide-react';

const ProfilePage: NextPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    recentAttempts: 0,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.mock_attempts) {
      const attempts = user.mock_attempts;
      const totalAttempts = attempts.length;
      
      if (totalAttempts > 0) {
        const scores = attempts
          .filter(a => a.score !== null)
          .map(a => a.score as number);
        
        const averageScore = scores.length > 0
          ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
          : 0;
        
        const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentAttempts = attempts.filter(
          a => new Date(a.completed_at) > thirtyDaysAgo
        ).length;

        setStats({
          totalAttempts,
          averageScore,
          highestScore,
          recentAttempts,
        });
      }
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header Section */}
        <div className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {user.full_name}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined {new Date((user as any).created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <Badge variant="secondary" className="text-sm">
                  {user.role === 'admin' ? '👑 Admin' : '🎓 Student'}
                </Badge>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="w-full md:w-auto">
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => router.push('/profile/edit')}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAttempts}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-gray-800">{stats.averageScore}%</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Highest Score</p>
              <p className="text-3xl font-bold text-gray-800">{stats.highestScore}%</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Recent Tests (30d)</p>
              <p className="text-3xl font-bold text-gray-800">{stats.recentAttempts}</p>
            </CardContent>
          </Card>
        </div>

        {/* Test History Section */}
        <Card className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Test History</CardTitle>
            <CardDescription>Your recent mock test attempts and performance</CardDescription>
          </CardHeader>
          <CardContent>
            {user.mock_attempts && user.mock_attempts.length > 0 ? (
              <div className="space-y-4">
                {user.mock_attempts
                  .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                  .map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-grow mb-3 md:mb-0">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {attempt.mock_tests?.title || 'Test Deleted'}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(attempt.completed_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(attempt.completed_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Score</p>
                          <Badge
                            variant={
                              attempt.score && attempt.score >= 70
                                ? 'default'
                                : attempt.score && attempt.score >= 50
                                ? 'secondary'
                                : 'destructive'
                            }
                            className="text-lg px-3 py-1"
                          >
                            {attempt.score ?? 'N/A'}%
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/results/${attempt.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">You haven't attempted any tests yet.</p>
                <Button asChild>
                  <Link href="/mock-tests">Browse Mock Tests</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;