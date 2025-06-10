import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/profile';
import { 
  getUserProfile, 
  saveUserProfile, 
  getProfileImage, 
  saveProfileImage,
  getTargetCaloriesFromBMI,
  clearAllAppData,
  removeFromStorage,
  storageKeys
} from '@/utils/localStorage';
import { removeAllAuthCookies } from '@/utils/auth-cookies';

const defaultProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  gender: 'Male',
  age: '25'
};

export const useProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [targetCalories, setTargetCalories] = useState<number>(2500);
  const [formData, setFormData] = useState<UserProfile>(defaultProfile);
  const [originalFormData, setOriginalFormData] = useState<UserProfile>(defaultProfile);

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
    
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

  const loadProfileData = () => {
    // Load target calories from BMI data
    const calories = getTargetCaloriesFromBMI();
    setTargetCalories(calories);

    // Load saved profile data
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setFormData(savedProfile);
      setOriginalFormData(savedProfile);
    }

    // Load saved profile image
    const savedImage = getProfileImage();
    if (savedImage) {
      setProfileImage(savedImage);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.name.trim()) {
      return { isValid: false, error: 'Nama tidak boleh kosong!' };
    }
    
    if (formData.name.trim().length < 2) {
      return { isValid: false, error: 'Nama harus memiliki minimal 2 karakter!' };
    }
    
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1 || age > 120) {
      return { isValid: false, error: 'Umur harus berupa angka antara 1-120 tahun!' };
    }
    
    return { isValid: true };
  };

  const handleEditProfile = () => {
    setOriginalFormData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = (): { success: boolean; error?: string } => {
    const validation = validateForm();
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      const success = saveUserProfile(formData);
      if (success) {
        setOriginalFormData({ ...formData });
        setIsEditing(false);
        return { success: true };
      } else {
        return { success: false, error: 'Gagal menyimpan profil. Silakan coba lagi.' };
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, error: 'Terjadi kesalahan saat menyimpan profil.' };
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalFormData });
    setIsEditing(false);
  };

  const handleImageUpload = (file: File, onResult: (result: { success: boolean; error?: string }) => void) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onResult({ success: false, error: 'Ukuran file terlalu besar! Maksimal 5MB.' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onResult({ success: false, error: 'File harus berupa gambar!' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setProfileImage(imageData);
      
      try {
        const success = saveProfileImage(imageData);
        if (success) {
          onResult({ success: true });
        } else {
          onResult({ success: false, error: 'Gagal menyimpan foto profil. File mungkin terlalu besar.' });
        }
      } catch (error) {
        console.error('Error saving profile image:', error);
        onResult({ success: false, error: 'Gagal menyimpan foto profil.' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = (): { success: boolean; error?: string } => {
    try {
      removeAllAuthCookies()
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: 'Terjadi kesalahan saat logout. Silakan coba lagi.' };
    }
  };

  const handleDeleteAppData = (): { success: boolean; error?: string } => {
    try {
      const success = clearAllAppData();
      if (success) {
        // Reset component state
        setFormData(defaultProfile);
        setProfileImage(null);
        setTargetCalories(2500);
        setIsEditing(false);
        return { success: true };
      } else {
        return { success: false, error: 'Terjadi kesalahan saat menghapus data.' };
      }
    } catch (error) {
      console.error('Error deleting app data:', error);
      return { success: false, error: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.' };
    }
  };

  return {
    // State
    isEditing,
    profileImage,
    targetCalories,
    formData,
    originalFormData,
    
    // Actions
    handleInputChange,
    handleEditProfile,
    handleSave,
    handleCancel,
    handleImageUpload,
    handleLogout,
    handleDeleteAppData,
    loadProfileData,
    validateForm
  };
}; 