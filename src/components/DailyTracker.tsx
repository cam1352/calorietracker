import React from 'react';
import { MealEntry, UserGoals } from '../types';
import { Flame, Dumbbell, Wheat, Droplet, Plus, Trash2, Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';

interface DailyTrackerProps {
  meals: MealEntry[];
  goals: UserGoals;
  onDeleteMeal: (id: string) => void;
  onNavigateToScan: () => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  meals,
  goals,
  onDeleteMeal,
  onNavigateToScan,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter((m) => m.date === todayStr);

  const totalCaloriesToday = todayMeals.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProteinToday = Math.round(todayMeals.reduce((acc, m) => acc + m.protein, 0));
  const totalCarbsToday = Math.round(todayMeals.reduce((acc, m) => acc + m.carbs, 0));
  const totalFatToday = Math.round(todayMeals.reduce((acc, m) => acc + m.fat, 0));

  const caloriePct = Math.min(100, Math.round((totalCaloriesToday / goals.dailyCalorieTarget) * 100));
  const proteinPct = Math.min(100, Math.round((totalProteinToday / goals.dailyProteinTarget) * 100));
  const carbsPct = Math.min(100, Math.round((totalCarbsToday / goals.dailyCarbsTarget) * 100));
  const fatPct = Math.min(100, Math.round((totalFatToday / goals.dailyFatTarget) * 100));

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Banner: Calorie Budget Progress */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Today's Calorie Summary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Daily Calorie Budget
            </h2>
          </div>

          <button
            onClick={onNavigateToScan}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Scan New Meal</span>
          </button>
        </div>

        {/* Large Calorie Bar */}
        <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-extrabold text-white">{totalCaloriesToday}</span>
              <span className="text-sm font-semibold text-slate-400 ml-1.5">
                / {goals.dailyCalorieTarget} kcal
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-emerald-400">{goals.dailyCalorieTarget - totalCaloriesToday} kcal</span>
              <span className="block text-[11px] text-slate-400">Remaining</span>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                caloriePct > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${caloriePct}%` }}
            />
          </div>
        </div>

        {/* Macros Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {/* Protein */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-400 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" /> Protein
              </span>
              <span className="text-slate-300 font-semibold">{totalProteinToday} / {goals.dailyProteinTarget}g</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${proteinPct}%` }} />
            </div>
          </div>

          {/* Carbs */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5" /> Carbs
              </span>
              <span className="text-slate-300 font-semibold">{totalCarbsToday} / {goals.dailyCarbsTarget}g</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${carbsPct}%` }} />
            </div>
          </div>

          {/* Fat */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-400 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5" /> Fat
              </span>
              <span className="text-slate-300 font-semibold">{totalFatToday} / {goals.dailyFatTarget}g</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full transition-all duration-500" style={{ width: `${fatPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Meals Timeline */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-white">Today's Logged Meals</h3>

        {todayMeals.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-3xl border border-slate-800 space-y-3">
            <Flame className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-semibold">No meals logged for today yet!</p>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Snap a picture of your breakfast, lunch, or dinner to let AI read your plate and track calories.
            </p>
            <button
              onClick={onNavigateToScan}
              className="mt-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Scan Your Plate</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryMeals = todayMeals.filter((m) => m.mealType === category);
              if (categoryMeals.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{category}</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    {categoryMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {meal.imageUrl ? (
                            <img
                              src={meal.imageUrl}
                              alt={meal.dishName}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 shrink-0">
                              <Flame className="w-6 h-6" />
                            </div>
                          )}

                          <div className="space-y-1">
                            <h5 className="font-bold text-white text-base leading-snug">{meal.dishName}</h5>
                            <p className="text-xs text-slate-400 line-clamp-1">{meal.explanation}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span>{meal.items?.length || 0} items detected</span>
                              <span>•</span>
                              <span>P: {meal.protein}g</span>
                              <span>C: {meal.carbs}g</span>
                              <span>F: {meal.fat}g</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-emerald-400">{meal.totalCalories}</span>
                            <span className="text-xs text-slate-400 ml-1">kcal</span>
                          </div>
                          <button
                            onClick={() => onDeleteMeal(meal.id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete meal log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
