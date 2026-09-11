import { MealEntry, UserGoals, UserSubscription } from '../types';

const STORAGE_KEYS = {
  MEALS: 'nutrisnap_meals_v1',
  GOALS: 'nutrisnap_goals_v1',
  SUBSCRIPTION: 'nutrisnap_sub_v1',
};

// Default daily targets
export const DEFAULT_GOALS: UserGoals = {
  dailyCalorieTarget: 2000,
  dailyProteinTarget: 140,
  dailyCarbsTarget: 220,
  dailyFatTarget: 65,
};

// Default Subscription state (3 free scans)
export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  isPro: false,
  scansRemaining: 3,
  plan: 'free',
};

// Initial Seed Data for immediate demonstration (past 7 days of realistic meal logs)
const SEED_MEALS: MealEntry[] = [
  {
    id: 'seed-1',
    dishName: 'Avocado Toast & Poached Eggs',
    explanation: 'Sourdough toast topped with mashed avocado, chili flakes, and two organic poached eggs. High in healthy fats and protein.',
    mealType: 'Breakfast',
    items: [
      { name: 'Poached Eggs (2)', portionSize: '100g', calories: 144, protein: 12.6, carbs: 0.8, fat: 9.9 },
      { name: 'Avocado Mash', portionSize: '80g', calories: 128, protein: 1.6, carbs: 6.8, fat: 11.7 },
      { name: 'Artisan Sourdough Toast', portionSize: '60g', calories: 160, protein: 5.4, carbs: 31.0, fat: 1.2 }
    ],
    totalCalories: 432,
    protein: 19.6,
    carbs: 38.6,
    fat: 22.8,
    healthScore: 9,
    dietaryTags: ['High Protein', 'Healthy Fats'],
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'seed-2',
    dishName: 'Grilled Chicken Caesar Salad',
    explanation: 'Crisp romaine lettuce tossed with grilled herb chicken breast, shaved parmesan cheese, garlic croutons, and light Caesar dressing.',
    mealType: 'Lunch',
    items: [
      { name: 'Grilled Chicken Breast', portionSize: '150g', calories: 247, protein: 46.5, carbs: 0, fat: 5.4 },
      { name: 'Romaine Lettuce & Greens', portionSize: '100g', calories: 17, protein: 1.2, carbs: 3.3, fat: 0.3 },
      { name: 'Parmesan Cheese & Croutons', portionSize: '40g', calories: 158, protein: 7.0, carbs: 14.2, fat: 8.1 },
      { name: 'Light Caesar Dressing', portionSize: '2 tbsp', calories: 95, protein: 0.5, carbs: 2.1, fat: 9.4 }
    ],
    totalCalories: 517,
    protein: 55.2,
    carbs: 19.6,
    fat: 23.2,
    healthScore: 8,
    dietaryTags: ['High Protein', 'Low Carb'],
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80'
  }
];

export const getStoredMeals = (): MealEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MEALS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(SEED_MEALS));
    return SEED_MEALS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SEED_MEALS;
  }
};

export const saveMeal = (meal: MealEntry): MealEntry[] => {
  const current = getStoredMeals();
  const updated = [meal, ...current];
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(updated));
  return updated;
};

export const deleteMeal = (id: string): MealEntry[] => {
  const current = getStoredMeals();
  const updated = current.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(updated));
  return updated;
};

export const getStoredGoals = (): UserGoals => {
  const data = localStorage.getItem(STORAGE_KEYS.GOALS);
  if (!data) return DEFAULT_GOALS;
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_GOALS;
  }
};

export const saveGoals = (goals: UserGoals): UserGoals => {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  return goals;
};

export const getStoredSubscription = (): UserSubscription => {
  const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
  if (!data) return DEFAULT_SUBSCRIPTION;
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
};

export const saveSubscription = (sub: UserSubscription): UserSubscription => {
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  return sub;
};

export const decrementFreeScan = (): UserSubscription => {
  const current = getStoredSubscription();
  if (current.isPro) return current;
  const updated: UserSubscription = {
    ...current,
    scansRemaining: Math.max(0, current.scansRemaining - 1),
  };
  return saveSubscription(updated);
};
