'use client'

import React from 'react'
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, Label, PolarGrid, PolarRadiusAxis, LabelList, PolarAngleAxis, Radar, RadarChart, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  User,
  Settings,
  Activity,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Clock,
  Utensils,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import { ThemeToggle } from '@/components/themes/theme-toggle';

const weeklyData = [
  { day: "Sun", calories: 1850, target: 2000, },
  { day: "Mon", calories: 1450, target: 2000, },
  { day: "Tue", calories: 2100, target: 2000, },
  { day: "Wed", calories: 1600, target: 2000, },
  { day: "Thu", calories: 1940, target: 2000, },
  { day: "Fri", calories: 2050, target: 2000, },
  { day: "Sat", calories: 1750, target: 2000, },
]

const chartConfig = {
  calories: {
    label: "Calories",
    color: "#f59e0b",
  },
  target: {
    label: "Target",
    color: "#0055FFFF",
  },
}

const foodData = [
  { bahan: "Nasi", konsumsi: 85 },
  { bahan: "Ayam", konsumsi: 70 },
  { bahan: "Sayuran", konsumsi: 60 },
  { bahan: "Buah", konsumsi: 45 },
  { bahan: "Ikan", konsumsi: 40 },
  { bahan: "Telur", konsumsi: 55 },
]

const radarConfig = {
  konsumsi: {
    label: "Konsumsi (%)",
    color: "#f59e0b",
  },
}

// Daily food history data
const dailyFoodHistory = [
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
]

// History data for different periods
const weeklyHistory = [
  { day: "Sen", calories: 1850 },
  { day: "Sel", calories: 2100 },
  { day: "Rab", calories: 1600 },
  { day: "Kam", calories: 1940 },
  { day: "Jum", calories: 2050 },
  { day: "Sab", calories: 1750 },
  { day: "Min", calories: 1450 },
]

const monthlyHistory = [
  { week: "W1", calories: 1800 },
  { week: "W2", calories: 1950 },
  { week: "W3", calories: 1700 },
  { week: "W4", calories: 1850 },
]

const sixMonthHistory = [
  { month: "Jan", calories: 1800 },
  { month: "Feb", calories: 1950 },
  { month: "Mar", calories: 1700 },
  { month: "Apr", calories: 1850 },
  { month: "May", calories: 2000 },
  { month: "Jun", calories: 1900 },
]

const yearlyHistory = [
  { year: "2020", calories: 1750 },
  { year: "2021", calories: 1850 },
  { year: "2022", calories: 1900 },
  { year: "2023", calories: 1950 },
  { year: "2024", calories: 1800 },
]

