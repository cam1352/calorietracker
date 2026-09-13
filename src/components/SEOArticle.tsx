import React from 'react';
import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';

interface SEOArticleProps {
  type: 'blog' | 'faq';
  data: any;
  onBack: () => void;
}

export const SEOArticle: React.FC<SEOArticleProps> = ({ type, data, onBack }) => {
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to App
      </button>

      <article className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl bg-slate-900/80">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-6 uppercase tracking-wider">
          {type === 'blog' ? <BookOpen className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
          <span>{type === 'blog' ? 'NutriSnap Blog' : 'Frequently Asked Questions'}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
          {data.title}
        </h1>
        
        {data.date && (
          <p className="text-slate-400 text-sm font-medium mb-10 pb-10 border-b border-slate-800">
            Published on {new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}

        <div 
          className="prose prose-invert prose-emerald max-w-none 
          prose-headings:text-white prose-headings:font-bold 
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-emerald-400 hover:prose-a:text-emerald-300
          prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </article>
    </div>
  );
};
