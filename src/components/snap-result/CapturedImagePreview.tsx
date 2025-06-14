import React from 'react';
import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';

interface CapturedImagePreviewProps {
  imageUrl: string;
  onImageClick: (imageData: { url: string; alt: string }) => void;
}

export const CapturedImagePreview: React.FC<CapturedImagePreviewProps> = ({
  imageUrl,
  onImageClick,
}) => {
  return (
    <div className="mb-6 sm:mb-10">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Gambar yang diambil</h2>
      </div>
      <div 
        className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-border/40 shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
        onClick={() => onImageClick({ url: imageUrl, alt: "Captured ingredients" })}
      >
        <Image
          src={imageUrl}
          alt="Captured ingredients"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}; 