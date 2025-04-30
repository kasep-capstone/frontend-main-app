import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/themes/theme-provider"
import type React from "react" // Added import for React
import MobileLayout from "@/components/layout/MobileLayout"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <MobileLayout>
            {children}
          </MobileLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
