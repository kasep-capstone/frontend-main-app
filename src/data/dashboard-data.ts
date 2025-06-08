import { DayData, FoodData, DailyFood, HistoryData, PeriodData, Slide } from '@/types/dashboard';

export const weeklyData: DayData[] = [
  { day: "Sun", calories: 1850, target: 2000 },
  { day: "Mon", calories: 1450, target: 2000 },
  { day: "Tue", calories: 2100, target: 2000 },
  { day: "Wed", calories: 1600, target: 2000 },
  { day: "Thu", calories: 1940, target: 2000 },
  { day: "Fri", calories: 2050, target: 2000 },
  { day: "Sat", calories: 1750, target: 2000 },
];

export const chartConfig = {
  calories: {
    label: "Calories",
    color: "#f59e0b",
  },
  target: {
    label: "Target",
    color: "#0055FFFF",
  },
};

export const foodData: FoodData[] = [
  { bahan: "Nasi", konsumsi: 85 },
  { bahan: "Ayam", konsumsi: 70 },
  { bahan: "Sayuran", konsumsi: 60 },
  { bahan: "Buah", konsumsi: 45 },
  { bahan: "Ikan", konsumsi: 40 },
  { bahan: "Telur", konsumsi: 55 },
];

export const radarConfig = {
  konsumsi: {
    label: "Konsumsi (%)",
    color: "#f59e0b",
  },
};

export const dailyFoodHistory: DailyFood[] = [
  {
    id: 1,
    name: "Nasi Gudeg",
    calories: 450,
    time: "07:30",
    category: "Sarapan",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center"
  },
  {
    id: 2,
    name: "Ayam Goreng",
    calories: 320,
    time: "12:15",
    category: "Makan Siang",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=100&h=100&fit=crop&crop=center"
  },
  {
    id: 3,
    name: "Gado-gado",
    calories: 280,
    time: "13:00",
    category: "Makan Siang",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=100&h=100&fit=crop&crop=center"
  },
  {
    id: 4,
    name: "Pisang Goreng",
    calories: 180,
    time: "16:45",
    category: "Snack",
    image: "https://images.unsplash.com/photo-1587334207976-c8da06a3cc4e?w=100&h=100&fit=crop&crop=center"
  },
  {
    id: 5,
    name: "Soto Ayam",
    calories: 290,
    time: "19:20",
    category: "Makan Malam",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=100&h=100&fit=crop&crop=center"
  }
];

export const weeklyHistory: HistoryData[] = [
  { day: "Sen", calories: 1850 },
  { day: "Sel", calories: 2100 },
  { day: "Rab", calories: 1600 },
  { day: "Kam", calories: 1940 },
  { day: "Jum", calories: 2050 },
  { day: "Sab", calories: 1750 },
  { day: "Min", calories: 1450 },
];

export const monthlyHistory: HistoryData[] = [
  { week: "W1", calories: 1800 },
  { week: "W2", calories: 1950 },
  { week: "W3", calories: 1700 },
  { week: "W4", calories: 1850 },
];

export const sixMonthHistory: HistoryData[] = [
  { month: "Jan", calories: 1800 },
  { month: "Feb", calories: 1950 },
  { month: "Mar", calories: 1700 },
  { month: "Apr", calories: 1850 },
  { month: "May", calories: 2000 },
  { month: "Jun", calories: 1900 },
];

export const yearlyHistory: HistoryData[] = [
  { year: "2020", calories: 1750 },
  { year: "2021", calories: 1850 },
  { year: "2022", calories: 1900 },
  { year: "2023", calories: 1950 },
  { year: "2024", calories: 1800 },
];

export const periods: PeriodData[] = [
  { id: 'week', label: '1 Minggu', data: weeklyHistory, dataKey: 'day' },
  { id: 'month', label: '1 Bulan', data: monthlyHistory, dataKey: 'week' },
  { id: 'sixmonth', label: '6 Bulan', data: sixMonthHistory, dataKey: 'month' },
  { id: 'year', label: '1 Tahun', data: yearlyHistory, dataKey: 'year' }
];

export const slides: Slide[] = [
  {
    id: 'food',
    title: 'Bahan Makanan Favorit',
    description: 'Konsumsi bahan makanan dalam 7 hari terakhir'
  },
  {
    id: 'history',
    title: 'History Kalori',
    description: 'Data konsumsi kalori berdasarkan periode waktu'
  }
];

export const historyConfig = {
  calories: {
    label: "Calories",
    color: "#f59e0b",
  },
}; 