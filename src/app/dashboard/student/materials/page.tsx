"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Download,
  Headphones,
  Sparkles,
  Search,
  Calendar,
  Clock,
  BookOpen,
  ArrowUpDown,
  Eye,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for downloaded materials
const downloadedMaterials = [
  {
    id: "m1",
    name: "Week 1: Introduction to Phonetics",
    class: "Introduction to Linguistics",
    professor: "Dr. Smith",
    type: "pdf",
    size: "2.4 MB",
    downloadedDate: "Sep 15, 2023",
    lastViewed: "Today",
    translated: true,
    audioGenerated: true,
    summarized: true,
    path: "/files/intro-phonetics.pdf",
  },
  {
    id: "m2",
    name: "Week 2: Morphology Basics",
    class: "Introduction to Linguistics",
    professor: "Dr. Smith",
    type: "pdf",
    size: "3.1 MB",
    downloadedDate: "Sep 22, 2023",
    lastViewed: "Yesterday",
    translated: true,
    audioGenerated: false,
    summarized: true,
    path: "/files/morphology-basics.pdf",
  },
  {
    id: "m3",
    name: "García Lorca Poetry Collection",
    class: "Advanced Spanish Literature",
    professor: "Prof. Garcia",
    type: "pdf",
    size: "2.7 MB",
    downloadedDate: "Sep 18, 2023",
    lastViewed: "3 days ago",
    translated: true,
    audioGenerated: true,
    summarized: false,
    path: "/files/garcia-lorca.pdf",
  },
  {
    id: "m4",
    name: "French Pronunciation Guide",
    class: "French for Beginners",
    professor: "Dr. Dubois",
    type: "docx",
    size: "1.8 MB",
    downloadedDate: "Sep 10, 2023",
    lastViewed: "1 week ago",
    translated: false,
    audioGenerated: true,
    summarized: false,
    path: "/files/french-pronunciation.docx",
  },
  {
    id: "m5",
    name: "German Case System Overview",
    class: "German Grammar",
    professor: "Prof. Mueller",
    type: "pdf",
    size: "4.2 MB",
    downloadedDate: "Sep 25, 2023",
    lastViewed: "Today",
    translated: true,
    audioGenerated: false,
    summarized: true,
    path: "/files/german-cases.pdf",
  },
  {
    id: "m6",
    name: "Basic Kanji Characters",
    class: "Japanese Kanji",
    professor: "Dr. Tanaka",
    type: "pdf",
    size: "5.6 MB",
    downloadedDate: "Sep 20, 2023",
    lastViewed: "2 days ago",
    translated: false,
    audioGenerated: false,
    summarized: true,
    path: "/files/basic-kanji.pdf",
  },
  {
    id: "m7",
    name: "Midterm Study Guide",
    class: "Introduction to Linguistics",
    professor: "Dr. Smith",
    type: "docx",
    size: "1.5 MB",
    downloadedDate: "Sep 28, 2023",
    lastViewed: "Today",
    translated: false,
    audioGenerated: false,
    summarized: false,
    path: "/files/midterm-guide.docx",
  },
]

export default function StudentMaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState("grid")

  // Get unique classes for filter dropdown
  const classes = Array.from(new Set(downloadedMaterials.map((m) => m.class)))

  // Filter and sort materials
  const filteredMaterials = downloadedMaterials
    .filter(
      (material) =>
        (searchQuery === "" ||
          material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.class.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterClass === "all" || material.class === filterClass) &&
        (filterType === "all" || material.type === filterType),
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
      if (sortBy === "type") return a.type.localeCompare(b.type)
      if (sortBy === "size") {
        const aSize = Number.parseFloat(a.size.split(" ")[0])
        const bSize = Number.parseFloat(b.size.split(" ")[0])
        return bSize - aSize
      }
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Materials</h1>
          <p className="text-gray-500">View and manage your downloaded learning materials</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <BookOpen className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Table View
          </Button>
        </div>
      </div>

      {/* Tabs for different material categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All Materials</TabsTrigger>
          <TabsTrigger value="translated">Translated</TabsTrigger>
          <TabsTrigger value="audio">Audio Generated</TabsTrigger>
          <TabsTrigger value="summarized">Summarized</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Search and filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search materials by name or class..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="pptx">PPTX</SelectItem>
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
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
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
                        <div className="flex gap-1">
                          {material.translated && (
                            <Badge variant="secondary" className="h-6">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Translated
                            </Badge>
                          )}
                          {material.audioGenerated && (
                            <Badge variant="secondary" className="h-6">
                              <Headphones className="h-3 w-3 mr-1" />
                              Audio
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">{material.class}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Downloaded: {material.downloadedDate}</span>
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
                              <Sparkles className="h-4 w-4" />
                              <span className="sr-only">AI Tools</span>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Downloaded</TableHead>
                    <TableHead>Last Viewed</TableHead>
                    <TableHead>AI Features</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.class}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {material.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{material.size}</TableCell>
                      <TableCell>{material.downloadedDate}</TableCell>
                      <TableCell>{material.lastViewed}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {material.translated && (
                            <Badge variant="secondary" className="h-6">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Translated
                            </Badge>
                          )}
                          {material.audioGenerated && (
                            <Badge variant="secondary" className="h-6">
                              <Headphones className="h-3 w-3 mr-1" />
                              Audio
                            </Badge>
                          )}
                          {material.summarized && (
                            <Badge variant="secondary" className="h-6">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Summary
                            </Badge>
                          )}
                        </div>
                      </TableCell>
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
                            <Sparkles className="h-4 w-4" />
                            <span className="sr-only">AI Tools</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="translated" className="space-y-4">
          {/* Content for translated materials tab */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {downloadedMaterials
              .filter((m) => m.translated)
              .map((material) => (
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
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">{material.class}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Downloaded: {material.downloadedDate}</span>
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
                              <Sparkles className="h-4 w-4" />
                              <span className="sr-only">AI Tools</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          {/* Content for audio generated materials tab */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {downloadedMaterials
              .filter((m) => m.audioGenerated)
              .map((material) => (
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
                          <Headphones className="h-3 w-3 mr-1" />
                          Audio
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">{material.class}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Downloaded: {material.downloadedDate}</span>
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
                              <Headphones className="h-4 w-4" />
                              <span className="sr-only">Play Audio</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="summarized" className="space-y-4">
          {/* Content for summarized materials tab */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {downloadedMaterials
              .filter((m) => m.summarized)
              .map((material) => (
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
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Summary
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">{material.class}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Downloaded: {material.downloadedDate}</span>
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
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="sr-only">View Summary</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

