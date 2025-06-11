# Main App - Capstone Project

This is the main frontend application built with Next.js, featuring authentication integration with the backend API.

## Features

- **Authentication System**: Sign in/Sign up with email and password
- **Real-time API Integration**: Connects to backend authentication endpoints
- **Secure Token Management**: JWT token handling with automatic refresh
- **Responsive UI**: Modern, mobile-first design
- **Protected Routes**: Route-based authentication protection

## Prerequisites

- Node.js 18+ 
- Backend API server running (with authentication endpoints)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Note**: Update the `NEXT_PUBLIC_API_URL` to match your backend server URL.

### 3. Backend API Requirements

Your backend must have the following authentication endpoints:

#### POST /auth/login
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "userAlias": "username",
      "email": "user@example.com",
      "username": "username",
      "firstName": "First",
      "lastName": "Last",
      "birthDate": null,
      "gender": null,
      "height": null,
      "weight": null,
      "activityLevel": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "authProvider": "local",
      "providerId": null
    },
    "token": "jwt-token-here"
  }
}
```

#### POST /auth/register
```json
// Request
{
  "email": "user@example.com", 
  "password": "password123",
  "fullName": "First Last"
}

// Response
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user-id",
      "userAlias": "username",
      "email": "user@example.com",
      "username": "username", 
      "firstName": "First",
      "lastName": "Last",
      "birthDate": null,
      "gender": null,
      "height": null,
      "weight": null,
      "activityLevel": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "authProvider": "local",
      "providerId": null
    },
    "token": "jwt-token-here"
  }
}
```

#### POST /auth/refresh
```json
// Request Headers
{
  "Authorization": "Bearer jwt-token-here"
}

// Response
{
  "token": "new-jwt-token-here"
}
```

### 4. Validation Schema

The backend should use these validation rules (using Joi):

```javascript
// Login validation
{
  email: Joi.string().email().required(),
  password: Joi.string().required()
}

// Register validation  
{
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).required()
}

// Refresh validation
{
  authorization: Joi.string().required() // in headers
}
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Authentication Flow

1. **Sign Up**: Users can create an account with email, password, and full name
2. **Sign In**: Users can log in with email and password
3. **Token Management**: JWT tokens are stored in secure cookies and automatically refreshed
4. **Route Protection**: Authenticated routes redirect to sign-in if user is not logged in
5. **Automatic Logout**: Invalid or expired tokens trigger automatic logout

## Key Files

- `src/contexts/AuthContext.tsx` - Authentication context and state management
- `src/services/apiService.ts` - API communication service
- `src/app/(auth)/signin/page.tsx` - Sign in page
- `src/app/(auth)/signup/page.tsx` - Sign up page
- `src/utils/auth-cookies.ts` - Cookie management utilities
- `src/utils/auth-routes.ts` - Route protection configuration

## Development Notes

- **Google OAuth**: Currently not implemented (shows error message)
- **Token Refresh**: Automatically validates and refreshes tokens on app initialization
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript integration with proper type definitions

## API Service Configuration

The API service (`src/services/apiService.ts`) handles all HTTP communication with the backend. It:

- Automatically includes proper headers
- Handles errors gracefully
- Provides typed responses
- Supports configurable base URL via environment variables

## Contributing

1. Ensure your backend matches the required API endpoints
2. Update environment variables accordingly
3. Test authentication flow thoroughly
4. Follow TypeScript best practices 