// Create a dedicated upload page for professors

"use client"

import { useState } from "react"
import { FileUp, Upload, File, FileText, Check, Clock, Filter, Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/Dashboard/file-upload"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample data for recent uploads
const recentUploads = [
  {
    id: "u1",
    title: "Week 1: Introduction to Phonetics",
    description: "Basic concepts of phonetics and phonology",
    type: "pdf",
    size: "2.4 MB",
    uploadedDate: "2 days ago",
    class: "Introduction to Linguistics",
    downloads: 12,
  },
  {
    id: "u2",
    title: "Week 2: Morphology Basics",
    description: "Introduction to morphemes and word formation",
    type: "pdf",
    size: "3.1 MB",
    uploadedDate: "1 week ago",
    class: "Introduction to Linguistics",
    downloads: 8,
  },
  {
    id: "u3",
    title: "García Lorca Poetry Collection",
    description: "Selected poems with analysis",
    type: "pdf",
    size: "2.7 MB",
    uploadedDate: "2 weeks ago",
    class: "Advanced Spanish Literature",
    downloads: 5,
  },
  {
    id: "u4",
    title: "Midterm Study Guide",
    description: "Comprehensive review of all topics covered so far",
    type: "docx",
    size: "1.5 MB",
    uploadedDate: "3 days ago",
    class: "Introduction to Linguistics",
    downloads: 15,
  },
  {
    id: "u5",
    title: "German Case System Overview",
    description: "Detailed explanation of German grammatical cases",
    type: "pptx",
    size: "4.2 MB",
    uploadedDate: "1 week ago",
    class: "German Grammar",
    downloads: 7,
  },
]

export default function ProfessorUploadPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showSuccess, setShowSuccess] = useState(false)

  // Filter uploads based on search and filters
  const filteredUploads = recentUploads.filter(
    (upload) =>
      (searchQuery === "" ||
        upload.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        upload.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterClass === "all" || upload.class === filterClass) &&
      (filterType === "all" || upload.type === filterType),
  )

  // Get unique classes for filter dropdown
  const classes = Array.from(new Set(recentUploads.map((upload) => upload.class)))

  // Simulate a successful upload notification
  const showSuccessNotification = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 5000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Materials</h1>
          <p className="text-gray-500">Upload and manage educational materials for your students</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload New Material
        </Button>
      </div>

      {/* Success notification */}
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Upload Successful!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your file has been successfully uploaded and is now available to your students.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick upload card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Upload</CardTitle>
          <CardDescription>Drag and drop files or select from cloud storage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Upload from Computer</p>
              <p className="text-xs text-gray-500 mt-1">Drag and drop or browse files</p>
            </div>

            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <File className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Google Drive</p>
              <p className="text-xs text-gray-500 mt-1">Import from your Drive account</p>
            </div>

            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Dropbox</p>
              <p className="text-xs text-gray-500 mt-1">Import from your Dropbox account</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <FileUpload
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false)
          // Simulate a successful upload when modal is closed
          showSuccessNotification()
        }}
      />
    </div>
  )
}

