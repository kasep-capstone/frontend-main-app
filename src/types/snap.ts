import { Recipe } from './recipe';

export interface SnapResult {
  date: string;
  userId: string;
  snaped: string;
  material_detected: string[];
  receipts: Recipe[];
}

export interface RecipeRecommendationsProps {
  snapResult: SnapResult;
  currentIndex: number;
  showNavButtons: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  showDetails: boolean;
  onShowDetailsChange: (show: boolean) => void;
  onRecipeSelect: (recipe: Recipe) => void;
  onScrollToRecipe: (direction: 'left' | 'right') => void;
} 