import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface CaptureLoadingScreenProps {
  isCapturing: boolean;
  capturedImage: string | null;
  isFrontCamera: boolean;
  showCancel: boolean;
  onCancel: () => void;
}

export const CaptureLoadingScreen: React.FC<CaptureLoadingScreenProps> = ({
  isCapturing,
  capturedImage,
  isFrontCamera,
  showCancel,
  onCancel,
}) => {
  if (!isCapturing) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm px-4 sm:px-8">
      {capturedImage && (
        <div className="w-full max-w-xs sm:max-w-md h-auto mx-auto mb-6 sm:mb-8 rounded-xl overflow-hidden border border-border/40 shadow-lg">
          <div className="relative aspect-[4/3] w-full">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
              style={{
                transform: isFrontCamera ? 'scaleX(-1)' : 'none'
              }}
            />
          </div>
        </div>
      )}
      
      <div className="relative mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 sm:border-4 border-primary rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-primary rounded-full animate-ping opacity-75" />
        </div>
      </div>
      
      <div className="text-center max-w-sm mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-wider mb-2">
          Sedang diproses
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base tracking-wider">
          Proses analisa bahan...
        </p>
        
        {showCancel && (
          <div className="mt-8 sm:mt-10">
            <p className="text-muted-foreground text-sm sm:text-base tracking-wider mb-4 sm:mb-6">
              Kelamaan nunggu?
            </p>
            <button
              onClick={onCancel}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-destructive hover:bg-destructive/90 text-white rounded-full transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg text-sm sm:text-base font-medium"
            >
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
              Batalkan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 