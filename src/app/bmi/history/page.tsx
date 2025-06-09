'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MenuBarTop } from '@/components/menu-bar-top';
import { MenuBar } from '@/components/menu-bar';
import { 
  History, 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity, 
  Trash2, 
  Download,
  Plus,
  Scale,
  Heart,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Eye,
  Filter
} from 'lucide-react';
import Link from 'next/link';

// Interface untuk data BMI history
interface BMIRecord {
  id: string;
  date: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: string;
  bmi: number;
  category: string;
  healthStatus: string;
  targetCalories: number;
  hasGoals?: boolean;
  idealTargets?: {
    weightRange: string;
    targetWeight: number;
    targetBMI: string;
    targetCalories: number;
    timeEstimate: string;
  };
  recommendations?: {
    icon: string;
    iconColor: string;
    title: string;
    description: string;
    recommendations: string[];
  };
  progress?: {
    weightRemaining: number;
    weightDirection: string;
    calorieAdjustment: number;
    calorieDirection: string;
    bmiRemaining: number;
    bmiDirection: string;
  };
}

export default function BMIHistoryPage() {
  const [bmiHistory, setBmiHistory] = useState<BMIRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<BMIRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BMIRecord | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Load data dari localStorage saat component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('bmiHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setBmiHistory(history);
      setFilteredHistory(history);
    }
  }, []);

  // Filter history berdasarkan kategori
  useEffect(() => {
    if (filterCategory === 'all') {
      setFilteredHistory(bmiHistory);
    } else if (filterCategory === 'with-goals') {
      setFilteredHistory(bmiHistory.filter(record => record.hasGoals === true));
    } else if (filterCategory === 'without-goals') {
      setFilteredHistory(bmiHistory.filter(record => !record.hasGoals));
    } else {
      setFilteredHistory(bmiHistory.filter(record => record.category.toLowerCase() === filterCategory));
    }
  }, [bmiHistory, filterCategory]);

  // Fungsi untuk mendapatkan warna berdasarkan kategori BMI
  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBMIBgColor = (bmi: number) => {
    if (bmi < 18.5) return 'bg-blue-50 border-blue-200';
    if (bmi < 25) return 'bg-green-50 border-green-200';
    if (bmi < 30) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // Fungsi untuk mendapatkan icon berdasarkan kategori
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'underweight': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overweight': return <TrendingDown className="w-4 h-4 text-yellow-600" />;
      case 'obese': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Fungsi untuk menerjemahkan activity level ke bahasa Indonesia
  const getActivityLevelText = (activityLevel: string) => {
    switch (activityLevel.toLowerCase()) {
      case 'sedentary': return 'Tidak Aktif';
      case 'light': return 'Ringan';
      case 'moderate': return 'Sedang';
      case 'active': return 'Aktif';
      case 'very_active': return 'Sangat Aktif';
      default: return activityLevel;
    }
  };

  // Fungsi untuk menghapus record
  const handleDeleteRecord = (id: string) => {
    const updatedHistory = bmiHistory.filter(record => record.id !== id);
    setBmiHistory(updatedHistory);
    localStorage.setItem('bmiHistory', JSON.stringify(updatedHistory));
    setShowDeleteConfirm(null);
  };

  // Fungsi untuk export data
  const handleExportData = () => {
    const dataStr = JSON.stringify(bmiHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bmi-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Fungsi untuk mendapatkan trend BMI
  const getBMITrend = () => {
    if (bmiHistory.length < 2) return null;
    
    const latest = bmiHistory[0];
    const previous = bmiHistory[1];
    const difference = latest.bmi - previous.bmi;
    
    return {
      direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
      value: Math.abs(difference),
      percentage: Math.abs((difference / previous.bmi) * 100)
    };
  };

  const trend = getBMITrend();

  // Fungsi untuk mendapatkan statistik
  const getStatistics = () => {
    if (bmiHistory.length === 0) return null;
    
    const bmis = bmiHistory.map(record => record.bmi);
    const weights = bmiHistory.map(record => record.weight);
    
    return {
      averageBMI: (bmis.reduce((a, b) => a + b, 0) / bmis.length).toFixed(1),
      minBMI: Math.min(...bmis).toFixed(1),
      maxBMI: Math.max(...bmis).toFixed(1),
      currentWeight: weights[0],
      weightChange: weights.length > 1 ? (weights[0] - weights[weights.length - 1]).toFixed(1) : '0'
    };
  };

  const stats = getStatistics();

  return (
    <>
      <MenuBarTop />
      <div className="min-h-screen bg-background pt-16 pb-20">
        <div className="max-w-md mx-auto px-4">
          
          {/* Header dengan navigasi kembali */}
          <div className="mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <History className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">Riwayat BMI</h1>
                  <p className="text-muted-foreground">
                    {bmiHistory.length > 0 ? `${bmiHistory.length} pencatatan tersimpan` : 'Belum ada data'}
                  </p>
                </div>
              </div>
          </div>

          {/* Statistik ringkas */}
          {stats && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">BMI Rata-rata</span>
                </div>
                <div className="text-xl font-bold text-amber-600">{stats.averageBMI}</div>
                <div className="text-xs text-muted-foreground">Range: {stats.minBMI} - {stats.maxBMI}</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Scale className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Perubahan Berat</span>
                </div>
                <div className={`text-xl font-bold ${parseFloat(stats.weightChange) > 0 ? 'text-red-600' : parseFloat(stats.weightChange) < 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {parseFloat(stats.weightChange) > 0 ? '+' : ''}{stats.weightChange} kg
                </div>
                <div className="text-xs text-muted-foreground">dari awal pencatatan</div>
              </div>
            </div>
          )}

          {/* Goals Statistics */}
          {bmiHistory.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Target Progress</span>
                </div>
                <div className="text-sm text-amber-600">
                  {bmiHistory.filter(record => record.hasGoals).length} dari {bmiHistory.length} memiliki target
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div 
                    className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(bmiHistory.filter(record => record.hasGoals).length / bmiHistory.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-amber-700 mt-1">
                  {Math.round((bmiHistory.filter(record => record.hasGoals).length / bmiHistory.length) * 100)}% pencatatan dengan target yang ditetapkan
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
                onChange={(e) => setFilterCategory(e.target.value)}
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
            
            {bmiHistory.length > 0 && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportData}
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
                {bmiHistory.length === 0 ? 'Belum Ada Riwayat' : 'Tidak Ada Data'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {bmiHistory.length === 0 
                  ? 'Mulai mencatat BMI Anda untuk melihat riwayat dan progress'
                  : `Tidak ada data untuk kategori ${filterCategory}`
                }
              </p>
              {bmiHistory.length === 0 && (
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
          <div className="space-y-4">
            {filteredHistory.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card border border-border rounded-lg p-4 shadow-sm ${getBMIBgColor(record.bmi)} ${record.hasGoals ? 'ring-2 ring-amber-200' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {new Date(record.date).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    {record.hasGoals && (
                      <span className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                        Target Set
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(record.category)}
                    <span className={`text-sm font-medium ${getBMIColor(record.bmi)}`}>
                      {record.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getBMIColor(record.bmi)}`}>
                      {record.bmi.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">BMI</div>
                    {record.hasGoals && record.idealTargets && (
                      <div className="text-xs text-amber-600 mt-1">
                        → {record.idealTargets.targetBMI}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {record.weight}kg
                    </div>
                    <div className="text-xs text-muted-foreground">Berat</div>
                    {record.hasGoals && record.idealTargets && (
                      <div className="text-xs text-amber-600 mt-1">
                        → {record.idealTargets.targetWeight}kg
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {record.targetCalories.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-muted-foreground">Kalori</div>
                    {record.hasGoals && record.idealTargets && (
                      <div className="text-xs text-amber-600 mt-1">
                        → {record.idealTargets.targetCalories.toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar untuk Goals */}
                {record.hasGoals && record.progress && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-amber-800">Progress Target:</span>
                      <span className="text-amber-600">
                        {record.idealTargets?.timeEstimate}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-amber-700">
                      {record.progress.weightDirection === 'maintain' ? 'Pertahankan berat badan' :
                       record.progress.weightDirection === 'gain' ? `Perlu menambah ${record.progress.weightRemaining.toFixed(1)} kg` :
                       `Perlu mengurangi ${record.progress.weightRemaining.toFixed(1)} kg`}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {record.healthStatus} • {record.height}cm • {record.age}th • {getActivityLevelText(record.activityLevel)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDeleteConfirm(record.id)}
                      className="p-1 text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Detail View */}
                {selectedRecord?.id === record.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Jenis Kelamin:</span>
                        <div className="font-medium">{record.gender === 'male' ? 'Pria' : 'Wanita'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Aktivitas:</span>
                        <div className="font-medium">{getActivityLevelText(record.activityLevel)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tinggi:</span>
                        <div className="font-medium">{record.height} cm</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Umur:</span>
                        <div className="font-medium">{record.age} tahun</div>
                      </div>
                    </div>

                    {/* Recommendations jika ada */}
                    {record.hasGoals && record.recommendations && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center space-x-2">
                          <Target className="w-4 h-4 text-amber-600" />
                          <span>Rekomendasi yang Ditetapkan:</span>
                        </h4>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                          <div className={`text-sm font-medium mb-2 ${record.recommendations.iconColor}`}>
                            {record.recommendations.title}
                          </div>
                          <div className="text-xs text-muted-foreground mb-3">
                            {record.recommendations.description}
                          </div>
                          <div className="space-y-2">
                            {record.recommendations.recommendations.slice(0, 3).map((rec, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  record.recommendations!.iconColor === 'text-blue-600' ? 'bg-blue-600' :
                                  record.recommendations!.iconColor === 'text-green-600' ? 'bg-green-600' :
                                  record.recommendations!.iconColor === 'text-yellow-600' ? 'bg-yellow-600' :
                                  'bg-red-600'
                                }`}>
                                  {idx + 1}
                                </div>
                                <p className="text-xs text-foreground leading-relaxed">{rec}</p>
                              </div>
                            ))}
                            {record.recommendations.recommendations.length > 3 && (
                              <div className="text-xs text-muted-foreground italic">
                                +{record.recommendations.recommendations.length - 3} rekomendasi lainnya
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border rounded-lg p-6 mx-4 max-w-sm w-full"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hapus Riwayat</h3>
                    <p className="text-sm text-muted-foreground">Apakah Anda yakin?</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                  Riwayat BMI yang dihapus tidak dapat dipulihkan.
                </p>
                
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-muted text-white py-2 px-4 rounded-md hover:bg-muted/80 transition-colors"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteRecord(showDeleteConfirm)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <MenuBar />
      </div>
    </>
  );
}
