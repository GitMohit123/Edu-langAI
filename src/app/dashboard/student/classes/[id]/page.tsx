"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BookOpen, Download, Sparkles, Headphones, Search, Filter, Languages, File, FileText, SquareArrowOutUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClassDashboardSkeletonStudent } from "@/components/Dashboard/student-dashboard-skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileAudio } from "lucide-react"
import { MoreVertical } from "lucide-react"
import { TranslateDialog } from "@/components/Dashboard/translate-dialog"
import { TextToSpeechDialog } from "@/components/Dashboard/text-to-speech-dialog"
import { AiSummarizeDialog } from "@/components/Dashboard/ai-summarize-dialog"

export default function StudentClassDetailPage() {
  const params = useParams()
  const classId = params.id as string
  const [currentClass, setCurrentClass] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [translateOpen, setTranslateOpen] = useState(false)
  const [textToSpeechOpen, setTextToSpeechOpen] = useState(false)
  const [aiSummarizeOpen, setAiSummarizeOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true)
        const [classInfoResponse, documentsResponse] = await Promise.all([
          fetch(`/api/class/get-class-info/${classId}`),
          fetch(`/api/documents/classes/${classId}`),
        ]);
        const classInfo = await classInfoResponse.json();
        const documents = await documentsResponse.json();
        setCurrentClass(classInfo);
        setDocuments(documents); // Assuming you have a state for documents
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false)
      }
    };
    if (classId) {
      fetchClassData();
    }
  }, [classId]);

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [activeTab, setActiveTab] = useState("materials")
  const handleOpenTranslate = (document: any) => {
    setSelectedDocument(document)
    setTranslateOpen(true)
  }

  const handleOpenTextToSpeech = (document: any) => {
    setSelectedDocument(document)
    setTextToSpeechOpen(true)
  }

  const handleOpenAiSummarize = (document: any) => {
    setSelectedDocument(document)
    setAiSummarizeOpen(true)
  }
  if (loading && !currentClass) {
    return <ClassDashboardSkeletonStudent />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary-600">{currentClass.title}</h1>
          </div>
          <p className="text-gray-500">Professor: {currentClass.professorName ? currentClass.professorName.charAt(0).toUpperCase() + currentClass.professorName.slice(1) : "Unknown"}</p>
        </div>
      </div>

      <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
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
              {documents.length > 0 ? (
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
                  {documents.map((material: any) => (
                    <TableRow key={material.documentId}>
                      <TableCell className="font-medium">{material.fileName || "Material Name"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {material.fileType || "pdf"}
                        </Badge>
                      </TableCell>
                      <TableCell>{material.size || "1000"}</TableCell>
                      <TableCell>{material.uploaded || "2024-01-01"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Sparkles className="h-4 w-4" />
                            <span className="sr-only">Translate</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => window.open(material.fileUrl, '_blank')}>
                            <SquareArrowOutUpRight className="h-4 w-4" />
                            <span className="sr-only">Text to Speech</span>
                          </Button>
                          <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenTranslate(material)}>
                              <Languages className="mr-2 h-4 w-4" />
                              Language Translate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenTextToSpeech(material)}>
                              <FileAudio className="mr-2 h-4 w-4" />
                              Text-to-Speech
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenAiSummarize(material)}>
                              <Sparkles className="mr-2 h-4 w-4" />
                              AI Summarize
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-ful gap-2">
                  <FileText className="h-10 w-10 text-primary-600" />
                  <p className="w-full text-center text-sm text-gray-500">No documents Uploaded.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <TranslateDialog open={translateOpen} onOpenChange={setTranslateOpen} document={selectedDocument} />

      <TextToSpeechDialog open={textToSpeechOpen} onOpenChange={setTextToSpeechOpen} document={selectedDocument} />

      <AiSummarizeDialog open={aiSummarizeOpen} onOpenChange={setAiSummarizeOpen} document={selectedDocument} />
    </div>
  )
}

