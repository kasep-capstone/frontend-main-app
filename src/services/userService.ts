// API service for backend communication
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface BackendUser {
  id: string
  userAlias: string
  email: string
  username: string
  firstName: string
  lastName: string
  birthDate: string | null
  gender: string | null
  height: number | null
  weight: number | null
  activityLevel: string | null
  createdAt: string
  updatedAt: string
  authProvider: string
  providerId: string | null
  avatar: string | null
}

export interface AuthResponse {
  user: BackendUser
  token: string
}

export interface LoginResponse extends AuthResponse {}
export interface RegisterResponse extends AuthResponse {}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      }

      const response = await fetch(url, config)
      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || `HTTP ${response.status}: ${response.statusText}`,
          message: responseData.message || `Request failed with status ${response.status}`
        }
      }

      // Handle the backend's wrapped response structure
      if (responseData.status === 'success' && responseData.data) {
        return {
          success: true,
          data: responseData.data,
        }
      }

      // Fallback for direct response
      return {
        success: true,
        data: responseData,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Network error or server unavailable'
      }
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return this.makeRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async refreshToken(token: string): Promise<ApiResponse<{ token: string }>> {
    return this.makeRequest<{ token: string }>('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Helper method for authenticated requests with auto-retry on 401
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOnUnauthorized: boolean = true
  ): Promise<ApiResponse<T>> {
    // Get token from cookies (dynamic)
    const getToken = () => {
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => 
          cookie.trim().startsWith('authToken=')
        )
        return tokenCookie ? tokenCookie.split('=')[1] : null
      }
      return null
    }

    const token = getToken()
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found',
        message: 'Authentication required'
      }
    }

    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await this.makeRequest<T>(endpoint, authOptions)

    // If unauthorized and retry is enabled, try to refresh token
    if (!response.success && response.error?.includes('401') && retryOnUnauthorized) {
      console.log('401 detected, attempting token refresh...')
      
      try {
        const refreshResponse = await this.refreshToken(token)
        if (refreshResponse.success && refreshResponse.data) {
          // Update token in cookies
          if (typeof document !== 'undefined') {
            document.cookie = `authToken=${refreshResponse.data.token}; path=/; secure=${process.env.NODE_ENV === 'production'}; samesite=lax; max-age=${60 * 60 * 24 * 7}`
          }
          
          // Retry original request with new token
          const retryOptions = {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${refreshResponse.data.token}`,
            },
          }
          
          console.log('Token refreshed, retrying original request...')
          return this.makeRequest<T>(endpoint, retryOptions)
        }
      } catch (refreshError) {
        console.warn('Auto token refresh failed:', refreshError)
      }
    }

    return response
  }

  // User profile endpoints
  async getUserProfile(): Promise<ApiResponse<{ user: BackendUser }>> {
    return this.makeAuthenticatedRequest<{ user: BackendUser }>('/user/profile', {
      method: 'GET',
    })
  }

  // Legacy method for backward compatibility
  async getUserProfileWithToken(token: string): Promise<ApiResponse<{ user: BackendUser }>> {
    return this.makeRequest<{ user: BackendUser }>('/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

// Export a singleton instance
export const apiService = new ApiService()
export default ApiService 