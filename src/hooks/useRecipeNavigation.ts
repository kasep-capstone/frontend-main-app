import { useState, useRef, useEffect } from 'react';
import { SnapResult } from './useSnapResult';

export const useRecipeNavigation = (snapResult: SnapResult | null) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowNavButtons(scrollPosition > 350);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRecipe = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current || !snapResult) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.offsetWidth;
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(snapResult.receipts.length - 1, currentIndex + 1);

    setCurrentIndex(newIndex);
    container.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth'
    });
  };

  return {
    currentIndex,
    showNavButtons,
    scrollContainerRef,
    scrollToRecipe,
  };
}; 