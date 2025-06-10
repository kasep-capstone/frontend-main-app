'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { cn } from '@/utils/utils'
import { useAuth } from '@/contexts/AuthContext'
import { AuthOnlyPageContent } from '@/components/auth/ProtectedPage'

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const { login, loginWithGoogle, isLoading } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await login(formData.email, formData.password)
      // Success handled by AuthContext (redirect, etc.)
    } catch (error: any) {
      console.error('Login error:', error)
      setErrors({ general: error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.' })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle()
      // Success handled by AuthContext (redirect, etc.)
    } catch (error: any) {
      console.error('Google login error:', error)
      setErrors({ general: error.message || 'Terjadi kesalahan saat login dengan Google. Silakan coba lagi.' })
    }
  }

  return (
    <AuthOnlyPageContent>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">

          {/* Logo/Brand Area */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl text-white font-bold">KASEP</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-muted-foreground text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Sign In Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.general}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(
                      "pl-10 h-12",
                      errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={cn(
                      "pl-10 pr-10 h-12",
                      errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-12 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Email: user@example.com</p>
              <p>Password: password123</p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              size="lg"
              className={cn(
                "w-full h-12 relative",
                "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200",
                "dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:border-gray-700",
                "shadow-sm hover:shadow-md transition-all duration-200",
                "focus:ring-2 focus:ring-primary/20 focus:border-primary"
              )}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center">
                <FcGoogle className="w-5 h-5 mr-3" />
                Masuk dengan Google
              </div>
            </Button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <Link 
                  href="/signup" 
                  className="text-primary hover:underline font-medium"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Dengan masuk, Anda menyetujui{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Syarat Layanan
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Kebijakan Privasi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthOnlyPageContent>
  )
}
