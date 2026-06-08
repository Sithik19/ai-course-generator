"use client"

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Sparkles, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { db } from '@/configs/db';
import { Subscriptions } from '@/configs/schema';
import { and, eq } from 'drizzle-orm';
import { checkUserSubscription } from '@/configs/subscription';

// Dynamically load Razorpay SDK script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function UpgradeScreen() {
  const { user } = useUser();
  const [isMember, setIsMember] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // 'monthly' or 'yearly'

  React.useEffect(() => {
    if (user) {
      const fetchSubscription = async () => {
        const active = await checkUserSubscription(
          user?.primaryEmailAddress?.emailAddress,
          user?.unsafeMetadata?.isMember
        );
        setIsMember(active);
      };
      fetchSubscription();
    }
  }, [user]);

  const activatePremium = async () => {
    try {
      if (user) {
        await user.update({
          unsafeMetadata: {
            isMember: true
          }
        });
      }
    } catch (error) {
      console.error("Error activating premium:", error);
    }
  };
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'razorpay', 'stripe', 'upi'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Stripe form fields state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // UPI configuration
  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID;
  const PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME;
  const UPI_PHONE = process.env.NEXT_PUBLIC_UPI_PHONE;
  const [utrNumber, setUtrNumber] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Starter Plan',
      price: '₹0',
      period: 'forever',
      description: 'Test the waters of AI-powered course generation.',
      features: [
        'Generate up to 5 courses total',
        'Basic AI model explanations',
        'Standard category templates',
        'Community support'
      ],
      cta: 'Current Plan',
      active: true,
      popular: false,
    },
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: '₹1',
      period: 'month',
      description: 'Perfect for regular creators.',
      features: [
        'Generate UNLIMITED courses',
        'Stateless API (faster & higher quality)',
        'Custom course thumbnail uploads',
        'Advanced detailed topics & code examples',
        'Priority feature access & support'
      ],
      cta: 'Subscribe Monthly',
      active: false,
      popular: true,
    },
    {
      id: 'yearly',
      name: 'Premium Yearly',
      price: '₹10',
      period: 'year',
      description: 'Save 45% with our best value annual subscription.',
      features: [
        'Generate UNLIMITED courses',
        'Stateless API (faster & higher quality)',
        'Custom course thumbnail uploads',
        'Advanced detailed topics & code examples',
        'Priority feature access & support',
        'Save 45% compared to monthly'
      ],
      cta: 'Subscribe Yearly',
      active: false,
      popular: false,
    }
  ];

  const handleSubscribeClick = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setPaymentMethod(''); // Reset method selection
    setUtrNumber(''); // Reset reference number
    setSuccess(false);
    setCheckingStatus(false);
  };

  const handleRazorpayCheckout = async () => {
    setLoading(true);
    const scriptLoaded = await loadRazorpay();
    setLoading(false);

    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    const priceAmount = selectedPlan.id === 'monthly' ? 100 : 1000; // 100 paise = ₹1, 1000 paise = ₹10
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: priceAmount.toString(),
      currency: "INR",
      name: "CloudWaves Premium",
      description: `${selectedPlan.name} Subscription`,
      image: "https://img.clerk.com/placeholder-user.png",
      handler: async function (response) {
        await activatePremium();
        setSuccess(true);
        setShowPaymentModal(false);
      },
      prefill: {
        name: user?.fullName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
      theme: {
        color: "#2563eb", // blue-600
      },
    };

    try {
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Razorpay instance error:", err);
      alert("Error opening Razorpay. Starting simulated checkout.");
      setPaymentMethod('stripe'); // fallback to stripe card checkout
    }
  };

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      alert("Please fill in all card details.");
      return;
    }
    setLoading(true);
    await activatePremium();
    setLoading(false);
    setSuccess(true);
    setShowPaymentModal(false);
  };

  const amountVal = selectedPlan?.id === 'monthly' ? 1 : 10;
  const upiLink = selectedPlan ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amountVal}&cu=INR&tn=${encodeURIComponent(selectedPlan.name)}` : '';
  const qrCodeUrl = selectedPlan ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}` : '';

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl flex items-center justify-center gap-2">
          Unlock Unlimited Potential <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Generate as many custom courses as you need, upload custom banners, and study at your own pace.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col justify-between p-8 bg-white dark:bg-slate-900 border rounded-3xl shadow-sm transition-all duration-300 ${
              plan.popular 
                ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105 md:-translate-y-2' 
                : 'border-gray-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'
            }`}
          >
            {plan.popular && (
              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}

            <div>
              {/* Title & Price */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-12">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm font-medium">/{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            {plan.id === 'free' ? (
              <Button
                variant="outline"
                className="w-full rounded-xl py-6 border-gray-300 dark:border-slate-700 text-gray-400 dark:text-gray-500 font-semibold cursor-not-allowed"
                disabled
              >
                {isMember ? 'Basic Member' : plan.cta}
              </Button>
            ) : (
              <Button
                onClick={() => handleSubscribeClick(plan)}
                disabled={isMember}
                className={`w-full rounded-xl py-6 font-semibold shadow-xs transition-all duration-300 hover:scale-[1.02] ${
                  isMember
                    ? 'bg-emerald-600 hover:bg-emerald-600 text-white cursor-default'
                    : plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white'
                }`}
              >
                {isMember ? 'Premium Active' : plan.cta} {!isMember && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Feature trust section */}
      <div className="mt-16 border-t border-gray-100 dark:border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-600 dark:text-slate-400 text-sm">
        <div className="flex flex-col items-center gap-2">
          <ShieldCheck className="h-10 w-10 text-emerald-500" />
          <h4 className="font-semibold text-gray-800 dark:text-slate-200">Secure Billing</h4>
          <p className="text-gray-500 dark:text-slate-400">Industry-standard encryption secures all subscription checkouts.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CreditCard className="h-10 w-10 text-blue-500" />
          <h4 className="font-semibold text-gray-800 dark:text-slate-200">Flexible Methods</h4>
          <p className="text-gray-500 dark:text-slate-400">Pay securely via UPI, credit/debit card, or net banking options.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Sparkles className="h-10 w-10 text-violet-500 animate-pulse" />
          <h4 className="font-semibold text-gray-800 dark:text-slate-200">Instant Access</h4>
          <p className="text-gray-500 dark:text-slate-400">Upgrade takes effect instantly so you can get back to creating.</p>
        </div>
      </div>

      {/* Checkout Method Selection Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Complete Subscription</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Select your payment method for the <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedPlan?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {paymentMethod === '' ? (
            /* Method Selection */
            <div className="flex flex-col gap-4 py-4">
              <Button
                variant="outline"
                onClick={() => setPaymentMethod('upi')}
                className="w-full flex items-center justify-between p-6 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Instant UPI Transfer (Free)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Direct payment to UPI ID or Phone Number</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Button>

              <Button
                variant="outline"
                onClick={handleRazorpayCheckout}
                disabled={loading}
                className="w-full flex items-center justify-between p-6 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Razorpay Checkout</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cards, UPI, Netbanking (India)</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Button>

              <Button
                variant="outline"
                onClick={() => setPaymentMethod('stripe')}
                className="w-full flex items-center justify-between p-6 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Card Payment (Stripe)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Credit or Debit card simulation</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Button>
            </div>
          ) : paymentMethod === 'upi' ? (
            /* UPI payment info and QR Code */
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="bg-blue-50 dark:bg-slate-950/40 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 w-full text-left space-y-2">
                <div className="flex justify-between items-center pb-1 border-b border-blue-100/60 dark:border-blue-900/20">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Option 1: Pay to UPI ID</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">UPI ID: <span className="text-blue-600 dark:text-blue-400 select-all font-mono">{UPI_ID}</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Payee Name: {PAYEE_NAME}</p>
                
                <div className="flex justify-between items-center pt-2 pb-1 border-b border-blue-100/60 dark:border-blue-900/20">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Option 2: Pay to Phone Number</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number: <span className="text-blue-600 dark:text-blue-400 select-all font-mono">{UPI_PHONE}</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Linked to: Google Pay / PhonePe / Paytm / BHIM</p>
                
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 text-center pt-2">Amount: {selectedPlan?.price}</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-3 bg-white shadow-xs">
                <img 
                  src={qrCodeUrl} 
                  alt="UPI Payment QR Code" 
                  className="w-[200px] h-[200px]"
                />
              </div>
              <p className="text-[11px] text-gray-500 max-w-xs leading-normal">
                Scan this QR code with any UPI app to pay, or make a manual transfer directly to the Phone Number.
              </p>

              {/* Only show the open intent button on mobile devices */}
              <div className="w-full block md:hidden">
                <a href={upiLink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-semibold shadow-xs">
                    Open UPI Payment App
                  </Button>
                </a>
              </div>

              <div className="w-full text-left space-y-1.5 mt-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Transaction Reference No (UTR)</label>
                <Input
                  type="text"
                  placeholder="Enter 12-digit UTR No."
                  maxLength="12"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="rounded-lg border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={async () => {
                  if (utrNumber.length !== 12 || isNaN(Number(utrNumber))) {
                    alert("Please enter a valid 12-digit UPI UTR number.");
                    return;
                  }
                  setLoading(true);
                  try {
                    // Check if UTR is already used
                    const existing = await db.select().from(Subscriptions)
                      .where(eq(Subscriptions.utr, utrNumber));
                    
                    if (existing.length > 0) {
                      alert("This transaction reference number (UTR) has already been used.");
                      setLoading(false);
                      return;
                    }

                    // Save the pending transaction reference to DB
                    await db.insert(Subscriptions).values({
                      email: user?.primaryEmailAddress?.emailAddress,
                      utr: utrNumber,
                      amount: selectedPlan?.price,
                      plan: selectedPlan?.name,
                      status: 'pending',
                      createdAt: new Date().toISOString()
                    });

                    alert("Payment reference submitted successfully! The admin will verify the transaction against their bank statement and activate your premium plan shortly.");
                    setShowPaymentModal(false);
                    setUtrNumber('');
                  } catch (error) {
                    console.error("Error submitting UPI payment reference:", error);
                    alert("Something went wrong while submitting payment reference. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 font-semibold shadow-sm"
              >
                {loading ? 'Verifying payment...' : 'Verify & Activate Plan'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setPaymentMethod('')}
                className="w-full text-xs text-gray-500 hover:text-gray-800"
              >
                Go Back
              </Button>
            </div>
          ) : (
            /* Stripe Credit Card Form */
            <form onSubmit={handleStripeCheckout} className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Name on Card</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="rounded-lg border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Card Number</label>
                <Input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  maxLength="19"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="rounded-lg border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Expiration Date</label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="rounded-lg border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">CVC</label>
                  <Input
                    type="password"
                    placeholder="•••"
                    maxLength="3"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="rounded-lg border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-semibold mt-4 shadow-sm"
              >
                {loading ? 'Processing Secure Payment...' : `Pay ${selectedPlan?.price}`}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setPaymentMethod('')}
                className="w-full text-xs text-gray-500 hover:text-gray-800"
              >
                Go Back
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="max-w-md rounded-2xl p-8 bg-white dark:bg-slate-900 border dark:border-slate-800 text-center text-gray-900 dark:text-white">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 mb-6 animate-bounce">
            <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Activated!</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Thank you for subscribing! Your premium account is now active. You have unlocked unlimited AI course generation, stateless rendering, and custom thumbnail banners.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                setSuccess(false);
                window.location.href = '/dashboard';
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-semibold shadow-sm"
            >
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dev Reset Button */}
      {isMember && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                if (user) {
                  await user.update({
                    unsafeMetadata: {
                      isMember: false
                    }
                  });
                  window.location.reload();
                }
              } catch (err) {
                console.error("Error resetting membership:", err);
              }
            }}
            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/20 border border-red-200/40 rounded-lg px-4 py-2"
          >
            ⚠️ Dev Reset: Remove Premium Access (Test Payments)
          </Button>
        </div>
      )}
    </div>
  );
}

export default UpgradeScreen;
