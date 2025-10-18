import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Download, IndianRupee, CheckCircle2, Loader2, Lock, FileText, UserPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

interface DownloadableFile {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  price: number;
  downloads_count: number;
  created_at: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface Payment {
  id: string;
  razorpay_order_id: string;
}

interface Purchase {
  id: string;
  file_id: string;
  user_id: number;
  purchased_at: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface SingleFilePageProps {
  file: DownloadableFile | null;
}

const SingleFilePage: React.FC<SingleFilePageProps> = ({ file: initialFile }) => {
  const [file] = useState<DownloadableFile | null>(initialFile);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [purchased, setPurchased] = useState<boolean>(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState<boolean>(false);
  const [checkingPurchase, setCheckingPurchase] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
  
  // Signup form state
  const [showSignupForm, setShowSignupForm] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  
  const { user } = useAuth();
  const router = useRouter();

  // Check if user has already purchased
  React.useEffect(() => {
    const checkPurchase = async () => {
      if (!user || !file) {
        setCheckingPurchase(false);
        return;
      }

      try {
        const response = await api.get(`/files/${file.id}/check-purchase/${user.id}`);
        if (response.hasPurchased) {
          setAlreadyPurchased(true);
        }
      } catch (error) {
        console.error('Error checking purchase:', error);
      } finally {
        setCheckingPurchase(false);
      }
    };

    checkPurchase();
  }, [user, file]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    setError('');
    
    try {
      await api.post('/auth/signup', { 
        full_name: fullName, 
        email, 
        password 
      });
      
      // After successful signup, redirect to login with current page as redirect
      router.push(`/auth/login?redirect=/files/${file?.slug}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      setShowSignupForm(true);
      return;
    }

    if (!file) return;

    try {
      setPurchasing(true);
      setError('');

      const response: { purchase?: Purchase; order?: RazorpayOrder; payment?: Payment; file: DownloadableFile } = 
        await api.post('/files/purchase', {
          fileId: file.id,
          userId: user.id,
        });

      // Free file - direct purchase
      if (response.purchase && !response.order) {
        setPurchased(true);
        setAlreadyPurchased(true);
        return;
      }

      // Paid file - initiate Razorpay
      if (response.order && response.payment) {
        initiateRazorpayPayment(response.order, response.payment);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to initiate purchase');
    } finally {
      setPurchasing(false);
    }
  };

  const initiateRazorpayPayment = (order: RazorpayOrder, payment: Payment): void => {
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      amount: order.amount,
      currency: order.currency,
      name: file!.title,
      description: file!.description?.slice(0, 20) || 'File Purchase',
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        try {
          await api.post('/files/verify-payment', {
            paymentId: payment.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });

          setPurchased(true);
          setAlreadyPurchased(true);
        } catch (error) {
          setError('Payment verification failed');
        }
      },
      prefill: {
        name: user?.full_name || '',
        email: user?.email || '',
      },
      theme: {
        color: '#3b82f6'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleDownload = () => {
    router.push('/dashboard/my-files');
  };

  const handleCopyLink = () => {
    if (file) {
      const link = `${window.location.origin}/offline-forms/${file.slug}`;
      navigator.clipboard.writeText(link);
    }
  };

  if (!file) {
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* <Header /> */}
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-red-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-red-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">File Not Found</h2>
              <p className="text-gray-600 text-lg mb-8">
                The file you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-400 text-white"
                onClick={() => router.push('/offline-forms')}
              >
                View All Files
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  // Success view
  if (purchased) {
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* <Header /> */}
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-green-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Purchase Successful!</h2>
              <p className="text-gray-600 text-lg mb-8">
                You can now download this file from your purchases page.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-400 text-white"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Go to My Downloads
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => router.push('/offline-forms')}
                >
                  Browse More Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  // Already purchased view
  if (alreadyPurchased && !checkingPurchase) {
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* <Header /> */}
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-yellow-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-yellow-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Already Purchased</h2>
              <p className="text-gray-600 text-lg mb-8">
                You've already purchased this file. Access it from your downloads page.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-400 text-white"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Go to My Downloads
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => router.push('/offline-forms')}
                >
                  Browse More Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen image-bg">
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="flex justify-center items-center gap-2 text-gray-300 p-1 pr-3 rounded-full border">
            <img src="/logo.png" alt="" className='w-10 h-10 rounded-full' />
            <span className="text-md font-medium">Haryana Job Alerts</span>
          </Link>
          <div className="flex items-center gap-2">
            {
              user ? (
                <Button 
                  className="flex items-center gap-2 h-10 bg-black border rounded-xl"
                  onClick={()=> router.push('/dashboard')}
                >
                  <Lock className="w-4 h-4" />
                  Go to Profile
                </Button>
              ) : (
                <Button 
                  className="flex items-center gap-2 h-10 bg-black border rounded-xl"
                  onClick={() => setShowSignupForm(true)}
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account to Purchase
                </Button>
              )
            }
          </div>
        </div>
        {/* Main Grid Layout - Two Columns */}
        <div className="grid lg:grid-cols-3 gap-8 bg-white border shadow-sm rounded-4xl p-6">
          {/* Left Column - File Details (2/3 width) */}
          <div className="lg:col-span-2">
            <div>
              {file.thumbnail_url && (
                <div className="w-full rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-blue-100 to-blue-50">
                  <img 
                    src={file.thumbnail_url} 
                    alt={file.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-8">
                {/* Title */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{file.title}</h1>
                </div>

                {/* Description */}
                {file.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">ABOUT THE PAGE</h2>
                    <div className="prose prose-gray max-w-none">
                      {file.description.split(/\r?\n/).map((line, idx) => (
                        line.trim() && (
                          <p key={idx} className="text-gray-700 leading-relaxed mb-2">
                            {line}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* What You'll Get Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">WHAT YOU'LL GET</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Number of resources</span>
                      <span className="font-medium text-gray-900">1</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Resource content</span>
                      <span className="font-medium text-gray-900">File</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>

          {/* Right Column - Purchase Card (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg border bg-white rounded-2xl">
                <CardContent className="p-6">
                  {/* Error Alert */}
                  {error && (
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertTitle className="text-red-700">Error</AlertTitle>
                      <AlertDescription className="text-red-600">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Signup Form for Non-Logged-In Users */}
                  {!user && showSignupForm ? (
                    <div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-4">Access to this purchase will be sent to this email</p>
                      </div>
                      
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            required
                            disabled={isSigningUp}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full Name"
                            required
                            disabled={isSigningUp}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password (min 6 characters)"
                            required
                            disabled={isSigningUp}
                            minLength={6}
                            className="w-full"
                          />
                        </div>

                        {/* Price Summary */}
                        <div className="py-4 border-y border-gray-200 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Sub Total</span>
                            <span className="text-gray-900">
                              {file.price === 0 ? '₹0' : `₹${file.price}`} 
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">
                              {file.price === 0 ? '₹0' : `₹${file.price}`}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-black hover:bg-gray-800 text-white h-12"
                          disabled={isSigningUp}
                        >
                          {isSigningUp ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            'Get it now →'
                          )}
                        </Button>
                      </form>

                      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                          Already have an account?{' '}
                          <Link href={`/auth/login?redirect=/offline-forms/${file.slug}`} className="text-blue-600 hover:underline font-medium">
                            Log in here
                          </Link>
                        </p>
                      </div>

                      {/* Invite Network */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">INVITE YOUR NETWORK</p>
                        <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                          <FileText className="w-4 h-4 mr-2" />
                          Copy link
                        </Button>
                      </div>
                    </div>
                  ) : !user ? (
                    // Show purchase form trigger for non-logged users
                    <div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-4">Access to this purchase will be sent to this email</p>
                        <Input
                          placeholder="Email Address"
                          disabled
                          className="w-full mb-3"
                        />
                      </div>

                      {/* Price Summary */}
                      <div className="py-4 border-y border-gray-200 space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sub Total</span>
                          <span className="text-gray-900">
                            {file.price === 0 ? '₹0' : `₹${file.price}`} 
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">
                            {file.price === 0 ? '₹0' : `₹${file.price}`}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white h-12"
                        onClick={handlePurchase}
                        disabled={checkingPurchase}
                      >
                        {checkingPurchase ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          'Get it now →'
                        )}
                      </Button>

                      <p className="text-center text-xs text-gray-600 mt-3">
                        Already have an account?{' '}
                        <Link href={`/auth/login?redirect=/offline-forms/${file.slug}`} className="text-blue-600 hover:underline font-medium">
                          Log in here
                        </Link>
                      </p>

                      {/* Invite Network */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">INVITE YOUR NETWORK</p>
                        <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                          <FileText className="w-4 h-4 mr-2" />
                          Copy link
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Logged-in user purchase form
                    <div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-4">Access to this purchase will be sent to this email</p>
                        <Input
                          value={user.email}
                          disabled
                          className="w-full mb-3"
                        />
                      </div>

                      {/* Price Summary */}
                      <div className="py-4 border-y border-gray-200 space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sub Total</span>
                          <span className="text-gray-900">
                            {file.price === 0 ? '₹0' : `₹${file.price}`}<span className="ml-3 text-gray-400 line-through">
                                {file.price === 0 ? '₹0' : `₹${file.price * 1.5}`}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">
                            {file.price === 0 ? '₹0' : `₹${file.price}`}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white h-12"
                        onClick={handlePurchase}
                        disabled={purchasing || checkingPurchase}
                      >
                        {purchasing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Get it now →'
                        )}
                      </Button>

                      {/* Invite Network */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">INVITE YOUR NETWORK</p>
                        <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                          <FileText className="w-4 h-4 mr-2" />
                          Copy link
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Lock className="w-3 h-3" />
                      <span>Secure payment powered by Razorpay</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const file: DownloadableFile = await api.get(`/files/slug/${slug}`);

    return {
      props: {
        file,
      },
    };
  } catch (error) {
    console.error('Error fetching file:', error);
    return {
      props: {
        file: null,
      },
    };
  }
};

export default SingleFilePage;