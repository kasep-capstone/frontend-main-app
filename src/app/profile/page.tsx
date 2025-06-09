"use client"
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Trash2, Twitter, Instagram, Camera, User, Edit3, Save, X, Settings, Shield, Link as LinkIcon, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

// Modal Types
type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'prompt';

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  promptValue?: string;
  onPromptChange?: (value: string) => void;
  promptPlaceholder?: string;
}

// Custom Modal Component
const CustomModal: React.FC<ModalState & { onClose: () => void }> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  onClose,
  confirmText = 'OK',
  cancelText = 'Batal',
  promptValue = '',
  onPromptChange,
  promptPlaceholder = ''
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-12 h-12 text-amber-500" />;
      case 'info':
        return <Info className="w-12 h-12 text-blue-500" />;
      case 'confirm':
      case 'prompt':
        return <AlertTriangle className="w-12 h-12 text-amber-500" />;
      default:
        return <Info className="w-12 h-12 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'confirm':
      case 'prompt':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 ${getBgColor()}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-center mb-4">
            {getIcon()}
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-center mb-3 text-gray-800">
            {title}
          </h3>
          
          {/* Message */}
          <div className="text-sm text-gray-600 text-center mb-6 whitespace-pre-line">
            {message}
          </div>
          
          {/* Prompt Input */}
          {type === 'prompt' && (
            <div className="mb-6">
              <input
                type="text"
                value={promptValue}
                onChange={(e) => onPromptChange?.(e.target.value)}
                placeholder={promptPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center font-mono"
                autoFocus
              />
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex gap-3">
            {(type === 'confirm' || type === 'prompt') && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 hover:bg-gray-50"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {confirmText}
                </Button>
              </>
            )}
            {(type === 'success' || type === 'error' || type === 'warning' || type === 'info') && (
              <Button
                onClick={onClose}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [targetCalories, setTargetCalories] = useState<number>(2500); // Default value
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@gmail.com', // Google account email
    gender: 'Male',
    age: '25'
  });

  // Store original data for cancel functionality
  const [originalFormData, setOriginalFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    gender: 'Male',
    age: '25'
  });

  // Modal state
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Modal helper functions
  const showModal = (config: Partial<ModalState>) => {
    setModal({
      isOpen: true,
      type: 'info',
      title: '',
      message: '',
      ...config
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const showAlert = (type: ModalType, title: string, message: string) => {
    showModal({ type, title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    showModal({
      type: 'confirm',
      title,
      message,
      onConfirm,
      confirmText: 'Ya',
      cancelText: 'Tidak'
    });
  };

  const showPrompt = (title: string, message: string, placeholder: string, onConfirm: (value: string) => void) => {
    let promptValue = '';
    
    showModal({
      type: 'prompt',
      title,
      message,
      promptValue: '',
      promptPlaceholder: placeholder,
      onPromptChange: (value: string) => {
        promptValue = value;
        setModal(prev => ({ ...prev, promptValue: value }));
      },
      onConfirm: () => onConfirm(promptValue),
      confirmText: 'Konfirmasi',
      cancelText: 'Batal'
    });
  };

  // Function to get target calories from BMI data
  const getTargetCaloriesFromBMI = (): number => {
    try {
      const bmiHistory = localStorage.getItem('bmiHistory');
      if (bmiHistory) {
        const history = JSON.parse(bmiHistory);
        if (history.length > 0) {
          // Get the most recent BMI record
          const latestRecord = history[0];
          return latestRecord.targetCalories || 2500;
        }
      }
    } catch (error) {
      console.error('Error reading BMI data:', error);
    }
    return 2500; // Default fallback
  };

  // Load target calories from BMI data on component mount
  useEffect(() => {
    const calories = getTargetCaloriesFromBMI();
    setTargetCalories(calories);

    // Load saved profile data from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        setFormData(profileData);
        setOriginalFormData(profileData);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }

    // Load saved profile image
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Function to update calories when window regains focus
    const handleFocus = () => {
      const updatedCalories = getTargetCaloriesFromBMI();
      setTargetCalories(updatedCalories);
    };

    // Add event listener for window focus
    window.addEventListener('focus', handleFocus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation functions
  const validateForm = () => {
    if (!formData.name.trim()) {
      showAlert('error', 'Validasi Gagal', 'Nama tidak boleh kosong!');
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      showAlert('error', 'Validasi Gagal', 'Nama harus memiliki minimal 2 karakter!');
      return false;
    }
    
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1 || age > 120) {
      showAlert('error', 'Validasi Gagal', 'Umur harus berupa angka antara 1-120 tahun!');
      return false;
    }
    
    return true;
  };

  // Edit Profile Functions
  const handleEditProfile = () => {
    setOriginalFormData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(formData));
      setOriginalFormData({ ...formData });
      setIsEditing(false);
      showAlert('success', 'Berhasil', 'Profil berhasil disimpan!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showAlert('error', 'Gagal', 'Gagal menyimpan profil. Silakan coba lagi.');
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({ ...originalFormData });
    setIsEditing(false);
  };

  // Profile Image Functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'File Terlalu Besar', 'Ukuran file terlalu besar! Maksimal 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showAlert('error', 'Tipe File Salah', 'File harus berupa gambar!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setProfileImage(imageData);
        
        try {
          localStorage.setItem('profileImage', imageData);
          showAlert('success', 'Berhasil', 'Foto profil berhasil diubah!');
        } catch (error) {
          console.error('Error saving profile image:', error);
          showAlert('error', 'Gagal', 'Gagal menyimpan foto profil. File mungkin terlalu besar.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
    fileInput?.click();
  };

  // Social Media Functions
  const handleConnectTwitter = () => {
    showConfirm(
      'Hubungkan Twitter',
      '🐦 Apakah Anda ingin menghubungkan akun Twitter Anda?\n\nAnda akan diarahkan ke halaman otorisasi Twitter.',
      () => {
        // Simulate Twitter connection
        setTimeout(() => {
          showAlert('success', 'Twitter Terhubung', 'Akun Twitter berhasil terhubung!\n\n@johndoe_nutrition');
        }, 1500);
      }
    );
  };

  const handleConnectInstagram = () => {
    showConfirm(
      'Hubungkan Instagram',
      '📸 Apakah Anda ingin menghubungkan akun Instagram Anda?\n\nAnda akan diarahkan ke halaman otorisasi Instagram.',
      () => {
        // Simulate Instagram connection
        setTimeout(() => {
          showAlert('success', 'Instagram Terhubung', 'Akun Instagram berhasil terhubung!\n\n@johndoe_healthy');
        }, 1500);
      }
    );
  };

  // Account Actions
  const handleLogout = () => {
    showConfirm(
      'Konfirmasi Logout',
      '🚪 Apakah Anda yakin ingin keluar?\n\nAnda perlu login kembali untuk mengakses aplikasi.',
      () => {
        try {
          // Clear user session data but keep profile data
          localStorage.removeItem('userSession');
          showAlert('success', 'Logout Berhasil', 'Anda berhasil logout!\n\nSampai jumpa lagi! 👋');
          
          // Redirect to login page
          // window.location.href = '/login';
        } catch (error) {
          console.error('Error during logout:', error);
          showAlert('error', 'Logout Gagal', 'Terjadi kesalahan saat logout. Silakan coba lagi.');
        }
      }
    );
  };

  const handleDeleteAppData = () => {
    const confirmText = 'HAPUS DATA SAYA';
    
    showPrompt(
      'Peringatan: Hapus Semua Data',
      `⚠️ PERINGATAN: Tindakan ini akan menghapus SEMUA data aplikasi Anda!\n\nData yang akan dihapus:\n• Riwayat BMI dan kalori\n• Riwayat makanan\n• Pengaturan profil\n• Foto profil\n\nAkun Google Anda tetap aman dan tidak terpengaruh.\n\nKetik "${confirmText}" untuk melanjutkan:`,
      confirmText,
      (userInput: string) => {
        if (userInput === confirmText) {
          showConfirm(
            'Konfirmasi Final',
            '🔥 Apakah Anda BENAR-BENAR yakin?\n\nTindakan ini TIDAK DAPAT DIBATALKAN!',
            () => {
              try {
                // Clear all app data
                const keysToRemove = [
                  'userProfile',
                  'profileImage', 
                  'bmiHistory',
                  'foodHistory',
                  'dailyCalories',
                  'userPreferences'
                ];
                
                keysToRemove.forEach(key => {
                  localStorage.removeItem(key);
                });
                
                // Reset component state
                setFormData({
                  name: 'John Doe',
                  email: 'john.doe@gmail.com',
                  gender: 'Male',
                  age: '25'
                });
                setProfileImage(null);
                setTargetCalories(2500);
                setIsEditing(false);
                
                showAlert('success', 'Data Terhapus', 'Semua data aplikasi berhasil dihapus!\n\nAnda dapat mulai fresh dengan akun Google yang sama.');
              } catch (error) {
                console.error('Error deleting app data:', error);
                showAlert('error', 'Gagal Hapus Data', 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.');
              }
            }
          );
        } else {
          showAlert('error', 'Konfirmasi Salah', 'Teks konfirmasi tidak sesuai. Penghapusan dibatalkan.');
        }
      }
    );
  };

  return (
    <>
      <MenuBarTop/>
      <div className="bg-background pt-16">
        <div className="max-w-md mx-auto px-4 pb-8">
          
          {/* Profile Header Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center shadow-lg">
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
                    onClick={triggerImageUpload}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-600 hover:bg-amber-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                {/* User Info */}
                <div className="text-center">
                  <h1 className="text-xl font-bold mb-1">{formData.name}</h1>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Gender:</span> {formData.gender}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span> {formData.age}
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-amber-700">{targetCalories.toLocaleString()}</div>
                        <div className="text-xs text-amber-600">Target Kalori Harian</div>
                      </div>
                    </div>
                    {targetCalories !== 2500 && (
                      <div className="text-xs text-center text-muted-foreground">
                        *Berdasarkan perhitungan BMI terbaru Anda
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings Card */}
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
                    onClick={handleEditProfile}
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
                      onChange={(e) => handleInputChange('name', e.target.value)}
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
                      onChange={(e) => handleInputChange('gender', e.target.value)}
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
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Masukkan umur Anda"
                      min="1"
                      max="120"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={handleSave}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleCancel}
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

          {/* Social Media Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-amber-600" />
                Sosial Media
              </CardTitle>
              <CardDescription>
                Hubungkan akun sosial media Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:border-blue-200" onClick={handleConnectTwitter}>
                  <Twitter className="w-4 h-4 text-blue-500" />
                  <span>Hubungkan Twitter</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-pink-50 hover:border-pink-200" onClick={handleConnectInstagram}>
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>Hubungkan Instagram</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Integration Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Akun Google
              </CardTitle>
              <CardDescription>
                Kelola akun Google Anda yang terhubung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Connected Google Account */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <div className="flex-1">
                      <div className="font-medium text-green-800">Google Account Terhubung</div>
                      <div className="text-sm text-green-600">{formData.email}</div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      Aktif
                    </div>
                  </div>
                </div>
                
                {/* Google Account Management */}
                {/* <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:border-blue-200">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span>Kelola Akun Google</span>
                </Button> */}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-600" />
                Keamanan & Aksi
              </CardTitle>
              <CardDescription>
                Kelola sesi dan keamanan akun Google Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-orange-50 hover:border-orange-200" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 text-orange-600" />
                  <div className="flex flex-col items-start">
                    <span>Keluar</span>
                    <span className="text-xs text-muted-foreground">Logout dari aplikasi ini</span>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 hover:bg-red-50 hover:border-red-200 text-red-600 border-red-200" onClick={handleDeleteAppData}>
                  <Trash2 className="w-4 h-4" />
                  <div className="flex flex-col items-start">
                    <span>Hapus Data Aplikasi</span>
                    <span className="text-xs text-muted-foreground">Hapus semua data aplikasi, akun Google tetap aman</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hidden File Input */}
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

        </div>
      </div>
      <div className="flex justify-center mt-16">
        <MenuBar/>
      </div>
      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        promptValue={modal.promptValue}
        onPromptChange={modal.onPromptChange}
        promptPlaceholder={modal.promptPlaceholder}
      />
    </>
  );
}