"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FileText, Users, Plus, Share2, Download, Clock, BarChart, FileUp, Sparkles, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data
const classData = {
  cls1: {
    id: "cls1",
    name: "Introduction to Linguistics",
    description: "An introductory course covering the fundamental concepts of linguistics.",
    code: "LING101",
    students: 28,
    materials: [
      {
        id: "m1",
        name: "Week 1: Introduction to Phonetics",
        type: "pdf",
        size: "2.4 MB",
        uploaded: "2 weeks ago",
        downloads: 24,
      },
      {
        id: "m2",
        name: "Week 2: Morphology Basics",
        type: "pdf",
        size: "3.1 MB",
        uploaded: "1 week ago",
        downloads: 22,
      },
      { id: "m3", name: "Week 3: Syntax Overview", type: "pdf", size: "2.8 MB", uploaded: "3 days ago", downloads: 15 },
      { id: "m4", name: "Midterm Study Guide", type: "docx", size: "1.5 MB", uploaded: "1 day ago", downloads: 18 },
    ],
    studentList: [
      {
        id: "s1",
        name: "Emma Thompson",
        email: "emma.t@example.com",
        joinedDate: "3 weeks ago",
        lastActive: "Today",
        materialsAccessed: 4,
      },
      {
        id: "s2",
        name: "Michael Chen",
        email: "michael.c@example.com",
        joinedDate: "3 weeks ago",
        lastActive: "Yesterday",
        materialsAccessed: 3,
      },
      {
        id: "s3",
        name: "Sofia Rodriguez",
        email: "sofia.r@example.com",
        joinedDate: "2 weeks ago",
        lastActive: "2 days ago",
        materialsAccessed: 4,
      },
      {
        id: "s4",
        name: "James Wilson",
        email: "james.w@example.com",
        joinedDate: "2 weeks ago",
        lastActive: "Today",
        materialsAccessed: 2,
      },
    ],
  },
  cls2: {
    id: "cls2",
    name: "Advanced Spanish Literature",
    description: "A deep dive into Spanish literature from the Golden Age to modern works.",
    code: "SPAN401",
    students: 15,
    materials: [
      { id: "m5", name: "Don Quixote Analysis", type: "pdf", size: "4.2 MB", uploaded: "3 weeks ago", downloads: 14 },
      {
        id: "m6",
        name: "García Lorca Poetry Collection",
        type: "pdf",
        size: "2.7 MB",
        uploaded: "2 weeks ago",
        downloads: 12,
      },
    ],
    studentList: [
      {
        id: "s5",
        name: "Alex Johnson",
        email: "alex.j@example.com",
        joinedDate: "4 weeks ago",
        lastActive: "Today",
        materialsAccessed: 2,
      },
      {
        id: "s6",
        name: "Maria Garcia",
        email: "maria.g@example.com",
        joinedDate: "4 weeks ago",
        lastActive: "Yesterday",
        materialsAccessed: 2,
      },
    ],
  },
  cls3: {
    id: "cls3",
    name: "Comparative World Languages",
    description: "Exploring language families and their relationships across the globe.",
    code: "LANG220",
    students: 22,
    materials: [
      {
        id: "m7",
        name: "Indo-European Language Family",
        type: "pdf",
        size: "3.5 MB",
        uploaded: "2 weeks ago",
        downloads: 20,
      },
      {
        id: "m8",
        name: "Sino-Tibetan Languages Overview",
        type: "pdf",
        size: "2.9 MB",
        uploaded: "1 week ago",
        downloads: 18,
      },
    ],
    studentList: [
      {
        id: "s7",
        name: "David Kim",
        email: "david.k@example.com",
        joinedDate: "3 weeks ago",
        lastActive: "Today",
        materialsAccessed: 2,
      },
      {
        id: "s8",
        name: "Priya Patel",
        email: "priya.p@example.com",
        joinedDate: "3 weeks ago",
        lastActive: "2 days ago",
        materialsAccessed: 1,
      },
    ],
  },
}

