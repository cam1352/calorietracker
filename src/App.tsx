import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlateScanner } from './components/PlateScanner';
import { ItemizedCalorieCard } from './components/ItemizedCalorieCard';
import { DailyTracker } from './components/DailyTracker';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
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
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'daily' | 'analytics'>('scan');
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
        plan: 'monthly',
      };
      saveSubscription(updatedSub);
      setSubscription(updatedSub);
      showToast('🎉 Subscription Active! Pro features unlocked.');
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
      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>Calorie Tracker © 2026. Powered by Google Gemini Vision & Stripe Payments.</p>
      </footer>
    </div>
  );
}

export default App;
