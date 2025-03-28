"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Search, Calendar, Clock, Languages, Globe, ArrowRight, Eye, Sparkles, List, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TranslationDialog } from "@/components/Dashboard/transational-dialog"

// Sample data for translated materials
const translatedMaterials = [
  {
    id: "t1",
    name: "Week 1: Introduction to Phonetics",
    originalName: "Week 1: Introduction to Phonetics",
    class: "Introduction to Linguistics",
    professor: "Dr. Smith",
    type: "pdf",
    size: "2.4 MB",
    originalLanguage: "English",
    translatedLanguage: "Spanish",
    translationDate: "Sep 16, 2023",
    lastViewed: "Today",
    path: "/files/translations/intro-phonetics-es.pdf",
  },
  {
    id: "t2",
    name: "Semana 2: Conceptos Básicos de Morfología",
    originalName: "Week 2: Morphology Basics",
    class: "Introduction to Linguistics",
    professor: "Dr. Smith",
    type: "pdf",
    size: "3.1 MB",
    originalLanguage: "English",
    translatedLanguage: "Spanish",
    translationDate: "Sep 23, 2023",
    lastViewed: "Yesterday",
    path: "/files/translations/morphology-basics-es.pdf",
  },
  {
    id: "t3",
    name: "García Lorca Poetry Collection",
    originalName: "García Lorca Poetry Collection",
    class: "Advanced Spanish Literature",
    professor: "Prof. Garcia",
    type: "pdf",
    size: "2.7 MB",
    originalLanguage: "Spanish",
    translatedLanguage: "English",
    translationDate: "Sep 19, 2023",
    lastViewed: "3 days ago",
    path: "/files/translations/garcia-lorca-en.pdf",
  },
  {
    id: "t4",
    name: "Deutsches Fallsystem Überblick",
    originalName: "German Case System Overview",
    class: "German Grammar",
    professor: "Prof. Mueller",
    type: "pdf",
    size: "4.2 MB",
    originalLanguage: "German",
    translatedLanguage: "English",
    translationDate: "Sep 26, 2023",
    lastViewed: "Today",
    path: "/files/translations/german-cases-en.pdf",
  },
  {
    id: "t5",
    name: "基本漢字文字",
    originalName: "Basic Kanji Characters",
    class: "Japanese Kanji",
    professor: "Dr. Tanaka",
    type: "pdf",
    size: "5.6 MB",
    originalLanguage: "Japanese",
    translatedLanguage: "English",
    translationDate: "Sep 21, 2023",
    lastViewed: "2 days ago",
    path: "/files/translations/basic-kanji-en.pdf",
  },
  {
    id: "t6",
    name: "Guide de prononciation française",
    originalName: "French Pronunciation Guide",
    class: "French for Beginners",
    professor: "Dr. Dubois",
    type: "docx",
    size: "1.8 MB",
    originalLanguage: "English",
    translatedLanguage: "French",
    translationDate: "Sep 11, 2023",
    lastViewed: "1 week ago",
    path: "/files/translations/french-pronunciation-fr.docx",
  },
]

// Language options
const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Chinese",
  "Arabic",
  "Russian",
  "Portuguese",
  "Italian",
]

export default function StudentTranslationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOriginalLang, setFilterOriginalLang] = useState("all")
  const [filterTranslatedLang, setFilterTranslatedLang] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState("grid")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Handle new translation
  const handleAddTranslation = (newTranslation: any) => {
    // Here you would typically add the new translation to your state or database
    console.log("New translation added:", newTranslation)
    setDialogOpen(false)
  }

  // Get unique classes for filter dropdown
  const classes = Array.from(new Set(translatedMaterials.map((m) => m.class)))

  // Filter and sort materials
  const filteredMaterials = translatedMaterials
    .filter(
      (material) =>
        (searchQuery === "" ||
          material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.class.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterOriginalLang === "all" || material.originalLanguage === filterOriginalLang) &&
        (filterTranslatedLang === "all" || material.translatedLanguage === filterTranslatedLang),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "recent") {
        // Sort by last viewed date (simplified for demo)
        const aValue = a.lastViewed === "Today" ? 0 : a.lastViewed === "Yesterday" ? 1 : 2
        const bValue = b.lastViewed === "Today" ? 0 : b.lastViewed === "Yesterday" ? 1 : 2
        return aValue - bValue
      }
      if (sortBy === "class") return a.class.localeCompare(b.class)
      if (sortBy === "date") {
        // This is a simplified sort for demo purposes
        return new Date(b.translationDate) > new Date(a.translationDate) ? 1 : -1
      }
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Translations</h1>
          <p className="text-gray-500">View and manage your translated learning materials</p>
        </div>
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)} className="py-4 mr-2 bg-primary-600 text-white hover:bg-primary-700 hover:text-white">
            <Sparkles className="h-6 w-6 mr-2" />
            Translate New Material
          </Button>
            <Button
              variant={viewMode === "list" ? "outline" : "ghost"}
              className={`rounded-r-none border ${viewMode === "list" ? "bg-primary-50" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              Table View
            </Button>
            <Button
              variant={viewMode === "grid" ? "outline" : "ghost"}
              className={`rounded-l-none border ${viewMode === "grid" ? "bg-primary-50" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
              Grid View
            </Button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search translations by name or class..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filterOriginalLang} onValueChange={setFilterOriginalLang}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Original language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={`orig-${lang}`} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterTranslatedLang} onValueChange={setFilterTranslatedLang}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Translated to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={`trans-${lang}`} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Viewed</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="date">Translation Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <motion.div
              key={material.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="uppercase mb-2">
                      {material.type}
                    </Badge>
                    <Badge variant="secondary" className="h-6">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Translated
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  <CardDescription>Original: {material.originalName}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {material.originalLanguage} → {material.translatedLanguage}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Translated: {material.translationDate}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Last viewed: {material.lastViewed}</span>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <span className="text-sm text-gray-500">{material.size}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Languages className="h-4 w-4" />
                          <span className="sr-only">Translate to Another Language</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Translated Name</TableHead>
                <TableHead>Original Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Translation Date</TableHead>
                <TableHead>Last Viewed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>{material.originalName}</TableCell>
                  <TableCell>{material.class}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{material.originalLanguage}</span>
                      <ArrowRight className="h-3 w-3 mx-1" />
                      <span>{material.translatedLanguage}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">
                      {material.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{material.translationDate}</TableCell>
                  <TableCell>{material.lastViewed}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Languages className="h-4 w-4" />
                        <span className="sr-only">Translate to Another Language</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <TranslationDialog open={dialogOpen} onOpenChange={setDialogOpen} onTranslationComplete={handleAddTranslation} />
    </div>
  )
}

