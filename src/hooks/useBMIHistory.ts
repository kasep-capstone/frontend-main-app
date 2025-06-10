import { useState, useEffect, useCallback } from 'react';
import { BMIRecord, BMIStatistics, BMITrend, FilterCategory } from '@/types/bmi';
import { getBMIStatistics, getBMITrend } from '@/utils/bmi';
import { BMIService } from '@/services/bmiService';

export const useBMIHistory = () => {
  const [history, setHistory] = useState<BMIRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<BMIRecord[]>([]);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [statistics, setStatistics] = useState<BMIStatistics | null>(null);
  const [trend, setTrend] = useState<BMITrend | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from API
  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const historyData = await BMIService.fetchBMIHistory();
      setHistory(historyData);
      
      // Get statistics from API
      try {
        const apiStats = await BMIService.getBMIStatistics();
        setStatistics(apiStats);
      } catch (error) {
        console.error('Error loading BMI statistics:', error);
        setStatistics(null);
      }
      
      // Get trends from API
      try {
        const apiTrend = await BMIService.getBMITrends();
        setTrend(apiTrend);
      } catch (error) {
        console.error('Error loading BMI trends:', error);
        setTrend(null);
      }
    } catch (error) {
      console.error('Error loading BMI history:', error);
      // Set empty state if not authenticated or API error
      setHistory([]);
      setStatistics(null);
      setTrend(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load - delay slightly to ensure auth is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistory();
    }, 100); // Small delay to ensure auth context is ready

    return () => clearTimeout(timer);
  }, [loadHistory]);

  // Filter history based on category
  useEffect(() => {
    let filtered = [...history];
    
    switch (filterCategory) {
      case 'all':
        break;
      case 'with-goals':
        filtered = history.filter(record => record.hasGoals === true);
        break;
      case 'without-goals':
        filtered = history.filter(record => !record.hasGoals);
        break;
      default:
        filtered = history.filter(record => record.category.toLowerCase() === filterCategory);
    }
    
    setFilteredHistory(filtered);
  }, [history, filterCategory]);

  // Delete record
  const deleteRecord = useCallback(async (id: string) => {
    try {
      const updatedHistory = await BMIService.deleteBMIRecord(id);
      setHistory(updatedHistory);
      
      // Recalculate statistics and trend
      const stats = getBMIStatistics(updatedHistory);
      setStatistics(stats);
      
      const trendData = getBMITrend(updatedHistory);
      setTrend(trendData);
      
      return updatedHistory;
    } catch (error) {
      console.error('Error deleting BMI record:', error);
      throw error;
    }
  }, []);

  // Export history
  const exportHistory = useCallback(async () => {
    try {
      const exportData = await BMIService.exportBMIHistory();
      
      // Create download link
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportData);
      const downloadElement = document.createElement('a');
      downloadElement.setAttribute('href', dataStr);
      downloadElement.setAttribute('download', `bmi-history-${new Date().toISOString().split('T')[0]}.json`);
      downloadElement.click();
      
      return exportData;
    } catch (error) {
      console.error('Error exporting BMI history:', error);
      throw error;
    }
  }, []);

  // Import history
  const importHistory = useCallback(async (file: File) => {
    try {
      const fileContent = await file.text();
      const importedHistory = await BMIService.importBMIHistory(fileContent);
      setHistory(importedHistory);
      
      // Recalculate statistics and trend
      const stats = getBMIStatistics(importedHistory);
      setStatistics(stats);
      
      const trendData = getBMITrend(importedHistory);
      setTrend(trendData);
      
      return importedHistory;
    } catch (error) {
      console.error('Error importing BMI history:', error);
      throw error;
    }
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    BMIService.clearBMIHistory();
    setHistory([]);
    setStatistics(null);
    setTrend(null);
  }, []);

  // Refresh history (useful after adding new records)
  const refreshHistory = useCallback(() => {
    loadHistory();
  }, [loadHistory]);

  // Get goals progress
  const getGoalsProgress = useCallback(() => {
    if (!history || history.length === 0) return { percentage: 0, count: 0, total: 0 };
    
    const withGoalsCount = history.filter(record => record?.hasGoals).length;
    const percentage = Math.round((withGoalsCount / history.length) * 100);
    
    return {
      percentage: isNaN(percentage) ? 0 : percentage,
      count: withGoalsCount || 0,
      total: history.length || 0
    };
  }, [history]);

  // Get latest record
  const getLatestRecord = useCallback(() => {
    return history && history.length > 0 ? history[0] : null;
  }, [history]);

  return {
    // Data
    history,
    filteredHistory,
    statistics,
    trend,
    
    // Filtering
    filterCategory,
    setFilterCategory,
    
    // State
    isLoading,
    
    // Actions
    deleteRecord,
    exportHistory,
    importHistory,
    clearHistory,
    refreshHistory,
    
    // Computed values
    getGoalsProgress,
    getLatestRecord,
    
    // Counts
    totalRecords: history.length,
    filteredCount: filteredHistory.length
  };
}; 