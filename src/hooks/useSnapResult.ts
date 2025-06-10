import { useState, useEffect } from 'react';
import { SnapResult } from '@/types';
import { STORAGE_KEYS } from '@/constants';

export const useSnapResult = () => {
  const [snapResult, setSnapResult] = useState<SnapResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load snap result from localStorage or API
    const loadSnapResult = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LATEST_SNAP_RESULT);
        if (stored) {
          setSnapResult(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading snap result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSnapResult();
  }, []);

  return {
    snapResult,
    isLoading,
    setSnapResult,
  };
};

export type { SnapResult }; 