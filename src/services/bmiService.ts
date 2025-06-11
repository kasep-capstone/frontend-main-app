import { BMIRecord } from '@/types/bmi';
import { apiClient } from './apiClient';
import { getAuthTokenFromCookie } from '@/utils/auth-cookies';
import { getIdealTargets, getRecommendations, ACTIVITY_LEVELS } from '@/utils/bmi';

export class BMIService {
  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = getAuthTokenFromCookie();
    return !!token;
  }

  // API-only operations
  static async saveBMIRecord(record: BMIRecord): Promise<BMIRecord[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login to save BMI records.');
    }

    try {
      // Convert record to API format - ensure integer values match API validation
      const apiRecord: any = {
        date: record.date, // Keep as string
        height: Math.round(record.height), // Convert to integer
        weight: Math.round(record.weight), // Convert to integer
        activityLevel: record.activityLevel,
        bmi: Math.round(record.bmi * 100) / 100, // Round to 2 decimal places
        category: record.category,
        healthStatus: record.healthStatus,
        targetCalories: Math.round(record.targetCalories), // Convert to integer
        hasGoals: record.hasGoals || false
      };

      // Only include idealTargets if hasGoals is true
      if (record.hasGoals && record.idealTargets) {
        apiRecord.idealTargets = record.idealTargets;
      }

      await apiClient.createBMIRecord(apiRecord);
      // After successful API call, get updated records
      return await this.getBMIHistory();
    } catch (error) {
      console.error('Error saving BMI record:', error);
      throw error;
    }
  }
  
  static async getBMIHistory(): Promise<BMIRecord[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login to view BMI history.');
    }

    try {
      const response = await apiClient.getUserBMIRecords({ limit: 100 });
      return response.bmiRecords || [];
    } catch (error) {
      console.error('Error fetching BMI history:', error);
      throw error;
    }
  }
  
  static async deleteBMIRecord(id: string): Promise<BMIRecord[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login to delete BMI records.');
    }

    try {
      await apiClient.deleteBMIRecord(id);
      return await this.getBMIHistory();
    } catch (error) {
      console.error('Error deleting BMI record:', error);
      throw error;
    }
  }
  
  static async getLatestBMIRecord(): Promise<BMIRecord | null> {
    if (!this.isAuthenticated()) {
      return null; // Return null instead of throwing error for latest record
    }

    try {
      const history = await this.getBMIHistory();
      return history.length > 0 ? history[0] : null;
    } catch (error) {
      console.error('Error getting latest BMI record:', error);
      return null;
    }
  }
  
  static async clearBMIHistory(): Promise<void> {
    try {
      localStorage.removeItem('bmi_history');
    } catch (error) {
      console.error('Error clearing BMI history:', error);
      throw error;
    }
  }
  
  static async exportBMIHistory(): Promise<string> {
    try {
      const history = await this.getBMIHistory();
      return JSON.stringify(history, null, 2);
    } catch (error) {
      console.error('Error exporting BMI history:', error);
      throw error;
    }
  }
  
  static async importBMIHistory(data: string): Promise<BMIRecord[]> {
    try {
      const importedHistory: BMIRecord[] = JSON.parse(data);
      
      // Validate imported data
      const validRecords = importedHistory.filter(record => this.validateBMIRecord(record));
      
      if (validRecords.length === 0) {
        throw new Error('No valid BMI records found in import data');
      }
      
      // Get current history
      const currentHistory = await this.getBMIHistory();
      
      // Merge with current history (avoid duplicates by date)
      const mergedHistory = [...currentHistory];
      
      for (const record of validRecords) {
        const existingIndex = mergedHistory.findIndex(existing => existing.date === record.date);
        if (existingIndex >= 0) {
          // Replace existing record with same date
          mergedHistory[existingIndex] = record;
        } else {
          // Add new record
          mergedHistory.push(record);
        }
      }
      
      // Sort by date (newest first)
      mergedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Save merged history
      localStorage.setItem('bmi_history', JSON.stringify(mergedHistory));
      
      return mergedHistory;
    } catch (error) {
      console.error('Error importing BMI history:', error);
      throw new Error('Invalid data format or import error');
    }
  }
  
  // API Integration Methods
  static async syncBMIRecord(record: BMIRecord): Promise<BMIRecord> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login to sync BMI records.');
    }

    try {
      const apiRecord = {
        date: new Date(record.date),
        height: record.height,
        weight: record.weight,
        age: record.age,
        gender: record.gender,
        activityLevel: record.activityLevel,
        bmi: record.bmi,
        category: record.category,
        healthStatus: record.healthStatus,
        targetCalories: record.targetCalories,
        hasGoals: record.hasGoals || false
      };
      
      return await apiClient.createBMIRecord(apiRecord);
    } catch (error) {
      console.error('Error syncing BMI record:', error);
      throw error;
    }
  }
  
  static async fetchBMIHistory(userId?: string): Promise<BMIRecord[]> {
    return await this.getBMIHistory();
  }
  
  static async deleteBMIRecordFromServer(id: string): Promise<void> {
    await this.deleteBMIRecord(id);
  }
  
  static async uploadBMIHistory(records: BMIRecord[]): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login to upload BMI history.');
    }

    try {
      const formattedRecords = records.map(record => ({
        date: new Date(record.date),
        height: record.height,
        weight: record.weight,
        age: record.age,
        gender: record.gender,
        activityLevel: record.activityLevel,
        bmi: record.bmi,
        category: record.category,
        healthStatus: record.healthStatus,
        targetCalories: record.targetCalories,
        hasGoals: record.hasGoals || false
      }));
      
      await apiClient.importBMIHistory(formattedRecords);
    } catch (error) {
      console.error('Error uploading BMI history:', error);
      throw error;
    }
  }
  
  static async downloadBMIHistory(userId: string): Promise<BMIRecord[]> {
    return await this.getBMIHistory();
  }

  // API-only methods
  static async getBMIStatistics(): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login to view BMI statistics.');
    }

    try {
      const response = await apiClient.getBMIStatistics();
      return response.statistics;
    } catch (error) {
      console.error('Error fetching BMI statistics:', error);
      throw error;
    }
  }

  static async getBMITrends(): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login to view BMI trends.');
    }

    try {
      const response = await apiClient.getBMITrends();
      return response.trend;
    } catch (error) {
      console.error('Error fetching BMI trends:', error);
      throw error;
    }
  }

  static async getBMIRecommendations(currentBMI?: number): Promise<any> {
    try {
      // If BMI is provided directly, use it
      if (currentBMI) {
        const recommendations = getRecommendations(currentBMI);
        return recommendations;
      }
      
      // Otherwise, try to get latest record to calculate recommendations
      const latestRecord = await this.getLatestBMIRecord();
      if (!latestRecord) {
        throw new Error('No BMI records found and no current BMI provided');
      }
      
      // Use local calculation
      const recommendations = getRecommendations(latestRecord.bmi);
      return recommendations;
    } catch (error) {
      console.error('Error generating BMI recommendations:', error);
      throw error;
    }
  }

  static async calculateIdealTargets(data: {
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: string;
  }): Promise<any> {
    // Validate input data
    if (!data.height || !data.weight || !data.age || !data.gender || !data.activityLevel) {
      throw new Error('Missing required fields for ideal targets calculation');
    }

    if (data.height <= 0 || data.weight <= 0 || data.age <= 0) {
      throw new Error('Height, weight, and age must be positive numbers');
    }

    try {
      // Use local calculation
      const idealTargets = getIdealTargets(data.height, data.weight, data.activityLevel, data.gender, data.age);
      return idealTargets;
    } catch (error) {
      console.error('Error calculating ideal targets:', error);
      throw error;
    }
  }

  static async getBMIProgress(): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login to view BMI progress.');
    }

    try {
      return await apiClient.getBMIProgress();
    } catch (error) {
      console.error('Error fetching BMI progress:', error);
      throw error;
    }
  }

  static async getActivityLevels(): Promise<any> {
    try {
      // Return local activity levels
      return ACTIVITY_LEVELS;
    } catch (error) {
      console.error('Error getting activity levels:', error);
      throw error;
    }
  }
  
  // Utility methods for data validation
  static validateBMIRecord(record: Partial<BMIRecord>): boolean {
    return !!(
      record.height && 
      record.weight && 
      record.age && 
      record.gender && 
      record.activityLevel &&
      record.height > 0 && 
      record.weight > 0 && 
      record.age > 0
    );
  }
  
  // Generate temporary ID for frontend use (backend will assign actual ID)
  static generateRecordId(): string {
    return 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
  }
} 