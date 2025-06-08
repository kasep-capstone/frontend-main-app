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
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      {capturedImage && (
        <div className="w-full h-auto m-8 rounded-lg overflow-hidden">
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-full object-cover"
            style={{
              transform: isFrontCamera ? 'scaleX(-1)' : 'none'
            }}
          />
        </div>
      )}
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-amber-600 rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-amber-600 rounded-full animate-ping opacity-75" />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-600 tracking-wider">
          Sedang diproses
        </h1>
        <p className="text-amber-500 mt-2 text-sm tracking-wider">
          Proses analisa bahan...
        </p>
        {showCancel && (
          <>
            <p className="text-amber-500 mt-10 text-sm tracking-wider">
              Kelamaan nunggu?
            </p>
            <button
              onClick={onCancel}
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <FaTimes className="w-4 h-4" />
              Batalkan
            </button>
          </>
        )}
      </div>
    </div>
  );
}; 