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

// Remove auth token from cookie
export function removeAuthTokenCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIES.TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
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

// Check if user is authenticated based on cookie
export function isAuthenticatedFromCookie(): boolean {
  return !!getAuthTokenFromCookie()
} 