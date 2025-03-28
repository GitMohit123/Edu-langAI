"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Calendar, Clock, ArrowRight, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { JoinClassModal } from "@/components/Dashboard/join-class-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for joined classes
const joinedClasses = [
  {
    id: "cls1",
    name: "Introduction to Linguistics",
    professor: "Dr. Smith",
    materials: 12,
    newMaterials: 2,
    code: "LING-AB123",
    lastActive: "Today",
    joinedDate: "Sep 5, 2023",
    nextAssignment: "Phonetics Analysis",
    nextAssignmentDue: "Oct 15, 2023",
  },
  {
    id: "cls2",
    name: "Advanced Spanish Literature",
    professor: "Prof. Garcia",
    materials: 8,
    newMaterials: 0,
    code: "SPAN-XY456",
    lastActive: "Yesterday",
    joinedDate: "Sep 10, 2023",
    nextAssignment: "García Lorca Essay",
    nextAssignmentDue: "Oct 20, 2023",
  },
  {
    id: "cls3",
    name: "French for Beginners",
    professor: "Dr. Dubois",
    materials: 15,
    newMaterials: 3,
    code: "FREN-CD789",
    lastActive: "3 days ago",
    joinedDate: "Aug 28, 2023",
    nextAssignment: "Basic Conversation Practice",
    nextAssignmentDue: "Oct 10, 2023",
  },
  {
    id: "cls4",
    name: "German Grammar",
    professor: "Prof. Mueller",
    materials: 10,
    newMaterials: 0,
    code: "GERM-EF101",
    lastActive: "1 week ago",
    joinedDate: "Sep 1, 2023",
    nextAssignment: "Case System Exercise",
    nextAssignmentDue: "Oct 25, 2023",
  },
  {
    id: "cls5",
    name: "Japanese Kanji",
    professor: "Dr. Tanaka",
    materials: 20,
    newMaterials: 5,
    code: "JAPN-GH202",
    lastActive: "Today",
    joinedDate: "Aug 15, 2023",
    nextAssignment: "Kanji Writing Practice",
    nextAssignmentDue: "Oct 12, 2023",
  },
]

export default function StudentClassesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  // Filter and sort classes
  const filteredClasses = joinedClasses
    .filter(
      (cls) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "recent") {
        // Sort by last active date (simplified for demo)
        const aValue = a.lastActive === "Today" ? 0 : a.lastActive === "Yesterday" ? 1 : 2
        const bValue = b.lastActive === "Today" ? 0 : b.lastActive === "Yesterday" ? 1 : 2
        return aValue - bValue
      }
      if (sortBy === "materials") return b.materials - a.materials
      return 0
    })

  const handleJoinClass = (code: string) => {
    // In a real app, this would add the class to the user's classes
    console.log("Joined class with code:", code)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-gray-500">View and manage all your enrolled classes</p>
        </div>
        <Button onClick={() => setIsJoinModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Join New Class
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search classes by name, professor, or code..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Active</SelectItem>
              <SelectItem value="name">Class Name</SelectItem>
              <SelectItem value="materials">Most Materials</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Classes grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => (
          <motion.div key={cls.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className="h-full">
              <CardHeader className="bg-primary-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{cls.name}</CardTitle>
                  {cls.newMaterials > 0 && <Badge className="bg-primary-500">{cls.newMaterials} new</Badge>}
                </div>
                <CardDescription>Professor: {cls.professor}</CardDescription>
                <CardDescription>Code: {cls.code}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{cls.materials} materials available</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">Joined on {cls.joinedDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">Last active: {cls.lastActive}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium mb-2">Next Assignment</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{cls.nextAssignment}</span>
                      <Badge variant="outline" className="text-xs">
                        Due {cls.nextAssignmentDue}
                      </Badge>
                    </div>
                  </div>
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

