import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Clock, Users, Flame } from 'lucide-react';
import ImagePopup from './image-popup';
import { Recipe, RecipeCardProps } from '@/types';

export function RecipeCard({ recipe, onSelect, showDetails, onShowDetailsChange }: RecipeCardProps) {
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
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 drop-shadow-lg leading-tight">{recipe.title}</h3>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-primary/90 text-white rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{recipe.calories} kal/porsi</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-white/20 text-white rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{recipe.prepTime + recipe.duration} min</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-white/20 text-white rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{recipe.servings} porsi</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        
        {/* Nutrition & Time Info */}
        <div className="bg-muted/20 rounded-lg p-3 mb-4 sm:mb-6">
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{recipe.calories} kalori</span> per porsi
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{recipe.totalCalories} kalori</span> total
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{recipe.prepTime} menit</span> persiapan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{recipe.duration} menit</span> memasak
              </span>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onShowDetailsChange(!showDetails)}
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary/90 hover:bg-primary/10 transition-colors text-sm sm:text-base font-medium"
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              Sembunyikan Detail
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              Lihat Detail
            </>
          )}
        </Button>

        <div className={`mt-4 sm:mt-6 space-y-6 sm:space-y-8 transition-all duration-300 ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none h-0'}`}>
          {/* Materials Section */}
          <div className="bg-muted/30 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-4 sm:mb-5">Bahan-bahan</h4>
            <div className="space-y-4 sm:space-y-5">
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
          <div className='mb-4 sm:mb-6'>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-4 sm:mb-5">Langkah-langkah</h4>
            <div className="space-y-4 sm:space-y-5 mb-4 sm:mb-6">
              {recipe.step.map((step, index) => (
                <div key={index} className="bg-muted/30 rounded-xl p-4 sm:p-5 transition-transform hover:scale-[1.02]">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed">{step.instruction}</p>
                  </div>
                  {step.image.length > 0 && (
                    <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
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
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base font-medium py-4 sm:py-6 shadow-lg"
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