import { useState, useRef, useEffect } from 'react';

export const useBrightnessDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isLoading: boolean
) => {
  const [isTooDark, setIsTooDark] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  }, [isLoading, videoRef]);

  return {
    isTooDark,
    canvasRef,
  };
}; 