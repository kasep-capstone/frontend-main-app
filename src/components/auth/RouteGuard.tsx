'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/ui/Loading'
import { 
  isProtectedRoute, 
  shouldRedirectWhenAuthenticated, 
  getAuthenticatedRedirect,
  getRouteConfig
} from '@/utils/auth-routes'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
  useRoutConfig?: boolean // Whether to use centralized route config
}

export default function RouteGuard({ 
  children, 
  requireAuth,
  redirectTo,
  fallback,
  useRoutConfig = true // Default to using centralized config
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Get route configuration from centralized config if enabled
  const routeConfig = useRoutConfig ? getRouteConfig(pathname) : null
  
  // Determine protection requirements
  const needsAuth = useRoutConfig ? 
    (routeConfig?.requireAuth ?? false) : 
    (requireAuth ?? true)
  
  const redirectPath = useRoutConfig ? 
    (routeConfig?.redirectTo || '/signin') : 
    (redirectTo || '/signin')

  useEffect(() => {
    if (!isLoading) {
      if (useRoutConfig) {
        // Use centralized route management
        if (isProtectedRoute(pathname) && !isAuthenticated) {
          // Store intended path for redirect after login
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('intendedPath', pathname)
          }
          router.push('/signin')
        } else if (shouldRedirectWhenAuthenticated(pathname) && isAuthenticated) {
          const redirect = getAuthenticatedRedirect(pathname) || '/dashboard'
          router.push(redirect)
        }
      } else {
        // Use legacy prop-based approach
        if (needsAuth && !isAuthenticated) {
          // Store intended path for redirect after login
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('intendedPath', pathname)
          }
          router.push(redirectPath)
        } else if (!needsAuth && isAuthenticated && redirectPath !== '/signin') {
          // If user is authenticated but shouldn't be on this page (like login/register)
          router.push('/dashboard')
        }
      }
    }
  }, [isAuthenticated, isLoading, needsAuth, router, pathname, redirectPath, useRoutConfig])

  // Show loading while checking authentication
  if (isLoading) {
    return fallback || <Loading />
  }

  if (useRoutConfig) {
    // Use centralized route config logic
    if (isProtectedRoute(pathname) && !isAuthenticated) {
      return fallback || <Loading />
    }
    
    if (shouldRedirectWhenAuthenticated(pathname) && isAuthenticated) {
      return fallback || <Loading />
    }
  } else {
    // Use legacy logic
    if (needsAuth && !isAuthenticated) {
      return fallback || <Loading />
    }
    
    if (!needsAuth && isAuthenticated && redirectPath !== '/signin') {
      return fallback || <Loading />
    }
  }

  return <>{children}</>
}

// Higher-order component for easier use
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireAuth?: boolean
    redirectTo?: string
    fallback?: React.ReactNode
    useRoutConfig?: boolean
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    )
  }
} 