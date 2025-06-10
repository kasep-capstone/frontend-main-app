# BMI API Integration

Aplikasi BMI telah diintegrasikan dengan backend API untuk menyimpan dan mengelola data BMI pengguna. Berikut adalah dokumentasi integrasi API:

## Konfigurasi

### Environment Variables
Buat file `.env.local` di root project dengan konfigurasi berikut:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Ganti URL dengan alamat backend API Anda.

## API Endpoints yang Diintegrasikan

### 1. Authentication Required Endpoints

Semua endpoint di bawah ini memerlukan header authorization:
```
Authorization: Bearer <jwt_token>
```

#### Create BMI Record
- **POST** `/bmi`
- Membuat record BMI baru
- Body: Data BMI lengkap termasuk measurements, kategori, dan target

#### Get User BMI Records
- **GET** `/bmi/my-records`
- Mengambil riwayat BMI pengguna dengan pagination
- Query params: `page`, `limit`, `category`

#### Get BMI Statistics
- **GET** `/bmi/statistics`
- Mengambil statistik BMI pengguna (rata-rata, min, max, perubahan berat)

#### Get BMI Trends
- **GET** `/bmi/trends`
- Mengambil trend perubahan BMI pengguna

#### Get BMI Recommendations
- **GET** `/bmi/recommendations`
- Mengambil rekomendasi berdasarkan BMI terbaru

#### Calculate Ideal Targets
- **POST** `/bmi/calculate-ideal-targets`
- Menghitung target ideal berdasarkan data pengguna
- Body: `height`, `weight`, `age`, `gender`, `activityLevel`

#### Export/Import BMI History
- **GET** `/bmi/export` - Export data BMI
- **POST** `/bmi/import` - Import data BMI
- **DELETE** `/bmi/clear-history` - Hapus semua riwayat

#### Delete BMI Record
- **DELETE** `/bmi/{id}` - Hapus record BMI tertentu

### 2. Public Endpoints

#### Get Activity Levels
- **GET** `/bmi/activity-levels`
- Mengambil daftar tingkat aktivitas yang tersedia

## Implementasi pada Frontend

### 1. API Client Service (`src/services/apiClient.ts`)
Service utama untuk komunikasi dengan backend API, termasuk:
- Authentication header management
- Error handling
- Response parsing
- Semua HTTP methods untuk BMI endpoints

### 2. BMI Service (`src/services/bmiService.ts`)
Service layer yang menggunakan API client secara eksklusif:
- **API-only approach**: Semua operasi menggunakan backend API
- **Authentication required**: Semua operasi memerlukan user yang sudah login
- **Error handling**: Proper error messages untuk authentication dan network errors

### 3. Hooks Update

#### useBMI Hook (`src/hooks/useBMI.ts`)
- **Async operations**: Semua operasi save/load menjadi async
- **API integration**: Menggunakan API untuk mendapatkan targets dan recommendations
- **Authentication handling**: Local calculation fallback untuk unauthenticated users

#### useBMIHistory Hook (`src/hooks/useBMIHistory.ts`)
- **API-only data loading**: Load history exclusively dari API
- **Authentication required**: Empty state untuk unauthenticated users
- **Export/Import**: Async operations dengan authentication checking

### 4. UI Components Update

#### BMI Page (`src/app/bmi/page.tsx`)
- **Async save operations**: Handle async save dengan loading states
- **Error handling**: Proper error management untuk API failures

#### BMI History Page (`src/app/bmi/history/page.tsx`)
- **Async export**: Handle async export operations
- **Loading states**: Show loading indicators saat fetch data

## Features

### 1. API-Only Data Storage
- **Backend integration**: Semua data disimpan secara eksklusif ke backend API
- **Authentication required**: User harus login untuk semua operasi BMI
- **No local storage**: Tidak ada data BMI yang disimpan di localStorage

### 2. Authentication Integration
- **Token-based auth**: Menggunakan JWT token dari cookies (bukan localStorage)
- **Automatic headers**: Token ditambahkan otomatis ke API calls dari cookies
- **Required authentication**: Semua BMI operations memerlukan authentication
- **Cookie-based storage**: Token disimpan di httpOnly cookies untuk keamanan

### 3. Error Handling
- **Authentication errors**: Clear error messages untuk unauthenticated users
- **API errors**: Proper error handling dengan user-friendly messages
- **Loading states**: Loading indicators untuk better UX

### 4. Performance Optimization
- **Parallel API calls**: Statistics dan trends diload secara parallel
- **Local calculation fallback**: Calculations tetap berjalan untuk unauthenticated users
- **Efficient data fetching**: Optimized API calls dengan proper caching

## Testing

### 1. API Connection Test
```bash
# Test API endpoint
curl -X GET http://localhost:3001/bmi/activity-levels
```

### 2. Authentication Test
```bash
# Test authenticated endpoint
curl -X GET http://localhost:3001/bmi/my-records \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Authentication Test
- Test tanpa login (harus dapat error messages yang jelas)
- Test dengan login (operasi BMI berjalan normal)
- Test logout (history menjadi kosong)

## Deployment Notes

1. **Environment Variables**: Set `NEXT_PUBLIC_API_URL` ke production API URL
2. **CORS**: Pastikan backend mengizinkan origin frontend
3. **SSL**: Gunakan HTTPS untuk production
4. **Authentication**: Pastikan JWT token valid dan secure

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Cek JWT token di localStorage
   - Verify token belum expired
   - Pastikan format header Authorization benar

2. **CORS Errors**
   - Pastikan backend mengizinkan origin frontend
   - Check preflight OPTIONS requests

3. **Network Timeout**
   - User akan mendapat error message
   - Calculations tetap berjalan untuk unauthenticated users

4. **Data Access Issues**
   - Pastikan user sudah login
   - Check backend API availability

5. **Authentication Token Issues**
   - Check cookies di browser (authToken should exist)
   - Verify token tidak expired dengan decode JWT
   - Check timing - auth context loading sebelum BMI operations

### Debug Tips

1. Check browser Network tab untuk API calls
2. Check Console untuk error messages dan authentication logs
3. Verify authentication token di browser cookies (authToken)
4. Test dengan authenticated dan unauthenticated users
5. Check timing issues - ensure auth context is loaded before BMI operations 