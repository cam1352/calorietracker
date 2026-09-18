import React from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, BarChart3, Calendar, Crown, Zap, UserCheck, LogIn, LogOut, Globe } from 'lucide-react';
import { UserSubscription } from '../types';

interface HeaderProps {
  activeTab: 'scan' | 'daily' | 'analytics' | 'seo';
  setActiveTab: (tab: 'scan' | 'daily' | 'analytics' | 'seo') => void;
  subscription: UserSubscription;
  onOpenPricing: () => void;
  user: { name: string; email: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  onOpenPricing,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const { t } = useTranslation();
  const currentLang = window.location.pathname.split('/')[1];
  const activeLang = ['en', 'es', 'zh', 'hi', 'fr', 'pt'].includes(currentLang) ? currentLang : 'en';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    if (lang === 'en') {
      window.location.href = '/';
    } else {
      window.location.href = `/${lang}/`;
    }
  };

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
                  Calorie <span className="text-emerald-400">Tracker</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Vision
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">AI Photo Food & Plate Calorie Reader</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors mr-1">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
              <select 
                value={activeLang}
                onChange={handleLanguageChange}
                className="appearance-none bg-transparent pl-7 pr-6 py-1.5 text-xs font-semibold text-slate-200 outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="zh">ZH</option>
                <option value="hi">HI</option>
                <option value="fr">FR</option>
                <option value="pt">PT</option>
              </select>
            </div>

            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'scan' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">{t('scan')}</span>
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'daily' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{t('daily')}</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('analytics')}</span>
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'seo' ? 'bg-rose-500/20 text-rose-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">{t('seo')}</span>
            </button>
          </nav>

          {/* User Auth & Pricing Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                title={t('sign_in')}
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t('sign_in')}</span>
              </button>
            )}

            {subscription.isPro ? (
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline">{t('pro')}</span>
              </div>
            ) : (
              <button
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                title="Upgrade to Pro"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span className="hidden sm:inline">Upgrade</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
