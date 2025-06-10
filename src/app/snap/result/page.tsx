'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import ImagePopup from '@/components/image-popup';
import { useSnapResult, useRecipeNavigation } from '@/hooks';
import { Recipe } from '@/types';
import { ROUTES, STORAGE_KEYS } from '@/constants';
import {
  CapturedImagePreview,
  DetectedMaterials,
  RecipeRecommendations,
  RetrySection,
  LoadingState
} from '@/components/snap-result';
import { ProtectedPageContent } from '@/components/auth/ProtectedPage';

export default function SnapResultPage() {
  const router = useRouter();
  const { snapResult, isLoading } = useSnapResult();
  const { currentIndex, showNavButtons, scrollContainerRef, scrollToRecipe } = useRecipeNavigation(snapResult);
  
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleRecipeSelect = (recipe: Recipe) => {
    // Store selected recipe in localStorage
    localStorage.setItem(STORAGE_KEYS.SELECTED_RECIPE, JSON.stringify(recipe));
    router.push(ROUTES.RECIPE_DETAIL);
  };

  const handleRetry = () => {
    router.push(ROUTES.SNAP);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!snapResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Data tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">Silakan coba scan ulang</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Kembali ke Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedPageContent>
    <div className="min-h-screen bg-background">
      <MenuBarTop />
      
      <div className="px-4 pt-6 pb-24">
        <CapturedImagePreview 
          imageUrl={snapResult.snaped}
          onImageClick={(imageData) => setSelectedImage(imageData)}
        />
        
        <DetectedMaterials 
          materials={snapResult.material_detected}
        />
        
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
        
        <RetrySection onRetryDetection={handleRetry} />
      </div>

      <MenuBar />
      
      <ImagePopup
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        alt={selectedImage?.alt || ''}
      />
    </div>
    </ProtectedPageContent>
  );
}