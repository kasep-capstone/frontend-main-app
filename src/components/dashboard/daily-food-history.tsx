import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Clock, Calendar, ArrowRight } from 'lucide-react';
import { DailyFood } from '@/types/dashboard';

interface DailyFoodHistoryProps {
  dailyFoodHistory: DailyFood[];
  imageErrors: Record<number, boolean>;
  onImageError: (foodId: number) => void;
  onViewHistory?: () => void;
  onFoodClick?: (food: DailyFood) => void;
}

export function DailyFoodHistory({ 
  dailyFoodHistory, 
  imageErrors, 
  onImageError,
  onViewHistory,
  onFoodClick
}: DailyFoodHistoryProps) {
  const totalCalories = dailyFoodHistory.reduce((sum, food) => sum + food.calories, 0);
  const targetCalories = 2000;
  const remainingCalories = targetCalories - totalCalories;

  return (
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
            <div 
              key={food.id} 
              className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onFoodClick?.(food)}
            >
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
                      onError={() => onImageError(food.id)}
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
              {totalCalories} kcal
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">Target: {targetCalories} kcal</span>
            <span className="text-xs text-muted-foreground">
              Sisa: {remainingCalories} kcal
            </span>
          </div>

          {/* View Full History Button */}
          <button 
            onClick={onViewHistory}
            className="w-full mt-4 px-4 py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors group"
          >
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
  );
} 