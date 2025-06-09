import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { ModalState, ModalType } from '@/types/profile';

interface CustomModalProps extends ModalState {
  onClose: () => void;
}

export const CustomModal: React.FC<CustomModalProps> = ({
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