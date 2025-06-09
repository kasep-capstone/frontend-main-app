'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCameraControls, useBrightnessDetection, useCaptureProcess } from '@/hooks';
import { 
  LoadingScreen,
  CameraPreview,
  CaptureLoadingScreen,
  TopControls,
  BottomControls,
  BrightnessAlert
} from '@/components/snap';

export default function SnapPage() {
  const router = useRouter();
  
  const {
    isFlashOn,
    isFrontCamera,
    isLoading,
    videoRef,
    startCamera,
    stopCamera,
    toggleFlash,
    toggleCamera,
  } = useCameraControls();

  const { isTooDark, canvasRef } = useBrightnessDetection(videoRef, isLoading);

  const {
    isCapturing,
    showCancel,
    capturedImage,
    handleCapture,
    handleCancelCapture,
  } = useCaptureProcess(videoRef, canvasRef, isFrontCamera, stopCamera, startCamera);

  const handleGallery = () => {
    console.log('Open gallery');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Hidden canvas for brightness detection */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Brightness Alert */}
      <BrightnessAlert 
        isTooDark={isTooDark}
        isLoading={isLoading}
        isCapturing={isCapturing}
      />

      {/* Loading Screen */}
      <LoadingScreen isVisible={isLoading} />

      {/* Capture Loading Screen */}
      <CaptureLoadingScreen
        isCapturing={isCapturing}
        capturedImage={capturedImage}
        isFrontCamera={isFrontCamera}
        showCancel={showCancel}
        onCancel={handleCancelCapture}
      />

      {/* Camera Preview */}
      <CameraPreview
        videoRef={videoRef}
        isFrontCamera={isFrontCamera}
        isLoading={isLoading}
      />

      {/* Top Controls */}
      <TopControls
        isLoading={isLoading}
        isFlashOn={isFlashOn}
        onToggleFlash={toggleFlash}
        onToggleCamera={toggleCamera}
      />

      {/* Bottom Controls */}
      <BottomControls
        isLoading={isLoading}
        isCapturing={isCapturing}
        isTooDark={isTooDark}
        onGallery={handleGallery}
        onCapture={handleCapture}
        onBack={handleBack}
      />
    </div>
  );
}