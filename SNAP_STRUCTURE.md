# Struktur Modular Page Snap dan Snap/Result

## Overview
Page snap dan snap/result telah direstrukturisasi menjadi komponen-komponen modular yang mudah untuk di-maintain dan di-extend.

## Struktur Direktori

```
src/
├── hooks/
│   ├── useCameraControls.ts         # Logika kontrol kamera
│   ├── useBrightnessDetection.ts    # Deteksi kecerahan gambar
│   ├── useCaptureProcess.ts         # Proses capture dan navigasi
│   ├── useSnapResult.ts             # Manajemen data hasil snap
│   ├── useRecipeNavigation.ts       # Navigasi antar resep
│   └── index.ts                     # Export semua hooks
├── components/
│   ├── snap/
│   │   ├── LoadingScreen.tsx        # Loading animation saat app start
│   │   ├── CameraPreview.tsx        # Preview kamera dengan guide lines
│   │   ├── CaptureLoadingScreen.tsx # Loading saat capture
│   │   ├── TopControls.tsx          # Flash dan switch camera
│   │   ├── BottomControls.tsx       # Gallery, capture, dan back button
│   │   ├── BrightnessAlert.tsx      # Alert kecerahan kurang
│   │   └── index.ts                 # Export semua komponen snap
│   └── snap-result/
│       ├── CapturedImagePreview.tsx # Preview gambar yang di-capture
│       ├── DetectedMaterials.tsx    # Chip bahan yang terdeteksi
│       ├── RecipeRecommendations.tsx# Daftar resep dengan navigasi
│       ├── RetrySection.tsx         # Button retry detection
│       ├── LoadingState.tsx         # Loading state
│       └── index.ts                 # Export semua komponen snap-result
└── app/
    ├── snap/
    │   └── page.tsx                 # Main snap page (refactored)
    └── snap/result/
        └── page.tsx                 # Snap result page (refactored)
```

## Hooks

### 1. useCameraControls
Mengelola semua logika kontrol kamera:
- Start/stop camera
- Toggle flash
- Toggle front/back camera
- Loading state management

### 2. useBrightnessDetection
Deteksi kecerahan real-time dari video stream:
- Analisis brightness frame video
- Threshold untuk kondisi terlalu gelap
- Real-time monitoring

### 3. useCaptureProcess
Mengelola proses capture dan simulasi backend:
- Capture gambar dari video stream
- Simulasi processing time
- Handle cancel operation
- Navigation ke result page

### 4. useSnapResult
Manajemen data hasil snap (mock data):
- Loading state management
- Data struktur result
- Animation visibility

### 5. useRecipeNavigation
Navigasi antar recipe cards:
- Horizontal scroll management
- Navigation buttons visibility
- Current index tracking

## Komponen Snap Page

### 1. LoadingScreen
- Loading animation saat app pertama kali dibuka
- KASEP branding dengan animation

### 2. CameraPreview
- Video stream dengan mirror effect untuk front camera
- Guide lines overlay untuk positioning
- Smooth transitions

### 3. CaptureLoadingScreen
- Loading saat proses capture
- Preview captured image
- Cancel button dengan delay
- Processing simulation

### 4. TopControls
- Flash toggle button
- KASEP title
- Camera switch button

### 5. BottomControls
- Gallery button
- Capture button (disabled saat gelap)
- Back button

### 6. BrightnessAlert
- Alert notification untuk kondisi terlalu gelap
- Conditional rendering

## Komponen Snap Result Page

### 1. CapturedImagePreview
- Preview gambar yang di-capture
- Click to view full size
- Smooth hover effects

### 2. DetectedMaterials
- Display bahan yang terdeteksi
- Chip layout dengan hover effects
- Responsive design

### 3. RecipeRecommendations
- Horizontal scroll recipe cards
- Navigation buttons
- Fixed navigation saat scroll
- Integration dengan RecipeCard component

### 4. RetrySection
- Button untuk retry detection
- Call-to-action messaging

### 5. LoadingState
- Loading spinner untuk data fetch
- Centered layout

## Keuntungan Struktur Modular

1. **Maintainability**: Setiap komponen memiliki tanggung jawab yang jelas
2. **Reusability**: Komponen dapat digunakan di page lain
3. **Testability**: Mudah untuk unit testing
4. **Scalability**: Mudah menambah fitur baru
5. **Clean Code**: Import yang terorganisir dengan index files
6. **Separation of Concerns**: Logic terpisah dari UI components

## Cara Menambah Fitur Baru

1. **Hook Baru**: Tambahkan di folder `hooks/` dan export di `index.ts`
2. **Komponen Baru**: Tambahkan di folder yang sesuai dan export di `index.ts`
3. **Update Page**: Import dan gunakan komponen/hook baru
4. **Testing**: Test komponen secara terpisah

## API Integration Points

Untuk integrasi dengan backend:
1. Ganti mock data di `useSnapResult.ts`
2. Implementasi real API calls
3. Error handling di masing-masing hook
4. Loading states sudah tersedia 