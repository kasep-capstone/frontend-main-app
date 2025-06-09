import React from 'react';
import { FaImages, FaTimes } from 'react-icons/fa';

interface BottomControlsProps {
  isLoading: boolean;
  isCapturing: boolean;
  isTooDark: boolean;
  onGallery: () => void;
  onCapture: () => void;
  onBack: () => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  isLoading,
  isCapturing,
  isTooDark,
  onGallery,
  onCapture,
  onBack,
}) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center transition-opacity duration-1000 z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <button
        onClick={onGallery}
        className="p-4 rounded-full bg-card/80 backdrop-blur-sm border border-border/40 hover:bg-card transition-all duration-300 shadow-lg"
      >
        <FaImages className="w-8 h-8 text-primary" />
      </button>
      <button
        onClick={onCapture}
        disabled={isCapturing || isTooDark}
        className={`p-6 rounded-full transition-all duration-300 shadow-lg ${
          isCapturing || isTooDark 
            ? 'bg-muted/50 cursor-not-allowed border border-border/20' 
            : 'bg-primary hover:bg-primary/90 border border-primary'
        }`}
      >
        <div className={`w-16 h-16 rounded-full border-4 transition-colors ${
          isTooDark ? 'border-muted-foreground/50' : 'border-primary-foreground'
        }`} />
      </button>
      <button
        onClick={onBack}
        className="p-4 rounded-full bg-card/80 backdrop-blur-sm border border-border/40 hover:bg-card transition-all duration-300 shadow-lg"
      >
        <FaTimes className="w-8 h-8 text-primary" />
      </button>
    </div>
  );
}; 