import type React from "react"
import { Sidebar } from "@/components/Dashboard/sidebar"
import { Header } from "@/components/Dashboard/header"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <div className="flex flex-1 flex-col md:pl-64">
        <Header role="student" userName="Jane Doe" email="jane.doe@example.com" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

