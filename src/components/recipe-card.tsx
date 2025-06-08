import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Clock, Users, Flame } from 'lucide-react';
import ImagePopup from './image-popup';

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

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  showDetails: boolean;
  onShowDetailsChange: (show: boolean) => void;
}

export function RecipeCard({ recipe, onSelect, showDetails, onShowDetailsChange }: RecipeCardProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null)

  return (
    <div className="w-full bg-card rounded-2xl shadow-lg overflow-hidden border border-border/40 transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full group cursor-pointer" onClick={() => setSelectedImage({ url: recipe.mainImage, alt: recipe.title })}>
        <Image
          src={recipe.mainImage}
          alt={recipe.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-4 drop-shadow-lg leading-tight">{recipe.title}</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 text-white rounded-full text-sm backdrop-blur-sm">
              <Flame className="w-4 h-4" />
              <span>{recipe.calories} cal</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm">
              <Clock className="w-4 h-4" />
              <span>30 min</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm">
              <Users className="w-4 h-4" />
              <span>2 porsi</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-base text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        <Button 
          onClick={() => onShowDetailsChange(!showDetails)}
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors text-base font-medium"
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-5 h-5" />
              Sembunyikan Detail
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              Lihat Detail
            </>
          )}
        </Button>

        <div className={`mt-6 space-y-8 transition-all duration-300 ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none h-0'}`}>
          {/* Materials Section */}
          <div className="bg-muted/30 rounded-xl p-5">
            <h4 className="text-base font-semibold text-foreground mb-5">Bahan-bahan</h4>
            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Bahan yang digunakan
                </h5>
                <div className="flex flex-wrap gap-2">
                  {recipe.usedMaterial.map((material, index) => (
                    <span key={index} className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium transition-transform hover:scale-105">
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Bahan yang tidak digunakan
                </h5>
                <div className="flex flex-wrap gap-2">
                  {recipe.unusedMaterial.map((material, index) => (
                    <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium transition-transform hover:scale-105">
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Bahan yang kurang
                </h5>
                <div className="flex flex-wrap gap-2">
                  {recipe.missingMaterial.map((material, index) => (
                    <span key={index} className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium transition-transform hover:scale-105">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className='mb-6'>
            <h4 className="text-base font-semibold text-foreground mb-5">Langkah-langkah</h4>
            <div className="space-y-5 mb-6">
              {recipe.step.map((step, index) => (
                <div key={index} className="bg-muted/30 rounded-xl p-5 transition-transform hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-base leading-relaxed">{step.instruction}</p>
                  </div>
                  {step.image.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {step.image.map((img, imgIndex) => (
                        <div 
                          key={imgIndex} 
                          className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
                          onClick={() => setSelectedImage({ url: img, alt: `Step ${index + 1} - Image ${imgIndex + 1}` })}
                        >
                          <Image
                            src={img}
                            alt={`Step ${index + 1} - Image ${imgIndex + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button 
            onClick={() => onSelect(recipe)}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:scale-[1.02] text-base font-medium py-6"
          >
            Mulai Memasak
          </Button>
      </div>

      <ImagePopup
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        alt={selectedImage?.alt || ''}
      />
    </div>
  );
} 