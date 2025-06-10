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
  name: string;
  email: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: string;
  avatar: string;
  authProvider: string;
}

export interface ProfileData extends UserProfile {
  profileImage: string | null;
  targetCalories: number;
} 