import React from 'react';

interface LoadingScreenProps {
  isVisible: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-amber-600 rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-amber-600 rounded-full animate-ping opacity-75" />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold text-amber-600 tracking-wider animate-pulse">
          KASEP
        </h1>
        <p className="text-amber-500 mt-2 text-sm tracking-wider animate-pulse">
          Capture your health
        </p>
      </div>
    </div>
  );
}; 