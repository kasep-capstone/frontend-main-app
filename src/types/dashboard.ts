export interface DayData {
  day: string;
  calories: number;
  target: number;
}

export interface FoodData {
  bahan: string;
  konsumsi: number;
}

interface RecipeStep {
  instruction: string;
  image: string[];
}

export interface DailyFood {
  id: number;
  name: string;
  calories: number;
  time: string;
  date: string; // Format: YYYY-MM-DD
  category: string;
  image: string;
  // Extended recipe data
  description?: string;
  usedMaterial?: string[];
  unusedMaterial?: string[];
  missingMaterial?: string[];
  material?: string[];
  step?: RecipeStep[];
  mainImage?: string;
  capturedImage?: string; // Image that was snapped/captured
}

export interface HistoryData {
  day?: string;
  week?: string;
  month?: string;
  year?: string;
  calories: number;
}

export interface PeriodData {
  id: string;
  label: string;
  data: HistoryData[];
  dataKey: string;
}

export interface Slide {
  id: string;
  title: string;
  description: string;
} 