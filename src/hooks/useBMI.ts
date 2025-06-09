import { useState, useEffect, useCallback } from 'react';
import { BMIFormData, BMIResults, BMIIdealTargets, BMIRecommendations, BMIProgress } from '@/types/bmi';
import { 
  processFormData, 
  getIdealTargets, 
  getRecommendations, 
  getProgressRemaining,
  ACTIVITY_LEVELS 
} from '@/utils/bmi';
import { BMIService } from '@/services/bmiService';

export const useBMI = () => {
  const [formData, setFormData] = useState<BMIFormData>({
    height: '170',
    weight: '80',
    age: '25',
    gender: 'male',
    activityLevel: 'moderate'
  });

  const [results, setResults] = useState<BMIResults | null>(null);
  const [idealTargets, setIdealTargets] = useState<BMIIdealTargets | null>(null);
  const [recommendations, setRecommendations] = useState<BMIRecommendations | null>(null);
  const [progress, setProgress] = useState<BMIProgress | null>(null);
  const [hasSetGoals, setHasSetGoals] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data from latest record on mount
  useEffect(() => {
    const latestRecord = BMIService.getLatestBMIRecord();
    if (latestRecord) {
      setFormData({
        height: latestRecord.height.toString(),
        weight: latestRecord.weight.toString(),
        age: latestRecord.age.toString(),
        gender: latestRecord.gender,
        activityLevel: latestRecord.activityLevel
      });
      
      if (latestRecord.hasGoals) {
        setHasSetGoals(true);
      }
      
      setIsDataLoaded(true);
    }
  }, []);

  // Calculate results whenever form data changes
  useEffect(() => {
    const newResults = processFormData(formData);
    setResults(newResults);

    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const age = parseFloat(formData.age);

    const newIdealTargets = getIdealTargets(height, weight, formData.activityLevel, formData.gender, age);
    setIdealTargets(newIdealTargets);

    const newRecommendations = getRecommendations(newResults.bmi);
    setRecommendations(newRecommendations);

    const newProgress = getProgressRemaining(weight, newResults.bmi, newResults.targetCalories, newIdealTargets);
    setProgress(newProgress);
  }, [formData]);

  const updateFormData = useCallback((updates: Partial<BMIFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      height: '170',
      weight: '80',
      age: '25',
      gender: 'male',
      activityLevel: 'moderate'
    });
    setHasSetGoals(false);
    setIsDataLoaded(false);
  }, []);

  const saveRecord = useCallback((withGoals: boolean = false) => {
    if (!results || !idealTargets || !recommendations || !progress) {
      throw new Error('Missing calculation results');
    }

    const baseRecord = {
      id: BMIService.generateRecordId(),
      date: new Date().toISOString(),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      age: parseFloat(formData.age),
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      bmi: results.bmi,
      category: results.category,
      healthStatus: results.healthStatus,
      targetCalories: results.targetCalories,
      hasGoals: withGoals
    };

    const recordToSave = withGoals ? {
      ...baseRecord,
      idealTargets,
      recommendations,
      progress
    } : baseRecord;

    const updatedHistory = BMIService.saveBMIRecord(recordToSave);
    setHasSetGoals(withGoals);
    
    return updatedHistory;
  }, [formData, results, idealTargets, recommendations, progress]);

  return {
    // Form state
    formData,
    updateFormData,
    resetForm,
    
    // Calculation results
    results,
    idealTargets,
    recommendations,
    progress,
    
    // Meta state
    hasSetGoals,
    setHasSetGoals,
    isDataLoaded,
    
    // Actions
    saveRecord,
    
    // Constants
    activityLevels: ACTIVITY_LEVELS
  };
}; 