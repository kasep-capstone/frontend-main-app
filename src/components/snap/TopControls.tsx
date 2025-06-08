import React from 'react';
import { FaLightbulb, FaSync } from 'react-icons/fa';

interface TopControlsProps {
  isLoading: boolean;
  isFlashOn: boolean;
  onToggleFlash: () => void;
  onToggleCamera: () => void;
}

export const TopControls: React.FC<TopControlsProps> = ({
  isLoading,
  isFlashOn,
  onToggleFlash,
  onToggleCamera,
}) => {
  return (
    <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-center transition-opacity duration-1000 z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <button
        onClick={onToggleFlash}
        className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
      >
        <FaLightbulb className={`w-6 h-6 text-amber-600 ${isFlashOn ? 'animate-pulse' : ''}`} />
      </button>
      <h1 className="text-2xl font-bold text-amber-600">KASEP</h1>
      <button
        onClick={onToggleCamera}
        className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
      >
        <FaSync className="w-6 h-6 text-amber-600" />
      </button>
    </div>
  );
}; 