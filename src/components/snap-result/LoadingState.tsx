import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-base text-muted-foreground font-medium">
          Memuat rekomendasi...
        </p>
      </div>
    </div>
  );
}; 