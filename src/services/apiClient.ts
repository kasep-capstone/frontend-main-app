import { getAuthTokenFromCookie } from '@/utils/auth-cookies';

interface ApiResponse<T = any> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
}

interface PaginatedResponse<T> {
  records: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}

interface BMIRecordsResponse {
  bmiRecords: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface BMIStatisticsResponse {
  statistics: {
    averageBMI: string;
    minBMI: string;
    maxBMI: string;
    currentWeight: number;
    weightChange: string;
    recordsWithGoals: number;
    totalRecords: number;
  };
}

interface BMITrendsResponse {
  trend: {
    direction: string;
    value: number;
    percentage: number;
  };
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  private getAuthHeaders(): HeadersInit {
    // Get token from cookies using utility function
    const token = getAuthTokenFromCookie();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'fail' || data.status === 'error') {
      throw new Error(data.message || 'API request failed');
    }

    return data.data || data;
  }

  // BMI API Methods
  async createBMIRecord(record: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(record)
    });

    return this.handleResponse(response);
  }

  async getUserBMIRecords(params: {
    page?: number;
    limit?: number;
    category?: string;
  } = {}): Promise<BMIRecordsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.category) searchParams.append('category', params.category);

    const response = await fetch(`${this.baseURL}/bmi/my-records?${searchParams}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async getBMIStatistics(): Promise<BMIStatisticsResponse> {
    const response = await fetch(`${this.baseURL}/bmi/statistics`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async getBMITrends(): Promise<BMITrendsResponse> {
    const response = await fetch(`${this.baseURL}/bmi/trends`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async getBMIRecommendations(): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi/recommendations`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async calculateIdealTargets(data: {
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi/calculate-ideal-targets`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async getBMIProgress(): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi/progress`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async exportBMIHistory(): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi/export`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async importBMIHistory(data: any[]): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi/import`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ data })
    });

    return this.handleResponse(response);
  }

  async clearBMIHistory(): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi/clear-history`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async getActivityLevels(): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi/activity-levels`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    return this.handleResponse(response);
  }

  async deleteBMIRecord(id: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/bmi/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, PaginatedResponse, BMIRecordsResponse, BMIStatisticsResponse, BMITrendsResponse }; 