"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useMutation, useAction } from 'convex/react';
import { ErrorAlert } from "@/components/error-alert";

export default function Login() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [otpId, setOtpId] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    variant: "default" | "destructive" | "success" | "info";
    title: string;
  } | null>(null);
  
  const getUser = useMutation(api._users.getUser);
  const createOTP = useMutation(api._otp.create);
  const sendOTP = useAction(api._otp.sendOTP);
  const verifyOTP = useMutation(api._otp.verify);

  const isEmailStage = step === "email";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if user exists
      const response = await getUser({ email });
      
      if (response.status === "error") {
        setError(response.message || "User not found");
        setLoading(false);
        return;
      }
      
      const user = response.user!;
      setUserId(user._id);

      // Create OTP
      const otpData = await createOTP({ userId: user._id });
      setOtpId(otpData.otpId as any);

      // Send OTP via email
      await sendOTP({ email, otpId: otpData.otpId, code: otpData.code });

      // Move to OTP verification step
      setStep("otp");
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(e.target.value);
    setError("");
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verify OTP
      const result = await verifyOTP({ otpId: otpId as any, code: otpCode });

      if (result.success) {
        setAlert({
          title: "Success",
          message: "Login successful! User ID: " + result.userId,
          variant: "success",
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

    return (
        <>
            <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1f3a 100%)' }}>
                <Header />
                      {alert && (
        <div className="fixed bottom-4 right-4 w-96 z-50">
          <ErrorAlert
            title={alert.title}
            message={alert.message}
            variant={alert.variant}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
                {/* Starfield Background */}
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 0,
                        opacity: 0.15,
                    }}
                >
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: Math.random() * 3 + 1 + 'px',
                                height: Math.random() * 3 + 1 + 'px',
                                background: '#c9a84c',
                                borderRadius: '50%',
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                                animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 pb-16 md:pb-20 px-4 md:px-8">
                    {/* Hero Section */}
                    <section className="max-w-7xl mx-auto pt-16 md:pt-32 pb-8 md:pb-20">
                        <div className="text-center mb-10 md:mb-16">
                            <h1
                                style={{
                                    fontFamily: "'Cinzel', serif",
                                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                                    fontWeight: 700,
                                    letterSpacing: '0.02em',
                                    marginBottom: '1rem',
                                }}
                                className="gold-text"
                            >
                                Access Your Learning Journey
                            </h1>
                            <p
                                style={{
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: 'clamp(0.95rem, 3.8vw, 1.1rem)',
                                    fontWeight: 300,
                                    lineHeight: 1.8,
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                }}
                            >
                                Log in to continue your studies or manage your courses
                            </p>
                        </div>

                        {/* Login Card */}
                        <div className="max-w-lg mx-auto">
                            <Card
                                style={{
                                    background: 'rgba(26, 31, 58, 0.7)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(201, 168, 76, 0.3)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                <CardContent className="p-5 sm:p-8">
                                    {isEmailStage ? (
                                        <>
                                            {/* Email Stage */}
                                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                                {/* Email Input */}
                                                <div>
                                                    <label
                                                        htmlFor="email"
                                                        style={{
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem',
                                                            letterSpacing: '0.01em',
                                                        }}
                                                        className="gold-text block mb-2"
                                                    >
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                        placeholder="you@example.com"
                                                        style={{
                                                            background: 'rgba(15, 23, 42, 0.6)',
                                                            border: '1px solid rgba(201, 168, 76, 0.2)',
                                                            color: 'white',
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontSize: '0.95rem',
                                                        }}
                                                        className="w-full px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = 'rgba(201, 168, 76, 0.5)';
                                                            e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                                                            e.target.style.background = 'rgba(15, 23, 42, 0.6)';
                                                        }}
                                                    />
                                                </div>

                                                {/* Error Message */}
                                                {error && (
                                                    <div
                                                        style={{
                                                            background: 'rgba(220, 38, 38, 0.1)',
                                                            border: '1px solid rgba(220, 38, 38, 0.5)',
                                                            color: '#fca5a5',
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontSize: '0.9rem',
                                                        }}
                                                        className="px-4 py-3 rounded-sm"
                                                    >
                                                        {error}
                                                    </div>
                                                )}

                                                {/* Submit Button */}
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="btn-gold w-full px-6 py-3 rounded-none h-auto text-white font-semibold"
                                                    style={{
                                                        fontFamily: "'Cinzel', serif",
                                                        fontSize: '1rem',
                                                        letterSpacing: '0.05em',
                                                        opacity: loading ? 0.7 : 1,
                                                    }}
                                                >
                                                    {loading ? 'Logging In...' : 'Login'}
                                                </Button>
                                            </form>
                                        </>
                                    ) : (
                                        <>
                                            {/* OTP Stage */}
                                            <form onSubmit={handleOtpSubmit} className="space-y-6">
                                                <div>
                                                    <p
                                                        style={{
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontSize: '0.95rem',
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            marginBottom: '1rem',
                                                        }}
                                                    >
                                                        An OTP has been sent to <span className="gold-text font-semibold">{email}</span>
                                                    </p>
                                                </div>

                                            {/* OTP Input */}
                                                <div>
                                                    <label
                                                        htmlFor="otp"
                                                        style={{
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem',
                                                            letterSpacing: '0.01em',
                                                        }}
                                                        className="gold-text block mb-2"
                                                    >
                                                        Enter OTP
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="otp"
                                                        value={otpCode}
                                                        onChange={handleOtpChange}
                                                        placeholder="000000"
                                                        style={{
                                                            background: 'rgba(15, 23, 42, 0.6)',
                                                            border: '1px solid rgba(201, 168, 76, 0.2)',
                                                            color: 'white',
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontSize: '0.95rem',
                                                            textAlign: 'center',
                                                            letterSpacing: '0.2em',
                                                        }}
                                                        className="w-full px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = 'rgba(201, 168, 76, 0.5)';
                                                            e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                                                            e.target.style.background = 'rgba(15, 23, 42, 0.6)';
                                                        }}
                                                    />
                                                </div>

                                                {/* Error Message */}
                                                {error && (
                                                    <div
                                                        style={{
                                                            background: 'rgba(220, 38, 38, 0.1)',
                                                            border: '1px solid rgba(220, 38, 38, 0.5)',
                                                            color: '#fca5a5',
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontSize: '0.9rem',
                                                        }}
                                                        className="px-4 py-3 rounded-sm"
                                                    >
                                                        {error}
                                                    </div>
                                                )}

                                                {/* Verify Button */}
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="btn-gold w-full px-6 py-3 rounded-none h-auto text-white font-semibold"
                                                    style={{
                                                        fontFamily: "'Cinzel', serif",
                                                        fontSize: '1rem',
                                                        letterSpacing: '0.05em',
                                                        opacity: loading ? 0.7 : 1,
                                                    }}
                                                >
                                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                                </Button>
                                            </form>
                                        </>
                                    )}



                                    {/* Sign Up Link */}
                                    <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(201, 168, 76, 0.2)' }}>
                                        <p
                                            style={{
                                                fontFamily: "'Lato', sans-serif",
                                                fontSize: '0.95rem',
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Don't have an account?{' '}
                                            <a
                                                href="#"
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                }}
                                                className="gold-text font-semibold hover:opacity-80 transition-opacity"
                                            >
                                                Sign up here
                                            </a>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Back to Home */}
                            <div className="text-center mt-8">
                                <p
                                    style={{
                                        fontFamily: "'Lato', sans-serif",
                                        fontSize: '0.9rem',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                    }}
                                >
                                    or{' '}
                                    <Link href="/" className="gold-text hover:opacity-80 transition-opacity font-semibold">
                                        return to home
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <Footer />
            </div>
        </>
    );
}
