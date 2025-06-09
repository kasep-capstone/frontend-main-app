import React from 'react';

interface BrightnessAlertProps {
  isTooDark: boolean;
  isLoading: boolean;
  isCapturing: boolean;
}

export const BrightnessAlert: React.FC<BrightnessAlertProps> = ({
  isTooDark,
  isLoading,
  isCapturing,
}) => {
  if (!isTooDark || isLoading || isCapturing) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-4 py-3 rounded-xl border border-destructive/20 shadow-lg">
      <p className="text-sm font-medium">Preview terlalu gelap! Pastikan pencahayaan cukup.</p>
    </div>
  );
}; 