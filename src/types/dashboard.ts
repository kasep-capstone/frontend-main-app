export interface DayData {
  day: string;
  calories: number;
  target: number;
}

export interface FoodData {
  bahan: string;
  konsumsi: number;
}

export interface DailyFood {
  id: number;
  name: string;
  calories: number;
  time: string;
  category: string;
  image: string;
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