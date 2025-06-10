'use client'

import React from 'react'
import RouteGuard from './RouteGuard'
import { ROUTE_PROTECTION_DEFAULTS, type RouteProtectionConfig } from '@/utils/auth-routes'

interface ProtectedPageProps {
  children: React.ReactNode
  type?: 'protected' | 'public' | 'auth-only'
  config?: RouteProtectionConfig
  useRoutConfig?: boolean // Whether to use centralized route config
}

/**
 * ProtectedPage - Easy wrapper component for page protection
 * 
 * Usage examples:
 * 
 * 1. Protected page (requires login) - uses centralized config:
 *    <ProtectedPage type="protected">
 *      <YourPageContent />
 *    </ProtectedPage>
 * 
 * 2. Public page (no login required):
 *    <ProtectedPage type="public">
 *      <YourPageContent />
 *    </ProtectedPage>
 * 
 * 3. Auth-only page (redirect if logged in, like login/register):
 *    <ProtectedPage type="auth-only">
 *      <YourPageContent />
 *    </ProtectedPage>
 * 
 * 4. Custom configuration (disables centralized config):
 *    <ProtectedPage config={{ requireAuth: true, redirectTo: '/custom-login' }}>
 *      <YourPageContent />
 *    </ProtectedPage>
 * 
 * 5. Force use centralized config even with custom config:
 *    <ProtectedPage config={{ ...custom }} useRoutConfig={true}>
 *      <YourPageContent />
 *    </ProtectedPage>
 */
export default function ProtectedPage({ 
  children, 
  type = 'protected',
  config,
  useRoutConfig 
}: ProtectedPageProps) {
  // Determine whether to use route config
  // If useRoutConfig is explicitly set, use that
  // If config is provided, default to NOT using route config (backward compatibility)
  // Otherwise, default to using route config
  const shouldUseRouteConfig = useRoutConfig ?? (config ? false : true)
  
  // Get default config based on type (for fallback when not using centralized config)
  const defaultConfig = config || ROUTE_PROTECTION_DEFAULTS[
    type === 'protected' ? 'PROTECTED' :
    type === 'public' ? 'PUBLIC' : 
    'AUTH_ONLY'
  ]

  return (
    <RouteGuard {...defaultConfig} useRoutConfig={shouldUseRouteConfig}>
      {children}
    </RouteGuard>
  )
}

// Convenience components for specific use cases
export function ProtectedPageContent({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage type="protected">
      {children}
    </ProtectedPage>
  )
}

export function PublicPageContent({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage type="public">
      {children}
    </ProtectedPage>
  )
}

export function AuthOnlyPageContent({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage type="auth-only">
      {children}
    </ProtectedPage>
  )
} 