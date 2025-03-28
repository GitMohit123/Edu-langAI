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

  const handleJoinClassSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!classCode.trim()) return

    setIsJoinModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-gray-500">Welcome back, Jane! Here are your classes and recent materials.</p>
        </div>
      </div>

      {/* Join Class Card */}
      <Card>
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
      </Card>

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

      {/* Enrolled Classes */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Classes</h2>
          <Link href="/dashboard/student/classes" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <motion.div
              key={cls.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              animate={{
                backgroundColor:
                  recentlyJoinedClass === cls.id ? ["#f0f9ff", "#ffffff", "#f0f9ff", "#ffffff"] : "#ffffff",
                transition: { duration: 2, repeat: 2 },
              }}
              className="rounded-lg overflow-hidden"
            >
              <Card className="h-full">
                <CardHeader className="bg-primary-50 pb-2">
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>Professor: {cls.professor}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Materials</span>
                      <span className="font-medium">{cls.materials}</span>
                    </div>
                    {cls.newMaterials > 0 && (
                      <div className="flex items-center">
                        <Badge className="bg-primary-500">
                          {cls.newMaterials} new {cls.newMaterials === 1 ? "material" : "materials"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 px-6 py-3">
                  <Link
                    href={`/dashboard/student/classes/${cls.id}`}
                    className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View Class
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}

          {/* Join class card */}
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className="flex h-full flex-col items-center justify-center border-2 border-dashed border-gray-200 p-6 text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-3">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mb-1 font-medium">Join Another Class</h3>
              <p className="mb-4 text-sm text-gray-500">Enter a class code to join a new class</p>
              <Button onClick={() => setIsJoinModalOpen(true)} variant="outline" className="mt-2">
                Enter Class Code
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Materials */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Materials</h2>
          <Link href="/dashboard/student/materials" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentMaterials.map((material) => (
                <div key={material.id} className="flex items-start gap-4 p-4">
                  <div className="rounded-full bg-primary-50 p-2">
                    <FileText className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{material.name}</p>
                      <Badge variant="outline" className="uppercase">
                        {material.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{material.class}</p>
                    <p className="text-xs text-gray-400">Uploaded {material.uploaded}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Sparkles className="h-4 w-4" />
                      <span className="sr-only">Translate</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Headphones className="h-4 w-4" />
                      <span className="sr-only">Text to Speech</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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

