"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import router from "next/router"

export default function SignInWithGooglePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement Google authentication logic here
      // For example, using NextAuth.js or Firebase Auth
      console.log("Initiating Google Sign In...")
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to dashboard or handle success
      router.push('/')
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Brand Area */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl text-white font-bold">KASEP</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Selamat Datang
          </h1>
          <p className="text-muted-foreground text-sm">
            Masuk untuk melanjutkan perjalanan sehat Anda
          </p>
        </div>

        {/* Sign In Button */}
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            size="lg"
            className={cn(
              "w-full h-12 relative",
              "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200",
              "dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:border-gray-700",
              "shadow-sm hover:shadow-md transition-all duration-200",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary"
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-3" />
                Menghubungkan...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FcGoogle className="w-5 h-5 mr-3" />
                Masuk dengan Google
              </div>
            )}
          </Button>
        </div>

                 {/* Footer */}
         <div className="mt-8 text-center">
           <p className="text-xs text-muted-foreground">
             Dengan masuk, Anda menyetujui{" "}
             <a href="/auth/terms" className="text-primary hover:underline">
               Syarat Layanan
             </a>{" "}
             dan{" "}
             <a href="/auth/privacy" className="text-primary hover:underline">
               Kebijakan Privasi
             </a>
           </p>
         </div>
      </div>
    </div>
  )
}
