import React from 'react';
import { Target, Activity, Heart } from 'lucide-react';
import { BMIResults as BMIResultsType, BMIIdealTargets, BMIProgress } from '@/types/bmi';
import { getBMIColor } from '@/utils/bmi';

interface BMIResultsProps {
  results: BMIResultsType;
  idealTargets?: BMIIdealTargets | null;
  progress?: BMIProgress | null;
  hasSetGoals?: boolean;
}

export const BMIResults: React.FC<BMIResultsProps> = ({
  results,
  idealTargets,
  progress,
  hasSetGoals = false
}) => {
  const bmiColorClass = getBMIColor(results.bmi);

  return (
    <div className="space-y-4">
      {/* Target Calories Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold">Target Kalori Harian</h3>
          </div>
          {hasSetGoals && (
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium shadow-sm">
              Goals Set
            </span>
          )}
        </div>
        
        {hasSetGoals && idealTargets && progress ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-muted-foreground">
                  {results.targetCalories.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Saat ini</div>
              </div>
              <div className="mx-4">
                <div className="w-8 h-0.5 bg-amber-400 rounded-full shadow-sm"></div>
              </div>
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-amber-600">
                  {idealTargets.targetCalories.toLocaleString()}
                </div>
                <div className="text-xs text-amber-600">Target</div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <div className="text-sm font-medium text-amber-800">
                {progress.calorieDirection === 'maintain' ? 'Pertahankan kalori saat ini' :
                 progress.calorieDirection === 'increase' ? `Tambah ${progress.calorieAdjustment} kalori/hari` :
                 `Kurangi ${progress.calorieAdjustment} kalori/hari`}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">
              {results.targetCalories.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">kalori per hari</div>
          </div>
        )}
      </div>

      {/* BMI and Health Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">BMI</span>
          </div>
          
          {hasSetGoals && idealTargets && progress ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Saat ini:</span>
                <span className={`font-bold ${bmiColorClass}`}>
                  {results.bmi.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">Target:</span>
                <span className="font-bold text-green-600">{idealTargets.targetBMI}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1">
                <div className="text-xs text-amber-800 text-center font-medium">
                  {progress.bmiDirection === 'maintain' ? 'BMI sudah ideal' :
                   progress.bmiDirection === 'increase' ? `+${progress.bmiRemaining.toFixed(1)} untuk target` :
                   `-${progress.bmiRemaining.toFixed(1)} untuk target`}
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-xl font-bold ${bmiColorClass}`}>
              {results.bmi.toFixed(1)}
            </div>
          )}
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium">Status</span>
          </div>
          
          {hasSetGoals && idealTargets && progress ? (
            <div className="space-y-2">
              <div className="text-xs">
                <span className="text-muted-foreground">Saat ini:</span>
                <div className={`text-sm font-semibold ${bmiColorClass}`}>
                  {results.healthStatus}
                </div>
                <div className={`text-xs ${bmiColorClass}`}>{results.category}</div>
              </div>
              <div className="text-xs">
                <span className="text-green-600">Target:</span>
                <div className="text-sm font-semibold text-green-600">Berat Badan Ideal</div>
                <div className="text-xs text-green-600">Normal</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1">
                <div className="text-xs text-amber-800 text-center font-medium">
                  {progress.weightDirection === 'maintain' ? 'Pertahankan!' :
                   progress.weightDirection === 'gain' ? `+${progress.weightRemaining.toFixed(1)} kg lagi` :
                   `-${progress.weightRemaining.toFixed(1)} kg lagi`}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className={`text-sm font-semibold ${bmiColorClass}`}>
                {results.healthStatus}
              </div>
              <div className={`text-xs ${bmiColorClass}`}>{results.category}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 