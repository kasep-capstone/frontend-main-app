import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RetrySectionProps {
  onRetryDetection: () => void;
}

export const RetrySection: React.FC<RetrySectionProps> = ({
  onRetryDetection,
}) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <p className="text-muted-foreground mb-4 text-center">
        Tidak menemukan resep yang sesuai?
      </p>
      <Button 
        onClick={onRetryDetection}
        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:scale-[1.02]"
      >
        <Camera className="w-4 h-4" />
        Deteksi Ulang Bahan
      </Button>
    </div>
  );
}; 