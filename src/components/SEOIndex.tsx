import React from 'react';
import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';
import faqsData from '../data/faqs.json';
import blogsData from '../data/blogs.json';

interface SEOIndexProps {
  type: 'blog' | 'faq';
  onSelect: (item: any, type: 'blog' | 'faq') => void;
  onBack: () => void;
}

export const SEOIndex: React.FC<SEOIndexProps> = ({ type, onSelect, onBack }) => {
  // Only show published blogs
  const items = type === 'blog' 
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

      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
          {type === 'blog' ? 'Nutrition Guides & Articles' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-slate-400 text-lg">
          {type === 'blog' ? 'Expert advice on tracking macros and eating healthy.' : 'Answers to common questions about calorie tracking.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item, type)}
            className="flex flex-col text-left glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 bg-slate-900/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-emerald-400">
              {type === 'blog' ? <BookOpen className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
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
