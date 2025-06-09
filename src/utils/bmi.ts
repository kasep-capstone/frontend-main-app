import { BMIFormData, BMIResults, BMIIdealTargets, BMIRecommendations, BMIProgress, ActivityLevel, BMIRecord, BMIStatistics, BMITrend } from '@/types/bmi';
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Sedikit atau tidak ada olahraga', multiplier: 1.2 },
  { value: 'light', label: 'Light', description: 'Olahraga ringan 1-3 hari/minggu', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate', description: 'Olahraga sedang 3-5 hari/minggu', multiplier: 1.55 },
  { value: 'active', label: 'Active', description: 'Olahraga berat 6-7 hari/minggu', multiplier: 1.725 },
  { value: 'very_active', label: 'Very Active', description: 'Olahraga sangat berat + pekerjaan fisik', multiplier: 1.9 }
];

export const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  if (heightInMeters > 0 && weight > 0) {
    return weight / (heightInMeters * heightInMeters);
  }
  return 0;
};

export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female'): number => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const getHealthStatus = (bmi: number): string => {
  if (bmi < 18.5) return 'Berat Badan Kurang';
  if (bmi < 25) return 'Berat Badan Ideal';
  if (bmi < 30) return 'Berat Badan Berlebih';
  return 'Obesitas';
};

export const getBMIColor = (bmi: number): string => {
  if (bmi < 18.5) return 'text-blue-600';
  if (bmi < 25) return 'text-green-600';
  if (bmi < 30) return 'text-yellow-600';
  return 'text-red-600';
};

export const getBMIBgColor = (bmi: number): string => {
  if (bmi < 18.5) return 'bg-blue-50 border-blue-200';
  if (bmi < 25) return 'bg-green-50 border-green-200';
  if (bmi < 30) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
};

export const getTargetCalories = (
  weight: number, 
  height: number, 
  age: number, 
  gender: 'male' | 'female', 
  activityLevel: string,
  bmi: number
): number => {
  const bmr = calculateBMR(weight, height, age, gender);
  const selectedActivity = ACTIVITY_LEVELS.find(level => level.value === activityLevel);
  const activityMultiplier = selectedActivity ? selectedActivity.multiplier : 1.55;
  const dailyCalories = bmr * activityMultiplier;
  
  if (bmi < 18.5) {
    return Math.round(dailyCalories + 300);
  } else if (bmi < 25) {
    return Math.round(dailyCalories);
  } else if (bmi < 30) {
    return Math.round(dailyCalories - 300);
  } else {
    return Math.round(dailyCalories - 500);
  }
};

export const getIdealTargets = (height: number, weight: number, activityLevel: string, gender: 'male' | 'female', age: number): BMIIdealTargets => {
  const heightInMeters = height / 100;
  const currentBMI = calculateBMI(height, weight);
  
  // BMI ideal range: 18.5 - 24.9
  const minIdealWeight = Math.round(18.5 * heightInMeters * heightInMeters);
  const maxIdealWeight = Math.round(24.9 * heightInMeters * heightInMeters);
  const idealWeightRange = `${minIdealWeight}-${maxIdealWeight} kg`;
  
  // Target berdasarkan kondisi saat ini
  let targetWeight;
  if (currentBMI < 18.5) {
    targetWeight = Math.round(20 * heightInMeters * heightInMeters);
  } else if (currentBMI > 24.9) {
    targetWeight = Math.round(23 * heightInMeters * heightInMeters);
  } else {
    targetWeight = weight;
  }
  
  const targetBMI = '21.0';
  
  // Target kalori untuk mencapai berat ideal
  const bmr = calculateBMR(weight, height, age, gender);
  const selectedActivity = ACTIVITY_LEVELS.find(level => level.value === activityLevel);
  const activityMultiplier = selectedActivity ? selectedActivity.multiplier : 1.55;
  const maintenanceCalories = bmr * activityMultiplier;
  
  let targetCalories;
  if (currentBMI < 18.5) {
    targetCalories = Math.round(maintenanceCalories + 400);
  } else if (currentBMI > 24.9) {
    targetCalories = Math.round(maintenanceCalories - 400);
  } else {
    targetCalories = Math.round(maintenanceCalories);
  }
  
  const weightDifference = Math.abs(targetWeight - weight);
  const timeEstimate = weightDifference <= 2 ? '1-2 bulan' : 
                     weightDifference <= 5 ? '2-4 bulan' :
                     weightDifference <= 10 ? '4-8 bulan' : '8-12 bulan';
  
  return {
    weightRange: idealWeightRange,
    targetWeight,
    targetBMI,
    targetCalories,
    timeEstimate
  };
};

