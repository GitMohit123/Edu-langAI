"use client"
import type React from "react"
import { Sidebar } from "@/components/Dashboard/sidebar"
import { Header } from "@/components/Dashboard/header"
import { useUserContext } from "@/context/UserContext";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {user} = useUserContext();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <div className="flex flex-1 flex-col md:pl-64">
        <Header role="student" userName={user?.name || "Jane Doe"} email={user?.email || "jane.doe@example.com"} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

