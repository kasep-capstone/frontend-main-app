'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MenuBarTop } from '@/components/menu-bar-top';
import { MenuBar } from '@/components/menu-bar';
import { Calculator, Heart, Target, Activity, Zap, ChevronDown, ChevronUp, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Flag, Clock, Scale, History, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function BmiPage() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('80');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate'); // Default to moderate
  const [isActivityExpanded, setIsActivityExpanded] = useState(false);
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState(false);
  const [hasSetGoals, setHasSetGoals] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [lastRecordDate, setLastRecordDate] = useState<string | null>(null);

  // Load history count dan data terakhir saat component mount
  React.useEffect(() => {
    const existingHistory = localStorage.getItem('bmiHistory');
    if (existingHistory) {
      const history = JSON.parse(existingHistory);
      setHistoryCount(history.length);
      
      // Ambil data terakhir untuk mengisi form
      if (history.length > 0) {
        const lastRecord = history[0]; // Data terakhir ada di index 0
        setHeight(lastRecord.height.toString());
        setWeight(lastRecord.weight.toString());
        setAge(lastRecord.age.toString());
        setGender(lastRecord.gender);
        setActivityLevel(lastRecord.activityLevel);
        if (lastRecord.hasGoals) {
          setHasSetGoals(true);
        }
        setIsDataLoaded(true);
        setLastRecordDate(lastRecord.date);
      }
    }
  }, []);

  // Activity level options with multipliers
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Sedikit atau tidak ada olahraga', multiplier: 1.2 },
    { value: 'light', label: 'Light', description: 'Olahraga ringan 1-3 hari/minggu', multiplier: 1.375 },
    { value: 'moderate', label: 'Moderate', description: 'Olahraga sedang 3-5 hari/minggu', multiplier: 1.55 },
    { value: 'active', label: 'Active', description: 'Olahraga berat 6-7 hari/minggu', multiplier: 1.725 },
    { value: 'very_active', label: 'Very Active', description: 'Olahraga sangat berat + pekerjaan fisik', multiplier: 1.9 }
  ];

  // Fungsi untuk menghitung BMI
  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (heightInMeters > 0 && weightInKg > 0) {
      return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '0.0';
  };

  // Fungsi untuk menghitung BMR (Basal Metabolic Rate)
  const calculateBMR = () => {
    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageInYears = parseFloat(age);
    
    if (gender === 'male') {
      return Math.round(88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageInYears));
    } else {
      return Math.round(447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageInYears));
    }
  };

  // Fungsi untuk mendapatkan target kalori berdasarkan BMI dan aktivitas
  const getTargetCalories = (bmi: number) => {
    const bmr = calculateBMR();
    const selectedActivity = activityLevels.find(level => level.value === activityLevel);
    const activityMultiplier = selectedActivity ? selectedActivity.multiplier : 1.55; // Default to moderate
    const dailyCalories = bmr * activityMultiplier;
    
    if (bmi < 18.5) {
      // Underweight - perlu surplus kalori
      return Math.round(dailyCalories + 300);
    } else if (bmi < 25) {
      // Normal - maintenance
      return Math.round(dailyCalories);
    } else if (bmi < 30) {
      // Overweight - deficit kalori ringan
      return Math.round(dailyCalories - 300);
    } else {
      // Obese - deficit kalori sedang
      return Math.round(dailyCalories - 500);
    }
  };

  // Fungsi untuk mendapatkan kategori BMI
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Fungsi untuk mendapatkan status kesehatan
  const getHealthStatus = (bmi: number) => {
    if (bmi < 18.5) return 'Berat Badan Kurang';
    if (bmi < 25) return 'Berat Badan Ideal';
    if (bmi < 30) return 'Berat Badan Berlebih';
    return 'Obesitas';
  };

  // Fungsi untuk mendapatkan warna berdasarkan kategori BMI
  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const bmiValue = parseFloat(calculateBMI());
  const bmiCategory = getBMICategory(bmiValue);
  const healthStatus = getHealthStatus(bmiValue);
  const targetCalories = getTargetCalories(bmiValue);
  const bmiColorClass = getBMIColor(bmiValue);

  // Fungsi untuk mendapatkan rekomendasi berdasarkan BMI
  const getRecommendations = (bmi: number) => {
    if (bmi < 18.5) {
      return {
        icon: TrendingUp,
        iconColor: 'text-blue-600',
        title: 'Tingkatkan Berat Badan',
        description: 'BMI Anda menunjukkan berat badan kurang. Berikut rekomendasi untuk mencapai berat ideal:',
        recommendations: [
          'Tambahkan 300-500 kalori dari target harian Anda',
          'Konsumsi makanan bernutrisi tinggi seperti kacang-kacangan, alpukat, dan protein',
          'Lakukan strength training 3-4x seminggu untuk membangun massa otot',
          'Makan dalam porsi kecil tapi sering (5-6x sehari)',
          'Konsultasi dengan ahli gizi untuk program penambahan berat badan yang sehat'
        ]
      };
    } else if (bmi < 25) {
      return {
        icon: CheckCircle,
        iconColor: 'text-green-600',
        title: 'Pertahankan Berat Ideal',
        description: 'Selamat! BMI Anda sudah ideal. Pertahankan dengan tips berikut:',
        recommendations: [
          'Pertahankan target kalori harian sesuai rekomendasi',
          'Kombinasikan cardio (150 menit/minggu) dan strength training (2x/minggu)',
          'Konsumsi makanan seimbang: 50% karbohidrat, 25% protein, 25% lemak sehat',
          'Minum air putih minimal 8 gelas per hari',
          'Tidur cukup 7-9 jam setiap malam untuk menjaga metabolisme'
        ]
      };
    } else if (bmi < 30) {
      return {
        icon: TrendingDown,
        iconColor: 'text-yellow-600',
        title: 'Turunkan Berat Badan',
        description: 'BMI Anda menunjukkan berat badan berlebih. Ikuti rekomendasi ini untuk mencapai berat ideal:',
        recommendations: [
          'Kurangi 300-500 kalori dari target harian Anda',
          'Tingkatkan aktivitas cardio menjadi 150-300 menit per minggu',
          'Tambahkan strength training 2-3x seminggu',
          'Pilih makanan rendah kalori tinggi serat seperti sayuran dan buah-buahan',
          'Hindari makanan olahan dan minuman manis'
        ]
      };
    } else {
      return {
        icon: AlertCircle,
        iconColor: 'text-red-600',
        title: 'Program Penurunan Berat Badan',
        description: 'BMI Anda menunjukkan obesitas. Diperlukan program penurunan berat badan yang terstruktur:',
        recommendations: [
          'Konsultasi dengan dokter atau ahli gizi untuk program yang aman',
          'Kurangi 500-750 kalori dari target harian Anda',
          'Mulai dengan aktivitas ringan seperti jalan kaki 30 menit setiap hari',
          'Fokus pada makanan whole foods dan hindari makanan olahan',
          'Pertimbangkan program diet terstruktur dengan pengawasan profesional'
        ]
      };
    }
  };

  const recommendations = getRecommendations(bmiValue);

  // Fungsi untuk menghitung target ideal
  const getIdealTargets = () => {
    const heightInMeters = parseFloat(height) / 100;
    const currentWeight = parseFloat(weight);
    
    // BMI ideal range: 18.5 - 24.9
    const minIdealWeight = Math.round(18.5 * heightInMeters * heightInMeters);
    const maxIdealWeight = Math.round(24.9 * heightInMeters * heightInMeters);
    const idealWeightRange = `${minIdealWeight}-${maxIdealWeight} kg`;
    
    // Target berdasarkan kondisi saat ini
    let targetWeight;
    if (bmiValue < 18.5) {
      // Underweight: target ke batas bawah ideal + buffer
      targetWeight = Math.round(20 * heightInMeters * heightInMeters);
    } else if (bmiValue > 24.9) {
      // Overweight/Obese: target ke batas atas ideal
      targetWeight = Math.round(23 * heightInMeters * heightInMeters);
    } else {
      // Normal: pertahankan
      targetWeight = currentWeight;
    }
    
    // Target BMI ideal
    const targetBMI = '21.0'; // BMI optimal di tengah range
    
    // Target kalori untuk mencapai berat ideal
    const targetCaloriesForIdeal = (() => {
      const bmr = calculateBMR();
      const selectedActivity = activityLevels.find(level => level.value === activityLevel);
      const activityMultiplier = selectedActivity ? selectedActivity.multiplier : 1.55;
      const maintenanceCalories = bmr * activityMultiplier;
      
      if (bmiValue < 18.5) {
        return Math.round(maintenanceCalories + 400); // Surplus untuk gain
      } else if (bmiValue > 24.9) {
        return Math.round(maintenanceCalories - 400); // Deficit untuk loss
      } else {
        return Math.round(maintenanceCalories); // Maintenance
      }
    })();
    
    return {
      weightRange: idealWeightRange,
      targetWeight,
      targetBMI,
      targetCalories: targetCaloriesForIdeal,
      timeEstimate: Math.abs(targetWeight - currentWeight) <= 2 ? '1-2 bulan' : 
                   Math.abs(targetWeight - currentWeight) <= 5 ? '2-4 bulan' :
                   Math.abs(targetWeight - currentWeight) <= 10 ? '4-8 bulan' : '8-12 bulan'
    };
  };

  const idealTargets = getIdealTargets();

  // Fungsi untuk menghitung sisa progress
  const getProgressRemaining = () => {
    const currentWeight = parseFloat(weight);
    const weightDifference = idealTargets.targetWeight - currentWeight;
    const calorieDifference = idealTargets.targetCalories - targetCalories;
    const bmiDifference = parseFloat(idealTargets.targetBMI) - bmiValue;
    
    return {
      weightRemaining: Math.abs(weightDifference),
      weightDirection: weightDifference > 0 ? 'gain' : weightDifference < 0 ? 'lose' : 'maintain',
      calorieAdjustment: Math.abs(calorieDifference),
      calorieDirection: calorieDifference > 0 ? 'increase' : calorieDifference < 0 ? 'decrease' : 'maintain',
      bmiRemaining: Math.abs(bmiDifference),
      bmiDirection: bmiDifference > 0 ? 'increase' : bmiDifference < 0 ? 'decrease' : 'maintain'
    };
  };

  const progress = getProgressRemaining();

  // Format tanggal untuk tampilan
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShowPreview = () => {
    setShowPreviewModal(true);
  };

  const handleSaveWithGoals = () => {
    setHasSetGoals(true);
    handleSaveData(true);
    setShowPreviewModal(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSaveWithoutGoals = () => {
    handleSaveData(false);
    setShowPreviewModal(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCancelPreview = () => {
    setShowPreviewModal(false);
  };

  const handleSaveData = (withGoals: boolean) => {
    // Simpan data BMI ke localStorage dengan atau tanpa goals
    const baseRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      height: parseFloat(height),
      weight: parseFloat(weight),
      age: parseFloat(age),
      gender: gender as 'male' | 'female',
      activityLevel: activityLevel,
      bmi: bmiValue,
      category: bmiCategory,
      healthStatus: healthStatus,
      targetCalories: targetCalories,
      hasGoals: withGoals
    };

    // Jika user pilih simpan dengan goals, tambahkan data rekomendasi dan target
    const bmiRecord = withGoals ? {
      ...baseRecord,
      idealTargets: idealTargets,
      recommendations: {
        ...recommendations,
        icon: 'Activity' // Simplified icon name for storage
      },
      progress: progress
    } : baseRecord;

    // Ambil history yang sudah ada
    const existingHistory = localStorage.getItem('bmiHistory');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Tambahkan record baru di awal array
    const updatedHistory = [bmiRecord, ...history];
    
    // Batasi history maksimal 50 record
    if (updatedHistory.length > 50) {
      updatedHistory.splice(50);
    }
    
    // Simpan ke localStorage
    localStorage.setItem('bmiHistory', JSON.stringify(updatedHistory));
    
    // Update history count
    setHistoryCount(updatedHistory.length);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <MenuBarTop />
      <div className="min-h-screen bg-background pt-16 pb-20">
        <div className="max-w-md mx-auto px-4">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Calculator className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">BMI Kalkulator</h1>
                <p className="text-muted-foreground">
                  Track kalori dan BMI Anda
                </p>
              </div>
              <Link href="/bmi/history">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center"
                >
                  <History className="w-6 h-6 text-amber-600" />
                  {historyCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {historyCount > 99 ? '99+' : historyCount}
                    </div>
                  )}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Main Stats Cards */}
          {historyCount > 0 && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Stats dihitung berdasarkan data terakhir
                  </span>
                </div>
                {lastRecordDate && (
                  <span className="text-xs text-amber-700 font-medium">
                    {formatDate(lastRecordDate)}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="space-y-4 mb-6">
            {/* Target Calories Card */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold">Target Kalori Harian</h3>
                </div>
                {hasSetGoals && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium shadow-sm">Goals Set</span>
                )}
              </div>
              
              {hasSetGoals ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-muted-foreground">{targetCalories.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Saat ini</div>
                    </div>
                    <div className="mx-4">
                      <div className="w-8 h-0.5 bg-amber-400 rounded-full shadow-sm"></div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-amber-600">{idealTargets.targetCalories.toLocaleString()}</div>
                      <div className="text-xs text-amber-600">Target</div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium text-amber-800">
                      {progress.calorieDirection === 'maintain' ? 'Pertahankan kalori saat ini' :
                       progress.calorieDirection === 'increase' ? `Tambah ${progress.calorieAdjustment} kalori/hari` :
                       `Kurangi ${progress.calorieAdjustment} kalori/hari`}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{targetCalories.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">kalori per hari</div>
                </div>
              )}
            </div>

            {/* BMI and Health Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">BMI</span>
                </div>
                
                {hasSetGoals ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Saat ini:</span>
                      <span className={`font-bold ${bmiColorClass}`}>{calculateBMI()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Target:</span>
                      <span className="font-bold text-green-600">{idealTargets.targetBMI}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1">
                      <div className="text-xs text-amber-800 text-center font-medium">
                        {progress.bmiDirection === 'maintain' ? 'BMI sudah ideal' :
                         progress.bmiDirection === 'increase' ? `+${progress.bmiRemaining.toFixed(1)} untuk target` :
                         `-${progress.bmiRemaining.toFixed(1)} untuk target`}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-xl font-bold ${bmiColorClass}`}>{calculateBMI()}</div>
                )}
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                
                {hasSetGoals ? (
                  <div className="space-y-2">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Saat ini:</span>
                      <div className={`text-sm font-semibold ${bmiColorClass}`}>{healthStatus}</div>
                      <div className={`text-xs ${bmiColorClass}`}>{bmiCategory}</div>
                    </div>
                    <div className="text-xs">
                      <span className="text-green-600">Target:</span>
                      <div className="text-sm font-semibold text-green-600">Berat Badan Ideal</div>
                      <div className="text-xs text-green-600">Normal</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1">
                      <div className="text-xs text-amber-800 text-center font-medium">
                        {progress.weightDirection === 'maintain' ? 'Pertahankan!' :
                         progress.weightDirection === 'gain' ? `+${progress.weightRemaining.toFixed(1)} kg lagi` :
                         `-${progress.weightRemaining.toFixed(1)} kg lagi`}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={`text-sm font-semibold ${bmiColorClass}`}>{healthStatus}</div>
                    <div className={`text-xs ${bmiColorClass}`}>{bmiCategory}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Pengukuran Terkini</h3>
              {historyCount > 0 && (
                <span className="text-xs bg-green-50 text-green-800 px-3 py-1 rounded-full font-medium shadow-sm">
                  Data terakhir dimuat
                </span>
              )}
            </div>
            
            {/* Age and Gender */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Umur</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="male">Pria</option>
                  <option value="female">Wanita</option>
                </select>
              </div>
            </div>

            {/* Height and Weight with Silhouette */}
            <div className="flex items-center justify-center w-full px-2">
              {/* Siluet Gambar */}
              <img src="/boy-siluet.png" alt="Boy Silhouette" className="w-20 sm:w-28 md:w-32 h-64 sm:h-80 md:h-96 object-contain mr-4 sm:mr-6 md:mr-8 opacity-90 filter sepia brightness-[0.4] saturate-150 hue-rotate-15 drop-shadow-lg transition-all duration-300 hover:opacity-100 hover:brightness-[0.5]" />
              <div className="flex flex-col justify-center">
                {/* Tinggi */}
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="flex flex-col text-foreground items-center">
                    <div className="flex flex-col items-center mr-2 sm:mr-4">
                      <div className="w-0 h-0 border-x-4 sm:border-x-6 md:border-x-8 border-x-transparent border-b-[8px] sm:border-b-[12px] md:border-b-[16px] border-gray-400"></div>
                      <div className="w-0.5 sm:w-1 h-8 sm:h-12 md:h-16 bg-gray-400"></div>
                    </div>
                    <div className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3 text-center">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-16 sm:w-20 md:w-24 bg-transparent text-2xl sm:text-4xl md:text-5xl font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-sm sm:text-base md:text-lg font-normal ml-[-5px] sm:ml-[-8px] md:ml-[-10px]">cm</span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Height</span>
                    <div className="flex flex-col items-center mr-2 sm:mr-4">
                      <div className="w-0.5 sm:w-1 h-8 sm:h-12 md:h-16 bg-gray-400"></div>
                      <div className="w-0 h-0 border-x-4 sm:border-x-6 md:border-x-8 border-x-transparent border-t-[8px] sm:border-t-[12px] md:border-t-[16px] border-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Berat */}
            <div className="flex flex-col text-foreground items-center w-full">
              <div className='flex flex-col items-center'>
                <div className="flex items-center ml-2 sm:ml-4">
                  <div className="w-0 h-0 border-y-4 sm:border-y-6 md:border-y-8 border-y-transparent border-r-[8px] sm:border-r-[12px] md:border-r-[16px] border-gray-400"></div>
                  <div className="w-24 sm:w-32 md:w-36 h-0.5 sm:h-1 bg-gray-400"></div>
                  <div className="w-0 h-0 border-y-4 sm:border-y-6 md:border-y-8 border-y-transparent border-l-[8px] sm:border-l-[12px] md:border-l-[16px] border-gray-400"></div>
                </div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3 text-center">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-14 sm:w-18 md:w-20 bg-transparent text-2xl sm:text-4xl md:text-5xl font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm sm:text-base md:text-lg font-normal ml-[-5px] sm:ml-[-8px] md:ml-[-10px]">kg</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground mt-1">Weight</span>
              </div>
            </div>
          </div>

          {/* Activity Level Section - Optional */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold">Tingkat Aktivitas Harian</h3>
                {historyCount > 0 && (
                  <span className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded-full font-medium shadow-sm">
                    Tersimpan
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white bg-muted px-2 py-1 rounded-full">Opsional</span>
                <motion.button
                  onClick={() => setIsActivityExpanded(!isActivityExpanded)}
                  className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActivityExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>
            
            {!isActivityExpanded && (
              <div className="text-sm text-muted-foreground">
                Saat ini menggunakan tingkat aktivitas: <span className="font-medium text-foreground">{activityLevels.find(level => level.value === activityLevel)?.label}</span>
              </div>
            )}
            
            <motion.div
              initial={false}
              animate={{
                height: isActivityExpanded ? 'auto' : 0,
                opacity: isActivityExpanded ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Pilih tingkat aktivitas untuk perkiraan kalori yang lebih akurat
                </p>
                
                <div className="space-y-3">
                  {activityLevels.map((level) => (
                    <div key={level.value} className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id={level.value}
                        name="activityLevel"
                        value={level.value}
                        checked={activityLevel === level.value}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="mt-1 w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500 focus:ring-2"
                      />
                      <label htmlFor={level.value} className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm">{level.label}</div>
                        <div className="text-xs text-muted-foreground">{level.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShowPreview}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 mb-6"
          >
            Simpan Pengukuran
          </motion.button>

                    {/* Recommendations Section */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  recommendations.iconColor === 'text-blue-600' ? 'bg-blue-100' :
                  recommendations.iconColor === 'text-green-600' ? 'bg-green-100' :
                  recommendations.iconColor === 'text-yellow-600' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <recommendations.icon className={`w-5 h-5 ${recommendations.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{recommendations.title}</h3>
                  <p className="text-sm text-muted-foreground">Rekomendasi Personal</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsRecommendationsExpanded(!isRecommendationsExpanded)}
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{isRecommendationsExpanded ? 'Sembunyikan' : 'Lihat Detail'}</span>
                {isRecommendationsExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </motion.button>
            </div>
            
            {!isRecommendationsExpanded && (
              <div className="text-sm text-muted-foreground mb-4">
                <p className="mb-2">{recommendations.description}</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-amber-800">
                    📋 {recommendations.recommendations.length} rekomendasi tersedia - klik "Lihat Detail" untuk melihat semua tips
                  </div>
                </div>
              </div>
            )}
            
            <motion.div
              initial={false}
              animate={{
                height: isRecommendationsExpanded ? 'auto' : 0,
                opacity: isRecommendationsExpanded ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {recommendations.description}
                </p>
                
                <div className="space-y-3">
                  {recommendations.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        recommendations.iconColor === 'text-blue-600' ? 'bg-blue-600' :
                        recommendations.iconColor === 'text-green-600' ? 'bg-green-600' :
                        recommendations.iconColor === 'text-yellow-600' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}>
                        {index + 1}
                      </div>
                      <p className="text-sm text-foreground flex-1 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
                
                {/* Additional tip based on BMI category */}
                <div className={`mt-4 p-3 rounded-lg ${
                  recommendations.iconColor === 'text-blue-600' ? 'bg-blue-50 border border-blue-200' :
                  recommendations.iconColor === 'text-green-600' ? 'bg-green-50 border border-green-200' :
                  recommendations.iconColor === 'text-yellow-600' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Heart className={`w-4 h-4 ${recommendations.iconColor}`} />
                    <span className={`text-sm font-medium ${recommendations.iconColor}`}>
                      Tips Tambahan:
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bmiValue < 18.5 ? 'Ingat, penambahan berat badan yang sehat adalah 0.5-1 kg per minggu.' :
                     bmiValue < 25 ? 'Lakukan pemeriksaan BMI secara rutin setiap bulan untuk memantau kondisi tubuh.' :
                     bmiValue < 30 ? 'Target penurunan berat badan yang sehat adalah 0.5-1 kg per minggu.' :
                     'Konsultasi rutin dengan profesional kesehatan sangat direkomendasikan untuk kondisi Anda.'}
                  </p>
                </div>
              </div>
            </motion.div>

             {/* Ideal Targets Section */}
             <div className="mt-6 border-t border-border pt-6">
               <div className="flex items-center space-x-2 mb-4">
                 <Flag className="w-5 h-5 text-amber-600" />
                 <h4 className="font-semibold text-lg">Target Ideal Anda</h4>
               </div>
               
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Scale className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Berat Badan Ideal</span>
                    </div>
                    <div className="text-xl font-bold text-amber-700">{idealTargets.targetWeight} kg</div>
                    <div className="text-xs text-amber-600">Range: {idealTargets.weightRange}</div>
                  </div>
                 
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Target BMI</span>
                    </div>
                    <div className="text-xl font-bold text-green-700">{idealTargets.targetBMI}</div>
                    <div className="text-xs text-green-600">BMI Optimal</div>
                  </div>
               </div>
               
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Target Kalori</span>
                    </div>
                    <div className="text-xl font-bold text-blue-700">{idealTargets.targetCalories.toLocaleString()}</div>
                    <div className="text-xs text-blue-600">kalori/hari</div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Estimasi Waktu</span>
                    </div>
                    <div className="text-xl font-bold text-yellow-700">{idealTargets.timeEstimate}</div>
                    <div className="text-xs text-yellow-600">dengan konsistensi</div>
                  </div>
                </div>
               
               {/* Set Goals Button - Now shown as info only */}
               <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                 <div className="flex items-center justify-center space-x-2 mb-2">
                   <Target className="w-5 h-5 text-amber-600" />
                   <span className="text-sm font-medium text-amber-800">Target Personal</span>
                 </div>
                 <p className="text-xs text-amber-700">
                   Gunakan tombol "Simpan Pengukuran" untuk melihat preview dan opsi menetapkan target
                 </p>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card border border-border rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
                  <Calculator className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Preview Pengukuran BMI</h3>
                  <p className="text-sm text-muted-foreground">Tinjau data dan pilih cara menyimpan</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Current Data Summary */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-amber-600" />
                  <span>Ringkasan Data Anda</span>
                </h4>
                
                <div className="space-y-3">
                  {/* Basic Info */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-amber-600 font-medium">Umur:</span>
                        <div className="font-bold">{age} tahun</div>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Jenis Kelamin:</span>
                        <div className="font-bold">{gender === 'male' ? 'Pria' : 'Wanita'}</div>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Tinggi:</span>
                        <div className="font-bold">{height} cm</div>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Berat:</span>
                        <div className="font-bold">{weight} kg</div>
                      </div>
                    </div>
                  </div>

                  {/* BMI Result */}
                  <div className="bg-muted/30 border border-border rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">BMI & Status Kesehatan</div>
                      <div className={`text-2xl font-bold ${bmiColorClass} mb-1`}>{calculateBMI()}</div>
                      <div className={`text-sm font-semibold ${bmiColorClass} mb-1`}>{healthStatus}</div>
                      <div className={`text-xs ${bmiColorClass}`}>{bmiCategory}</div>
                    </div>
                  </div>

                  {/* Activity & Calories */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Aktivitas:</span>
                        <div className="font-bold">{activityLevels.find(level => level.value === activityLevel)?.label}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-blue-600 font-medium">Target Kalori:</span>
                        <div className="font-bold">{targetCalories.toLocaleString()} cal/hari</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations Preview */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <recommendations.icon className={`w-4 h-4 ${recommendations.iconColor}`} />
                  <span>Rekomendasi untuk Anda</span>
                </h4>
                
                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <div className="text-center mb-3">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      recommendations.iconColor === 'text-blue-600' ? 'bg-blue-50 text-blue-800' :
                      recommendations.iconColor === 'text-green-600' ? 'bg-green-50 text-green-800' :
                      recommendations.iconColor === 'text-yellow-600' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-red-50 text-red-800'
                    }`}>
                      <recommendations.icon className="w-4 h-4" />
                      <span>{recommendations.title}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 text-center">{recommendations.description}</p>
                  
                  <div className="space-y-2">
                    {recommendations.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          recommendations.iconColor === 'text-blue-600' ? 'bg-blue-600' :
                          recommendations.iconColor === 'text-green-600' ? 'bg-green-600' :
                          recommendations.iconColor === 'text-yellow-600' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}>
                          {index + 1}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                      </div>
                    ))}
                    {recommendations.recommendations.length > 2 && (
                      <div className="text-xs text-muted-foreground italic ml-7">
                        +{recommendations.recommendations.length - 2} rekomendasi lainnya akan tersimpan
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Target Preview (if with goals) */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Target Ideal (Opsional)</span>
                </h4>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-green-800 font-medium mb-1">Target BMI</div>
                      <div className="text-lg font-bold text-green-600">{idealTargets.targetBMI}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-800 font-medium mb-1">Target Berat</div>
                      <div className="text-lg font-bold text-green-600">{idealTargets.targetWeight} kg</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-800 font-medium mb-1">Target Kalori</div>
                      <div className="text-lg font-bold text-green-600">{idealTargets.targetCalories.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-800 font-medium mb-1">Estimasi Waktu</div>
                      <div className="text-lg font-bold text-green-600">{idealTargets.timeEstimate}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-800">Pilihan Penyimpanan:</div>
                    <div className="text-xs text-blue-700 mt-1">
                      • <strong>Simpan Saja:</strong> Menyimpan data pengukuran tanpa menetapkan target<br/>
                      • <strong>Simpan + Target:</strong> Menyimpan data dengan target dan rencana kesehatan personal
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col space-y-3 p-6 border-t border-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveWithGoals}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium shadow-md"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Simpan + Tetapkan Target</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveWithoutGoals}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Simpan Saja</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelPreview}
                className="w-full bg-muted text-white py-3 px-4 rounded-lg hover:bg-muted/80 transition-colors font-medium"
              >
                Batal
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <MenuBar />
      </div>
    </>
  );
};