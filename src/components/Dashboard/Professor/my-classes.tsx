"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ClassCard } from "./class-card"
import { Plus, Search } from "lucide-react"

// Mock data for professor classes
const mockClasses = [
  {
    id: "class-1",
    name: "Spanish for Beginners",
    description:
      "An introductory course to Spanish language covering basic vocabulary, grammar, and conversation skills.",
    language: "Spanish",
    level: "Beginner",
    studentsCount: 24,
    materialsCount: 12,
    startDate: "Jan 15, 2023",
  },
  {
    id: "class-2",
    name: "Intermediate French",
    description: "Build upon basic French knowledge with more advanced grammar, vocabulary, and cultural contexts.",
    language: "French",
    level: "Intermediate",
    studentsCount: 18,
    materialsCount: 15,
    startDate: "Feb 3, 2023",
  },
  {
    id: "class-3",
    name: "Business German",
    description:
      "Learn German vocabulary and phrases specific to business contexts, including meetings, negotiations, and presentations.",
    language: "German",
    level: "Advanced",
    studentsCount: 12,
    materialsCount: 8,
    startDate: "Mar 10, 2023",
  },
  {
    id: "class-4",
    name: "Japanese Culture & Language",
    description:
      "Explore Japanese language basics alongside cultural elements including etiquette, traditions, and modern society.",
    language: "Japanese",
    level: "Beginner",
    studentsCount: 30,
    materialsCount: 20,
    startDate: "Apr 5, 2023",
  },
  {
    id: "class-5",
    name: "Conversational Italian",
    description: "Focus on practical Italian conversation skills for travel, dining, and everyday interactions.",
    language: "Italian",
    level: "Intermediate",
    studentsCount: 15,
    materialsCount: 10,
    startDate: "May 12, 2023",
  },
]

export function MyClasses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [classToDelete, setClassToDelete] = useState<string | null>(null)

  // Filter classes based on search query and filters
  const filteredClasses = mockClasses.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLanguage = languageFilter === "all" || cls.language === languageFilter
    const matchesLevel = levelFilter === "all" || cls.level === levelFilter

    return matchesSearch && matchesLanguage && matchesLevel
  })

  // Get unique languages and levels for filters
  const languages = Array.from(new Set(mockClasses.map((cls) => cls.language)))
  const levels = Array.from(new Set(mockClasses.map((cls) => cls.level)))

  const handleDeleteClick = (id: string) => {
    setClassToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, you would delete the class here
    console.log(`Deleting class ${classToDelete}`)
    setDeleteDialogOpen(false)
    setClassToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">My Classes</h2>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create New Class
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              id={cls.id}
              name={cls.name}
              description={cls.description}
              language={cls.language}
              level={cls.level}
              studentsCount={cls.studentsCount}
              materialsCount={cls.materialsCount}
              startDate={cls.startDate}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No classes found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters, or create a new class.</p>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this class and remove all associated materials and student enrollments. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete Class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

