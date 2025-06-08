'use client'
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import { RecipeCard } from '@/components/recipe-card';
import ImagePopup from '@/components/image-popup';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package, ChevronLeft, ChevronRight, BadgeCheck, Sparkles, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeStep {
  instruction: string;
  image: string[];
}

interface Recipe {
  title: string;
  mainImage: string;
  calories: number;
  usedMaterial: string[];
  unusedMaterial: string[];
  missingMaterial: string[];
  material: string[];
  description: string;
  step: RecipeStep[];
}

interface SnapResult {
  date: string;
  userId: string;
  snaped: string;
  material_detected: string[];
  receipts: Recipe[];
}

export default function SnapResult() {
  const [isVisible, setIsVisible] = useState(false);
  const [snapResult, setSnapResult] = useState<SnapResult | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowNavButtons(scrollPosition > 350);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // TODO: Replace with actual API call
    // This is mock data for demonstration
    setSnapResult({
      date: "2025-05-19T19:05:45",
      userId: "uuid",
      snaped: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
      material_detected: ["bawang merah", "bawang putih", "gula", "jeruk purut"],
      receipts: [
        {
          title: "soto ayam",
          mainImage: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
          calories: 1500,
          usedMaterial: ["bawang merah", "bawang putih"],
          unusedMaterial: ["merica", "garam"],
          missingMaterial: ["gula", "jeruk purut"],
          material: ["bawang merah", "bawang putih", "gula", "jeruk purut"],
          description: "Soto ayam adalah hidangan sup ayam khas Indonesia yang terkenal dengan kuah beningnya yang gurih dan segar.",
          step: [
            {
              instruction: "Siapkan bumbu-bumbu seperti bawang merah, bawang putih, dan bumbu lainnya.",
              image: [
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
              ],
            },
            {
              instruction: "Rebus ayam dengan bumbu-bumbu hingga matang dan kuah menjadi bening.",
              image: [
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
              ],
            },
          ],
        },
        {
          title: "sop ayam",
          mainImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop",
          calories: 1500,
          usedMaterial: ["bawang merah", "bawang putih"],
          unusedMaterial: ["merica", "garam"],
          missingMaterial: ["gula", "jeruk purut"],
          material: ["bawang merah", "bawang putih", "gula", "jeruk purut"],
          description: "Sop ayam adalah hidangan sup ayam yang lezat dengan berbagai sayuran segar.",
          step: [
            {
              instruction: "Potong ayam dan sayuran sesuai ukuran yang diinginkan.",
              image: [
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
              ],
            },
            {
              instruction: "Masak ayam dan sayuran dalam air mendidih hingga matang.",
              image: [
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
              ],
            },
          ],
        },
      ],
    });
  }, []);

  const handleRecipeSelect = (recipe: Recipe) => {
    console.log('Selected recipe:', recipe);
  };

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

  const handleRetryDetection = () => {
    router.push('/snap');
  };

  return (
    <>
      <MenuBarTop/>
      <div className={`min-h-screen bg-background pt-16 pb-20 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-md mx-auto px-4">
          {/* Captured Image Preview */}
          {snapResult && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-semibold">Gambar yang diambil</h2>
              </div>
              <div 
                className="relative w-full h-48 rounded-xl overflow-hidden border border-border/40 shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedImage({ url: snapResult.snaped, alt: "Captured ingredients" })}
              >
                <Image
                  src={snapResult.snaped}
                  alt="Captured ingredients"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Detected Materials */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  <h2 className="text-xl font-semibold">Bahan yang terdeteksi</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {snapResult.material_detected.map((material, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-base font-medium transition-transform hover:scale-105"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Rekomendasi Resep</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToRecipe('left')}
                disabled={currentIndex === 0}
                className="p-2.5 rounded-full bg-amber-100 text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-amber-200 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scrollToRecipe('right')}
                disabled={!snapResult || currentIndex === snapResult.receipts.length - 1}
                className="p-2.5 rounded-full bg-amber-100 text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-amber-200 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {snapResult ? (
            <div className="relative">
              {/* Navigation Buttons - Fixed on sides when scrolling */}
              <div className={`fixed top-1/2 -translate-y-1/2 left-4 right-4 z-50 flex justify-between pointer-events-none transition-opacity duration-300 ${showNavButtons ? 'opacity-100' : 'opacity-0'}`}>
                <button
                  onClick={() => scrollToRecipe('left')}
                  disabled={currentIndex === 0}
                  className="p-3 rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto transform hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scrollToRecipe('right')}
                  disabled={currentIndex === snapResult.receipts.length - 1}
                  className="p-3 rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto pointer-events-auto transform hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div 
                ref={scrollContainerRef}
                className="relative w-full overflow-x-hidden"
              >
                <div className="flex transition-transform duration-300 ease-in-out">
                  {snapResult.receipts.map((recipe, index) => (
                    <div 
                      key={index}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className="max-w-md mx-auto">
                        <RecipeCard
                          recipe={recipe}
                          onSelect={handleRecipeSelect}
                          showDetails={showDetails}
                          onShowDetailsChange={setShowDetails}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retry Detection Button */}
              <div className="mt-8 flex flex-col items-center justify-center">
                <p className="text-muted-foreground mb-4 text-center">Tidak menemukan resep yang sesuai?</p>
                <Button 
                  onClick={handleRetryDetection}
                  className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:scale-[1.02]"
                >
                  <Camera className="w-4 h-4" />
                  Deteksi Ulang Bahan
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-base text-muted-foreground font-medium">Memuat rekomendasi...</p>
              </div>
            </div>
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
        <MenuBar/>
      </div>
    </>
  );
}