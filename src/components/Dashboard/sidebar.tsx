"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
  Headphones,
  FileUp,
  GraduationCap,
  BookMarked,
} from "lucide-react"

interface SidebarProps {
  role: "professor" | "student"
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const professorLinks = [
    { href: "/dashboard/professor", label: "Dashboard", icon: Home },
    { href: "/dashboard/professor/upload", label: "Upload", icon: FileUp },
    { href: "/dashboard/professor/settings", label: "Settings", icon: Settings },
  ]

  const studentLinks = [
    { href: "/dashboard/student", label: "Dashboard", icon: Home },
    { href: "/dashboard/student/classes", label: "My Classes", icon: BookOpen },
    // { href: "/dashboard/student/materials", label: "Materials", icon: FileText },
    { href: "/dashboard/student/translations", label: "Translations", icon: BookMarked },
    { href: "/dashboard/student/audio", label: "Text to Speech", icon: Headphones },
    { href: "/dashboard/student/settings", label: "Settings", icon: Settings },
  ]

  const links = role === "professor" ? professorLinks : studentLinks

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <Link href={`/dashboard/${role}`} className="flex items-center space-x-2">
              {role === "professor" ? (
                <BookOpen className="h-6 w-6 text-primary-600" />
              ) : (
                <GraduationCap className="h-6 w-6 text-primary-600" />
              )}
              <span className="text-xl font-bold text-primary-600">EduLang</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary-600" : "text-gray-500")} />
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 h-full w-1 rounded-r-md bg-primary-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/auth/login"
              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Log Out
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

