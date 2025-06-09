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
        className="p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/40 hover:bg-card transition-all duration-300 shadow-lg"
      >
        <FaLightbulb className={`w-6 h-6 text-primary ${isFlashOn ? 'animate-pulse' : ''}`} />
      </button>
      <h1 className="text-2xl font-bold text-primary tracking-wider">KASEP</h1>
      <button
        onClick={onToggleCamera}
        className="p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/40 hover:bg-card transition-all duration-300 shadow-lg"
      >
        <FaSync className="w-6 h-6 text-primary" />
      </button>
    </div>
  );
}; 