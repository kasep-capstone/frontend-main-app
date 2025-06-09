export interface BMIRecord {
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
  idealTargets?: BMIIdealTargets;
  recommendations?: BMIRecommendations;
  progress?: BMIProgress;
}

export interface BMIIdealTargets {
  weightRange: string;
  targetWeight: number;
  targetBMI: string;
  targetCalories: number;
  timeEstimate: string;
}

export interface BMIRecommendations {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  recommendations: string[];
}

export interface BMIProgress {
  weightRemaining: number;
  weightDirection: 'gain' | 'lose' | 'maintain';
  calorieAdjustment: number;
  calorieDirection: 'increase' | 'decrease' | 'maintain';
  bmiRemaining: number;
  bmiDirection: 'increase' | 'decrease' | 'maintain';
}

export interface ActivityLevel {
  value: string;
  label: string;
  description: string;
  multiplier: number;
}

export interface BMIFormData {
  height: string;
  weight: string;
  age: string;
  gender: 'male' | 'female';
  activityLevel: string;
}

export interface BMIResults {
  bmi: number;
  category: string;
  healthStatus: string;
  targetCalories: number;
  bmr: number;
}

export interface BMIStatistics {
  averageBMI: string;
  minBMI: string;
  maxBMI: string;
  currentWeight: number;
  weightChange: string;
}

export interface BMITrend {
  direction: 'up' | 'down' | 'stable';
  value: number;
  percentage: number;
}

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';
export type FilterCategory = 'all' | 'with-goals' | 'without-goals' | BMICategory; 