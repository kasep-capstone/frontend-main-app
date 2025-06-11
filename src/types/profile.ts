export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'prompt';

export interface ModalState {
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

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female' | string;
  birthDate: string;
  height: string;
  weight: string;
  activityLevel: string;
  avatar: string;
  authProvider: string;
  targetCalories: number | null;
  password?: string; // For profile updates
  confirmPassword?: string; // For password verification
}

export interface ProfileData extends UserProfile {
  profileImage: string | null;
  targetCalories: number | null;
} 