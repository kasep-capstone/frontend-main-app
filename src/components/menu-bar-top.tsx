"use client"

import { ArrowLeft, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function MenuBarTop() {
  const router = useRouter()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-lg border-x border-border/10">
        <div className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-lg">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-lg font-semibold">
            KASEP
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
