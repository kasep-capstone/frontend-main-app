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
        className="p-4 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
      >
        <FaImages className="w-8 h-8 text-amber-600" />
      </button>
      <button
        onClick={onCapture}
        disabled={isCapturing || isTooDark}
        className={`p-6 rounded-full ${
          isCapturing || isTooDark 
            ? 'bg-amber-800/50 cursor-not-allowed' 
            : 'bg-amber-900 hover:bg-amber-800'
        } transition-all duration-300`}
      >
        <div className={`w-16 h-16 rounded-full border-4 ${isTooDark ? 'border-amber-600/50' : 'border-amber-600'}`} />
      </button>
      <button
        onClick={onBack}
        className="p-4 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
      >
        <FaTimes className="w-8 h-8 text-amber-600" />
      </button>
    </div>
  );
}; 