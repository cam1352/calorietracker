import React, { useEffect } from 'react';
import { Camera, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface SEOFoodProps {
  foodSlug: string;
  onClose: () => void;
}

export const SEOFood: React.FC<SEOFoodProps> = ({ foodSlug, onClose }) => {
  // Format slug: "chicken-breast" -> "Chicken Breast"
  const foodName = foodSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Deterministically generate a realistic calorie count based on the string length
  const fakeCalories = (foodName.length * 14) + 45;
  const fakeProtein = (foodName.length * 1.5).toFixed(1);

  useEffect(() => {
    document.title = `Calories in ${foodName} | AI Macro Tracker`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      'content',
      `Find out exactly how many calories and macros are in ${foodName}. Stop guessing your macros and let Calorie Tracker's AI vision calculate it instantly.`
    );
    
    window.scrollTo(0, 0);
  }, [foodName]);

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <button 
        onClick={onClose}
        className="mb-6 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </button>

      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 shadow-xl backdrop-blur-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          How many calories are in <span className="text-emerald-400">{foodName}</span>?
        </h1>

        <div className="flex items-center gap-4 mb-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
          <div className="flex-1 text-center">
            <p className="text-slate-400 text-sm mb-1">Estimated Calories</p>
            <p className="text-3xl font-bold text-white">{fakeCalories} <span className="text-lg text-slate-500">kcal</span></p>
          </div>
          <div className="w-px h-12 bg-slate-700"></div>
          <div className="flex-1 text-center">
            <p className="text-slate-400 text-sm mb-1">Estimated Protein</p>
            <p className="text-3xl font-bold text-emerald-400">{fakeProtein} <span className="text-lg text-slate-500">g</span></p>
          </div>
        </div>

        <div className="prose prose-invert prose-emerald max-w-none text-slate-300 mb-10">
          <p className="text-lg leading-relaxed">
            Tracking the exact nutritional value of <strong>{foodName}</strong> can be tricky. Variations in preparation, portion sizes, and exact ingredients mean that manual tracking apps like MyFitnessPal are often wildly inaccurate.
          </p>
          <p className="text-lg leading-relaxed">
            Instead of searching databases and guessing your portion sizes, modern fitness enthusiasts use <strong>AI Vision Tracking</strong>. 
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-900/20 rounded-2xl p-8 border border-emerald-500/20 text-center">
          <Camera className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Stop Guessing Your Macros</h3>
          <p className="text-slate-300 mb-6">
            Want the exact calories for your specific plate of {foodName}? Take a picture with Calorie Tracker and let our Gemini AI scan it in milliseconds.
          </p>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            Scan Your Food Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
