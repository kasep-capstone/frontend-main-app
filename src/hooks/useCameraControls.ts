import { useState, useRef, useEffect } from 'react';

export const useCameraControls = () => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [flashSupported, setFlashSupported] = useState(false);
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
        
        // Check if torch/flash is supported
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const capabilities = videoTrack.getCapabilities() as any;
          if (capabilities.torch) {
            setFlashSupported(true);
          } else {
            setFlashSupported(false);
            console.log('Torch/Flash not supported on this device');
          }
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // Reset flash state when camera stops
    setIsFlashOn(false);
    setFlashSupported(false);
  };

  const toggleFlash = async () => {
    if (!streamRef.current || !flashSupported) {
      console.log('Flash not supported or camera not active');
      return;
    }

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const newFlashState = !isFlashOn;
        await videoTrack.applyConstraints({
          advanced: [{ torch: newFlashState } as any]
        });
        setIsFlashOn(newFlashState);
        console.log(`Flash ${newFlashState ? 'ON' : 'OFF'}`);
      }
    } catch (err) {
      console.error('Error toggling flash:', err);
      // Fallback: just update the state for UI feedback even if flash doesn't work
      setIsFlashOn(!isFlashOn);
    }
  };

  const toggleCamera = () => {
    // Turn off flash when switching camera (front camera doesn't support flash)
    setIsFlashOn(false);
    setIsFrontCamera(!isFrontCamera);
  };

  return {
    isFlashOn,
    isFrontCamera,
    isLoading,
    flashSupported,
    videoRef,
    streamRef,
    startCamera,
    stopCamera,
    toggleFlash,
    toggleCamera,
  };
}; 