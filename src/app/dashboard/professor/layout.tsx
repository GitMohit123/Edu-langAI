import type React from "react"
import { Sidebar } from "@/components/Dashboard/sidebar"
import { Header } from "@/components/Dashboard/header"

export default function ProfessorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="professor" />
      <div className="flex flex-1 flex-col md:pl-64">
        <Header role="professor" userName="Dr. Smith" email="dr.smith@example.com" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

