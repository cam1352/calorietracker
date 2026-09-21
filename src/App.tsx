import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlateScanner } from './components/PlateScanner';
import { DailyDiary } from './components/DailyDiary';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { SEOArticle } from './components/SEOArticle';
import { SEOIndex } from './components/SEOIndex';
import { SEOFood } from './components/SEOFood';
import { PlateAnalysisResult, MealEntry, UserGoals, UserSubscription } from './types';
import { getStoredMeals, saveMeal, deleteMeal, getGoals, getSubscription, saveSubscription } from './utils/storage';
import { Toast } from './components/Toast';

// Dynamically load language databases
const loadDB = (type: 'blog' | 'faq', lang: string) => {
  const code = lang === 'zh' ? 'zh' : lang; // ensure fallback
  try {
    if (type === 'blog') {
      if (lang === 'fr') return require('./data/blogs_fr.json');
      if (lang === 'es') return require('./data/blogs_es.json');
      if (lang === 'zh') return require('./data/blogs_zh.json');
      if (lang === 'hi') return require('./data/blogs_hi.json');
      if (lang === 'pt') return require('./data/blogs_pt.json');
      return require('./data/blogs.json');
    } else {
      if (lang === 'fr') return require('./data/faqs_fr.json');
      if (lang === 'es') return require('./data/faqs_es.json');
      if (lang === 'zh') return require('./data/faqs_zh.json');
      if (lang === 'hi') return require('./data/faqs_hi.json');
      if (lang === 'pt') return require('./data/faqs_pt.json');
      return require('./data/faqs.json');
    }
  } catch(e) {
    return type === 'blog' ? require('./data/blogs.json') : require('./data/faqs.json');
  }
};

export function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'daily' | 'analytics' | 'seo'>(() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const hasLang = ['en', 'es', 'fr', 'zh', 'hi', 'pt'].includes(parts[0]);
    const route = hasLang ? parts[1] : parts[0];
    
    if (['blog', 'faq', 'food'].includes(route)) return 'seo';
    
    const params = new URLSearchParams(window.location.search);
    return (params.has('blog') || params.has('faq') || params.has('food')) ? 'seo' : 'scan';
  });

  const [seoType, setSeoType] = useState<'blog' | 'faq' | 'food'>(() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const hasLang = ['en', 'es', 'fr', 'zh', 'hi', 'pt'].includes(parts[0]);
    const route = hasLang ? parts[1] : parts[0];
    
    if (route === 'food') return 'food';
    if (route === 'faq') return 'faq';
    if (route === 'blog') return 'blog';
    
    const params = new URLSearchParams(window.location.search);
    if (params.has('food')) return 'food';
    return params.has('faq') ? 'faq' : 'blog';
  });

  const [seoData, setSeoData] = useState<any>(() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const hasLang = ['en', 'es', 'fr', 'zh', 'hi', 'pt'].includes(parts[0]);
    const lang = hasLang ? parts[0] : 'en';
    const route = hasLang ? parts[1] : parts[0];
    const slug = hasLang ? parts[2] : parts[1];

    if (route === 'food' && slug) return slug;
    
    if (route === 'blog' && slug) {
      const db = loadDB('blog', lang);
      return db.find((b: any) => b.slug === slug);
    }
    
    if (route === 'faq' && slug) {
      const db = loadDB('faq', lang);
      return db.find((f: any) => f.slug === slug);
    }

    // Fallback to legacy query parameters
    const params = new URLSearchParams(window.location.search);
    if (params.has('food')) return params.get('food');
    if (params.has('blog')) return loadDB('blog', lang).find((b:any) => b.slug === params.get('blog'));
    if (params.has('faq')) return loadDB('faq', lang).find((f:any) => f.slug === params.get('faq'));
    return null;
  });

  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [goals] = useState<UserGoals>(getGoals());
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [toast, setToast] = useState<{message: string, isVisible: boolean}>({ message: '', isVisible: false });
  const [subscription, setSubscription] = useState<UserSubscription>(() => getSubscription());

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast({ message: '', isVisible: false }), 3000);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('calorietracker_user_v1');
    if (savedUser) setUser(JSON.parse(savedUser));
    setMeals(getStoredMeals());

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const updatedSub: UserSubscription = {
        isPro: true,
        scansRemaining: 999999,
        plan: 'monthly',
      };
      saveSubscription(updatedSub);
      setSubscription(updatedSub);
      showToast('Welcome to Premium! Your account has been upgraded.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleScanComplete = (result: PlateAnalysisResult, imageUrl?: string) => {
    if (!subscription.isPro && subscription.scansRemaining <= 0) {
      setShowPricing(true);
      return;
    }

    if (!subscription.isPro) {
      const updatedSub = { ...subscription, scansRemaining: subscription.scansRemaining - 1 };
      saveSubscription(updatedSub);
      setSubscription(updatedSub);
    }

    const meal: MealEntry = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      mealType: 'Snack',
      imageUrl
    };
    
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
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10" />
      
      <Header 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'seo') {
            window.history.replaceState({}, document.title, '/');
          }
        }}
        user={user}
        onSignInClick={() => setShowAuth(true)}
        onLogout={handleLogout}
        isPro={subscription.isPro}
        onUpgradeClick={() => setShowPricing(true)}
      />

      <main className="pt-20 pb-24">
        {activeTab === 'scan' && (
          <PlateScanner 
            onScanComplete={handleScanComplete} 
            scansRemaining={subscription.scansRemaining}
            isPro={subscription.isPro}
            onUpgradeClick={() => setShowPricing(true)}
          />
        )}
        
        {activeTab === 'daily' && (
          <DailyDiary meals={meals} onDelete={handleDeleteMeal} />
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
              window.history.replaceState({}, document.title, '/');
              window.scrollTo(0, 0);
            }} 
          />
        )}
        
        {activeTab === 'seo' && seoData && seoType !== 'food' && (
          <SEOArticle 
            type={seoType as 'blog' | 'faq'} 
            data={seoData} 
            onBack={() => {
              setActiveTab('scan');
              setSeoData(null);
              window.history.replaceState({}, document.title, '/');
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

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onSuccess={(userData) => {
            setUser(userData);
            setShowAuth(false);
          }} 
        />
      )}

      {showPricing && (
        <PricingModal 
          onClose={() => setShowPricing(false)}
          onSuccess={handleUpgradeSuccess}
        />
      )}

      <Toast message={toast.message} isVisible={toast.isVisible} />
    </div>
  );
}