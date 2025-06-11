import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Import our route configuration
import { isProtectedRoute, shouldRedirectWhenAuthenticated, getAuthenticatedRedirect } from '@/utils/auth-routes'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get authentication status from token
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  const isAuthenticated = !!token
  
  // Check if route requires authentication
  const requiresAuth = isProtectedRoute(pathname)
  
  // Handle protected routes
  if (requiresAuth && !isAuthenticated) {
    // Store intended path for redirect after login
    const response = NextResponse.redirect(new URL('/signin', request.url))
    response.cookies.set('intendedPath', pathname, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    })
    return response
  }
  
  // Handle auth-only routes (signin/signup when already authenticated)
  if (shouldRedirectWhenAuthenticated(pathname) && isAuthenticated) {
    const redirectTo = getAuthenticatedRedirect(pathname) || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }
  
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$).*)',
  ],
} 