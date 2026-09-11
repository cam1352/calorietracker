export interface FoodItem {
  id?: string;
  name: string;
  portionSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface PlateAnalysisResult {
  dishName: string;
  explanation: string;
  items: FoodItem[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number;
  dietaryTags: string[];
  isMock?: boolean;
}

export interface MealEntry extends PlateAnalysisResult {
  id: string;
  timestamp: string; // ISO date string
  date: string; // YYYY-MM-DD
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  imageUrl?: string;
}

export interface UserGoals {
  dailyCalorieTarget: number;
  dailyProteinTarget: number; // grams
  dailyCarbsTarget: number; // grams
  dailyFatTarget: number; // grams
}

export interface UserSubscription {
  isPro: boolean;
  scansRemaining: number; // Free trial scan counter
  plan: 'free' | 'monthly' | 'yearly';
  renewalDate?: string;
}
