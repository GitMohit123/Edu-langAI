"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Upload, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export function TranslationDialog({
  open,
  onOpenChange,
  onTranslationComplete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTranslationComplete: (translation: any) => void
}) {
//   const { toast } = useToast()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [targetLanguage, setTargetLanguage] = useState<string>("")
  const [voiceType, setVoiceType] = useState<string>("")
  const [uploading, setUploading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [uploadComplete, setUploadComplete] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      setFileName(droppedFile.name)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const simulateUpload = () => {
    setUploading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)

          // Create a new translation object
          const newTranslation = {
            id: Math.random().toString(36).substring(2, 9),
            title: fileName.replace(/\.[^/.]+$/, ""),
            language: targetLanguage,
            voice: voiceType,
            date: new Date().toISOString(),
            fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "0 MB",
            duration: "3:45", // Mock duration
            status: "completed",
          }

          // Notify parent component
          onTranslationComplete(newTranslation)

          // Show success toast
        //   toast({
        //     title: "Translation Initiated",
        //     description: "Your document is being processed for translation.",
        //   })

          // Close dialog after a short delay
          setTimeout(() => {
            onOpenChange(false)
            setFile(null)
            setFileName("")
            setTargetLanguage("")
            setVoiceType("")
            setUploadComplete(false)
          }, 1500)

          return 100
        }
        return prevProgress + 5
      })
    }, 150)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !targetLanguage || !voiceType) {
    //   toast({
    //     title: "Missing Information",
    //     description: "Please fill in all required fields.",
    //     variant: "destructive",
    //   })
      return
    }
    simulateUpload()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Translate Document to Speech</DialogTitle>
          <DialogDescription>
            Upload a PDF document to translate into spoken audio in your target language.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                fileName ? "border-primary bg-primary/5" : "border-input hover:border-primary/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-sm">{fileName}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      setFileName("")
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Drag & drop your PDF here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports PDF files up to 10MB</p>
                </div>
              )}
              <Input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-language">Target Language</Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger id="target-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="voice-type">Voice Type</Label>
                <Select value={voiceType} onValueChange={setVoiceType}>
                  <SelectTrigger id="voice-type">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {uploadComplete && (
              <div className="bg-green-50 text-green-700 rounded-md p-3 flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Upload complete! Processing translation...</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || !targetLanguage || !voiceType || uploading}>
              Translate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

