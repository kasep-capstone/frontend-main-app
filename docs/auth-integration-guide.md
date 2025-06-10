# Centralized Authentication System Integration Guide

This guide explains the newly integrated centralized authentication system that provides route protection at both server and client levels.

## Overview

The system now uses a centralized configuration approach where all route protection rules are defined in one place (`src/utils/auth-routes.ts`) and automatically enforced by:

1. **Server-side middleware** (`middleware.ts`) - Handles redirects before pages load
2. **Client-side components** - Provides UI-level protection and loading states
3. **Centralized configuration** - Single source of truth for all route rules

## Key Files

### 1. `src/utils/auth-routes.ts`
Contains all route definitions and helper functions:

```typescript
// All routes are defined here
export const routeConfigs: RouteConfig[] = [
  { path: '/signin', requireAuth: false, redirectTo: '/dashboard' },
  { path: '/dashboard', requireAuth: true },
  { path: '/profile', requireAuth: true },
  // ... more routes
]

// Helper functions
export function isProtectedRoute(pathname: string): boolean
export function getRouteConfig(pathname: string): RouteConfig | undefined
// ... more helpers
```

### 2. `middleware.ts`
Server-side protection using Next.js middleware:

```typescript
// Automatically protects routes before they load
export function middleware(request: NextRequest) {
  const requiresAuth = isProtectedRoute(pathname)
  if (requiresAuth && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  // ... more logic
}
```

### 3. `src/components/auth/ProtectedPage.tsx`
Client-side wrapper for pages:

```typescript
// Automatically uses centralized config by default
<ProtectedPageContent>
  <YourPageContent />
</ProtectedPageContent>
```

## Usage

### Automatic Route Protection

Most routes are now automatically protected based on the central configuration:

```typescript
// In your page component - that's it!
export default function ProfilePage() {
  return (
    <ProtectedPageContent>
      <div>Your profile content</div>
    </ProtectedPageContent>
  )
}
```

### Adding New Routes

To add a new protected route, simply add it to the `routeConfigs` array:

```typescript
// In src/utils/auth-routes.ts
export const routeConfigs: RouteConfig[] = [
  // ... existing routes
  { path: '/settings', requireAuth: true, description: 'User settings' },
]
```

### Custom Protection Rules

For special cases, you can override the automatic behavior:

```typescript
// Disable centralized config for custom behavior
<ProtectedPage 
  useRoutConfig={false}
  config={{ requireAuth: true, redirectTo: '/custom-login' }}
>
  <YourContent />
</ProtectedPage>
```

## Configuration Options

### Route Configuration

Each route can have:

- `path`: The route path
- `requireAuth`: Whether authentication is required
- `redirectTo`: Where to redirect authenticated users (for auth-only pages)
- `description`: Human-readable description

### Page Protection Types

1. **Protected Pages** (requires login):
   ```typescript
   <ProtectedPageContent>{children}</ProtectedPageContent>
   ```

2. **Public Pages** (no login required):
   ```typescript
   <PublicPageContent>{children}</PublicPageContent>
   ```

3. **Auth-Only Pages** (redirect if logged in, like login/signup):
   ```typescript
   <AuthOnlyPageContent>{children}</AuthOnlyPageContent>
   ```

## Benefits

1. **Single Source of Truth**: All route rules in one place
2. **Server-Side Protection**: Routes protected before page loads
3. **Client-Side UX**: Smooth loading states and transitions
4. **Automatic Cookie Management**: Seamless auth state sharing
5. **Backward Compatibility**: Existing code continues to work
6. **Type Safety**: Full TypeScript support

## Authentication Flow

1. User visits protected route
2. **Middleware** checks authentication server-side
3. If not authenticated, redirects to `/signin` with intended path stored
4. User logs in successfully
5. **AuthContext** sets cookies and localStorage
6. User redirected to originally intended path
7. **Client components** handle loading states

## Migration from Old System

The system is backward compatible. Existing pages using explicit configuration will continue to work:

```typescript
// Old way (still works)
<ProtectedPage config={{ requireAuth: true, redirectTo: '/signin' }}>
  {children}
</ProtectedPage>

// New way (automatic)
<ProtectedPageContent>
  {children}
</ProtectedPageContent>
```

## Constants and Paths

Use centralized path constants:

```typescript
import { AUTH_PATHS } from '@/utils/auth-routes'

// Instead of hardcoding '/signin'
router.push(AUTH_PATHS.SIGNIN)
```

## Cookie Management

The system automatically manages authentication cookies for server-side access:

```typescript
import { setAuthTokenCookie, removeAuthTokenCookie } from '@/utils/auth-cookies'

// Automatically called by AuthContext
setAuthTokenCookie(token)  // On login
removeAuthTokenCookie()    // On logout
```

This integration provides a robust, scalable authentication system that works seamlessly across your entire application. 