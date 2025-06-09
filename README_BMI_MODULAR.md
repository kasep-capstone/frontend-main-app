# BMI Calculator - Modular Architecture

## Overview

BMI Calculator telah direfactor menjadi arsitektur modular yang clean dan mudah di-maintain. Setiap komponen memiliki tanggung jawab yang jelas dan terpisah, memudahkan pengembangan, testing, dan integrasi dengan API.

## Structure

```
src/
├── types/bmi.ts              # TypeScript interfaces & types
├── utils/bmi.ts              # Pure functions untuk kalkulasi BMI
├── services/bmiService.ts    # Service layer untuk data operations
├── hooks/
│   ├── useBMI.ts            # Custom hook untuk BMI calculations & form management
│   └── useBMIHistory.ts     # Custom hook untuk history management
└── components/bmi/
    ├── BMIForm.tsx          # Form input component
    ├── BMIResults.tsx       # Results display component
    ├── BMIRecommendations.tsx # Recommendations component
    ├── BMITargets.tsx       # Targets display component
    ├── BMIHistoryList.tsx   # History list component
    └── index.ts             # Component exports
```

## Key Benefits

### 1. **Separation of Concerns**
- **Types**: Centralized type definitions
- **Utils**: Pure calculation functions
- **Services**: Data layer abstraction
- **Hooks**: Business logic & state management
- **Components**: Pure UI components

### 2. **Easy API Integration**
Service layer sudah disiapkan untuk integrasi API:

```typescript
// src/services/bmiService.ts
static async syncBMIRecord(record: BMIRecord): Promise<BMIRecord> {
  // TODO: Implement API call to sync record with backend
  // For now, just save locally
  this.saveBMIRecord(record);
  return record;
}

static async fetchBMIHistory(userId?: string): Promise<BMIRecord[]> {
  // TODO: Implement API call to fetch history from backend
  // For now, return local storage data
  return this.getBMIHistory();
}
```

### 3. **Reusable Components**
Setiap komponen dapat digunakan secara independen:

```typescript
import { BMIForm, BMIResults, BMIRecommendations } from '@/components/bmi';
import { useBMI } from '@/hooks/useBMI';

function CustomBMIPage() {
  const { formData, updateFormData, results, recommendations } = useBMI();
  
  return (
    <div>
      <BMIForm 
        formData={formData}
        onFormDataChange={updateFormData}
        // ... other props
      />
      {results && <BMIResults results={results} />}
      {recommendations && <BMIRecommendations recommendations={recommendations} />}
    </div>
  );
}
```

### 4. **Easy Testing**
Setiap layer dapat di-test secara terpisah:

```typescript
// Utils testing
import { calculateBMI, getBMICategory } from '@/utils/bmi';

test('calculate BMI correctly', () => {
  expect(calculateBMI(170, 70)).toBeCloseTo(24.22);
  expect(getBMICategory(24.22)).toBe('Normal');
});

// Service testing
import { BMIService } from '@/services/bmiService';

test('save BMI record', () => {
  const record = { /* mock record */ };
  const result = BMIService.saveBMIRecord(record);
  expect(result).toContain(record);
});

// Component testing
import { render, screen } from '@testing-library/react';
import { BMIResults } from '@/components/bmi';

test('display BMI results', () => {
  const mockResults = { bmi: 24.22, category: 'Normal', /* ... */ };
  render(<BMIResults results={mockResults} />);
  expect(screen.getByText('24.2')).toBeInTheDocument();
});
```

## Usage Examples

### Basic BMI Calculator
```typescript
import { useBMI } from '@/hooks/useBMI';
import { BMIForm, BMIResults } from '@/components/bmi';

function SimpleBMICalculator() {
  const { 
    formData, 
    updateFormData, 
    results, 
    activityLevels 
  } = useBMI();

  return (
    <div>
      <BMIForm 
        formData={formData}
        onFormDataChange={updateFormData}
        activityLevels={activityLevels}
        isActivityExpanded={false}
        onActivityExpandedChange={() => {}}
      />
      {results && <BMIResults results={results} />}
    </div>
  );
}
```

### BMI History Management
```typescript
import { useBMIHistory } from '@/hooks/useBMIHistory';
import { BMIHistoryList } from '@/components/bmi';

function BMIHistoryPage() {
  const { 
    filteredHistory, 
    deleteRecord, 
    exportHistory,
    statistics 
  } = useBMIHistory();

  return (
    <div>
      <div>Total Records: {statistics?.averageBMI}</div>
      <button onClick={exportHistory}>Export Data</button>
      <BMIHistoryList 
        history={filteredHistory}
        onDeleteRecord={deleteRecord}
      />
    </div>
  );
}
```

### Custom BMI Service Integration
```typescript
// Extend service for API integration
class ApiBMIService extends BMIService {
  static async syncBMIRecord(record: BMIRecord): Promise<BMIRecord> {
    try {
      const response = await fetch('/api/bmi/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      
      if (!response.ok) throw new Error('Failed to sync');
      
      const synced = await response.json();
      
      // Also save locally as backup
      this.saveBMIRecord(synced);
      
      return synced;
    } catch (error) {
      // Fallback to local storage
      console.warn('API sync failed, saving locally:', error);
      return this.saveBMIRecord(record);
    }
  }
}
```

## Migration Guide

### From Old to New Structure

**Before:**
```typescript
// All logic mixed in one component
function BmiPage() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('80');
  
  const calculateBMI = () => {
    // inline calculation logic
  };
  
  const handleSave = () => {
    // inline save logic
  };
  
  return (
    <div>
      {/* Mixed UI and logic */}
    </div>
  );
}
```

**After:**
```typescript
// Clean separation
function BmiPage() {
  const {
    formData,
    updateFormData,
    results,
    saveRecord
  } = useBMI();

  return (
    <div>
      <BMIForm 
        formData={formData}
        onFormDataChange={updateFormData}
      />
      {results && <BMIResults results={results} />}
      <button onClick={() => saveRecord(false)}>
        Save
      </button>
    </div>
  );
}
```

## Future Enhancements

### 1. API Integration
- Replace localStorage dengan API calls
- Add user authentication
- Sync data across devices

### 2. Advanced Features
- BMI trends & analytics
- Goal tracking & notifications
- Social sharing
- Healthcare provider integration

### 3. Testing
- Unit tests untuk utils & services
- Integration tests untuk hooks
- Component tests dengan React Testing Library
- E2E tests dengan Playwright

### 4. Performance
- Add React.memo untuk heavy components
- Implement virtual scrolling untuk large history
- Add data caching strategies

## Best Practices

1. **Always use hooks for state management** - Jangan langsung manipulasi state di component
2. **Keep components pure** - Components hanya menerima props dan render UI
3. **Use service layer untuk data operations** - Mudah untuk testing dan API integration
4. **Follow TypeScript strictly** - Semua data harus strongly typed
5. **Write tests** - Setiap function dan component harus memiliki test

## Conclusion

Arsitektur modular ini memberikan:
- ✅ **Better maintainability** - Setiap file memiliki tanggung jawab yang jelas
- ✅ **Easy testing** - Setiap layer dapat di-test terpisah
- ✅ **API ready** - Service layer sudah disiapkan untuk API integration
- ✅ **Reusable components** - Components dapat digunakan di halaman lain
- ✅ **Type safety** - Fully typed dengan TypeScript
- ✅ **Clean code** - Separation of concerns yang jelas 