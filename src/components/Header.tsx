import React from 'react';
import { Camera, BarChart3, Calendar, Crown, Zap } from 'lucide-react';
import { UserSubscription } from '../types';

interface HeaderProps {
  activeTab: 'scan' | 'daily' | 'analytics';
  setActiveTab: (tab: 'scan' | 'daily' | 'analytics') => void;
  subscription: UserSubscription;
  onOpenPricing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  onOpenPricing,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scan')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Camera className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Nutri<span className="text-emerald-400">Snap</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI 2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">AI Plate Calorie & Macro Reader</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'scan'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Scan Plate</span>
            </button>

            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'daily'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Daily Log</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Week & Month</span>
            </button>
          </nav>

          {/* Pricing & Pro Badge */}
          <div className="flex items-center gap-3">
            {subscription.isPro ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Pro Unlimited</span>
              </div>
            ) : (
              <button
                onClick={onOpenPricing}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Upgrade ($4.99/mo)</span>
                <span className="hidden lg:inline-block px-1.5 py-0.5 rounded-md bg-slate-950/20 text-[10px]">
                  {subscription.scansRemaining} scans left
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
