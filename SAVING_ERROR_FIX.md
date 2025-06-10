# BMI Saving Errors and Recommendations Fix

## Issues Fixed

### 1. **BMI Recommendations Error** 
**Error**: `Error generating BMI recommendations: Error: No BMI records found`

**Root Cause**: The `getBMIRecommendations()` method was trying to fetch the latest saved BMI record to generate recommendations, but for new users (first time filling the form), there are no saved records yet.

**Solution**: 
- Modified `getBMIRecommendations()` to accept an optional `currentBMI` parameter
- Updated `useBMI.ts` to pass the calculated BMI value directly to the recommendations method
- Added fallback logic to handle both scenarios (with and without saved records)

### 2. **BMI Save Error - 400 Bad Request**
**Error**: `POST http://localhost:8080/bmi 400 (Bad Request) - Invalid request payload input`

**Root Cause**: Multiple data format issues:
- Wrong API base URL (was `http://localhost:3001`, should be `http://localhost:8080`)
- Data types not matching API validation (API expects integers for height, weight, age)
- Date format issue (was using formatted display string instead of ISO string)

**Solutions Applied**:

#### A. API URL Fix
- Updated `apiClient.ts` base URL from `localhost:3001` to `localhost:8080`

#### B. Data Type Conversion in `bmiService.ts`
```javascript
const apiRecord = {
  date: record.date, // Keep as ISO string
  height: Math.round(record.height), // Convert to integer
  weight: Math.round(record.weight), // Convert to integer  
  age: Math.round(record.age), // Convert to integer
  gender: record.gender,
  activityLevel: record.activityLevel,
  bmi: Math.round(record.bmi * 100) / 100, // Round to 2 decimal places
  category: record.category,
  healthStatus: record.healthStatus,
  targetCalories: Math.round(record.targetCalories), // Convert to integer
  hasGoals: record.hasGoals || false
};

// Only include idealTargets if hasGoals is true
if (record.hasGoals && record.idealTargets) {
  apiRecord.idealTargets = record.idealTargets;
}
```

#### C. Date Format Fix in `useBMI.ts`
- Changed from `formatDate(new Date().toISOString())` to `new Date().toISOString()`
- Removed unused `formatDate` import

#### D. Debug Logging Added
- Added comprehensive logging in `apiClient.ts` to track data being sent to API
- This will help identify any future data format issues

## API Data Format

### **Save Without Goals/Target** (`hasGoals: false`)
```json
{
  "date": "2023-12-01T10:30:00Z",
  "height": 170,
  "weight": 80,
  "age": 25,
  "gender": "male",
  "activityLevel": "moderate",
  "bmi": 27.68,
  "category": "Overweight",
  "healthStatus": "Berat Badan Berlebih",
  "targetCalories": 2000,
  "hasGoals": false
}
```

### **Save With Goals/Target** (`hasGoals: true`)
```json
{
  "date": "2023-12-01T10:30:00Z",
  "height": 170,
  "weight": 80,
  "age": 25,
  "gender": "male",
  "activityLevel": "moderate",
  "bmi": 27.68,
  "category": "Overweight",
  "healthStatus": "Berat Badan Berlebih",
  "targetCalories": 2000,
  "hasGoals": true,
  "idealTargets": {
    "weightRange": "55-70 kg",
    "targetWeight": 65,
    "targetBMI": "22.5",
    "targetCalories": 1800,
    "timeEstimate": "4-6 bulan"
  }
}
```

## Button Mapping

### **"Simpan Saja" Button** → `saveRecord(false)`
- Calls BMI service with `hasGoals: false`
- Only sends basic BMI data without idealTargets

### **"Simpan + Tetapkan Target" Button** → `saveRecord(true)`
- Calls BMI service with `hasGoals: true`
- Includes `idealTargets` object with weight goals and time estimates

## Files Modified

1. **`src/services/bmiService.ts`**
   - Updated `getBMIRecommendations()` method to accept currentBMI parameter
   - Fixed data type conversion in `saveBMIRecord()` method
   - Added conditional inclusion of `idealTargets` only when `hasGoals` is true

2. **`src/hooks/useBMI.ts`**
   - Updated recommendations call to pass current BMI value
   - Fixed date format in record creation
   - Removed unused formatDate import
   - Simplified record creation to only include `idealTargets` when goals are set

3. **`src/services/apiClient.ts`**
   - Fixed base URL from localhost:3001 to localhost:8080
   - Added debug logging for BMI record creation

## Expected Behavior Now

### ✅ **Recommendations Loading**
- **First-time users**: Recommendations calculated using current form BMI value
- **Existing users**: Recommendations calculated using latest saved record or current BMI
- **Error handling**: Falls back to local calculation if any issues

### ✅ **BMI Record Saving**
- **Data validation**: All numeric values properly converted to integers/floats
- **Date format**: Uses ISO string format
- **API communication**: Correct endpoint with proper data format
- **Goals handling**: `idealTargets` only included when user selects "Save + Set Target"
- **Debugging**: Full request logging for troubleshooting

### ✅ **User Experience**
- No more "No BMI records found" errors when calculating recommendations
- No more 400 Bad Request errors when saving BMI records
- Clear separation between simple save and save with goals
- Smooth form filling and saving experience for both new and existing users

## Testing Checklist

- [ ] First-time user can fill form and see recommendations without errors
- [ ] "Simpan Saja" button saves BMI record with `hasGoals: false` (no idealTargets)
- [ ] "Simpan + Tetapkan Target" button saves BMI record with `hasGoals: true` and includes idealTargets
- [ ] API requests show proper data format in console logs
- [ ] All numeric values are properly rounded/converted before API calls 