import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProfile } from '@/types/profile';
import { 
  saveProfileImage,
  getTargetCaloriesFromBMI,
  clearAllAppData
} from '@/utils/localStorage';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/userService';

export const useProfile = () => {
  const { user, updateUser, logout, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [targetCalories, setTargetCalories] = useState<number>(2500);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    avatar: '',
    authProvider: ''
  });
  const [originalFormData, setOriginalFormData] = useState<UserProfile>({
    name: '',
    email: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    avatar: '',
    authProvider: ''
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
      // Load target calories from BMI data
      const calories = getTargetCaloriesFromBMI();
      setTargetCalories(calories);

      // Fetch user profile via AuthContext (which handles API call)
      const apiUser = await fetchUserProfile();
      
      if (!apiUser) {
        throw new Error('Failed to fetch user profile');
      }
      
      // Calculate age from birthDate if available
      let age = '';
      if (apiUser.birthDate) {
        const birthDate = new Date(apiUser.birthDate);
        const today = new Date();
        const calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age = (calculatedAge - 1).toString();
        } else {
          age = calculatedAge.toString();
        }
      }

      // Map API response to UserProfile format
      const fullName = `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim();
      const profileData: UserProfile = {
        name: fullName,
        email: apiUser.email || '',
        gender: apiUser.gender || '',
        age: age,
        height: apiUser.height?.toString() || '',
        weight: apiUser.weight?.toString() || '',
        activityLevel: apiUser.activityLevel || '',
        avatar: apiUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
        authProvider: apiUser.authProvider || ''
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
          name: fullName,
          email: user.email || '',
          gender: user.gender || '',
          age: '',
          height: user.height?.toString() || '',
          weight: user.weight?.toString() || '',
          activityLevel: user.activityLevel || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
          authProvider: user.authProvider || ''
        };
        
        setFormData(fallbackData);
        setOriginalFormData(fallbackData);
        setProfileImage(fallbackData.avatar);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]); // Only depend on fetchUserProfile

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
  }, []); // Empty dependency array - only run on mount

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
      // Note: Profile data is now managed via API only, not saved locally
      // Update auth context if name or email changed
      const currentFullName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
      if (user && (currentFullName !== formData.name || user.email !== formData.email)) {
        // Split name back into firstName and lastName
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        updateUser({
          firstName: firstName,
          lastName: lastName,
          email: formData.email
        });
      }
      
      setOriginalFormData({ ...formData });
      setIsEditing(false);
      return { success: true };
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
          name: '',
          email: '',
          gender: '',
          age: '',
          height: '',
          weight: '',
          activityLevel: '',
          avatar: '',
          authProvider: ''
        });
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

  // Reset initialization flag and reload data
  const reloadProfileData = useCallback(async () => {
    hasInitialized.current = false;
    await loadProfileData();
  }, [loadProfileData]);

  return {
    // State
    isEditing,
    profileImage,
    targetCalories,
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