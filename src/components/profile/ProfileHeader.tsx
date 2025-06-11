import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, User } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface ProfileHeaderProps {
  profileImage: string | null;
  formData: UserProfile;
  onImageUpload: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImage,
  formData,
  onImageUpload
}) => {
  // Calculate age from birthDate
  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Format display name
  const displayName = `${formData.firstName} ${formData.lastName}`.trim() || 'User';
  const age = calculateAge(formData.birthDate);

  // Format gender for display
  const formatGender = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male': return 'Laki-laki';
      case 'female': return 'Perempuan';
      case 'other': return 'Lainnya';
      default: return gender;
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center shadow-lg">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-amber-600" />
              )}
            </div>
            <button
              onClick={onImageUpload}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-600 hover:bg-amber-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="text-center">
            <h1 className="text-xl font-bold mb-1">{displayName}</h1>
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
              {formData.authProvider === 'google' && (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Gender:</span> {formatGender(formData.gender)}
              </div>
              {age !== null && (
                <div>
                  <span className="font-medium">Umur:</span> {age} tahun
                </div>
              )}
            </div>
            <div className="mt-3 space-y-2">
              <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-700">{formData.targetCalories?.toLocaleString()}</div>
                  <div className="text-xs text-amber-600">Target Kalori Harian</div>
                </div>
              </div>
              {formData.targetCalories !== null && (
                <div className="text-xs text-center text-muted-foreground">
                  *Berdasarkan perhitungan BMI terbaru Anda
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 