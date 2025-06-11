'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MenuBarTop } from '@/components/menu-bar-top';
import { MenuBar } from '@/components/menu-bar';
import { BMIForm } from '@/components/bmi/BMIForm';
import { BMIResults } from '@/components/bmi/BMIResults';
import { BMIRecommendations } from '@/components/bmi/BMIRecommendations';
import { BMITargets } from '@/components/bmi/BMITargets';
import { Calculator, History, Target, Activity, BarChart3, AlertCircle, TrendingUp, CheckCircle, TrendingDown } from 'lucide-react';
import { useBMI } from '@/hooks/useBMI';
import { useBMIHistory } from '@/hooks/useBMIHistory';
import { formatDate, getBMIColor } from '@/utils/bmi';
import Link from 'next/link';
import { ProtectedPageContent } from '@/components/auth/ProtectedPage';

export default function BmiPage() {
  const [isActivityExpanded, setIsActivityExpanded] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const {
    formData,
    updateFormData,
    results,
    idealTargets,
    recommendations,
    progress,
    hasSetGoals,
    setHasSetGoals,
    isDataLoaded,
    saveRecord,
    activityLevels
  } = useBMI();

  const { totalRecords, getLatestRecord } = useBMIHistory();

  const latestRecord = getLatestRecord();
  const lastRecordDate = latestRecord?.date || null;

  // Helper function to get icon component from string
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return TrendingUp;
      case 'CheckCircle': return CheckCircle;
      case 'TrendingDown': return TrendingDown;
      case 'AlertCircle': return AlertCircle;
      default: return Target;
    }
  };

  const handleShowPreview = () => {
    setShowPreviewModal(true);
  };

  const handleSaveWithGoals = async () => {
    try {
      setHasSetGoals(true);
      await saveRecord(true);
      setShowPreviewModal(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error saving BMI record with goals:', error);
      setShowPreviewModal(false);
      if (error instanceof Error && error.message.includes('Authentication required')) {
        alert('Silakan login terlebih dahulu untuk menyimpan data BMI.');
      } else {
        alert('Gagal menyimpan data BMI. Silakan coba lagi.');
      }
    }
  };

  const handleSaveWithoutGoals = async () => {
    try {
      await saveRecord(false);
      setShowPreviewModal(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error saving BMI record:', error);
      setShowPreviewModal(false);
      if (error instanceof Error && error.message.includes('Authentication required')) {
        alert('Silakan login terlebih dahulu untuk menyimpan data BMI.');
      } else {
        alert('Gagal menyimpan data BMI. Silakan coba lagi.');
      }
    }
  };

  const handleCancelPreview = () => {
    setShowPreviewModal(false);
  };

  return (
    <>
    <ProtectedPageContent>
      <MenuBarTop />
      <div className="min-h-screen bg-background pt-16 pb-20">
        <div className="max-w-md mx-auto px-4">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Calculator className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">BMI Kalkulator</h1>
                <p className="text-muted-foreground">
                  Track kalori dan BMI Anda
                </p>
              </div>
              <Link href="/bmi/history">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center"
                >
                  <History className="w-6 h-6 text-amber-600" />
                  {totalRecords > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {totalRecords > 99 ? '99+' : totalRecords}
                    </div>
                  )}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Main Stats Cards */}
          {results && (
            <BMIResults
              results={results}
              idealTargets={idealTargets}
              progress={progress}
              hasSetGoals={hasSetGoals}
            />
          )}

          {/* Input Section */}
          <BMIForm
            formData={formData}
            onFormDataChange={updateFormData}
            activityLevels={activityLevels}
            isActivityExpanded={isActivityExpanded}
            onActivityExpandedChange={setIsActivityExpanded}
            showDataLoadedBanner={isDataLoaded}
            lastRecordDate={lastRecordDate}
          />

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShowPreview}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 my-6"
          >
            Simpan Pengukuran
          </motion.button>

          {/* Recommendations Section */}
          {recommendations && results && (
            <BMIRecommendations
              recommendations={recommendations}
              bmi={results.bmi}
            />
          )}

          {/* Targets Section */}
          {idealTargets && recommendations && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm my-6">
              <BMITargets idealTargets={idealTargets} />
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card border border-border rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
                  <Calculator className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Preview Pengukuran BMI</h3>
                  <p className="text-sm text-muted-foreground">Tinjau data dan pilih cara menyimpan</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Current Data Summary */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-amber-600" />
                  <span>Ringkasan Data Anda</span>
                </h4>

                <div className="space-y-3">
                  {/* Basic Info */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-amber-600 font-medium">Umur:</span>
                        <div className="font-bold">{formData.age} tahun</div>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Jenis Kelamin:</span>
                        <div className="font-bold">{formData.gender === 'male' ? 'Pria' : 'Wanita'}</div>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Tinggi:</span>
                        <div className="font-bold">{formData.height} cm</div>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Berat:</span>
                        <div className="font-bold">{formData.weight} kg</div>
                      </div>
                    </div>
                  </div>

                  {/* BMI Result */}
                  {results && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600 mb-2">BMI & Status Kesehatan</div>
                        <div className={`text-2xl font-bold mb-1 ${getBMIColor(results.bmi)}`}>{results.bmi.toFixed(1)}</div>
                        <div className={`text-sm font-semibold mb-1 ${getBMIColor(results.bmi)}`}>{results.healthStatus}</div>
                        <div className={`text-xs ${getBMIColor(results.bmi)}`}>{results.category}</div>
                      </div>
                    </div>
                  )}

                  {/* Activity & Calories */}
                  {results && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-orange-600 font-medium">Aktivitas:</span>
                          <div className="font-bold">{activityLevels.find(level => level.value === formData.activityLevel)?.label}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-orange-600 font-medium">Target Kalori:</span>
                          <div className="font-bold">{results.targetCalories.toLocaleString()} cal/hari</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations Preview */}
              {recommendations && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    {React.createElement(getIconComponent(recommendations.icon), { className: `w-4 h-4 ${recommendations.iconColor}` })}
                    <span>Rekomendasi untuk Anda</span>
                  </h4>

                                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="text-center mb-3">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${recommendations.iconColor === 'text-blue-600' ? 'bg-blue-50 text-blue-800' :
                          recommendations.iconColor === 'text-green-600' ? 'bg-green-50 text-green-800' :
                            recommendations.iconColor === 'text-yellow-600' ? 'bg-amber-50 text-amber-800' :
                              'bg-red-50 text-red-800'
                        }`}>
                        {React.createElement(getIconComponent(recommendations.icon), { className: 'w-4 h-4' })}
                        <span>{recommendations.title}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 text-center">{recommendations.description}</p>

                    <div className="space-y-2">
                      {recommendations.recommendations.slice(0, 2).map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${recommendations.iconColor === 'text-blue-600' ? 'bg-blue-600' :
                              recommendations.iconColor === 'text-green-600' ? 'bg-green-600' :
                                recommendations.iconColor === 'text-yellow-600' ? 'bg-amber-600' :
                                  'bg-red-600'
                            }`}>
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                        </div>
                      ))}
                      {recommendations.recommendations.length > 2 && (
                        <div className="text-xs text-muted-foreground italic ml-7">
                          +{recommendations.recommendations.length - 2} rekomendasi lainnya akan tersimpan
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Target Preview (if with goals) */}
              {idealTargets && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Target Ideal (Opsional)</span>
                  </h4>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-green-800 font-medium mb-1">Target BMI</div>
                        <div className="text-lg font-bold text-green-600">{idealTargets.targetBMI || 'N/A'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-800 font-medium mb-1">Target Berat</div>
                        <div className="text-lg font-bold text-green-600">{idealTargets.targetWeight || 0} kg</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-800 font-medium mb-1">Target Kalori</div>
                        <div className="text-lg font-bold text-green-600">{idealTargets.targetCalories?.toLocaleString() || '0'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-800 font-medium mb-1">Estimasi Waktu</div>
                        <div className="text-lg font-bold text-green-600">{idealTargets.timeEstimate || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-amber-800">Pilihan Penyimpanan:</div>
                    <div className="text-xs text-amber-700 mt-1">
                      • <strong>Simpan Saja:</strong> Menyimpan data pengukuran tanpa menetapkan target<br />
                      • <strong>Simpan + Target:</strong> Menyimpan data dengan target dan rencana kesehatan personal
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col space-y-3 p-6 border-t border-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveWithGoals}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium shadow-md"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Simpan + Tetapkan Target</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveWithoutGoals}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Simpan Saja</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelPreview}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg transition-colors font-medium border border-gray-300"
              >
                Batal
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <MenuBar />
      </div>
    </ProtectedPageContent>
    </>
  );
};