export default function ClassDetailPage() {
  const params = useParams()
  const classId = params.id as string
  const currentClass = classData[classId]

  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  if (!currentClass) {
    return <div>Class not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{currentClass.name}</h1>
            <Badge variant="outline" className="ml-2">
              {currentClass.code}
            </Badge>
          </div>
          <p className="text-gray-500">{currentClass.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Class Code
          </Button>
          <Button onClick={() => setIsUploading(true)} className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Upload Material
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentClass.students}</div>
                <p className="text-xs text-gray-500">Enrolled students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Materials</CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentClass.materials.length}</div>
                <p className="text-xs text-gray-500">Uploaded documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                <Download className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentClass.materials.reduce((acc, material) => acc + material.downloads, 0)}
                </div>
                <p className="text-xs text-gray-500">Total material downloads</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentClass.studentList.filter((student) => student.lastActive === "Today").length}
                </div>
                <p className="text-xs text-gray-500">Students active today</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent activity would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary-50 p-2">
                    <Download className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">Michael Chen downloaded "Midterm Study Guide"</p>
                    <p className="text-sm text-gray-500">Today, 10:23 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary-50 p-2">
                    <Sparkles className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Sofia Rodriguez requested Spanish translation for "Week 3: Syntax Overview"
                    </p>
                    <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary-50 p-2">
                    <Headphones className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">Emma Thompson used text-to-speech for "Week 2: Morphology Basics"</p>
                    <p className="text-sm text-gray-500">2 days ago, 11:15 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <Link
                href={`/dashboard/professor/classes/${classId}/activity`}
                className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View All Activity
                <BarChart className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Class Materials</CardTitle>
                  <CardDescription>All materials uploaded to this class</CardDescription>
                </div>
                <Button onClick={() => setIsUploading(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Upload New
                </Button>
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
                    <TableHead>Downloads</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClass.materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {material.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{material.size}</TableCell>
                      <TableCell>{material.uploaded}</TableCell>
                      <TableCell>{material.downloads}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Enrolled Students</CardTitle>
                  <CardDescription>Students currently enrolled in this class</CardDescription>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Class Code
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Materials Accessed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClass.studentList.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.joinedDate}</TableCell>
                      <TableCell>{student.lastActive}</TableCell>
                      <TableCell>
                        {student.materialsAccessed} / {currentClass.materials.length}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <BarChart className="h-4 w-4" />
                          <span className="sr-only">View Activity</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tools Tab */}
        <TabsContent value="ai-tools" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Translation</CardTitle>
                <CardDescription>Translate your materials into multiple languages</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Our AI can automatically translate your uploaded materials into over 95 languages, making your content
                  accessible to students worldwide.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Materials with translations</span>
                    <span className="font-medium">3 / {currentClass.materials.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Most requested language</span>
                    <span className="font-medium">Spanish</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full">Manage Translations</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Summarization</CardTitle>
                <CardDescription>Create concise summaries of your materials</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Let our AI create summaries of your uploaded documents to help students quickly grasp key concepts and
                  main points.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Materials with summaries</span>
                    <span className="font-medium">2 / {currentClass.materials.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Average summary length</span>
                    <span className="font-medium">250 words</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full">Generate Summaries</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Text-to-Speech</CardTitle>
                <CardDescription>Convert your materials to audio</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Transform your written content into natural-sounding speech in multiple languages and voices.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Materials with audio</span>
                    <span className="font-medium">1 / {currentClass.materials.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total audio generated</span>
                    <span className="font-medium">45 minutes</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full">Generate Audio</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Analytics</CardTitle>
                <CardDescription>Get insights on student engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Use AI to analyze student engagement patterns and identify areas where students might need additional
                  support.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Engagement score</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Most active day</span>
                    <span className="font-medium">Wednesday</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full">View Analytics</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Material Dialog would go here */}
    </div>
  )
}

