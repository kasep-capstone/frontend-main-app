'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AUTH_PATHS } from '@/utils/auth-routes'
import { setAuthTokenCookie, removeAuthTokenCookie } from '@/utils/auth-cookies'

// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
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
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('authToken')
      
      if (storedUser && token) {
        const userData: User = JSON.parse(storedUser)
        
        // TODO: Validate token with backend
        // For now, we'll assume stored data is valid
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      // Clear invalid data
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // TODO: Replace with actual API call
      const response = await mockLogin(email, password)
      
      if (response.success) {
        const userData = response.user!
        const token = response.token!
        
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('authToken', token)
        setAuthTokenCookie(token)
        
        setUser(userData)
        
        // Redirect to dashboard or intended page
        const intendedPath = sessionStorage.getItem('intendedPath') || AUTH_PATHS.DASHBOARD
        sessionStorage.removeItem('intendedPath')
        router.push(intendedPath)
      } else {
        throw new Error(response.message || 'Login failed')
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
      
      // TODO: Implement Google OAuth
      const response = await mockGoogleLogin()
      
      if (response.success) {
        const userData = response.user
        const token = response.token
        
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('authToken', token)
        setAuthTokenCookie(token)
        
        setUser(userData)
        
        const intendedPath = sessionStorage.getItem('intendedPath') || AUTH_PATHS.DASHBOARD
        sessionStorage.removeItem('intendedPath')
        router.push(intendedPath)
      }
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
      
      // TODO: Replace with actual API call
      const response = await mockRegister(userData)
      
      if (response.success) {
        const newUser = response.user
        const token = response.token
        
        localStorage.setItem('user', JSON.stringify(newUser))
        localStorage.setItem('authToken', token)
        setAuthTokenCookie(token)
        
        setUser(newUser)
        
        // Redirect to dashboard after successful registration
        router.push(AUTH_PATHS.DASHBOARD)
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear user data
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    removeAuthTokenCookie()
    sessionStorage.removeItem('intendedPath')
    
    // Redirect to login
    router.push(AUTH_PATHS.SIGNIN)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
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
    updateUser
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

// Mock API functions (replace with actual API calls)
async function mockLogin(email: string, password: string): Promise<{
  success: boolean
  user?: User
  token?: string
  message?: string
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation
  if (email === 'user@example.com' && password === 'password123') {
    return {
      success: true,
      user: {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  }
  
  return {
    success: false,
    message: 'Email atau password salah'
  }
}

async function mockGoogleLogin() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    user: {
      id: '2',
      name: 'Google User',
      email: 'google@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150'
    },
    token: 'mock-google-token-' + Date.now()
  }
}

async function mockRegister(userData: RegisterData) {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    success: true,
    user: {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
    },
    token: 'mock-register-token-' + Date.now()
  }
} 