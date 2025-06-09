import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecipeCard } from '@/components/recipe-card';
import { SnapResult } from '@/hooks/useSnapResult';

interface Recipe {
  title: string;
  mainImage: string;
  calories: number; // calories per serving
  totalCalories: number; // total calories for all servings
  duration: number; // cooking time in minutes
  prepTime: number; // preparation time in minutes
  servings: number; // number of servings
  usedMaterial: string[];
  unusedMaterial: string[];
  missingMaterial: string[];
  material: string[];
  description: string;
  step: any[];
}

interface RecipeRecommendationsProps {
  snapResult: SnapResult;
  currentIndex: number;
  showNavButtons: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  showDetails: boolean;
  onShowDetailsChange: (show: boolean) => void;
  onRecipeSelect: (recipe: Recipe) => void;
  onScrollToRecipe: (direction: 'left' | 'right') => void;
}

export const RecipeRecommendations: React.FC<RecipeRecommendationsProps> = ({
  snapResult,
  currentIndex,
  showNavButtons,
  scrollContainerRef,
  showDetails,
  onShowDetailsChange,
  onRecipeSelect,
  onScrollToRecipe,
}) => {
  return (
    <div className="relative">
      {/* Header with Navigation */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Rekomendasi Resep</h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onScrollToRecipe('left')}
            disabled={currentIndex === 0}
            className="p-2 sm:p-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/40 text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-card hover:scale-110 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => onScrollToRecipe('right')}
            disabled={currentIndex === snapResult.receipts.length - 1}
            className="p-2 sm:p-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/40 text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-card hover:scale-110 shadow-sm"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Fixed Navigation Buttons on Scroll */}
      <div className={`fixed top-1/2 -translate-y-1/2 left-4 right-4 z-50 flex justify-between pointer-events-none transition-opacity duration-300 ${showNavButtons ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={() => onScrollToRecipe('left')}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto transform hover:scale-110 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => onScrollToRecipe('right')}
          disabled={currentIndex === snapResult.receipts.length - 1}
          className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto transform hover:scale-110 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Recipe Cards Container */}
      <div 
        ref={scrollContainerRef}
        className="relative w-full overflow-x-hidden"
      >
        <div className="flex transition-transform duration-300 ease-in-out">
          {snapResult.receipts.map((recipe, index) => (
            <div 
              key={index}
              className="w-full flex-shrink-0 px-1 sm:px-2"
            >
              <div className="w-full">
                <RecipeCard
                  recipe={recipe}
                  onSelect={onRecipeSelect}
                  showDetails={showDetails}
                  onShowDetailsChange={onShowDetailsChange}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 