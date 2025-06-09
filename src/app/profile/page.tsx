"use client"
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import React from 'react';

// Import modular components
import { CustomModal } from '@/components/profile/CustomModal';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { SocialMediaSection } from '@/components/profile/SocialMediaSection';
import { AccountSection } from '@/components/profile/AccountSection';
import { AccountActions } from '@/components/profile/AccountActions';

// Import custom hooks
import { useModal } from '@/hooks/useModal';
import { useProfile } from '@/hooks/useProfile';

export default function Profile() {
  // Use custom hooks
  const { modal, closeModal, showAlert, showConfirm, showPrompt } = useModal();
  const {
    isEditing,
    profileImage,
    targetCalories,
    formData,
    handleInputChange,
    handleEditProfile,
    handleSave,
    handleCancel,
    handleImageUpload,
    handleLogout,
    handleDeleteAppData
  } = useProfile();

  // Image upload handlers
  const triggerImageUpload = () => {
    const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
    fileInput?.click();
  };

  const onImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, (result) => {
        if (result.success) {
          showAlert('success', 'Berhasil', 'Foto profil berhasil diubah!');
        } else {
          showAlert('error', 'Gagal', result.error || 'Gagal menyimpan foto profil.');
        }
      });
    }
  };

  // Profile save handler
  const onSave = () => {
    const result = handleSave();
    if (result.success) {
      showAlert('success', 'Berhasil', 'Profil berhasil disimpan!');
    } else {
      showAlert('error', 'Validasi Gagal', result.error || 'Gagal menyimpan profil.');
    }
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

  // Account action handlers
  const onLogout = () => {
    showConfirm(
      'Konfirmasi Logout',
      '🚪 Apakah Anda yakin ingin keluar?\n\nAnda perlu login kembali untuk mengakses aplikasi.',
      () => {
        const result = handleLogout();
        if (result.success) {
          showAlert('success', 'Logout Berhasil', 'Anda berhasil logout!\n\nSampai jumpa lagi! 👋');
          // Redirect to login page
          // window.location.href = '/login';
        } else {
          showAlert('error', 'Logout Gagal', result.error || 'Terjadi kesalahan saat logout.');
        }
      }
    );
  };

  const onDeleteAppData = () => {
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
              const result = handleDeleteAppData();
              if (result.success) {
                showAlert('success', 'Data Terhapus', 'Semua data aplikasi berhasil dihapus!\n\nAnda dapat mulai fresh dengan akun Google yang sama.');
              } else {
                showAlert('error', 'Gagal Hapus Data', result.error || 'Terjadi kesalahan saat menghapus data.');
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
          
          {/* Profile Header */}
          <ProfileHeader
            profileImage={profileImage}
            formData={formData}
            targetCalories={targetCalories}
            onImageUpload={triggerImageUpload}
          />

          {/* Profile Settings */}
          <ProfileSettings
            isEditing={isEditing}
            formData={formData}
            onEditProfile={handleEditProfile}
            onSave={onSave}
            onCancel={handleCancel}
            onInputChange={handleInputChange}
          />

          {/* Social Media Section */}
          <SocialMediaSection
            onConnectTwitter={handleConnectTwitter}
            onConnectInstagram={handleConnectInstagram}
          />

          {/* Account Integration */}
          <AccountSection formData={formData} />

          {/* Account Actions */}
          <AccountActions
            onLogout={onLogout}
            onDeleteAppData={onDeleteAppData}
          />

          {/* Hidden File Input */}
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />

        </div>
      </div>
      <div className="flex justify-center mt-16">
        <MenuBar/>
      </div>
      
      {/* Custom Modal */}
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