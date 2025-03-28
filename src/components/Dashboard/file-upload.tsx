"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileUp, X, File, Check, Loader2, Cloud, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploadProps {
  isOpen: boolean
  onClose: () => void
  classId?: string
}

export function FileUpload({ isOpen, onClose, classId }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSource, setUploadSource] = useState("computer")
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...fileArray])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...fileArray])
    }
  }

  const handleUpload = () => {
    if (files.length === 0 || !title.trim()) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsUploading(false)
          setShowSuccess(true)

          // Reset form after showing success message
          setTimeout(() => {
            setFiles([])
            setTitle("")
            setDescription("")
            setUploadProgress(0)
            setShowSuccess(false)
            onClose()
          }, 2000)
        }, 500)
      }
    }, 200)
  }

  const simulateExternalUpload = (source: string) => {
    // In a real app, this would open the Google Drive or Dropbox picker
    console.log(`Opening ${source} picker...`)

    // Simulate selecting a file after a delay
    setTimeout(() => {
      const mockFile = new (window.File as any)(["dummy content"], `${source}-document.pdf`, { type: "application/pdf" })
      setFiles([mockFile])
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Material</DialogTitle>
          <DialogDescription>Upload educational materials for your students</DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Upload Successful!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your file has been successfully uploaded and is now available to your students.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Week 5: Introduction to Syntax"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a brief description of this material"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Source</Label>
              <Tabs defaultValue="computer" value={uploadSource} onValueChange={setUploadSource} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="computer" className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    <span>Computer</span>
                  </TabsTrigger>
                  <TabsTrigger value="drive" className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    <span>Google Drive</span>
                  </TabsTrigger>
                  <TabsTrigger value="dropbox" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>Dropbox</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="computer" className="mt-4">
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                    <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
                    <p className="text-xs text-gray-500 mt-1">Supports PDF, DOCX, PPTX, and other common formats</p>
                  </div>
                </TabsContent>

                <TabsContent value="drive" className="mt-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Cloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Select files from Google Drive</p>
                    <p className="text-xs text-gray-500 mt-1 mb-4">Connect your Google Drive account to import files</p>
                    <Button
                      variant="outline"
                      className="mx-auto"
                      onClick={() => simulateExternalUpload("Google Drive")}
                    >
                      Connect to Google Drive
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="dropbox" className="mt-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Database className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Select files from Dropbox</p>
                    <p className="text-xs text-gray-500 mt-1 mb-4">Connect your Dropbox account to import files</p>
                    <Button variant="outline" className="mx-auto" onClick={() => simulateExternalUpload("Dropbox")}>
                      Connect to Dropbox
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                      <div className="flex items-center">
                        <File className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Uploading...</Label>
                  <span className="text-xs text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!showSuccess && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || !title.trim() || isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

