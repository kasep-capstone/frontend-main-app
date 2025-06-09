import { UserProfile } from '@/types/profile';

export const storageKeys = {
  userProfile: 'userProfile',
  profileImage: 'profileImage',
  bmiHistory: 'bmiHistory',
  foodHistory: 'foodHistory',
  dailyCalories: 'dailyCalories',
  userPreferences: 'userPreferences',
  userSession: 'userSession'
} as const;

export const saveToStorage = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

export const getFromStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue || null;
  }
};

export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

export const clearAllAppData = (): boolean => {
  try {
    const keysToRemove = [
      storageKeys.userProfile,
      storageKeys.profileImage,
      storageKeys.bmiHistory,
      storageKeys.foodHistory,
      storageKeys.dailyCalories,
      storageKeys.userPreferences
    ];
    
    keysToRemove.forEach(key => removeFromStorage(key));
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};

export const saveUserProfile = (profile: UserProfile): boolean => {
  return saveToStorage(storageKeys.userProfile, profile);
};

export const getUserProfile = (): UserProfile | null => {
  return getFromStorage<UserProfile>(storageKeys.userProfile);
};

export const saveProfileImage = (imageData: string): boolean => {
  return saveToStorage(storageKeys.profileImage, imageData);
};

export const getProfileImage = (): string | null => {
  return getFromStorage<string>(storageKeys.profileImage);
};

export const getTargetCaloriesFromBMI = (): number => {
  try {
    const bmiHistory = getFromStorage(storageKeys.bmiHistory);
    if (bmiHistory && Array.isArray(bmiHistory) && bmiHistory.length > 0) {
      const latestRecord = bmiHistory[0];
      return latestRecord.targetCalories || 2500;
    }
  } catch (error) {
    console.error('Error reading BMI data:', error);
  }
  return 2500; // Default fallback
}; 