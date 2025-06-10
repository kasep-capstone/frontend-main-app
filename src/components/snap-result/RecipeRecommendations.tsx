import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecipeCard } from '@/components/recipe-card';
import { Recipe, SnapResult, RecipeRecommendationsProps } from '@/types';

export function RecipeRecommendations({
  snapResult,
  currentIndex,
  showNavButtons,
  scrollContainerRef,
  showDetails,
  onShowDetailsChange,
  onRecipeSelect,
  onScrollToRecipe,
}: RecipeRecommendationsProps) {
  return (
    <div className="relative mb-24">
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {snapResult.receipts.map((recipe, index) => (
          <div key={index} className="min-w-full snap-center">
            <RecipeCard
              recipe={recipe}
              onSelect={onRecipeSelect}
              showDetails={showDetails}
              onShowDetailsChange={onShowDetailsChange}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {showNavButtons && snapResult.receipts.length > 1 && (
        <>
          <button
            onClick={() => onScrollToRecipe('left')}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => onScrollToRecipe('right')}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            disabled={currentIndex === snapResult.receipts.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Recipe Indicator */}
      {snapResult.receipts.length > 1 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/40">
          <div className="flex items-center gap-2">
            {snapResult.receipts.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 