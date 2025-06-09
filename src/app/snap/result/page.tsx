'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import ImagePopup from '@/components/image-popup';
import { useSnapResult, useRecipeNavigation } from '@/hooks';
import {
  CapturedImagePreview,
  DetectedMaterials,
  RecipeRecommendations,
  RetrySection,
  LoadingState
} from '@/components/snap-result';

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

export default function SnapResult() {
  const router = useRouter();
  const { snapResult, isVisible } = useSnapResult();
  const { currentIndex, showNavButtons, scrollContainerRef, scrollToRecipe } = useRecipeNavigation(snapResult);
  
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleRecipeSelect = (recipe: Recipe) => {
    console.log('Selected recipe:', recipe);
  };

  const handleRetryDetection = () => {
    router.push('/snap');
  };

  return (
    <>
      <MenuBarTop />
      <div className={`min-h-screen bg-background pt-16 pb-20 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-md mx-auto px-3 sm:px-4">
          {snapResult ? (
            <>
              {/* Captured Image Preview */}
              <CapturedImagePreview
                imageUrl={snapResult.snaped}
                onImageClick={setSelectedImage}
              />

              {/* Detected Materials */}
              <DetectedMaterials
                materials={snapResult.material_detected}
              />

              {/* Recipe Recommendations */}
              <RecipeRecommendations
                snapResult={snapResult}
                currentIndex={currentIndex}
                showNavButtons={showNavButtons}
                scrollContainerRef={scrollContainerRef}
                showDetails={showDetails}
                onShowDetailsChange={setShowDetails}
                onRecipeSelect={handleRecipeSelect}
                onScrollToRecipe={scrollToRecipe}
              />

              {/* Retry Section */}
              <RetrySection onRetryDetection={handleRetryDetection} />
            </>
          ) : (
            <LoadingState />
          )}
        </div>
      </div>

      <ImagePopup
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        alt={selectedImage?.alt || ''}
      />
      
      <div className="flex justify-center pt-8">
        <MenuBar />
      </div>
    </>
  );
}