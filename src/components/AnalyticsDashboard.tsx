import React, { useState } from 'react';
import { MealEntry, UserGoals } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Award, Flame, Dumbbell } from 'lucide-react';

interface AnalyticsDashboardProps {
  meals: MealEntry[];
  goals: UserGoals;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ meals, goals }) => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Compute date array for past 7 days (Week) or past 30 days (Month)
  const daysCount = viewMode === 'week' ? 7 : 30;
  const chartData = [];

  const now = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const dayMeals = meals.filter((m) => m.date === dateStr);
    const dayCalories = dayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
    const dayProtein = Math.round(dayMeals.reduce((sum, m) => sum + m.protein, 0));
    const dayCarbs = Math.round(dayMeals.reduce((sum, m) => sum + m.carbs, 0));
    const dayFat = Math.round(dayMeals.reduce((sum, m) => sum + m.fat, 0));

    // Format label (e.g. Mon, Tue or Sep 11)
    const label =
      viewMode === 'week'
        ? d.toLocaleDateString('en-US', { weekday: 'short' })
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    chartData.push({
      date: dateStr,
      label,
      calories: dayCalories,
      target: goals.dailyCalorieTarget,
      protein: dayProtein,
      carbs: dayCarbs,
      fat: dayFat,
    });
  }

  // Summary Metrics
  const activeDays = chartData.filter((d) => d.calories > 0).length;
  const totalPeriodCalories = chartData.reduce((acc, d) => acc + d.calories, 0);
  const avgDailyCalories = activeDays > 0 ? Math.round(totalPeriodCalories / activeDays) : 0;
  const highestDay = [...chartData].sort((a, b) => b.calories - a.calories)[0];

  const totalProteinPeriod = chartData.reduce((acc, d) => acc + d.protein, 0);
  const totalCarbsPeriod = chartData.reduce((acc, d) => acc + d.carbs, 0);
  const totalFatPeriod = chartData.reduce((acc, d) => acc + d.fat, 0);

  const pieData = [
    { name: 'Protein', value: totalProteinPeriod * 4, color: '#3b82f6' },
    { name: 'Carbs', value: totalCarbsPeriod * 4, color: '#f59e0b' },
    { name: 'Fat', value: totalFatPeriod * 9, color: '#a855f7' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Banner & Range Switcher */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Calorie Analytics & Trends</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {viewMode === 'week' ? 'Weekly Intake (Past 7 Days)' : 'Monthly Intake (Past 30 Days)'}
          </h2>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setViewMode('week')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'week'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Per Week (7 Days)
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'month'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Per Month (30 Days)
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Daily Calories</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{avgDailyCalories} <span className="text-xs text-slate-400 font-medium">kcal/day</span></p>
          <p className="text-[11px] text-emerald-400 font-semibold">Target: {goals.dailyCalorieTarget} kcal</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Highest Intake Day</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{highestDay?.calories || 0} <span className="text-xs text-slate-400 font-medium">kcal</span></p>
          <p className="text-[11px] text-slate-400">{highestDay ? highestDay.label : 'N/A'}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Logging Days</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{activeDays} <span className="text-xs text-slate-400 font-medium">/ {daysCount} days</span></p>
          <p className="text-[11px] text-blue-400 font-semibold">{Math.round((activeDays / daysCount) * 100)}% consistency</p>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Daily Calorie Bar Chart</span>
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Intaked Calories
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block ml-2" /> Target Budget
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                formatter={(value: any) => [`${value} kcal`, 'Calories']}
              />
              <Bar dataKey="calories" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macro Distribution Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Macronutrient Energy Distribution</h3>
          <p className="text-xs text-slate-400">Total calorie contribution from Protein, Carbs, and Fats</p>
          
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`${Math.round(Number(val))} kcal`, 'Energy']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Protein ({totalProteinPeriod}g)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Carbs ({totalCarbsPeriod}g)
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Fat ({totalFatPeriod}g)
            </span>
          </div>
        </div>

        {/* Nutritional Insights Card */}
        <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>AI Nutritional Insights</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs leading-relaxed space-y-1">
              <p className="font-bold text-emerald-300">Great Calorie Consistency!</p>
              <p className="text-slate-300">
                Your average daily intake of <strong className="text-white">{avgDailyCalories} kcal</strong> is well aligned with your overall health targets.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs leading-relaxed space-y-1">
              <p className="font-bold text-blue-300">Protein Intake Target</p>
              <p className="text-slate-300">
                You averaged <strong className="text-white">{Math.round(totalProteinPeriod / (activeDays || 1))}g</strong> of protein per day. Keep incorporating lean meats, eggs, and legumes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
