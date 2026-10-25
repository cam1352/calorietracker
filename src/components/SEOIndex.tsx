import React, { useState } from 'react';
import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';
import faqsData from '../data/faqs.json';
import blogsData from '../data/blogs.json';

interface SEOIndexProps {
  type: 'blog' | 'faq' | 'food';
  onSelect: (item: any, type: 'blog' | 'faq' | 'food') => void;
  onBack: () => void;
  onTypeChange?: (type: 'blog' | 'faq') => void;
}

export const SEOIndex: React.FC<SEOIndexProps> = ({ type: initialType, onSelect, onBack, onTypeChange }) => {
  const [currentTab, setCurrentTab] = useState<'blog' | 'faq'>(initialType === 'faq' ? 'faq' : 'blog');

  const handleTabChange = (newTab: 'blog' | 'faq') => {
    setCurrentTab(newTab);
    if (onTypeChange) onTypeChange(newTab);
  };

  const items = currentTab === 'blog' 
    ? blogsData.filter(b => !b.publishDate || new Date(b.publishDate) <= new Date())
    : faqsData;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to App
      </button>

      {/* Segmented Controller: Guides & Articles vs FAQs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
            {currentTab === 'blog' ? 'Clinical Guides & Articles' : '1,000+ Calorie & Macro FAQs'}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            {currentTab === 'blog' 
              ? 'Deep metabolic science, TDEE, NEAT, mTOR, and macronutrient nutrition guides.' 
              : 'Direct clinical answers to calorie, protein, carbohydrate, and fat queries.'}
          </p>
        </div>

        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => handleTabChange('blog')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'blog'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Guides ({blogsData.length})
          </button>
          <button
            onClick={() => handleTabChange('faq')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'faq'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            FAQs ({faqsData.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item, currentTab)}
            className="flex flex-col text-left glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 bg-slate-900/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-emerald-400">
              {currentTab === 'blog' ? <BookOpen className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 leading-snug">
              {item.title}
            </h3>
            {item.date && (
               <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-auto pt-4">
                 {new Date(item.date).toLocaleDateString()}
               </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
