'use client'

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Search, 
  Filter,
  ChevronDown,
  Flame,
  Eye
} from 'lucide-react';
import { DailyFood } from '@/types/dashboard';
import { dailyFoodHistory } from '@/constants/dashboard-data';
import { ProtectedPageContent } from '@/components/auth/ProtectedPage';

export default function HistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(dailyFoodHistory.map(food => food.category)));
    return ['all', ...cats];
  }, []);

  // Filter food history
  const filteredHistory = useMemo(() => {
    return dailyFoodHistory.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
      
      // Time filter implementation
      let matchesTimeFilter = true;
      if (selectedTimeFilter !== 'all') {
        const foodDate = new Date(food.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        
        switch (selectedTimeFilter) {
          case 'today':
            const todayStr = today.toISOString().split('T')[0];
            matchesTimeFilter = food.date === todayStr;
            break;
            
          case 'week':
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(today.getDate() - 7);
            matchesTimeFilter = foodDate >= oneWeekAgo;
            break;
            
          case 'month':
            const oneMonthAgo = new Date(today);
            oneMonthAgo.setMonth(today.getMonth() - 1);
            matchesTimeFilter = foodDate >= oneMonthAgo;
            break;
            
          default:
            matchesTimeFilter = true;
        }
      }
      
      return matchesSearch && matchesCategory && matchesTimeFilter;
    });
  }, [searchQuery, selectedCategory, selectedTimeFilter]);

  // Group food history by date
  const groupedHistory = useMemo(() => {
    const groups: Record<string, typeof filteredHistory> = {};
    
    filteredHistory.forEach(food => {
      if (!groups[food.date]) {
        groups[food.date] = [];
      }
      groups[food.date].push(food);
    });

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    
    return sortedDates.map(date => ({
      date,
      foods: groups[date].sort((a, b) => a.time.localeCompare(b.time)) // Sort by time within each day
    }));
  }, [filteredHistory]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Hari Ini';
    if (isYesterday) return 'Kemarin';

    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageError = (foodId: number) => {
    setImageErrors(prev => ({ ...prev, [foodId]: true }));
  };

  const handleFoodClick = (food: DailyFood) => {
    router.push(`/history/${food.id}`);
  };

  const totalCalories = filteredHistory.reduce((sum, food) => sum + food.calories, 0);

  const handleTimeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedTimeFilter(newValue);
  };

  return (
    <>
    <ProtectedPageContent>
      <MenuBarTop />
      <div className="min-h-screen bg-background pt-16 pb-20">
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">History Makanan</h1>
                <p className="text-sm text-muted-foreground">Riwayat makanan yang telah di-scan</p>
              </div>
            </div>

            {/* Summary Card */}
            <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">Total Makanan</p>
                    <p className="text-2xl font-bold text-amber-800">{filteredHistory.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-700">Total Kalori</p>
                    <p className="text-2xl font-bold text-amber-800">{totalCalories}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-amber-700" />
                  </div>
                </div>
                
                {/* Active Filter Indicator */}
                {(selectedTimeFilter !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-xs text-amber-600 mb-1">Filter aktif:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTimeFilter !== 'all' && (
                        <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs">
                          {selectedTimeFilter === 'today' ? 'Hari Ini' : 
                           selectedTimeFilter === 'week' ? 'Minggu Ini' : 
                           selectedTimeFilter === 'month' ? 'Bulan Ini' : selectedTimeFilter}
                        </span>
                      )}
                      {selectedCategory !== 'all' && (
                        <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs">
                          {selectedCategory}
                        </span>
                      )}
                      {searchQuery && (
                        <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs">
                          "{searchQuery}"
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border/40 rounded-md bg-background text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border/40 rounded-md bg-background text-sm focus:border-amber-400 focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Semua Kategori' : category}
                    </option>
                  ))}
                </select>
              </div>
                             <div className="flex-1">
                 <select
                   value={selectedTimeFilter}
                   onChange={handleTimeFilterChange}
                   className="w-full px-3 py-2 border border-border/40 rounded-md bg-background text-sm focus:border-amber-400 focus:outline-none"
                 >
                  <option value="all">Semua Waktu</option>
                  <option value="today">Hari Ini</option>
                  <option value="week">Minggu Ini</option>
                  <option value="month">Bulan Ini</option>
                </select>
              </div>
            </div>
          </div>

          {/* Food History List */}
          <div className="space-y-6">
            {groupedHistory.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Utensils className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-2">Tidak ada makanan ditemukan</h3>
                <p className="text-muted-foreground text-sm">
                  Coba ubah filter pencarian atau scan makanan baru
                </p>
              </Card>
            ) : (
              groupedHistory.map((group, groupIndex) => {
                const dayCalories = group.foods.reduce((sum, food) => sum + food.calories, 0);
                
                return (
                  <div key={group.date} className="space-y-3">
                    {/* Date Header with Separator */}
                    <div className="relative">
                      <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <h3 className="font-semibold text-amber-800 text-lg">
                            {formatDate(group.date)}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-amber-700">
                          <span className="text-sm font-medium">{group.foods.length} makanan</span>
                          <div className="w-1 h-1 rounded-full bg-amber-400"></div>
                          <span className="text-sm font-medium">{dayCalories} kcal</span>
                        </div>
                      </div>
                      
                      {/* Separator Line for non-first groups */}
                      {groupIndex > 0 && (
                        <div className="absolute -top-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                      )}
                    </div>

                    {/* Food Items for this date */}
                    <div className="space-y-3 ml-2">
                      {group.foods.map((food) => (
                        <Card 
                          key={food.id} 
                          className="hover:shadow-md transition-all duration-200 cursor-pointer border-border/40 hover:border-amber-200"
                          onClick={() => handleFoodClick(food)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              {/* Food Image */}
                              <div className="w-16 h-16 rounded-lg flex-shrink-0">
                                {imageErrors[food.id] ? (
                                  <div className="w-full h-full bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Utensils className="w-8 h-8 text-amber-600" />
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
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-base text-foreground truncate">{food.name}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                      {food.description || 'Makanan lezat dengan bahan-bahan pilihan'}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 ml-2">
                                    <Flame className="w-4 h-4 text-amber-600" />
                                    <span className="text-sm font-semibold text-amber-600">{food.calories}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      {food.time}
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                                      {food.category}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-amber-600">
                                    <Eye className="w-3 h-3" />
                                    <span>Lihat Detail</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom spacing for menu bar */}
          <div className="h-20" />
        </div>
      </div>

      <div className="flex justify-center">
        <MenuBar />
      </div>
    </ProtectedPageContent>
    </>
  );
}
