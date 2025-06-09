import React from 'react';
import { FaImages, FaTimes } from 'react-icons/fa';

interface BottomControlsProps {
  isLoading: boolean;
  isCapturing: boolean;
  isTooDark: boolean;
  onImageUpload: (file: File) => void;
  onCapture: () => void;
  onBack: () => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  isLoading,
  isCapturing,
  isTooDark,
  onImageUpload,
  onCapture,
  onBack,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className={`absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center transition-opacity duration-1000 z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isCapturing}
          className={`absolute inset-0 w-full h-full opacity-0 ${isCapturing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`block p-4 rounded-full transition-all duration-300 shadow-lg ${
            isCapturing 
              ? 'bg-muted/50 cursor-not-allowed border border-border/20' 
              : 'bg-card/80 backdrop-blur-sm border border-border/40 hover:bg-card cursor-pointer'
          }`}
        >
          <FaImages className={`w-8 h-8 ${isCapturing ? 'text-muted-foreground/50' : 'text-primary'}`} />
        </label>
      </div>
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