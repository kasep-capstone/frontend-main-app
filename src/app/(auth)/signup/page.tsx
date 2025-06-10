'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, CheckCircle } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { cn } from '@/utils/utils'
import { useAuth } from '@/contexts/AuthContext'
import { AuthOnlyPageContent } from '@/components/auth/ProtectedPage'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [acceptTerms, setAcceptTerms] = useState(false)
  
  const { register, loginWithGoogle, isLoading } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nama harus minimal 2 karakter'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password harus minimal 8 karakter'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf besar, kecil, dan angka'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama'
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'Anda harus menyetujui syarat dan ketentuan'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, text: '', color: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++
    
    if (score < 2) return { score, text: 'Lemah', color: 'text-red-500' }
    if (score < 4) return { score, text: 'Sedang', color: 'text-amber-500' }
    return { score, text: 'Kuat', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      // Success handled by AuthContext (redirect, etc.)
    } catch (error: any) {
      console.error('Registration error:', error)
      setErrors({ general: error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.' })
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle()
      // Success handled by AuthContext (redirect, etc.)
    } catch (error: any) {
      console.error('Google sign up error:', error)
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
              Buat Akun Baru
            </h1>
            <p className="text-muted-foreground text-sm">
              Bergabung untuk memulai perjalanan sehat Anda
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.general}
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={cn(
                      "pl-10 h-12",
                      errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
                    )}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

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
                    placeholder="Buat password yang kuat"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score < 2 ? 'bg-red-500' :
                            passwordStrength.score < 4 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={cn(
                      "pl-10 pr-10 h-12",
                      errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    Saya menyetujui{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Syarat dan Ketentuan
                    </Link>{' '}
                    serta{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Kebijakan Privasi
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-12 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button
              onClick={handleGoogleSignUp}
              size="lg"
              className={cn(
                "w-full h-12 relative",
                "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200",
                "dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:border-gray-700",
                "shadow-sm hover:shadow-md transition-all duration-200",
                "focus:ring-2 focus:ring-primary/20 focus:border-primary"
              )}
            >
              <div className="flex items-center justify-center">
                <FcGoogle className="w-5 h-5 mr-3" />
                Daftar dengan Google
              </div>
            </Button>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <Link 
                  href="/signin" 
                  className="text-primary hover:underline font-medium"
                >
                  Masuk sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Dengan mendaftar, Anda menyetujui{" "}
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
