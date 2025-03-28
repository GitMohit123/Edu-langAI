"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { BookOpen, Download, Sparkles, Headphones, Search, Filter, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Material {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  translated: boolean;
  audioAvailable: boolean;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface ClassData {
  id: string;
  name: string;
  description: string;
  professor: string;
  materials: Material[];
  announcements: Announcement[];
}

interface ClassDataMap {
  [key: string]: ClassData;
}

// Sample data
const classData: ClassDataMap = {
  cls1: {
    id: "cls1",
    name: "Introduction to Linguistics",
    description: "An introductory course covering the fundamental concepts of linguistics.",
    professor: "Dr. Smith",
    materials: [
      {
        id: "m1",
        name: "Week 1: Introduction to Phonetics",
        type: "pdf",
        size: "2.4 MB",
        uploaded: "2 weeks ago",
        translated: true,
        audioAvailable: true,
      },
      {
        id: "m2",
        name: "Week 2: Morphology Basics",
        type: "pdf",
        size: "3.1 MB",
        uploaded: "1 week ago",
        translated: false,
        audioAvailable: false,
      },
      {
        id: "m3",
        name: "Week 3: Syntax Overview",
        type: "pdf",
        size: "2.8 MB",
        uploaded: "3 days ago",
        translated: false,
        audioAvailable: false,
      },
      {
        id: "m4",
        name: "Midterm Study Guide",
        type: "docx",
        size: "1.5 MB",
        uploaded: "1 day ago",
        translated: false,
        audioAvailable: false,
      },
    ],
    announcements: [
      {
        id: "a1",
        title: "Midterm Exam Date",
        content: "The midterm exam will be held on October 15th. Please review the study guide.",
        date: "2 days ago",
      },
      {
        id: "a2",
        title: "Office Hours Change",
        content: "My office hours will be moved to Thursdays 2-4 PM starting next week.",
        date: "1 week ago",
      },
    ],
  },
  cls2: {
    id: "cls2",
    name: "Advanced Spanish Literature",
    description: "A deep dive into Spanish literature from the Golden Age to modern works.",
    professor: "Prof. Garcia",
    materials: [
      {
        id: "m5",
        name: "Don Quixote Analysis",
        type: "pdf",
        size: "4.2 MB",
        uploaded: "3 weeks ago",
        translated: true,
        audioAvailable: true,
      },
      {
        id: "m6",
        name: "García Lorca Poetry Collection",
        type: "pdf",
        size: "2.7 MB",
        uploaded: "2 weeks ago",
        translated: false,
        audioAvailable: false,
      },
    ],
    announcements: [
      {
        id: "a3",
        title: "Essay Deadline Extended",
        content: "The deadline for the comparative essay has been extended to November 5th.",
        date: "3 days ago",
      },
    ],
  },
}

export default function StudentClassDetailPage() {
  const params = useParams()
  const classId = params.id as string
  const currentClass = classData[classId]

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [activeTab, setActiveTab] = useState("materials")

  if (!currentClass) {
    return <div>Class not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary-600">{currentClass.name}</h1>
          </div>
          <p className="text-gray-500">Professor: {currentClass.professor}</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English (Original)</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
        </TabsList>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Class Materials</CardTitle>
                  <CardDescription>All materials for this class</CardDescription>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search materials..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClass.materials.map((material: Material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {material.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{material.size}</TableCell>
                      <TableCell>{material.uploaded}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="ghost" size="sm" disabled={material.translated}>
                            <Sparkles className="h-4 w-4" />
                            <span className="sr-only">Translate</span>
                          </Button>
                          <Button variant="ghost" size="sm" disabled={material.audioAvailable}>
                            <Headphones className="h-4 w-4" />
                            <span className="sr-only">Text to Speech</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Announcements</CardTitle>
              <CardDescription>Important updates from your professor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentClass.announcements.map((announcement: Announcement) => (
                  <Card key={announcement.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <p className="text-xs text-gray-500">{announcement.date}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tools Tab */}
        <TabsContent value="ai-tools" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Translation</CardTitle>
                <CardDescription>Translate materials to your preferred language</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Our AI can translate class materials into over 95 languages, making content accessible in your
                  preferred language.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select Language</span>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English (Original)</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select Material</span>
                    <Select defaultValue="m1">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentClass.materials.map((material: Material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Translate Material
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Text-to-Speech</CardTitle>
                <CardDescription>Listen to your materials</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Convert any text material to natural-sounding speech in multiple languages and voices.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select Voice</span>
                    <Select defaultValue="female">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select Material</span>
                    <Select defaultValue="m1">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentClass.materials.map((material: Material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Generate Audio
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Summarization</CardTitle>
                <CardDescription>Get concise summaries of your materials</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Let our AI create summaries of your learning materials to help you quickly grasp key concepts.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Summary Length</span>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (250 words)</SelectItem>
                        <SelectItem value="medium">Medium (500 words)</SelectItem>
                        <SelectItem value="long">Long (1000 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select Material</span>
                    <Select defaultValue="m1">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentClass.materials.map((material: Material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Summary
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Tools</CardTitle>
                <CardDescription>AI-powered study aids</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Generate flashcards, practice quizzes, and study guides based on your class materials.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tool Type</span>
                    <Select defaultValue="flashcards">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Tool" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flashcards">Flashcards</SelectItem>
                        <SelectItem value="quiz">Practice Quiz</SelectItem>
                        <SelectItem value="studyguide">Study Guide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select Material</span>
                    <Select defaultValue="m1">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentClass.materials.map((material: Material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Create Study Tool
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

