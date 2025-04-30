"use client"

import type * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Home, Settings, Bell, User, ScanLine, Calculator } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
  iconColor: string
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="h-5 w-5" strokeWidth={2} />,
    label: "Home",
    href: "/",
    iconColor: "text-blue-500",
  },
  {
    icon: <ScanLine className="h-5 w-5" strokeWidth={2} />,
    label: "Snap",
    href: "/snap",
    iconColor: "text-green-500",
  },
  {
    icon: <Calculator className="h-5 w-5" strokeWidth={2} />,
    label: "BMI",
    href: "/bmi",
    iconColor: "text-orange-500",
  },
]

export function MenuBar() {
  const { theme } = useTheme()
  const { scrollY } = useScroll()
  const pathname = usePathname()
  const isDarkTheme = theme === "dark"
  const y = useTransform(scrollY, [0, 100], [0, -20])
  const opacity = useTransform(scrollY, [0, 100], [1, 0.8])

  return (
    <motion.div
      className="fixed bottom-6 z-50 mx-4"
      style={{ y, opacity }}
    >
      <motion.nav
        className="p-2 rounded-2xl bg-background/80 backdrop-blur-lg border border-border/40 shadow-lg relative overflow-hidden"
        initial="initial"
      >
        <ul className="flex items-center gap-2 relative z-10">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <motion.li key={item.label} className="relative">
                <motion.a
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent transition-colors rounded-xl group`}
                >
                  <span className={`transition-colors duration-300 ${isActive ? '[&>svg]:stroke-[2.5px]' : 'text-muted-foreground'} group-hover:${item.iconColor}`}>
                    {item.icon}
                  </span>
                  <span 
                    className={`text-sm transition-[max-width,opacity,transform] duration-500 ease-in-out text-foreground font-medium group-hover:text-foreground opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[200px] overflow-hidden translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap`}
                  >
                    {item.label}
                  </span>
                </motion.a>
              </motion.li>
            )
          })}
        </ul>
      </motion.nav>
    </motion.div>
  )
}
