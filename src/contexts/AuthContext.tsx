'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AUTH_PATHS } from '@/utils/auth-routes'
import { 
  setAuthTokenCookie, 
  removeAllAuthCookies, 
  getUserFromCookie,
  getAuthTokenFromCookie,
  setIntendedPathCookie,
  getIntendedPathFromCookie,
  removeIntendedPathCookie,
  setUserCookie
} from '@/utils/auth-cookies'
import { apiService, LoginRequest, RegisterRequest, BackendUser } from '@/services/userService'

// Helper function to check if JWT token is expired or near expiry
const isTokenExpiredOrNearExpiry = (token: string, bufferMinutes: number = 5): boolean => {
  try {
    // Simple JWT decode (payload only, not for security validation)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000) // Current time in seconds
    const expiryTime = payload.exp
    
    if (!expiryTime) {
      console.warn('Token has no expiry time')
      return true // If no expiry, consider as expired
    }
    
    // Check if token expires within buffer time
    const bufferSeconds = bufferMinutes * 60
    const timeUntilExpiry = expiryTime - now
    
    console.log(`Token expires in ${Math.floor(timeUntilExpiry / 60)} minutes`)
    return timeUntilExpiry <= bufferSeconds
  } catch (error) {
    console.warn('Error decoding token:', error)
    return true // If can't decode, consider as expired
  }
}

// Types
export interface User {
  targetCalories: number | null
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

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshAuthToken: () => Promise<boolean>
  fetchUserProfile: () => Promise<User | null>
}

export interface RegisterData {
  name: string
  email: string
  password: string
  birthDate?: string
  gender?: string
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const authInitialized = useRef(false)

  // Initialize auth state
  useEffect(() => {
    if (!authInitialized.current) {
      initializeAuth()
      authInitialized.current = true
    }
  }, [])

  // Background token refresh - check every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = getAuthTokenFromCookie()
      
      if (token && user && isTokenExpiredOrNearExpiry(token, 10)) {
        console.log('Background token refresh triggered')
        await refreshAuthToken()
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [user])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      
      // Check if token exists
      const token = getAuthTokenFromCookie()
      
      if (token) {
        // Smart token management: only refresh if needed
        if (isTokenExpiredOrNearExpiry(token)) {
          console.log('Token expiring soon, refreshing...')
          
          try {
            const response = await apiService.refreshToken(token)
            if (response.success && response.data) {
              // Token refreshed successfully
              setAuthTokenCookie(response.data.token)
              console.log('Token refreshed successfully')
              
              // Set a minimal auth state without full user data
              // User data will be fetched only when needed (e.g., profile page)
              setUser({
                id: '',
                userAlias: '',
                email: '',
                username: '',
                firstName: '',
                lastName: '',
                birthDate: null,
                gender: null,
                height: null,
                weight: null,
                activityLevel: null,
                createdAt: '',
                updatedAt: '',
                authProvider: '',
                providerId: null,
                avatar: null,
                targetCalories: null
              })
            } else {
              // Token refresh failed, clear auth data
              console.warn('Token refresh failed:', response.error)
              removeAllAuthCookies()
            }
          } catch (error) {
            // If refresh fails, assume token is invalid
            console.warn('Token refresh error:', error)
            removeAllAuthCookies()
          }
        } else {
          // Token is still valid - set authenticated state without fetching full profile
          console.log('Token still valid, user authenticated')
          setUser({
            id: '',
            userAlias: '',
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            birthDate: null,
            gender: null,
            height: null,
            weight: null,
            activityLevel: null,
            createdAt: '',
            updatedAt: '',
            authProvider: '',
            providerId: null,
            avatar: null,
            targetCalories: null
          })
        }
      } else {
        // No token found
        console.log('No authentication token found')
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      // Clear invalid data
      removeAllAuthCookies()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const credentials: LoginRequest = { email, password }
      const response = await apiService.login(credentials)
      
      if (response.success && response.data) {
        const { token, user: backendUser } = response.data
        
        // Store the complete backend user data directly
        const userData: User = {
          ...backendUser,
        }
        
        // Store user data and token in cookies
        setUserCookie(userData)
        setAuthTokenCookie(token)
        
        setUser(userData)
        
        // Redirect to dashboard or intended page
        const intendedPath = getIntendedPathFromCookie() || AUTH_PATHS.DASHBOARD
        removeIntendedPathCookie()
        router.push(intendedPath)
      } else {
        throw new Error(response.message || response.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true)
      
      // TODO: Implement Google OAuth integration
      // This requires setting up Google OAuth provider and backend support
      throw new Error('Google login is not yet implemented. Please use email and password to sign in.')
      
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      
      const registerData: RegisterRequest = {
        email: userData.email,
        password: userData.password,
        fullName: userData.name,
        ...(userData.birthDate && { birthDate: userData.birthDate }),
        ...(userData.gender && { gender: userData.gender })
      }
      
      const response = await apiService.register(registerData)
      
      if (response.success && response.data) {
        const { token, user: backendUser } = response.data
        
        // Store the complete backend user data directly
        const newUser: User = backendUser
        
        setAuthTokenCookie(token)
        setUserCookie(newUser)
        setUser(newUser)

        
        // Redirect to dashboard after successful registration
        router.push(AUTH_PATHS.DASHBOARD)
      } else {
        throw new Error(response.message || response.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear user data and all auth cookies
    setUser(null)
    removeAllAuthCookies()
    
    // Redirect to login
    router.push(AUTH_PATHS.SIGNIN)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
    }
  }

  // Method to manually refresh token when needed
  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      const token = getAuthTokenFromCookie()
      if (!token) {
        console.warn('No token found for refresh')
        return false
      }

      const response = await apiService.refreshToken(token)
      if (response.success && response.data) {
        setAuthTokenCookie(response.data.token)
        console.log('Manual token refresh successful')
        return true
      } else {
        console.warn('Manual token refresh failed:', response.error)
        removeAllAuthCookies()
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('Manual token refresh error:', error)
      removeAllAuthCookies()
      setUser(null)
      return false
    }
  }

  // Method to fetch user profile data when needed
  const fetchUserProfile = async (): Promise<User | null> => {
    try {
      const response = await apiService.getUserProfile()
      if (response.success && response.data) {
        const userData = response.data.user
        setUser(userData)
        return userData
      } else {
        console.warn('Failed to fetch user profile:', response.error)
        return null
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    refreshAuthToken,
    fetchUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

 