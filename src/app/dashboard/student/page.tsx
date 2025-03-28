"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, FileText, Headphones, Sparkles, Plus, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { JoinClassModal } from "@/components/Dashboard/join-class-modal"

// Sample data
const initialClasses = [
  {
    id: "cls1",
    name: "Introduction to Linguistics",
    professor: "Dr. Smith",
    materials: 12,
    newMaterials: 2,
    code: "LING-AB123",
  },
  {
    id: "cls2",
    name: "Advanced Spanish Literature",
    professor: "Prof. Garcia",
    materials: 8,
    newMaterials: 0,
    code: "SPAN-XY456",
  },
]

const recentMaterials = [
  {
    id: "m1",
    name: "Week 3: Syntax Overview",
    class: "Introduction to Linguistics",
    type: "pdf",
    uploaded: "3 days ago",
  },
  { id: "m4", name: "Midterm Study Guide", class: "Introduction to Linguistics", type: "docx", uploaded: "1 day ago" },
  {
    id: "m6",
    name: "García Lorca Poetry Collection",
    class: "Advanced Spanish Literature",
    type: "pdf",
    uploaded: "2 weeks ago",
  },
]

export default function StudentDashboardPage() {
  const [classCode, setClassCode] = useState("")
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [classes, setClasses] = useState(initialClasses)
  const [recentlyJoinedClass, setRecentlyJoinedClass] = useState<string | null>(null)

  const handleJoinClass = (code: string) => {
    // In a real app, this would fetch class details from the server
    // For demo purposes, we'll create a mock class
    const newClass = {
      id: `cls${classes.length + 1}`,
      name: `Class ${code}`,
      professor: "Professor",
      materials: 0,
      newMaterials: 0,
      code: code,
    }

    setClasses([...classes, newClass])
    setRecentlyJoinedClass(newClass.id)

    // Reset the highlight after animation
    setTimeout(() => {
      setRecentlyJoinedClass(null)
    }, 5000)
  }

  const handleJoinClassSubmit = () => {
    setIsJoinModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-600">Student Dashboard</h1>
          <p className="text-gray-500">Welcome back, Jane! Here are your classes and recent materials.</p>
        </div>
        <Button variant="outline" onClick={handleJoinClassSubmit} className="py-4 mr-2 bg-primary-600 text-white hover:bg-primary-700 hover:text-white">
        <BookOpen className="h-4 w-4 mr-2" />Join a Class
          </Button>
      </div>

      {/* Join Class Card */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Join a Class</CardTitle>
          <CardDescription>Enter the class code provided by your professor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinClassSubmit} className="flex gap-2">
            <Input
              id="class-code-input"
              placeholder="Enter class code (e.g., LING-AB123)"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              className="flex-1 uppercase"
            />
            <Button type="submit" disabled={!classCode.trim()}>
              Join Class
            </Button>
          </form>
        </CardContent>
      </Card> */}

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-gray-500">Classes you're currently taking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Materials</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, cls) => acc + cls.materials, 0)}</div>
            <p className="text-xs text-gray-500">Documents across all your classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Materials</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, cls) => acc + cls.newMaterials, 0)}</div>
            <p className="text-xs text-gray-500">New documents in the last week</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Tools Section */}
      <div>
        <h2 className="mb-4 text-xl font-bold">AI Learning Tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Translation</CardTitle>
              <CardDescription>Translate materials to your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Access your learning materials in over 95 languages with our AI-powered translation.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <Link
                href="/dashboard/student/translations"
                className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Translate Materials
                <Sparkles className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text-to-Speech</CardTitle>
              <CardDescription>Listen to your materials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Convert any text material to natural-sounding speech in multiple languages and voices.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <Link
                href="/dashboard/student/audio"
                className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Listen to Materials
                <Headphones className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Summarization</CardTitle>
              <CardDescription>Get concise summaries of your materials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Let our AI create summaries of your learning materials to help you quickly grasp key concepts.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <Link
                href="/dashboard/student/ai-tools"
                className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Summarize Materials
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinClass={handleJoinClass}
      />
    </div>
  )
}

