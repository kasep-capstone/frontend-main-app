import { BMIRecord } from '@/types/bmi';

const BMI_STORAGE_KEY = 'bmiHistory';
const MAX_HISTORY_RECORDS = 50;

export class BMIService {
  // Local Storage Operations
  static saveBMIRecord(record: BMIRecord): BMIRecord[] {
    const existingHistory = this.getBMIHistory();
    const updatedHistory = [record, ...existingHistory];
    
    // Limit history to max records
    if (updatedHistory.length > MAX_HISTORY_RECORDS) {
      updatedHistory.splice(MAX_HISTORY_RECORDS);
    }
    
    localStorage.setItem(BMI_STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  }
  
  static getBMIHistory(): BMIRecord[] {
    try {
      const history = localStorage.getItem(BMI_STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading BMI history:', error);
      return [];
    }
  }
  
  static deleteBMIRecord(id: string): BMIRecord[] {
    const history = this.getBMIHistory();
    const updatedHistory = history.filter(record => record.id !== id);
    localStorage.setItem(BMI_STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  }
  
  static getLatestBMIRecord(): BMIRecord | null {
    const history = this.getBMIHistory();
    return history.length > 0 ? history[0] : null;
  }
  
  static clearBMIHistory(): void {
    localStorage.removeItem(BMI_STORAGE_KEY);
  }
  
  static exportBMIHistory(): string {
    const history = this.getBMIHistory();
    return JSON.stringify(history, null, 2);
  }
  
  static importBMIHistory(data: string): BMIRecord[] {
    try {
      const importedHistory: BMIRecord[] = JSON.parse(data);
      localStorage.setItem(BMI_STORAGE_KEY, JSON.stringify(importedHistory));
      return importedHistory;
    } catch (error) {
      console.error('Error importing BMI history:', error);
      throw new Error('Invalid data format');
    }
  }
  
  // Future API Integration Points
  // These methods can be modified to integrate with backend APIs
  
  static async syncBMIRecord(record: BMIRecord): Promise<BMIRecord> {
    // TODO: Implement API call to sync record with backend
    // For now, just save locally
    this.saveBMIRecord(record);
    return record;
  }
  
  static async fetchBMIHistory(userId?: string): Promise<BMIRecord[]> {
    // TODO: Implement API call to fetch history from backend
    // For now, return local storage data
    return this.getBMIHistory();
  }
  
  static async deleteBMIRecordFromServer(id: string): Promise<void> {
    // TODO: Implement API call to delete record from backend
    // For now, just delete locally
    this.deleteBMIRecord(id);
  }
  
  static async uploadBMIHistory(records: BMIRecord[]): Promise<void> {
    // TODO: Implement API call to upload all records to backend
    console.log('Uploading BMI history to server:', records);
  }
  
  static async downloadBMIHistory(userId: string): Promise<BMIRecord[]> {
    // TODO: Implement API call to download all records from backend
    return this.getBMIHistory();
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
  
  static generateRecordId(): string {
    return Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
  }
} 