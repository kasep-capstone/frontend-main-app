import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Activity, Target, Trash2, Eye } from 'lucide-react';
import { BMIRecord } from '@/types/bmi';
import { getBMIColor, getBMIBgColor, getActivityLevelText, formatDate } from '@/utils/bmi';

interface BMIHistoryListProps {
  history: BMIRecord[];
  onDeleteRecord: (id: string) => void;
}

export const BMIHistoryList: React.FC<BMIHistoryListProps> = ({
  history,
  onDeleteRecord
}) => {
  const [selectedRecord, setSelectedRecord] = useState<BMIRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'underweight': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overweight': return <TrendingDown className="w-4 h-4 text-yellow-600" />;
      case 'obese': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const handleDeleteConfirm = (id: string) => {
    onDeleteRecord(id);
    setShowDeleteConfirm(null);
  };

  return (
    <>
      <div className="space-y-4">
        {history.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-card border border-border rounded-lg p-4 shadow-sm ${getBMIBgColor(record.bmi)} ${record.hasGoals ? 'ring-2 ring-amber-200' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {new Date(record.date).toLocaleDateString('id-ID', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                {record.hasGoals && (
                  <span className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                    Target Set
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {getCategoryIcon(record.category)}
                <span className={`text-sm font-medium ${getBMIColor(record.bmi)}`}>
                  {record.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className={`text-lg font-bold ${getBMIColor(record.bmi)}`}>
                  {record.bmi.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">BMI</div>
                {record.hasGoals && record.idealTargets && (
                  <div className="text-xs text-amber-600 mt-1">
                    → {record.idealTargets.targetBMI || 'N/A'}
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">
                  {record.weight}kg
                </div>
                <div className="text-xs text-muted-foreground">Berat</div>
                {record.hasGoals && record.idealTargets && (
                  <div className="text-xs text-amber-600 mt-1">
                    → {record.idealTargets.targetWeight || 0}kg
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">
                  {record.targetCalories.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-muted-foreground">Kalori</div>
                {record.hasGoals && record.idealTargets && (
                  <div className="text-xs text-amber-600 mt-1">
                    → {record.idealTargets.targetCalories?.toLocaleString('id-ID') || '0'}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar untuk Goals */}
            {record.hasGoals && record.progress && (
              <div className="mb-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-amber-800">Progress Target:</span>
                  <span className="text-amber-600">
                    {record.idealTargets?.timeEstimate || 'N/A'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-amber-700">
                  {record.progress.weightDirection === 'maintain' ? 'Pertahankan berat badan' :
                   record.progress.weightDirection === 'gain' ? `Perlu menambah ${record.progress.weightRemaining.toFixed(1)} kg` :
                   `Perlu mengurangi ${record.progress.weightRemaining.toFixed(1)} kg`}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {record.healthStatus} • {record.height}cm • {record.age}th • {getActivityLevelText(record.activityLevel)}
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(record.id)}
                  className="p-1 text-muted-foreground hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Detail View */}
            {selectedRecord?.id === record.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Jenis Kelamin:</span>
                    <div className="font-medium">{record.gender === 'male' ? 'Pria' : 'Wanita'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Aktivitas:</span>
                    <div className="font-medium">{getActivityLevelText(record.activityLevel)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tinggi:</span>
                    <div className="font-medium">{record.height} cm</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Umur:</span>
                    <div className="font-medium">{record.age} tahun</div>
                  </div>
                </div>

                {/* Recommendations jika ada */}
                {record.hasGoals && record.recommendations && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>Rekomendasi yang Ditetapkan:</span>
                    </h4>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                      <div className={`text-sm font-medium mb-2 ${record.recommendations.iconColor}`}>
                        {record.recommendations.title}
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">
                        {record.recommendations.description}
                      </div>
                      <div className="space-y-2">
                        {record.recommendations.recommendations.slice(0, 3).map((rec, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              record.recommendations!.iconColor === 'text-blue-600' ? 'bg-blue-600' :
                              record.recommendations!.iconColor === 'text-green-600' ? 'bg-green-600' :
                              record.recommendations!.iconColor === 'text-yellow-600' ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}>
                              {idx + 1}
                            </div>
                            <p className="text-xs text-foreground leading-relaxed">{rec}</p>
                          </div>
                        ))}
                        {record.recommendations.recommendations.length > 3 && (
                          <div className="text-xs text-muted-foreground italic">
                            +{record.recommendations.recommendations.length - 3} rekomendasi lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg p-6 mx-4 max-w-sm w-full"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Hapus Riwayat</h3>
                <p className="text-sm text-muted-foreground">Apakah Anda yakin?</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Riwayat BMI yang dihapus tidak dapat dipulihkan.
            </p>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-muted text-white py-2 px-4 rounded-md hover:bg-muted/80 transition-colors"
              >
                Batal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Hapus
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}; 