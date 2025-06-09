import { useState } from 'react';
import { ModalState, ModalType } from '@/types/profile';

export const useModal = () => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

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

  return {
    modal,
    showModal,
    closeModal,
    showAlert,
    showConfirm,
    showPrompt
  };
}; 