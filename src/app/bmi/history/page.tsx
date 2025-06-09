'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { MenuBarTop } from '@/components/menu-bar-top';
import { MenuBar } from '@/components/menu-bar';
import { BMIHistoryList } from '@/components/bmi/BMIHistoryList';
import { 
  History, 
  Target, 
  Activity, 
  Download,
  Plus,
  Scale,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Filter
} from 'lucide-react';
import { useBMIHistory } from '@/hooks/useBMIHistory';
import Link from 'next/link';

export default function BMIHistoryPage() {
  const {
    filteredHistory,
    statistics,
    trend,
    filterCategory,
    setFilterCategory,
    deleteRecord,
    exportHistory,
    getGoalsProgress,
    totalRecords
  } = useBMIHistory();

  const goalsProgress = getGoalsProgress();

  return (
    <>
      <MenuBarTop />
      <div className="min-h-screen bg-background pt-16 pb-20">
        <div className="max-w-md mx-auto px-4">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Riwayat BMI</h1>
                <p className="text-muted-foreground">
                  {totalRecords > 0 ? `${totalRecords} pencatatan tersimpan` : 'Belum ada data'}
                </p>
              </div>
            </div>
          </div>

          {/* Statistik ringkas */}
          {statistics && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">BMI Rata-rata</span>
                </div>
                <div className="text-xl font-bold text-amber-600">{statistics.averageBMI}</div>
                <div className="text-xs text-muted-foreground">Range: {statistics.minBMI} - {statistics.maxBMI}</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Scale className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Perubahan Berat</span>
                </div>
                <div className={`text-xl font-bold ${parseFloat(statistics.weightChange) > 0 ? 'text-red-600' : parseFloat(statistics.weightChange) < 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {parseFloat(statistics.weightChange) > 0 ? '+' : ''}{statistics.weightChange} kg
                </div>
                <div className="text-xs text-muted-foreground">dari awal pencatatan</div>
              </div>
            </div>
          )}

          {/* Goals Statistics */}
          {totalRecords > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Target Progress</span>
                </div>
                <div className="text-sm text-amber-600">
                  {goalsProgress.count} dari {goalsProgress.total} memiliki target
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div 
                    className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goalsProgress.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-amber-700 mt-1">
                  {goalsProgress.percentage}% pencatatan dengan target yang ditetapkan
                </div>
              </div>
            </div>
          )}

          {/* Trend BMI */}
          {trend && (
            <div className="bg-card border border-border rounded-lg p-4 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold">Trend Terbaru</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {trend.direction === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : trend.direction === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  ) : (
                    <Target className="w-4 h-4 text-blue-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    trend.direction === 'up' ? 'text-red-600' : 
                    trend.direction === 'down' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {trend.direction === 'up' ? 'Naik' : trend.direction === 'down' ? 'Turun' : 'Stabil'} {trend.value.toFixed(1)} 
                    ({trend.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="text-sm border border-border rounded-md px-3 py-1 bg-background"
              >
                <option value="all">Semua Kategori</option>
                <option value="underweight">Underweight</option>
                <option value="normal">Normal</option>
                <option value="overweight">Overweight</option>
                <option value="obese">Obese</option>
                <option value="with-goals">Dengan Target</option>
                <option value="without-goals">Tanpa Target</option>
              </select>
            </div>
            
            {totalRecords > 0 && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportHistory}
                  className="p-2 bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {totalRecords === 0 ? 'Belum Ada Riwayat' : 'Tidak Ada Data'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {totalRecords === 0 
                  ? 'Mulai mencatat BMI Anda untuk melihat riwayat dan progress'
                  : `Tidak ada data untuk kategori ${filterCategory}`
                }
              </p>
              {totalRecords === 0 && (
                <Link href="/bmi">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg inline-flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Mulai Pencatatan</span>
                  </motion.button>
                </Link>
              )}
            </div>
          )}

          {/* History List */}
          {filteredHistory.length > 0 && (
            <BMIHistoryList
              history={filteredHistory}
              onDeleteRecord={deleteRecord}
            />
          )}
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <MenuBar />
      </div>
    </>
  );
}
