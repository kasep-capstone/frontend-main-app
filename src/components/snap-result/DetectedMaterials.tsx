import React from 'react';
import { Sparkles } from 'lucide-react';

interface DetectedMaterialsProps {
  materials: string[];
}

export const DetectedMaterials: React.FC<DetectedMaterialsProps> = ({
  materials,
}) => {
  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-semibold">Bahan yang terdeteksi</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {materials.map((material, index) => (
          <span 
            key={index}
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-base font-medium transition-transform hover:scale-105"
          >
            {material}
          </span>
        ))}
      </div>
    </div>
  );
}; 