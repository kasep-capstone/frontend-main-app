import React from 'react';
import { Sparkles } from 'lucide-react';

interface DetectedMaterialsProps {
  materials: string[];
}

export const DetectedMaterials: React.FC<DetectedMaterialsProps> = ({
  materials,
}) => {
  return (
    <div className="my-6 sm:my-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Bahan yang terdeteksi</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {materials.map((material, index) => (
          <span 
            key={index}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-card/80 backdrop-blur-sm text-primary border border-border/40 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 hover:bg-card shadow-sm"
          >
            {material}
          </span>
        ))}
      </div>
    </div>
  );
}; 