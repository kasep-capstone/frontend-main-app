import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Save, X, Settings } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface ProfileSettingsProps {
  isEditing: boolean;
  formData: UserProfile;
  onEditProfile: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: string, value: string) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isEditing,
  formData,
  onEditProfile,
  onSave,
  onCancel,
  onInputChange
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-600" />
          Pengaturan Profil
        </CardTitle>
        <CardDescription>
          Kelola informasi dan preferensi akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 hover:bg-amber-50 hover:border-amber-200"
              onClick={onEditProfile}
            >
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span>Edit Profil</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Nama</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Masukkan nama Anda"
              />
            </div>
            
            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Google</label>
              <div className="w-full px-3 py-2 border border-border rounded-lg bg-muted/30 text-muted-foreground flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{formData.email}</span>
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Terverifikasi</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Email ini terhubung dengan akun Google Anda</p>
            </div>
            
            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
              <select
                value={formData.gender}
                onChange={(e) => onInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>
            
            {/* Age Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Umur</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => onInputChange('age', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Masukkan umur Anda"
                min="1"
                max="120"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={onSave}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
              <Button 
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 