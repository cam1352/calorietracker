import React, { useState } from 'react';
import { X, Check, Zap, Crown, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import { UserSubscription } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpgradeSuccess: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgradeSuccess,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: billingCycle }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe Checkout page
        window.location.href = data.url;
      } else if (data.isMock) {
        // Instant upgrade for demo when Stripe secret keys are not configured
        setTimeout(() => {
          onUpgradeSuccess();
          setLoading(false);
          onClose();
        }, 1200);
      } else {
        throw new Error(data.error || 'Failed to initiate payment');
      }
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Crown className="w-3.5 h-3.5 fill-amber-400" />
            <span>NutriSnap Pro Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Unlock Unlimited AI Food Scanning
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
            Get instant itemized calorie breakdowns, full meal explanations, and unlimited day/week/month tracking.
          </p>
        </div>

        {/* Toggle Billing Cycle */}
        <div className="flex items-center justify-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 max-w-xs mx-auto text-xs font-semibold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              billingCycle === 'monthly'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly ($4.99/mo)
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex-1 py-2 rounded-xl transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yearly ($39.99/yr)
            <span className="absolute -top-2 -right-1 bg-amber-400 text-slate-950 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shadow">
              Save 33%
            </span>
          </button>
        </div>

        {/* Pricing Box */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-white">
              {billingCycle === 'monthly' ? '$4.99' : '$39.99'}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              /{billingCycle === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          <p className="text-xs text-emerald-400 font-semibold">
            {billingCycle === 'yearly' ? 'Billed annually (~$3.33/mo)' : 'Cancel anytime with 1-click'}
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-2.5 text-xs text-slate-300">
          {[
            'Unlimited AI Food Plate Scans (Gemini Vision 2.5)',
            'Itemized Calorie & Macro Breakdown per component',
            'Full Culinary Ingredient & Preparation Explanations',
            'Per Day / Per Week / Per Month Tracking Dashboard',
            'CSV & Data Export of Food Logs',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-rose-400 text-xs text-center font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
            {error}
          </p>
        )}

        {/* CTA Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Subscribe Now — {billingCycle === 'monthly' ? '$4.99/mo' : '$39.99/yr'}</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          Secure SSL Payment via Stripe. 14-day money-back guarantee.
        </p>
      </div>
    </div>
  );
};
