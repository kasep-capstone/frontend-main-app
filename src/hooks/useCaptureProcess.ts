import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useCaptureProcess = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isFrontCamera: boolean,
  stopCamera: () => void,
  startCamera: () => void
) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const router = useRouter();
  const isCancelled = useRef(false);

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

  const handleUpload = async (imageUrl: string) => {
    // Set the uploaded image as captured image
    setCapturedImage(imageUrl);
    
    // Stop the camera
    stopCamera();
    
    setIsCapturing(true);
    isCancelled.current = false;
    
    try {
      // Same backend processing time as capture
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Only navigate if not cancelled
      if (!isCancelled.current) {
        router.push('/snap/result');
      }
    } catch (error) {
      console.error('Error during upload analysis:', error);
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

  return {
    isCapturing,
    showCancel,
    capturedImage,
    handleCapture,
    handleUpload,
    handleCancelCapture,
  };
}; 