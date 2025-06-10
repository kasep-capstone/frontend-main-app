import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadarChart, Radar, PolarAngleAxis, PolarGrid, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { FoodData, PeriodData, Slide } from '@/types/dashboard';
import { radarConfig, historyConfig } from '@/constants/dashboard-data';

interface HorizontalSliderProps {
  foodData: FoodData[];
  periods: PeriodData[];
  slides: Slide[];
  currentSlide: number;
  selectedPeriod: string;
  onSlideChange: (slide: number) => void;
  onPeriodChange: (period: string) => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export function HorizontalSlider({
  foodData,
  periods,
  slides,
  currentSlide,
  selectedPeriod,
  onSlideChange,
  onPeriodChange,
  onPrevSlide,
  onNextSlide
}: HorizontalSliderProps) {
  const getCurrentPeriodData = () => {
    const period = periods.find(p => p.id === selectedPeriod);
    return period || periods[0];
  };

  return (
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
            onClick={onPrevSlide}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextSlide}
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
                      onClick={() => onPeriodChange(period.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedPeriod === period.id
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
              onClick={() => onSlideChange(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-amber-600' : 'bg-muted'
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
  );
} 