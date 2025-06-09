import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Heart, TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { BMIRecommendations as BMIRecommendationsType } from '@/types/bmi';

interface BMIRecommendationsProps {
  recommendations: BMIRecommendationsType;
  bmi: number;
}

export const BMIRecommendations: React.FC<BMIRecommendationsProps> = ({
  recommendations,
  bmi
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return TrendingUp;
      case 'CheckCircle': return CheckCircle;
      case 'TrendingDown': return TrendingDown;
      case 'AlertCircle': return AlertCircle;
      default: return TrendingUp;
    }
  };

  const IconComponent = getIconComponent(recommendations.icon);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            recommendations.iconColor === 'text-blue-600' ? 'bg-blue-100' :
            recommendations.iconColor === 'text-green-600' ? 'bg-green-100' :
            recommendations.iconColor === 'text-yellow-600' ? 'bg-yellow-100' :
            'bg-red-100'
          }`}>
            <IconComponent className={`w-5 h-5 ${recommendations.iconColor}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{recommendations.title}</h3>
            <p className="text-sm text-muted-foreground">Rekomendasi Personal</p>
          </div>
        </div>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{isExpanded ? 'Sembunyikan' : 'Lihat Detail'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </motion.button>
      </div>
      
      {!isExpanded && (
        <div className="text-sm text-muted-foreground mb-4">
          <p className="mb-2">{recommendations.description}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="text-sm font-medium text-amber-800">
              📋 {recommendations.recommendations.length} rekomendasi tersedia - klik "Lihat Detail" untuk melihat semua tips
            </div>
          </div>
        </div>
      )}
      
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="pb-4">
          <p className="text-sm text-muted-foreground mb-4">
            {recommendations.description}
          </p>
          
          <div className="space-y-3">
            {recommendations.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  recommendations.iconColor === 'text-blue-600' ? 'bg-blue-600' :
                  recommendations.iconColor === 'text-green-600' ? 'bg-green-600' :
                  recommendations.iconColor === 'text-yellow-600' ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}>
                  {index + 1}
                </div>
                <p className="text-sm text-foreground flex-1 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
          
          {/* Additional tip based on BMI category */}
          <div className={`mt-4 p-3 rounded-lg ${
            recommendations.iconColor === 'text-blue-600' ? 'bg-blue-50 border border-blue-200' :
            recommendations.iconColor === 'text-green-600' ? 'bg-green-50 border border-green-200' :
            recommendations.iconColor === 'text-yellow-600' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <Heart className={`w-4 h-4 ${recommendations.iconColor}`} />
              <span className={`text-sm font-medium ${recommendations.iconColor}`}>
                Tips Tambahan:
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {bmi < 18.5 ? 'Ingat, penambahan berat badan yang sehat adalah 0.5-1 kg per minggu.' :
               bmi < 25 ? 'Lakukan pemeriksaan BMI secara rutin setiap bulan untuk memantau kondisi tubuh.' :
               bmi < 30 ? 'Target penurunan berat badan yang sehat adalah 0.5-1 kg per minggu.' :
               'Konsultasi rutin dengan profesional kesehatan sangat direkomendasikan untuk kondisi Anda.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 