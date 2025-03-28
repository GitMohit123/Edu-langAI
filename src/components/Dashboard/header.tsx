"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search, LogOut, Settings, Mail, UserCircle, BookOpen, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationDropdown } from "@/components/Dashboard/notification-dropdown"

interface HeaderProps {
  role: "professor" | "student"
  userName: string
  email?: string
}

export function Header({ role, userName, email = "user@example.com" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center md:hidden">
        {/* Space for mobile menu button */}
        <div className="w-10"></div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="hidden md:flex md:w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={`Search ${role === "professor" ? "classes and materials" : "materials and translations"}...`}
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=48&width=48&text=User" alt={userName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-start p-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48&text=User" alt={userName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-gray-500">{email}</p>
                  <div className="flex items-center pt-1">
                    {role === "professor" ? (
                      <div className="flex items-center text-xs text-primary-600">
                        <BookOpen className="mr-1 h-3 w-3" />
                        Professor
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-primary-600">
                        <GraduationCap className="mr-1 h-3 w-3" />
                        Student
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${role}/profile`} className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${role}/settings`} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${role}/notifications`} className="cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${role}/messages`} className="cursor-pointer">
                  <Mail className="mr-2 h-4 w-4" />
                  Messages
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-red-600 hover:text-red-700 focus:text-red-700">
              <Link href="/auth/login" className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

