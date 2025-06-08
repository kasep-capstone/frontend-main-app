import { useState, useRef, useEffect } from 'react';

export const useCameraControls = () => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  return {
    isFlashOn,
    isFrontCamera,
    isLoading,
    videoRef,
    streamRef,
    startCamera,
    stopCamera,
    toggleFlash,
    toggleCamera,
  };
}; 