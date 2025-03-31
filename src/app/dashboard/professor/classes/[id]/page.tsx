"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FileText, Users, Plus, Share2, Download, Clock, BarChart, FileUp, Sparkles, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClassDashboardSkeleton } from "@/components/Dashboard/professor-dashboard-skeleton"
import { motion } from "framer-motion"
import { FileUpload } from "@/components/Dashboard/file-upload"


export default function ClassDetailPage() {
  const params = useParams()
  const classId = params.id as string
  const [currentClass, setCurrentClass] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true)
        const [classInfoResponse, documentsResponse, studentsResponse] = await Promise.all([
          fetch(`/api/class/get-class-info/${classId}`),
          fetch(`/api/documents/classes/${classId}`),
          fetch(`/api/class/get-students/${classId}`)
        ]);

        const classInfo = await classInfoResponse.json();
        const documents = await documentsResponse.json();
        const students = await studentsResponse.json();

        setCurrentClass(classInfo);
        setDocuments(documents); // Assuming you have a state for documents
        setStudents(students);
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false)
      }
    };
    if (classId && !isUploadModalOpen) {
      fetchClassData();
    }
  }, [classId, isUploadModalOpen]);

  
  if (loading) {
    return <ClassDashboardSkeleton />
  }
  if (currentClass) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{currentClass.title || "Class Title"}</h1>
              <Badge variant="outline" className="ml-2">
                {currentClass.code || "Class Code"}
              </Badge>
            </div>
            <p className="text-gray-500">{currentClass.description || "Class Description"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => {
              navigator.clipboard.writeText(currentClass.code)
            }}>
              <Share2 className="h-4 w-4" />
              Share Class Code
            </Button>
            <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 hover:text-white">
              <FileUp className="h-4 w-4" />
              Upload Material
            </Button>
          </div>
        </div>


        <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length || 0}</div>
                  <p className="text-xs text-gray-500">Enrolled students</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Materials</CardTitle>
                  <FileText className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.length || 0}</div>
                  <p className="text-xs text-gray-500">Uploaded documents</p>
                </CardContent>
              </Card>
            </div>
  
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <CardTitle>Class Materials</CardTitle>
                    <CardDescription>All materials uploaded to this class</CardDescription>
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
                        <TableHead>Downloads</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((material: any) => (
                        <TableRow key={material.documentId}>
                          <TableCell className="font-medium">{material.fileName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="uppercase">
                              {material.fileType || "pdf"}
                            </Badge>
                          </TableCell>
                          <TableCell>{material.size || "1000"}</TableCell>
                          <TableCell>{material.uploaded || "2024-01-01"}</TableCell>
                          <TableCell>{material.downloads || "100"}</TableCell>
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
                ) : (
                  <motion.div transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className="flex h-full flex-col items-center justify-center border-2 border-dashed border-gray-200 p-6 text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-3">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mb-1 font-medium">Upload Materials</h3>
              <p className="mb-4 text-sm text-gray-500">Start uploading materials to the class</p>
              <Button variant="outline" className="mt-2" onClick={() => setIsUploadModalOpen(true)}>
                Upload Materials
              </Button>
            </Card>
          </motion.div>
                )}
              </CardContent>
            </Card>
  
        {/* Upload Material Dialog would go here */}
        <FileUpload
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false)
        }}
        classId={classId}
      />
      </div>
    )
  }
  
}

