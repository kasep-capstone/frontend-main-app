import React, { useEffect } from 'react';
import { BMIFormData, ActivityLevel } from '@/types/bmi';
import { getUserFromCookie } from '@/utils/auth-cookies';
import { getAge } from '@/utils/bmi';

interface BMIFormProps {
  formData: BMIFormData;
  onFormDataChange: (updates: Partial<BMIFormData>) => void;
  activityLevels: ActivityLevel[];
  isActivityExpanded: boolean;
  onActivityExpandedChange: (expanded: boolean) => void;
  showDataLoadedBanner?: boolean;
  lastRecordDate?: string | null;
}

export const BMIForm: React.FC<BMIFormProps> = ({
  formData,
  onFormDataChange,
  activityLevels,
  isActivityExpanded,
  onActivityExpandedChange,
  showDataLoadedBanner = false,
  lastRecordDate
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const userCookie = getUserFromCookie();
  const age = getAge(userCookie?.birthDate);
  const gender = userCookie?.gender;

  // Check if required fields are empty
  const isHeightEmpty = !formData.height || formData.height.trim() === '';
  const isWeightEmpty = !formData.weight || formData.weight.trim() === '';
  const hasRequiredFieldsEmpty = isHeightEmpty || isWeightEmpty;

  // Auto-populate age and gender from cookie
  useEffect(() => {
    if (age && gender) {
      onFormDataChange({
        age: age.toString(),
        gender: gender as 'male' | 'female'
      });
    }
  }, [age, gender, onFormDataChange]);

  return (
    <div className="space-y-6 mt-5">
      {/* Data Loaded Banner */}
      {showDataLoadedBanner && lastRecordDate && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-amber-800">
                Stats dihitung berdasarkan data terakhir
              </span>
            </div>
            <span className="text-xs text-amber-700 font-medium">
              {formatDate(lastRecordDate)}
            </span>
          </div>
        </div>
      )}

      {/* Required Fields Warning */}
      {hasRequiredFieldsEmpty && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <span className="text-sm font-medium text-red-800">
                Harap lengkapi data yang diperlukan:
              </span>
              <div className="text-xs text-red-700 mt-1">
                {isHeightEmpty && isWeightEmpty && "Tinggi badan dan berat badan wajib diisi"}
                {isHeightEmpty && !isWeightEmpty && "Tinggi badan wajib diisi"}
                {!isHeightEmpty && isWeightEmpty && "Berat badan wajib diisi"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pengukuran Terkini</h3>
          {showDataLoadedBanner && (
            <span className="text-xs bg-green-50 text-green-800 px-3 py-1 rounded-full font-medium shadow-sm">
              Data terakhir dimuat
            </span>
          )}
        </div>
        
        {/* Age and Gender */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Umur</label>
            <input
              type="number"
              value={age || formData.age}
              onChange={(e) => onFormDataChange({ age: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Umur belum diisi"
              disabled
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
            <input
              type="string"
              value={gender || formData.gender}
              onChange={(e) => onFormDataChange({ gender: e.target.value as 'male' | 'female' })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Gender belum diisi"
              disabled
            />
          </div>
        </div>

        {/* Height and Weight with Silhouette */}
        <div className="flex items-center justify-center w-full px-2">
          {/* Siluet Gambar */}
          <img 
            src="/boy-siluet.png" 
            alt="Boy Silhouette" 
            className="w-20 sm:w-28 md:w-32 h-64 sm:h-80 md:h-96 object-contain mr-4 sm:mr-6 md:mr-8 opacity-90 filter sepia brightness-[0.4] saturate-150 hue-rotate-15 drop-shadow-lg transition-all duration-300 hover:opacity-100 hover:brightness-[0.5]" 
          />
          <div className="flex flex-col justify-center">
            {/* Tinggi */}
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="flex flex-col text-foreground items-center">
                <div className="flex flex-col items-center mr-2 sm:mr-4">
                  <div className="w-0 h-0 border-x-4 sm:border-x-6 md:border-x-8 border-x-transparent border-b-[8px] sm:border-b-[12px] md:border-b-[16px] border-gray-400"></div>
                  <div className="w-0.5 sm:w-1 h-8 sm:h-12 md:h-16 bg-gray-400"></div>
                </div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3 text-center">
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => onFormDataChange({ height: e.target.value })}
                    className={`w-16 sm:w-20 md:w-24 bg-transparent text-2xl sm:text-4xl md:text-5xl font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isHeightEmpty ? 'border-2 border-red-400 rounded-md px-1' : ''}`}
                    placeholder={isHeightEmpty ? "0" : ""}
                  />
                  <span className="text-sm sm:text-base md:text-lg font-normal ml-[-5px] sm:ml-[-8px] md:ml-[-10px]">cm</span>
                </div>
                <span className={`text-xs sm:text-sm mb-2 sm:mb-3 ${isHeightEmpty ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                  Tinggi {isHeightEmpty && '(Wajib diisi)'}
                </span>
                <div className="flex flex-col items-center mr-2 sm:mr-4">
                  <div className="w-0.5 sm:w-1 h-8 sm:h-12 md:h-16 bg-gray-400"></div>
                  <div className="w-0 h-0 border-x-4 sm:border-x-6 md:border-x-8 border-x-transparent border-t-[8px] sm:border-t-[12px] md:border-t-[16px] border-gray-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Berat */}
        <div className="flex flex-col text-foreground items-center w-full">
          <div className='flex flex-col items-center'>
            <div className="flex items-center ml-2 sm:ml-4">
              <div className="w-0 h-0 border-y-4 sm:border-y-6 md:border-y-8 border-y-transparent border-r-[8px] sm:border-r-[12px] md:border-r-[16px] border-gray-400"></div>
              <div className="w-24 sm:w-32 md:w-36 h-0.5 sm:h-1 bg-gray-400"></div>
              <div className="w-0 h-0 border-y-4 sm:border-y-6 md:border-y-8 border-y-transparent border-l-[8px] sm:border-l-[12px] md:border-l-[16px] border-gray-400"></div>
            </div>
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3 text-center">
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => onFormDataChange({ weight: e.target.value })}
                className={`w-14 sm:w-18 md:w-20 bg-transparent text-2xl sm:text-4xl md:text-5xl font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isWeightEmpty ? 'border-2 border-red-400 rounded-md px-1' : ''}`}
                placeholder={isWeightEmpty ? "0" : ""}
              />
              <span className="text-sm sm:text-base md:text-lg font-normal ml-[-5px] sm:ml-[-8px] md:ml-[-10px]">kg</span>
            </div>
            <span className={`text-xs sm:text-sm mt-1 ${isWeightEmpty ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
              Berat {isWeightEmpty && '(Wajib diisi)'}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Level Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Tingkat Aktivitas Harian</span>
            {showDataLoadedBanner && (
              <span className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded-full font-medium shadow-sm">
                Tersimpan
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white bg-muted px-2 py-1 rounded-full">Opsional</span>
            <button
              onClick={() => onActivityExpandedChange(!isActivityExpanded)}
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {isActivityExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>
        
        {!isActivityExpanded && (
          <div className="text-sm text-muted-foreground">
            Saat ini menggunakan tingkat aktivitas: <span className="font-medium text-foreground">{activityLevels.find(level => level.value === formData.activityLevel)?.label}</span>
          </div>
        )}
        
        {isActivityExpanded && (
          <div className="pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Pilih tingkat aktivitas untuk perkiraan kalori yang lebih akurat
            </p>
            
            <div className="space-y-3">
              {activityLevels.map((level) => (
                <div key={level.value} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id={level.value}
                    name="activityLevel"
                    value={level.value}
                    checked={formData.activityLevel === level.value}
                    onChange={(e) => onFormDataChange({ activityLevel: e.target.value })}
                    className="mt-1 w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500 focus:ring-2"
                  />
                  <label htmlFor={level.value} className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm">{level.label}</div>
                    <div className="text-xs text-muted-foreground">{level.description}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 