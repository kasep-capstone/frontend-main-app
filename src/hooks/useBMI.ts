'use client'
import { useState, useEffect, useCallback } from 'react';
import { BMIFormData, BMIResults, BMIIdealTargets, BMIRecommendations, BMIProgress, ActivityLevel, BMIRecord } from '@/types/bmi';
import { 
  processFormData, 
  getIdealTargets, 
  getRecommendations, 
  getProgressRemaining,
  ACTIVITY_LEVELS,
  getAge
} from '@/utils/bmi';
import { BMIService } from '@/services/bmiService';
import { getUserFromCookie } from '@/utils/auth-cookies';

export const useBMI = () => {
  const [formData, setFormData] = useState<BMIFormData>({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate'
  });

  const [results, setResults] = useState<BMIResults | null>(null);
  const [idealTargets, setIdealTargets] = useState<BMIIdealTargets | null>(null);
  const [recommendations, setRecommendations] = useState<BMIRecommendations | null>(null);
  const [progress, setProgress] = useState<BMIProgress | null>(null);
  const [hasSetGoals, setHasSetGoals] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activityLevels, setActivityLevels] = useState<ActivityLevel[]>(ACTIVITY_LEVELS);
  const [isLoading, setIsLoading] = useState(false);

  // Load activity levels from API on mount
  useEffect(() => {
    const loadActivityLevels = async () => {
      try {
        const apiLevels = await BMIService.getActivityLevels();
        if (apiLevels && Array.isArray(apiLevels)) {
          setActivityLevels(apiLevels);
        }
      } catch (error) {
        console.error('Error loading activity levels, using fallback:', error);
        // Keep using ACTIVITY_LEVELS as fallback
        setActivityLevels(ACTIVITY_LEVELS);
      }
    };

    loadActivityLevels();
  }, []);

  // Load user data from cookie and set initial form data
  useEffect(() => {
    const userCookie = getUserFromCookie();
    const age = getAge(userCookie?.birthDate);
    const gender = userCookie?.gender;

    // Always set age and gender from cookie if available
    if (age && gender) {
      setFormData(prev => ({
        ...prev,
        age: age.toString(),
        gender: gender as 'male' | 'female'
      }));
    }
  }, []);

  // Load latest record on mount
  useEffect(() => {
    const loadLatestRecord = async () => {
      try {
        const latestRecord = await BMIService.getLatestBMIRecord();
        if (latestRecord) {
          // Get user data from cookie for age and gender
          const userCookie = getUserFromCookie();
          const cookieAge = getAge(userCookie?.birthDate);
          const cookieGender = userCookie?.gender;

          setFormData({
            height: latestRecord.height.toString(),
            weight: latestRecord.weight.toString(),
            // Use cookie data for age and gender instead of record data
            age: cookieAge ? cookieAge.toString() : latestRecord.age.toString(),
            gender: cookieGender ? (cookieGender as 'male' | 'female') : latestRecord.gender,
            activityLevel: latestRecord.activityLevel
          });
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading latest BMI record:', error);
      }
    };

    loadLatestRecord();
  }, []);

  // Calculate results when form data changes
  useEffect(() => {
    if (formData.height && formData.weight && formData.age) {
      try {
        const calculatedResults = processFormData(formData);
        setResults(calculatedResults);

        const userCookie = getUserFromCookie();
        const gender = userCookie?.gender;
        const age = getAge(userCookie?.birthDate);

        const height = parseFloat(formData.height);
        const weight = parseFloat(formData.weight);

        // Get ideal targets (now uses local calculation)
        const loadIdealTargets = async () => {
          try {
            const idealTargetsData = await BMIService.calculateIdealTargets({
              height,
              weight,
              age,
              gender,
              activityLevel: formData.activityLevel
            });
            
            setIdealTargets(idealTargetsData);
          } catch (error: any) {
            console.error('Error loading ideal targets:', error.message);
            // Fallback to direct local calculation if service fails
            const localTargets = getIdealTargets(height, weight, formData.activityLevel, formData.gender, age);
            setIdealTargets(localTargets);
          }
        };

        // Get recommendations (now uses local calculation)
        const loadRecommendations = async () => {
          try {
            const recommendationsData = await BMIService.getBMIRecommendations(calculatedResults.bmi);
            setRecommendations(recommendationsData);
          } catch (error: any) {
            console.error('Error loading recommendations:', error.message);
            // Fallback to direct local calculation if service fails
            const localRecommendations = getRecommendations(calculatedResults.bmi);
            setRecommendations(localRecommendations);
          }
        };

        loadIdealTargets();
        loadRecommendations();

      } catch (error) {
        console.error('Error calculating BMI results:', error);
        setResults(null);
        setIdealTargets(null);
        setRecommendations(null);
        setProgress(null);
      }
    } else {
      setResults(null);
      setIdealTargets(null);
      setRecommendations(null);
      setProgress(null);
    }
  }, [formData]);

  // Calculate progress when we have both results and ideal targets
  useEffect(() => {
    if (results && idealTargets) {
      const weight = parseFloat(formData.weight);
      const progressData = getProgressRemaining(weight, results.bmi, results.targetCalories, idealTargets);
      setProgress(progressData);
    }
  }, [results, idealTargets, formData.weight]);

  const updateFormData = useCallback((updates: Partial<BMIFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const saveRecord = useCallback(async (withGoals: boolean = false) => {
    if (!results || !idealTargets || !recommendations) {
      throw new Error('Cannot save record: missing calculation results');
    }

    setIsLoading(true);
    try {
                   const record: BMIRecord = {
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
        hasGoals: withGoals,
        ...(withGoals && idealTargets && {
          idealTargets
        })
      };

      await BMIService.saveBMIRecord(record);
      setHasSetGoals(withGoals);
      return record;
    } catch (error) {
      console.error('Error saving BMI record:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [formData, results, idealTargets, recommendations, progress]);

  return {
    // Form data
    formData,
    updateFormData,

    // Calculation results
    results,
    idealTargets,
    recommendations,
    progress,

    // State
    hasSetGoals,
    setHasSetGoals,
    isDataLoaded,
    isLoading,

    // Activity levels
    activityLevels,

    // Actions
    saveRecord
  };
}; 