"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useMutation, useAction } from 'convex/react';
import { sileo } from 'sileo';

export default function Login() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [otpId, setOtpId] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  
  const getUser = useMutation(api._users.getUser);
  const createOTP = useMutation(api._otp.create);
  const sendOTP = useAction(api._otp.sendOTP);
  const verifyOTP = useMutation(api._otp.verify);

  const isEmailStage = step === "email";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user exists
      const response = await getUser({ email });
      
      if (response.status === "error") {
         sileo.error({ title: response.message || "User not found" ,fill: "#171717", });
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
    } catch (error) {
      sileo.error({ title: error instanceof Error ? error.message : String(error) ,fill: "#171717", });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(e.target.value);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify OTP
      const result = await verifyOTP({ otpId: otpId as any, code: otpCode });

      if (result.success) {
        sileo.success({ title: "Login successful!", fill: "#171717", });
      }
    } catch (error) {
      sileo.error({ title: "Invalid OTP",fill: "#171717", });
    } finally {
      setLoading(false);
    }
  };

    return (
        <>
            <div className="min-h-screen bg-casa-gradient text-white">
                <Header />
                <div className="relative z-10 pb-16 md:pb-20 px-4 md:px-8">
                    {/* Hero Section */}
                    <section className="max-w-7xl mx-auto pt-16 md:pt-32 pb-8 md:pb-20">
                        <div className="text-center mb-10 md:mb-16">
                            <h1 className="gold-text hero-title mb-6" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>
                                Access Your Learning Journey
                            </h1>
                            <p className="text-subtitle max-w-xl mx-auto">
                                Log in to continue your studies or manage your courses
                            </p>
                        </div>

                        {/* Login Card */}
                        <div className="max-w-lg mx-auto">
                            <Card className="card-glass border-0">
                                <CardContent className="p-5 sm:p-8">
                                    {isEmailStage ? (
                                        <>
                                            {/* Email Stage */}
                                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                                {/* Email Input */}
                                                <div>
                                                    <label htmlFor="email" className="label-gold">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                        placeholder="you@example.com"
                                                        className="input-gold w-full"
                                                    />
                                                </div>

                                                {/* Submit Button */}
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="btn-gold w-full rounded-none h-auto px-6 py-3 text-base"
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
                                                    <p className="text-light mb-4">
                                                        An OTP has been sent to <span className="gold-text font-semibold">{email}</span>
                                                    </p>
                                                </div>

                                                {/* OTP Input */}
                                                <div>
                                                    <label htmlFor="otp" className="label-gold">
                                                        Enter OTP
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="otp"
                                                        value={otpCode}
                                                        onChange={handleOtpChange}
                                                        placeholder="000000"
                                                        className="input-gold w-full text-center tracking-widest"
                                                    />
                                                </div>

                                                {/* Verify Button */}
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="btn-gold w-full rounded-none h-auto px-6 py-3 text-base"
                                                >
                                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                                </Button>
                                            </form>
                                        </>
                                    )}



                                    {/* Sign Up Link */}
                                    <div className="mt-6 pt-6 border-t border-gold-subtle">
                                        <p className="text-light text-center">
                                            Don't have an account?{' '}
                                            <a href="#" className="gold-text font-semibold hover:opacity-80 transition-opacity">
                                                Sign up here
                                            </a>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Back to Home */}
                            <div className="text-center mt-8">
                                <p className="text-muted">
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
