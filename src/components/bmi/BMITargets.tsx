import React from 'react';
import { Flag, Scale, Target, Zap, Clock } from 'lucide-react';
import { BMIIdealTargets } from '@/types/bmi';

interface BMITargetsProps {
  idealTargets: BMIIdealTargets;
}

export const BMITargets: React.FC<BMITargetsProps> = ({ idealTargets }) => {
  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Flag className="w-5 h-5 text-amber-600" />
        <h4 className="font-semibold text-lg">Target Ideal Anda</h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Scale className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Berat Badan Ideal</span>
          </div>
          <div className="text-xl font-bold text-amber-700">
            {idealTargets.targetWeight} kg
          </div>
          <div className="text-xs text-amber-600">Range: {idealTargets.weightRange}</div>
        </div>
       
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Target BMI</span>
          </div>
          <div className="text-xl font-bold text-green-700">{idealTargets.targetBMI}</div>
          <div className="text-xs text-green-600">BMI Optimal</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Target Kalori</span>
          </div>
          <div className="text-xl font-bold text-blue-700">
            {idealTargets.targetCalories.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600">kalori/hari</div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Estimasi Waktu</span>
          </div>
          <div className="text-xl font-bold text-yellow-700">{idealTargets.timeEstimate}</div>
          <div className="text-xs text-yellow-600">dengan konsistensi</div>
        </div>
      </div>
      
      {/* Set Goals Button - Now shown as info only */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Target className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Target Personal</span>
        </div>
        <p className="text-xs text-amber-700">
          Gunakan tombol "Simpan Pengukuran" untuk melihat preview dan opsi menetapkan target
        </p>
      </div>
    </>
  );
}; 