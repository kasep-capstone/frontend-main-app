'use client'
import React, { useState, useRef, useEffect } from 'react';
import { FaLightbulb, FaCamera, FaImages, FaTimes, FaSync } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function SnapPage() {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [isTooDark, setIsTooDark] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const isCancelled = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      startCamera();
    }, 1500);

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [isFrontCamera]);

  useEffect(() => {
    let cancelTimer: NodeJS.Timeout;
    
    if (isCapturing) {
      cancelTimer = setTimeout(() => {
        setShowCancel(true);
      }, 5000);
    } else {
      setShowCancel(false);
    }

    return () => {
      if (cancelTimer) {
        clearTimeout(cancelTimer);
      }
    };
  }, [isCapturing]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 9 / 16 }
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // Capture the current frame
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image URL
    const imageUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageUrl);
    
    // Stop the camera
    stopCamera();
    
    setIsCapturing(true);
    isCancelled.current = false;
    
    try {
      // Simulate backend processing time (adjust this based on actual backend processing time)
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Only navigate if not cancelled
      if (!isCancelled.current) {
        router.push('/snap/result');
      }
    } catch (error) {
      console.error('Error during capture:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCancelCapture = () => {
    isCancelled.current = true;
    setIsCapturing(false);
    setShowCancel(false);
    startCamera();
  };

  const handleGallery = () => {
    console.log('Open gallery');
  };

  const handleBack = () => {
    router.push('/')
  };

  const checkBrightness = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Check if video has valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate average brightness
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        // Calculate brightness using RGB values
        const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        totalBrightness += brightness;
      }

      const averageBrightness = totalBrightness / (data.length / 4);
      // Threshold for darkness (adjust this value as needed)
      const isDark = averageBrightness < 50;
      setIsTooDark(isDark);
    } catch (error) {
      console.error('Error checking brightness:', error);
    }
  };

  useEffect(() => {
    let brightnessInterval: NodeJS.Timeout;

    const startBrightnessCheck = () => {
      if (!isLoading && videoRef.current && videoRef.current.readyState >= 2) {
        // Check brightness every 500ms
        brightnessInterval = setInterval(checkBrightness, 500);
      }
    };

    // Start checking when video is ready
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', startBrightnessCheck);
    }

    return () => {
      if (brightnessInterval) {
        clearInterval(brightnessInterval);
      }
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', startBrightnessCheck);
      }
    };
  }, [isLoading]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hidden canvas for brightness detection */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Dark Preview Alert */}
      {isTooDark && !isLoading && !isCapturing && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg">
          Preview terlalu gelap! Pastikan pencahayaan cukup.
        </div>
      )}

      {/* Initial Loading Animation */}
      {isLoading && (
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
      )}

      {/* Capture Loading Animation */}
      {isCapturing && (
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
                  onClick={handleCancelCapture}
                  className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <FaTimes className="w-4 h-4" />
                  Batalkan
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Camera Preview with Animation */}
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

      {/* Top Controls */}
      <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-center transition-opacity duration-1000 z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <button
          onClick={toggleFlash}
          className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
        >
          <FaLightbulb className={`w-6 h-6 text-amber-600 ${isFlashOn ? 'animate-pulse' : ''}`} />
        </button>
        <h1 className="text-2xl font-bold text-amber-600">KASEP</h1>
        <button
          onClick={toggleCamera}
          className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
        >
          <FaSync className="w-6 h-6 text-amber-600" />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center transition-opacity duration-1000 z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <button
          onClick={handleGallery}
          className="p-4 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
        >
          <FaImages className="w-8 h-8 text-amber-600" />
        </button>
        <button
          onClick={handleCapture}
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
          onClick={handleBack}
          className="p-4 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300"
        >
          <FaTimes className="w-8 h-8 text-amber-600" />
        </button>
      </div>
    </div>
  );
}