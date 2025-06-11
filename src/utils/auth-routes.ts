// Route configuration for authentication
export interface RouteConfig {
  path: string
  requireAuth: boolean
  redirectTo?: string
  description?: string
}

// Define your routes and their authentication requirements here
export const routeConfigs: RouteConfig[] = [
  // Public routes (no authentication required)
  { path: '/signin', requireAuth: false, redirectTo: '/dashboard', description: 'Sign in page' },
  { path: '/signup', requireAuth: false, redirectTo: '/dashboard', description: 'Sign up page' },
  
  // Protected routes (authentication required)
  { path: '/', requireAuth: true, description: 'User dashboard' },
  { path: '/dashboard', requireAuth: true, description: 'User dashboard' },
  { path: '/profile', requireAuth: true, description: 'User profile' },
  { path: '/bmi', requireAuth: true, description: 'BMI calculator' },
  { path: '/history', requireAuth: true, description: 'User history' },
  { path: '/snap', requireAuth: true, description: 'Food snap feature' },
  
  // Add more routes as needed
  // { path: '/settings', requireAuth: true, description: 'User settings' },
  // { path: '/reports', requireAuth: true, description: 'User reports' },
]

// Helper function to get route config
export function getRouteConfig(pathname: string): RouteConfig | undefined {
  return routeConfigs.find(config => {
    // Exact match or starts with the path (for dynamic routes)
    return pathname === config.path || pathname.startsWith(config.path + '/')
  })
}

// Helper function to check if route requires authentication
export function isProtectedRoute(pathname: string): boolean {
  const config = getRouteConfig(pathname)
  return config?.requireAuth ?? false
}

// Helper function to check if route should redirect when authenticated
export function shouldRedirectWhenAuthenticated(pathname: string): boolean {
  const config = getRouteConfig(pathname)
  return config?.requireAuth === false && !!config?.redirectTo
}

// Helper function to get redirect path for authenticated users
export function getAuthenticatedRedirect(pathname: string): string | undefined {
  const config = getRouteConfig(pathname)
  return config?.redirectTo
}

// Constants for common paths
export const AUTH_PATHS = {
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  HOME: '/',
} as const

// Type for easy route protection configuration
export type RouteProtectionConfig = {
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

// Default configurations for common scenarios
export const ROUTE_PROTECTION_DEFAULTS = {
  PROTECTED: { requireAuth: true, redirectTo: '/signin' } as RouteProtectionConfig,
  PUBLIC: { requireAuth: false } as RouteProtectionConfig,
  AUTH_ONLY: { requireAuth: false, redirectTo: '/dashboard' } as RouteProtectionConfig,
} as const 