export const getRecommendations = (bmi: number): BMIRecommendations => {
  if (bmi < 18.5) {
    return {
      icon: 'TrendingUp',
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
      icon: 'CheckCircle',
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
      icon: 'TrendingDown',
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
      icon: 'AlertCircle',
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

export const getProgressRemaining = (
  currentWeight: number,
  currentBMI: number,
  targetCalories: number,
  idealTargets: BMIIdealTargets
): BMIProgress => {
  const weightDifference = idealTargets.targetWeight - currentWeight;
  const calorieDifference = idealTargets.targetCalories - targetCalories;
  const bmiDifference = parseFloat(idealTargets.targetBMI) - currentBMI;
  
  return {
    weightRemaining: Math.abs(weightDifference),
    weightDirection: weightDifference > 0 ? 'gain' : weightDifference < 0 ? 'lose' : 'maintain',
    calorieAdjustment: Math.abs(calorieDifference),
    calorieDirection: calorieDifference > 0 ? 'increase' : calorieDifference < 0 ? 'decrease' : 'maintain',
    bmiRemaining: Math.abs(bmiDifference),
    bmiDirection: bmiDifference > 0 ? 'increase' : bmiDifference < 0 ? 'decrease' : 'maintain'
  };
};

export const processFormData = (formData: BMIFormData): BMIResults => {
  const height = parseFloat(formData.height);
  const weight = parseFloat(formData.weight);
  const age = parseFloat(formData.age);
  
  const bmi = calculateBMI(height, weight);
  const category = getBMICategory(bmi);
  const healthStatus = getHealthStatus(bmi);
  const bmr = calculateBMR(weight, height, age, formData.gender);
  const targetCalories = getTargetCalories(weight, height, age, formData.gender, formData.activityLevel, bmi);
  
  return {
    bmi,
    category,
    healthStatus,
    targetCalories,
    bmr
  };
};

export const getBMIStatistics = (history: BMIRecord[]): BMIStatistics | null => {
  if (history.length === 0) return null;
  
  const bmis = history.map(record => record.bmi);
  const weights = history.map(record => record.weight);
  
  return {
    averageBMI: (bmis.reduce((a, b) => a + b, 0) / bmis.length).toFixed(1),
    minBMI: Math.min(...bmis).toFixed(1),
    maxBMI: Math.max(...bmis).toFixed(1),
    currentWeight: weights[0],
    weightChange: weights.length > 1 ? (weights[0] - weights[weights.length - 1]).toFixed(1) : '0'
  };
};

export const getBMITrend = (history: BMIRecord[]): BMITrend | null => {
  if (history.length < 2) return null;
  
  const latest = history[0];
  const previous = history[1];
  const difference = latest.bmi - previous.bmi;
  
  return {
    direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
    value: Math.abs(difference),
    percentage: Math.abs((difference / previous.bmi) * 100)
  };
};

export const getActivityLevelText = (activityLevel: string): string => {
  switch (activityLevel.toLowerCase()) {
    case 'sedentary': return 'Tidak Aktif';
    case 'light': return 'Ringan';
    case 'moderate': return 'Sedang';
    case 'active': return 'Aktif';
    case 'very_active': return 'Sangat Aktif';
    default: return activityLevel;
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 