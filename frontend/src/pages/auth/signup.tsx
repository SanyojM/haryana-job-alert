import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from '@/lib/api';
import Link from 'next/link';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Pre-fill email from URL query if it exists
  useEffect(() => {
    if (router.query.email && typeof router.query.email === 'string') {
      setEmail(router.query.email);
    }
  }, [router.query.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/signup', { full_name: fullName, email, password });
      // On success, redirect to the login page, passing the redirect query along
      router.push(`/auth/login?redirect=${router.query.redirect || '/'}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up to access mock tests and courses.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}