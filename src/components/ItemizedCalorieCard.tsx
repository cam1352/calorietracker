import React, { useState, useEffect, useRef } from 'react';
import { PlateAnalysisResult, FoodItem, MealEntry } from '../types';
import { Sparkles, CheckCircle2, Flame, Dumbbell, Wheat, Droplet, Clock, Plus, Trash2, Edit2, Volume2, VolumeX, Share2, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

interface ItemizedCalorieCardProps {
  result: PlateAnalysisResult;
  imageUrl: string;
  onSaveMeal: (meal: MealEntry) => void;
  onReset: () => void;
}

export const ItemizedCalorieCard: React.FC<ItemizedCalorieCardProps> = ({
  result,
  imageUrl,
  onSaveMeal,
  onReset,
}) => {
  const [items, setItems] = useState<FoodItem[]>(result.items || []);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [saved, setSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExportSocial = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: '#020617' });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `CalorieTracker_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  // Recalculate totals dynamically if user modifies item quantities
  const totalCalories = Math.round(items.reduce((acc, item) => acc + (Number(item.calories) || 0), 0));
  const totalProtein = Math.round(items.reduce((acc, item) => acc + (Number(item.protein) || 0), 0) * 10) / 10;
  const totalCarbs = Math.round(items.reduce((acc, item) => acc + (Number(item.carbs) || 0), 0) * 10) / 10;
  const totalFat = Math.round(items.reduce((acc, item) => acc + (Number(item.fat) || 0), 0) * 10) / 10;

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser doesn't support Text-to-Speech.");
      return;
    }
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Determine the main foods listed
    const foodNames = items.map(i => i.name).join(' and ');
    const speechText = `I have scanned your plate. It contains ${foodNames}. This is approximately ${totalCalories} calories, with ${totalProtein} grams of protein.`;
    
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSave = () => {
    const mealEntry: MealEntry = {
      ...result,
      id: 'meal_' + Date.now(),
      items: items,
      totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      mealType,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl,
    };

    onSaveMeal(mealEntry);
    setSaved(true);

    // Trigger celebration confetti animation
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 animate-fadeIn">
      {/* Top Banner & Dish Name */}
      <div 
        ref={cardRef}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl bg-slate-950"
      >
        {/* Watermark (Only visible when generated, managed by CSS if needed, or just rendered normally) */}
        <div className="absolute top-4 right-4 text-emerald-500/30 font-black text-2xl tracking-tighter rotate-12 pointer-events-none select-none z-0">
          CalorieTracker.xyz
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Image Thumbnail */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-xl border border-slate-800 group">
            <img
              src={imageUrl}
              alt={result.dishName}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {result.isMock && (
              <span className="absolute top-3 left-3 bg-amber-500/90 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow">
                Demo Sample Scan
              </span>
            )}
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Score: {result.healthScore}/10</span>
            </div>
          </div>

          {/* Dish Details */}
          <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      AI Plate Analysis
                    </span>
                    {result.dietaryTags?.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Button Group */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleExportSocial}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md bg-emerald-600 hover:bg-emerald-500 text-slate-900"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Save to Camera Roll
                    </button>

                    <button 
                      onClick={handlePlayAudio}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
                        isPlaying 
                          ? 'bg-rose-500 text-white animate-pulse' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      {isPlaying ? 'Stop Audio' : 'Read Aloud'}
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {result.dishName}
                </h2>
              </div>

            {/* AI Explanation Box */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-sm leading-relaxed">
              <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                AI Culinary & Ingredient Explanation:
              </p>
              {result.explanation}
            </div>

            {/* Total Macros Pill Bar */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <Flame className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="block text-lg font-extrabold text-white">{totalCalories}</span>
                <span className="block text-[10px] uppercase font-semibold text-emerald-400">Calories</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <Dumbbell className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span className="block text-lg font-extrabold text-white">{totalProtein}g</span>
                <span className="block text-[10px] uppercase font-semibold text-blue-400">Protein</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <Wheat className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="block text-lg font-extrabold text-white">{totalCarbs}g</span>
                <span className="block text-[10px] uppercase font-semibold text-amber-400">Carbs</span>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                <Droplet className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <span className="block text-lg font-extrabold text-white">{totalFat}g</span>
                <span className="block text-[10px] uppercase font-semibold text-purple-400">Fat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Calorie Table Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Itemized Calorie Breakdown</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {items.length} items found
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Individual food components detected on your plate with per-item calories and portion sizes.
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-slate-800/80 bg-slate-950/60 rounded-2xl border border-slate-800 overflow-hidden">
          {items.map((item, index) => (
            <div key={index} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-white text-base">{item.name}</span>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                    {item.portionSize}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 pl-4">
                  <span>Protein: <strong className="text-slate-200">{item.protein}g</strong></span>
                  <span>Carbs: <strong className="text-slate-200">{item.carbs}g</strong></span>
                  <span>Fat: <strong className="text-slate-200">{item.fat}g</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-lg font-extrabold text-emerald-400">{item.calories}</span>
                  <span className="text-xs text-slate-400 ml-1">kcal</span>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Meal Category & Save Button Section */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400">Meal Category:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    mealType === type
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
            >
              Scan Another Plate
            </button>

            <button
              onClick={handleSave}
              disabled={saved}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                saved
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 hover:scale-105'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saved ? 'Saved to Daily Log!' : 'Save Meal Entry'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
