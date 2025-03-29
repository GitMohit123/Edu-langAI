"use client"
import type React from "react"
import { Sidebar } from "@/components/Dashboard/sidebar"
import { Header } from "@/components/Dashboard/header"
import { useUserContext } from "@/context/UserContext";
export default function ProfessorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {user} = useUserContext();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="professor" />
      <div className="flex flex-1 flex-col md:pl-64">
        <Header role="professor" userName={user?.name || "Dr. Smith"} email={user?.email || "dr.smith@example.com"} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

