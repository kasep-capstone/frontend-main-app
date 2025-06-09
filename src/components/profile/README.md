# Profile Module

This directory contains the modularized components for the profile page, designed for better maintainability and easier API integration.

## Structure

### Components
- **`CustomModal.tsx`** - Reusable modal component for all user interactions
- **`ProfileHeader.tsx`** - Profile picture, basic info, and target calories display
- **`ProfileSettings.tsx`** - Profile editing form and settings management
- **`SocialMediaSection.tsx`** - Social media account connection interface
- **`AccountSection.tsx`** - Google account integration status
- **`AccountActions.tsx`** - Logout and data deletion actions

### Hooks
- **`useModal.ts`** - Modal state management and helper functions
- **`useProfile.ts`** - Profile data management, validation, and actions

### Types
- **`types/profile.ts`** - TypeScript interfaces and types

### Utilities
- **`utils/localStorage.ts`** - Centralized localStorage operations

## Benefits

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other parts of the app
3. **Maintainability**: Changes to specific functionality are isolated
4. **Testability**: Individual components and hooks can be tested separately
5. **API Integration**: Easy to replace localStorage operations with API calls
6. **Type Safety**: Strong TypeScript typing throughout

## API Integration Ready

The structure is designed to make API integration straightforward:

- Replace localStorage operations in `utils/localStorage.ts` with API calls
- Update hooks to handle async operations and loading states
- Add error handling and retry mechanisms
- Implement optimistic updates where appropriate

## Usage

```tsx
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { useProfile } from '@/hooks/useProfile';

function ProfilePage() {
  const { formData, profileImage, targetCalories } = useProfile();
  
  return (
    <ProfileHeader
      formData={formData}
      profileImage={profileImage}
      targetCalories={targetCalories}
      onImageUpload={() => {}}
    />
  );
} 