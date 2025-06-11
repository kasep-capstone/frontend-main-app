import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProfile } from '@/types/profile';
import { 
  saveProfileImage,
  clearAllAppData
} from '@/utils/localStorage';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/apiClient';

export const useProfile = () => {
  const { user, updateUser, logout, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: '',
    height: '',
    weight: '',
    activityLevel: '',
    avatar: '',
    authProvider: '',
    targetCalories: null,
    password: '',
    confirmPassword: ''
  });
  const [originalFormData, setOriginalFormData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: '',
    height: '',
    weight: '',
    activityLevel: '',
    avatar: '',
    authProvider: '',
    targetCalories: null,
    password: '',
    confirmPassword: ''
  });

  const loadProfileData = useCallback(async () => {
    // Prevent double fetch in development mode (React.StrictMode)
    if (hasInitialized.current) {
      return;
    }
    
    hasInitialized.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch user profile via AuthContext (which handles API call)
      const apiUser = await fetchUserProfile();
      
      if (!apiUser) {
        throw new Error('Failed to fetch user profile');
      }

      // Map API response to UserProfile format
      const fullName = `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim();
      const profileData: UserProfile = {
        firstName: apiUser.firstName || '',
        lastName: apiUser.lastName || '',
        email: apiUser.email || '',
        gender: apiUser.gender || '',
        birthDate: apiUser.birthDate || '',
        height: apiUser.height?.toString() || '',
        weight: apiUser.weight?.toString() || '',
        targetCalories: apiUser.targetCalories,
        activityLevel: apiUser.activityLevel || '',
        avatar: apiUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
        authProvider: apiUser.authProvider || '',
        password: '', // Never populate password from API
        confirmPassword: ''
      };

      setFormData(profileData);
      setOriginalFormData(profileData);
      setProfileImage(profileData.avatar);
      
      // Update auth context with fresh data (but don't depend on it)
      updateUser({
        id: apiUser.id,
        userAlias: apiUser.userAlias,
        email: apiUser.email,
        username: apiUser.username,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        birthDate: apiUser.birthDate,
        gender: apiUser.gender,
        height: apiUser.height,
        weight: apiUser.weight,
        activityLevel: apiUser.activityLevel,
        createdAt: apiUser.createdAt,
        updatedAt: apiUser.updatedAt,
        authProvider: apiUser.authProvider,
        providerId: apiUser.providerId
      });
      
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile data');
      
      // Fallback to auth context data if API fails
      if (user) {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        const fallbackData: UserProfile = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          gender: user.gender || '',
          birthDate: user.birthDate || '',
          height: user.height?.toString() || '',
          weight: user.weight?.toString() || '',
          activityLevel: user.activityLevel || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
          authProvider: user.authProvider || '',
          targetCalories: null,
          password: '',
          confirmPassword: ''
        };
        
        setFormData(fallbackData);
        setOriginalFormData(fallbackData);
        setProfileImage(fallbackData.avatar);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile, user, updateUser]); // Updated dependencies

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []); // Empty dependency array - only run on mount

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.firstName.trim()) {
      return { isValid: false, error: 'Nama depan tidak boleh kosong!' };
    }
    
    if (formData.firstName.trim().length < 2) {
      return { isValid: false, error: 'Nama depan harus memiliki minimal 2 karakter!' };
    }
    
    if (!formData.birthDate) {
      return { isValid: false, error: 'Tanggal lahir harus diisi!' };
    }

    // Validate birth date is not in the future
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    if (birthDate > today) {
      return { isValid: false, error: 'Tanggal lahir tidak boleh di masa depan!' };
    }

    // Validate age (must be at least 1 year old and max 120)
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 1 || age > 120) {
      return { isValid: false, error: 'Umur harus antara 1-120 tahun!' };
    }

    // Validate password if provided (only for local auth)
    if (formData.authProvider === 'local' && formData.password) {
      if (formData.password.length < 8) {
        return { isValid: false, error: 'Password harus memiliki minimal 8 karakter!' };
      }
      
      if (!formData.confirmPassword) {
        return { isValid: false, error: 'Konfirmasi password harus diisi!' };
      }
      
      if (formData.password !== formData.confirmPassword) {
        return { isValid: false, error: 'Password dan konfirmasi password tidak cocok!' };
      }
    }
    
    return { isValid: true };
  };

  const handleEditProfile = () => {
    setOriginalFormData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = async (): Promise<{ success: boolean; error?: string }> => {
    const validation = validateForm();
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      setIsLoading(true);
      setError(null);

      // Prepare data for API
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : formData.birthDate
      };

      // Add height and weight if they exist
      if (formData.height) {
        updateData.height = parseInt(formData.height);
      }
      if (formData.weight) {
        updateData.weight = parseInt(formData.weight);
      }
      if (formData.targetCalories) {
        updateData.targetCalories = formData.targetCalories;
      }
      if (formData.activityLevel) {
        updateData.activityLevel = formData.activityLevel;
      }

      // Add password if provided (only for local auth)
      if (formData.authProvider === 'local' && formData.password) {
        updateData.password = formData.password;
        updateData.confirmPassword = formData.confirmPassword;
      }

      // Debug: Log the data being sent to API
      console.log('Sending profile update data:', updateData);
      
      // Call API to update profile
      const response = await apiClient.updateUserProfile(updateData);
      
      // Update auth context with fresh data
      if (user) {
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          gender: formData.gender,
          birthDate: formData.birthDate,
          height: formData.height ? parseInt(formData.height) : user.height,
          weight: formData.weight ? parseInt(formData.weight) : user.weight,
          activityLevel: formData.activityLevel || user.activityLevel
        });
      }
      
      setOriginalFormData({ ...formData });
      setIsEditing(false);
      
      // Clear password fields after save
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      
      return { success: true };
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan profil.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
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
      logout(); // Use auth context logout method
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
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          gender: '',
          birthDate: '',
          height: '',
          weight: '',
          activityLevel: '',
          avatar: '',
          authProvider: '',
          targetCalories: null,
          password: '',
          confirmPassword: ''
        });
        setProfileImage(null);
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

  // Reset initialization flag and reload data
  const reloadProfileData = useCallback(async () => {
    hasInitialized.current = false;
    await loadProfileData();
  }, [loadProfileData]);

  return {
    // State
    isEditing,
    profileImage,
    formData,
    originalFormData,
    isLoading,
    error,
    
    // Actions
    handleInputChange,
    handleEditProfile,
    handleSave,
    handleCancel,
    handleImageUpload,
    handleLogout,
    handleDeleteAppData,
    loadProfileData,
    reloadProfileData,
    validateForm
  };
}; 