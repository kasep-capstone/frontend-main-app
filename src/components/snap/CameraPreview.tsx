import React from 'react';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isFrontCamera: boolean;
  isLoading: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  isFrontCamera,
  isLoading,
}) => {
  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{
          transform: isFrontCamera ? 'scaleX(-1)' : 'none',
          objectPosition: 'center'
        }}
      />
      {/* ML-Optimized Guide Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main Frame */}
        <div className="absolute inset-0 mt-20 mb-36 mx-10 border-2 border-amber-600/50 rounded-lg">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-600/30 rounded-full">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-600/70 text-xs whitespace-nowrap">
              Posisikan bahan di dalam frame
            </div>
          </div>
          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-8 h-8">
            <div className="absolute top-0 left-0 w-4 h-0.5 bg-amber-600/70" />
            <div className="absolute top-0 left-0 h-4 w-0.5 bg-amber-600/70" />
          </div>
          <div className="absolute top-0 right-0 w-8 h-8">
            <div className="absolute top-0 right-0 w-4 h-0.5 bg-amber-600/70" />
            <div className="absolute top-0 right-0 h-4 w-0.5 bg-amber-600/70" />
          </div>
          <div className="absolute bottom-0 left-0 w-8 h-8">
            <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-amber-600/70" />
            <div className="absolute bottom-0 left-0 h-4 w-0.5 bg-amber-600/70" />
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8">
            <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-amber-600/70" />
            <div className="absolute bottom-0 right-0 h-4 w-0.5 bg-amber-600/70" />
          </div>
        </div>
        {/* Center focus point */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-0.5">
            <div className="absolute -left-1 -top-1 w-3 h-3 border-t border-l border-amber-600/50" />
            <div className="absolute -right-1 -top-1 w-3 h-3 border-t border-r border-amber-600/50" />
            <div className="absolute -left-1 -bottom-1 w-3 h-3 border-b border-l border-amber-600/50" />
            <div className="absolute -right-1 -bottom-1 w-3 h-3 border-b border-r border-amber-600/50" />
          </div>
        </div>
      </div>
    </div>
  );
}; 