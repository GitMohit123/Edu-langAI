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

      {/* Recent uploads */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">Recent Uploads</h2>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid View</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List View</span>
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search uploads by title or description..."
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

            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Uploads grid/list */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUploads.map((upload) => (
              <Card key={upload.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="uppercase">
                      {upload.type}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {upload.uploadedDate}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{upload.title}</CardTitle>
                  <CardDescription>{upload.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{upload.class}</span>
                    <span className="text-gray-500">{upload.size}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span>{upload.downloads} downloads</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Class
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Uploaded
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Downloads
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUploads.map((upload) => (
                  <tr key={upload.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{upload.title}</div>
                          <div className="text-sm text-gray-500">{upload.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{upload.class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className="uppercase">
                        {upload.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.uploadedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.downloads}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