const historyConfig = {
  calories: {
    label: "Calories",
    color: "#f59e0b",
  },
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = React.useState('week');
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [imageErrors, setImageErrors] = React.useState<Record<number, boolean>>({});

  const periods = [
    { id: 'week', label: '1 Minggu', data: weeklyHistory, dataKey: 'day' },
    { id: 'month', label: '1 Bulan', data: monthlyHistory, dataKey: 'week' },
    { id: 'sixmonth', label: '6 Bulan', data: sixMonthHistory, dataKey: 'month' },
    { id: 'year', label: '1 Tahun', data: yearlyHistory, dataKey: 'year' }
  ];

  const slides = [
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

  const getCurrentPeriodData = () => {
    const period = periods.find(p => p.id === selectedPeriod);
    return period || periods[0];
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Toggle dark class on document element
    document.documentElement.classList.toggle('dark');
  };

  // Initialize theme on component mount
  React.useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save theme preference
  React.useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleImageError = (foodId: number) => {
    setImageErrors(prev => ({ ...prev, [foodId]: true }));
  };

  return (
    <>
      <MenuBarTop />
      <div className="min-h-screen bg-background pt-16 pb-20">
        <div className="max-w-md mx-auto px-4">

          {/* Profile Section */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Welcome Back!</h2>
                  <p className="text-muted-foreground">Let's check your progress</p>
                </div>
              </div>
              {/* Dark/Light Mode Toggle */}
              <ThemeToggle />
            </div>
          </div>

          {/* Daily Calorie Charts */}
          <div className="mt-8 mb-8">
            <div className="">
              <div className="grid grid-cols-7 gap-2">
                {weeklyData.map((dayData) => {
                  const progress = Math.round((dayData.calories / dayData.target) * 100);
                  const progressAngle = Math.min(progress, 100) * 2.7; // 270 degrees max
                  const remaining = Math.max(0, dayData.target - dayData.calories);

                  // Get current day
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
                  const isToday = dayData.day === today;

                  return (
                    <div key={dayData.day} className="flex flex-col items-center relative">
                      {isToday && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[10px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                          Today
                        </div>
                      )}
                      <div className="relative">
                        <ChartContainer
                          config={chartConfig}
                          className="aspect-square w-16 h-16"
                        >
                          <RadialBarChart
                            data={[{
                              calories: dayData.calories,
                              target: dayData.target,
                              // remaining: remaining
                            }]}
                            startAngle={-90}
                            endAngle={180}
                            innerRadius={20}
                            outerRadius={30}
                          >
                            <PolarGrid
                              gridType="circle"
                              radialLines={false}
                              stroke="none"
                              className={`first:fill-muted last:fill-background ${isToday ? 'first:fill-amber-100 last:fill-amber-50' : ''}`}
                              polarRadius={[25, 20]}
                            />
                            <RadialBar
                              dataKey="target"
                              startAngle={-90}
                              endAngle={180}
                              fill="#0055FFFF"
                              cornerRadius={2}
                            />
                            <RadialBar
                              dataKey="calories"
                              startAngle={-90}
                              endAngle={-90 + progressAngle}
                              fill={progress >= 100 ? "#22c55e" : "#f59e0b"}
                              cornerRadius={2}
                            />
                            {/* Remaining calories indicator */}
                            {/* {remaining > 0 && (
                              <RadialBar
                                dataKey="remaining"
                                startAngle={-90 + progressAngle}
                                endAngle={180}
                                fill="#f3f4f6"
                                stroke="#d1d5db"
                                strokeWidth={1}
                                cornerRadius={2}
                              />
                            )} */}
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                              <Label
                                content={({ viewBox }) => {
                                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                      <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                      >
                                        <tspan
                                          x={viewBox.cx}
                                          y={viewBox.cy}
                                          className="fill-foreground text-[10px] font-bold"
                                        >
                                          {(dayData.calories / 1000).toFixed(1)}
                                        </tspan>
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) + 8}
                                          className="fill-muted-foreground text-[8px]"
                                        >
                                          kcal
                                        </tspan>
                                        {/* {remaining > 0 && (
                                          <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 16}
                                            className="fill-muted-foreground text-[6px]"
                                          >
                                            -{(remaining / 1000).toFixed(1)}k left
                                          </tspan>
                                        )} */}
                                      </text>
                                    ) as React.ReactElement
                                  }
                                }}
                              />
                            </PolarRadiusAxis>
                          </RadialBarChart>
                        </ChartContainer>
                      </div>
                      <div className={`text-xs font-medium ${isToday ? 'text-amber-600 font-bold' : 'text-muted-foreground'}`}>
                        {dayData.day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Horizontal Slider - Charts */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-600" />
                  {slides[currentSlide].title}
                </CardTitle>
                <CardDescription>
                  {slides[currentSlide].description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="pb-0">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {/* Slide 1: Radar Chart */}
                  <div className="w-full flex-shrink-0">
                    <ChartContainer
                      config={radarConfig}
                      className="mx-auto aspect-square max-h-[250px]"
                    >
                      <RadarChart data={foodData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="bahan" className="fill-muted-foreground text-sm" />
                        <PolarGrid stroke="#e5e7eb" strokeOpacity={0.5} />
                        <Radar
                          dataKey="konsumsi"
                          fill="#f59e0b"
                          fillOpacity={0.3}
                          stroke="#f59e0b"
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ChartContainer>
                  </div>

                  {/* Slide 2: History Chart */}
                  <div className="w-full flex-shrink-0">
                    <div className="space-y-6">
                      {/* Period Buttons */}
                      <div className="flex gap-2 justify-center overflow-x-auto">
                        {periods.map((period) => (
                          <button
                            key={period.id}
                            onClick={() => setSelectedPeriod(period.id)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedPeriod === period.id
                              ? 'bg-amber-600 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                          >
                            {period.label}
                          </button>
                        ))}
                      </div>

                      {/* Chart */}
                      <ChartContainer
                        config={historyConfig}
                        className="aspect-square max-h-[200px] w-full pr-10"
                      >
                        <LineChart data={getCurrentPeriodData().data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey={getCurrentPeriodData().dataKey} className="fill-muted-foreground text-sm" />
                          <YAxis className="fill-muted-foreground text-sm" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="calories"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center mt-4 gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-amber-600' : 'bg-muted'
                      }`}
                  />
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                {currentSlide === 0 && "Nasi paling sering dikonsumsi"}
                {currentSlide === 1 && selectedPeriod === 'week' && "Trend kalori harian minggu ini"}
                {currentSlide === 1 && selectedPeriod === 'month' && "Rata-rata kalori bulanan"}
                {currentSlide === 1 && selectedPeriod === 'sixmonth' && "Performa 6 bulan terakhir"}
                {currentSlide === 1 && selectedPeriod === 'year' && "Trend kalori 5 tahun terakhir"}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                {currentSlide === 0 && "Data berdasarkan frekuensi konsumsi harian"}
                {currentSlide === 1 && selectedPeriod === 'week' && "Kalori per hari dalam seminggu"}
                {currentSlide === 1 && selectedPeriod === 'month' && "Rata-rata kalori per minggu"}
                {currentSlide === 1 && selectedPeriod === 'sixmonth' && "Rata-rata kalori per bulan"}
                {currentSlide === 1 && selectedPeriod === 'year' && "Rata-rata kalori per tahun"}
              </div>
            </CardFooter>
          </Card>

          {/* Daily Food History */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-600" />
                History Makanan Hari Ini
              </CardTitle>
              <CardDescription>
                Makanan yang telah di-scan dan dikonsumsi hari ini
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="space-y-3">
                {dailyFoodHistory.map((food) => (
                  <div key={food.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    {/* Food Image */}
                    <div className="w-12 h-12 rounded-lg flex-shrink-0">
                      {imageErrors[food.id] ? (
                        <div className="w-full h-full bg-amber-100 rounded-lg flex items-center justify-center">
                          <Utensils className="w-6 h-6 text-amber-600" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-lg overflow-hidden">
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(food.id)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Food Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{food.name}</h4>
                        <span className="text-sm font-semibold text-amber-600">{food.calories} kcal</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {food.time}
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                          {food.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Kalori Hari Ini</span>
                  <span className="text-lg font-bold text-amber-600">
                    {dailyFoodHistory.reduce((sum, food) => sum + food.calories, 0)} kcal
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Target: 2000 kcal</span>
                  <span className="text-xs text-muted-foreground">
                    Sisa: {2000 - dailyFoodHistory.reduce((sum, food) => sum + food.calories, 0)} kcal
                  </span>
                </div>

                {/* View Full History Button */}
                <button className="w-full mt-4 px-4 py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors group">
                  <div className="flex items-center justify-center gap-2 text-amber-700">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium text-sm">Lihat History Lengkap</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-xs text-amber-600 mt-1">
                    Riwayat makanan minggu ini dan sebelumnya
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <div className="flex justify-center pt-8">
        <MenuBar />
      </div>
    </>
  )
}
