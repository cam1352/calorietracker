import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlateScanner } from './components/PlateScanner';
import { ItemizedCalorieCard } from './components/ItemizedCalorieCard';
import { DailyTracker } from './components/DailyTracker';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { SEOArticle } from './components/SEOArticle';
import { SEOIndex } from './components/SEOIndex';
import { SEOFood } from './components/SEOFood';
import faqsData from './data/faqs.json';
import blogsData from './data/blogs.json';
import foodsData from './data/foods.json';
import { PlateAnalysisResult, MealEntry, UserGoals, UserSubscription } from './types';
import {
  getStoredMeals,
  saveMeal,
  deleteMeal,
  getStoredGoals,
  getStoredSubscription,
  saveSubscription,
  decrementFreeScan,
} from './utils/storage';
import { CheckCircle2, Camera } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'daily' | 'analytics' | 'seo'>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.has('blog') || params.has('faq') || params.has('food')) ? 'seo' : 'scan';
  });
  const [seoData, setSeoData] = useState<any>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('food')) return params.get('food'); // Just store the slug string
    if (params.has('blog')) return blogsData.find(b => b.slug === params.get('blog'));
    if (params.has('faq')) return faqsData.find(f => f.slug === params.get('faq'));
    return null;
  });
  const [seoType, setSeoType] = useState<'blog' | 'faq' | 'food'>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('food')) return 'food';
    return params.has('faq') ? 'faq' : 'blog';
  });
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [goals, setGoals] = useState<UserGoals>(getStoredGoals());
  const [subscription, setSubscription] = useState<UserSubscription>(getStoredSubscription());
  
  // User Auth State
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('calorietracker_user_v1');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [scanResult, setScanResult] = useState<PlateAnalysisResult | null>(null);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMeals(getStoredMeals());

    // Check if returning from Stripe payment success redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const updatedSub: UserSubscription = {
        isPro: true,
        scansRemaining: 999999,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      saveSubscription(updatedSub);
      setSubscription(updatedSub);
      
      // Tell Google Analytics that a sign up and purchase happened!
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'sign_up', { method: 'Stripe' });
        (window as any).gtag('event', 'purchase', { currency: 'USD', value: 4.99 });
      }

      showToast('Welcome to Premium! Your account has been upgraded.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAnalysisComplete = (result: PlateAnalysisResult, imageBase64: string) => {
    setScanResult(result);
    setScanImage(imageBase64);
    if (!subscription.isPro) {
      const updatedSub = decrementFreeScan();
      setSubscription(updatedSub);
    }
  };

  const handleSaveMeal = (meal: MealEntry) => {
    const updated = saveMeal(meal);
    setMeals(updated);
    showToast('Meal successfully logged into Daily Diary!');
  };

  const handleDeleteMeal = (id: string) => {
    const updated = deleteMeal(id);
    setMeals(updated);
    showToast('Meal entry removed');
  };

  const handleUpgradeSuccess = () => {
    const updatedSub: UserSubscription = {
      isPro: true,
      scansRemaining: 999999,
      plan: 'monthly',
    };
    saveSubscription(updatedSub);
    setSubscription(updatedSub);
    showToast('🎉 Upgraded to Calorie Tracker Pro! Enjoy unlimited scans.');
  };

  const handleLogout = () => {
    localStorage.removeItem('calorietracker_user_v1');
    setUser(null);
    showToast('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        onOpenPricing={() => setIsPricingOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel px-4 py-3 rounded-2xl border border-emerald-500/30 text-emerald-300 text-sm font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scan' && (
          <div>
            {scanResult && scanImage ? (
              <ItemizedCalorieCard
                result={scanResult}
                imageUrl={scanImage}
                onSaveMeal={handleSaveMeal}
                onReset={() => {
                  setScanResult(null);
                  setScanImage(null);
                }}
              />
            ) : (
              <PlateScanner
                onAnalysisComplete={handleAnalysisComplete}
                scansRemaining={subscription.scansRemaining}
                isPro={subscription.isPro}
                onOpenPricing={() => setIsPricingOpen(true)}
              />
            )}
          </div>
        )}

        {activeTab === 'daily' && (
          <DailyTracker
            meals={meals}
            goals={goals}
            onDeleteMeal={handleDeleteMeal}
            onNavigateToScan={() => {
              setScanResult(null);
              setScanImage(null);
              setActiveTab('scan');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard meals={meals} goals={goals} />
        )}
      
        {activeTab === 'seo' && seoData && seoType === 'food' && (
          <SEOFood 
            foodSlug={seoData} 
            onClose={() => {
              setActiveTab('scan');
              setSeoData(null);
              window.history.replaceState({}, document.title, window.location.pathname);
              window.scrollTo(0, 0);
            }} 
          />
        )}
        
        {activeTab === 'seo' && seoData && seoType !== 'food' && (
          <SEOArticle 
            type={seoType as 'blog' | 'faq'} 
            data={seoData} 
            onBack={() => {
              setSeoData(null);
              window.scrollTo(0, 0);
            }} 
          />
        )}
        
        {activeTab === 'seo' && !seoData && (
          <SEOIndex 
            type={seoType}
            onSelect={(item, type) => {
              setSeoData(item);
              setSeoType(type);
              window.scrollTo(0, 0);
            }}
            onBack={() => {
              setActiveTab('scan');
              window.scrollTo(0, 0);
            }}
          />
        )}

      </main>

      {/* Pricing Upgrade Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        subscription={subscription}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      {/* Sign Up / Login Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          showToast(`Welcome ${userData.name}!`);
        }}
      />

      {/* Footer */}
      
      <footer className="bg-slate-950 pt-12 pb-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSeoData(null); setActiveTab('scan'); window.scrollTo(0, 0); }}>
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
              </div>
            </div>

            <div className="flex gap-6 text-sm font-semibold text-slate-300">
              <button onClick={() => { setSeoData(null); setSeoType('blog'); setActiveTab('seo'); window.scrollTo(0, 0); }} className="hover:text-emerald-400 transition-colors">Blog & Guides</button>
              <button onClick={() => { setSeoData(null); setSeoType('faq'); setActiveTab('seo'); window.scrollTo(0, 0); }} className="hover:text-emerald-400 transition-colors">FAQ</button>
              <a href="mailto:calorietracker.app@gmail.com" className="hover:text-emerald-400 transition-colors">Contact</a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center flex flex-col items-center">
            <div className="flex gap-4 mb-6">
              <a href="https://tiktok.com/@calorietrackerxyz" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.14.73-4.32 2.45-5.6 1.73-1.3 4.1-1.63 6.13-.86.15.06.31.14.46.2v4.06c-.84-.23-1.74-.29-2.61-.15-1.12.18-2.15.93-2.58 1.96-.34.8-.29 1.75.14 2.51.52.92 1.57 1.53 2.64 1.59 1.34.07 2.68-.53 3.39-1.63.49-.75.76-1.65.75-2.55V.02z"/></svg>
                TikTok
              </a>
              <a href="https://twitter.com/calorietrackerx" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X (Twitter)
              </a>
              <a href="https://instagram.com/calorietracker.xyz" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
              <a href="https://threads.net/@calorietracker.xyz" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16.516 11.53c-.347-.35-.788-.63-1.298-.814-.543-.197-1.156-.302-1.802-.302-1.026 0-1.956.248-2.692.709-.728.455-1.306 1.077-1.692 1.834-.386.757-.591 1.636-.591 2.583 0 .937.21 1.794.61 2.518.397.718.964 1.282 1.65 1.642.694.364 1.488.556 2.336.556 1.492 0 2.67-.478 3.5-.964.846-.496 1.34-1.144 1.62-1.767l-2.096-1.127c-.201.378-.518.73-1.02.997-.487.258-1.128.402-1.97.402-.55 0-1.037-.101-1.428-.291-.397-.193-.726-.462-.962-.806-.23-.34-.372-.731-.418-1.171h6.634c.026-.263.04-.543.04-.836 0-.853-.13-1.638-.372-2.316zm-5.289 1.424c.062-.358.196-.68.393-.951.192-.266.444-.475.748-.62.308-.147.66-.225 1.042-.225.437 0 .822.094 1.14.275.312.179.562.434.738.752.17.306.27.671.294 1.072h-4.355zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm7.155 16.903c-1.393.993-3.23 1.558-5.467 1.558-1.968 0-3.666-.46-5.06-1.365-1.385-.9-2.42-2.173-3.09-3.791-.673-1.626-1.018-3.486-1.018-5.541 0-2.091.354-3.978 1.055-5.624.707-1.658 1.763-2.951 3.16-3.87 1.405-.923 3.111-1.39 5.09-1.39 1.83 0 3.407.411 4.705 1.228 1.294.815 2.27 1.95 2.915 3.39l-2.092 1.026c-.463-1.07-1.182-1.905-2.148-2.493-.956-.582-2.128-.876-3.48-.876-1.42 0-2.656.34-3.687 1.015-1.026.67-1.802 1.626-2.31 2.85-.503 1.215-.762 2.662-.762 4.31 0 1.624.246 3.05.733 4.254.484 1.196 1.238 2.122 2.247 2.76 1.002.632 2.227.953 3.655.953 1.678 0 3.064-.42 4.14-1.25.92-.716 1.57-1.614 1.961-2.696l2.164.928c-.536 1.44-1.425 2.658-2.658 3.535z"/></svg>
                Threads
              </a>
            </div>
            <div className="text-xs text-slate-500">
              <p>Calorie Tracker &copy; 2026. Powered by Google Gemini Vision & Stripe Payments.</p>
              <p className="mt-2 text-[10px] text-slate-600">Disclaimer: AI nutritional analysis is an estimate and should not replace professional medical advice.</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
