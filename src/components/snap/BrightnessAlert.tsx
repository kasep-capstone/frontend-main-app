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
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg">
      Preview terlalu gelap! Pastikan pencahayaan cukup.
    </div>
  );
}; 