// Utility functions for managing authentication cookies

// Cookie names
export const AUTH_COOKIES = {
  TOKEN: 'authToken',
  USER: 'user',
  INTENDED_PATH: 'intendedPath',
} as const

// Set auth token in cookie (for middleware access)
export function setAuthTokenCookie(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIES.TOKEN}=${token}; path=/; secure=${process.env.NODE_ENV === 'production'}; samesite=lax; max-age=${60 * 60 * 24 * 7}` // 7 days
  }
}

// Set user data in cookie
export function setUserCookie(user: any) {
  if (typeof document !== 'undefined') {
    const userJson = JSON.stringify(user)
    document.cookie = `${AUTH_COOKIES.USER}=${encodeURIComponent(userJson)}; path=/; secure=${process.env.NODE_ENV === 'production'}; samesite=lax; max-age=${60 * 60 * 24 * 7}` // 7 days
  }
}

// Remove auth token from cookie
export function removeAuthTokenCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIES.TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

// Remove user data from cookie
export function removeUserCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIES.USER}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

// Remove all auth cookies
export function removeAllAuthCookies() {
  removeAuthTokenCookie()
  removeUserCookie()
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIES.INTENDED_PATH}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

// Get auth token from cookie (client-side)
export function getAuthTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${AUTH_COOKIES.TOKEN}=`)
  )
  
  return tokenCookie ? tokenCookie.split('=')[1] : null
}

// Get user data from cookie (client-side)
export function getUserFromCookie(): any | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const userCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${AUTH_COOKIES.USER}=`)
  )
  
  if (userCookie) {
    try {
      const userJson = decodeURIComponent(userCookie.split('=')[1])
      return JSON.parse(userJson)
    } catch (error) {
      console.error('Error parsing user cookie:', error)
      return null
    }
  }
  
  return null
}

// Check if user is authenticated based on cookie
export function isAuthenticatedFromCookie(): boolean {
  return !!getAuthTokenFromCookie() && !!getUserFromCookie()
}

// Set intended path for redirect after login
export function setIntendedPathCookie(path: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIES.INTENDED_PATH}=${encodeURIComponent(path)}; path=/; secure=${process.env.NODE_ENV === 'production'}; samesite=lax; max-age=${60 * 60 * 24}` // 1 day
  }
}

// Get intended path from cookie
export function getIntendedPathFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const pathCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${AUTH_COOKIES.INTENDED_PATH}=`)
  )
  
  return pathCookie ? decodeURIComponent(pathCookie.split('=')[1]) : null
}

// Remove intended path cookie
export function removeIntendedPathCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIES.INTENDED_PATH}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

// Helper function to get current auth state from cookies
export function getCurrentAuthState() {
  const user = getUserFromCookie()
  const token = getAuthTokenFromCookie()
  
  return {
    user,
    token,
    isAuthenticated: !!(user && token)
  }
} 