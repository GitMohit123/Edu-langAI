"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Headphones,
  Search,
  Calendar,
  Clock,
  Upload,
  Play,
  Pause,
  Trash2,
  Download,
  FileText,
  Volume2,
  SkipBack,
  SkipForward,
  X,
  Check,
  Loader2,
  FileAudio2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Sample data for audio translations
const audioTranslations = [
  {
    id: "a1",
    name: "Introduction to Phonetics",
    originalName: "Week 1: Introduction to Phonetics",
    class: "Introduction to Linguistics",
    professor: "Dr. Smith",
    originalLanguage: "English",
    voiceLanguage: "English",
    voiceType: "Female",
    duration: "14:32",
    createdDate: "Sep 16, 2023",
    lastPlayed: "Today",
    path: "/files/audio/intro-phonetics.mp3",
    size: "12.4 MB",
  },
  {
    id: "a2",
    name: "Morfología Básica",
    originalName: "Week 2: Morphology Basics",
    class: "Introduction to Linguistics",
    professor: "Dr. Smith",
    originalLanguage: "English",
    voiceLanguage: "Spanish",
    voiceType: "Male",
    duration: "18:45",
    createdDate: "Sep 23, 2023",
    lastPlayed: "Yesterday",
    path: "/files/audio/morphology-basics-es.mp3",
    size: "15.7 MB",
  },
  {
    id: "a3",
    name: "García Lorca Poetry Collection",
    originalName: "García Lorca Poetry Collection",
    class: "Advanced Spanish Literature",
    professor: "Prof. Garcia",
    originalLanguage: "Spanish",
    voiceLanguage: "English",
    voiceType: "Female",
    duration: "22:10",
    createdDate: "Sep 19, 2023",
    lastPlayed: "3 days ago",
    path: "/files/audio/garcia-lorca-en.mp3",
    size: "18.2 MB",
  },
  {
    id: "a4",
    name: "German Case System Overview",
    originalName: "German Case System Overview",
    class: "German Grammar",
    professor: "Prof. Mueller",
    originalLanguage: "German",
    voiceLanguage: "English",
    voiceType: "Male",
    duration: "16:28",
    createdDate: "Sep 26, 2023",
    lastPlayed: "1 week ago",
    path: "/files/audio/german-cases-en.mp3",
    size: "13.5 MB",
  },
  {
    id: "a5",
    name: "French Pronunciation Guide",
    originalName: "French Pronunciation Guide",
    class: "French for Beginners",
    professor: "Dr. Dubois",
    originalLanguage: "English",
    voiceLanguage: "French",
    voiceType: "Female",
    duration: "25:15",
    createdDate: "Oct 2, 2023",
    lastPlayed: "2 days ago",
    path: "/files/audio/french-pronunciation-fr.mp3",
    size: "20.8 MB",
  },
]

export default function StudentAudioPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLanguage, setFilterLanguage] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [activeTab, setActiveTab] = useState("library")

  // Audio player states
  const [currentAudio, setCurrentAudio] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [playbackRate, setPlaybackRate] = useState(1)

  // Upload states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [targetLanguage, setTargetLanguage] = useState("english")
  const [voiceType, setVoiceType] = useState("female")

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [audioToDelete, setAudioToDelete] = useState<any>(null)

  // Filter and sort audio translations
  const filteredAudio = audioTranslations
    .filter(
      (audio) =>
        (searchQuery === "" ||
          audio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audio.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audio.class.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterLanguage === "all" || audio.voiceLanguage.toLowerCase() === filterLanguage.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "recent") {
        // Sort by last played date (simplified for demo)
        const aValue = a.lastPlayed === "Today" ? 0 : a.lastPlayed === "Yesterday" ? 1 : 2
        const bValue = b.lastPlayed === "Today" ? 0 : b.lastPlayed === "Yesterday" ? 1 : 2
        return aValue - bValue
      }
      if (sortBy === "duration") {
        // Convert duration strings to seconds for comparison
        const aDuration = convertDurationToSeconds(a.duration)
        const bDuration = convertDurationToSeconds(b.duration)
        return bDuration - aDuration
      }
      return 0
    })

  // Helper function to convert duration string to seconds
  const convertDurationToSeconds = (duration: string) => {
    const [minutes, seconds] = duration.split(":").map(Number)
    return minutes * 60 + seconds
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle play/pause
  const togglePlayPause = (audio: any = null) => {
    if (audio && (!currentAudio || currentAudio.id !== audio.id)) {
      setCurrentAudio(audio)
      setIsPlaying(true)
      setCurrentTime(0)
    } else if (currentAudio) {
      setIsPlaying(!isPlaying)
    }
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handle upload submission
  const handleUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  // Reset upload dialog
  const resetUploadDialog = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    setUploadComplete(false)
    setIsUploadDialogOpen(false)
  }

  // Handle delete
  const handleDelete = (audio: any) => {
    setAudioToDelete(audio)
    setDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    // In a real app, you would call an API to delete the audio
    console.log(`Deleting audio: ${audioToDelete.name}`)
    setDeleteDialogOpen(false)
    setAudioToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-600">Text to Speech</h1>
          <p className="text-gray-500">Listen to your materials in multiple languages</p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 hover:text-white">
          <Headphones className="h-4 w-4" />
          Upload PDF for Audio
        </Button>
      </div>
      {/* Search and filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search audio by name or class..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Played</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audio cards grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAudio.map((audio) => (
              <motion.div
                key={audio.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">
                        {audio.voiceLanguage} Voice
                      </Badge>
                      <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{audio.size}</span>
                      <Badge variant="secondary" className="h-6">
                        <Headphones className="h-3 w-3 mr-1" />
                        {audio.duration}
                      </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{audio.name}</CardTitle>
                    <CardDescription>Original: {audio.originalName}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{audio.class}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Volume2 className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {audio.voiceType} Voice • {audio.voiceLanguage}
                        </span>
                      </div>
                      {/* <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">Created: {audio.createdDate}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">Last played: {audio.lastPlayed}</span>
                      </div> */}

                      <div className="flex justify-center items-center pt-4">
                        
                        <div className="flex gap-2 items-center justify-between w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => togglePlayPause(audio)}
                          >
                            {currentAudio?.id === audio.id && isPlaying ? (
                              <>
                                <Pause className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:inline">Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:inline">Play</span>
                              </>
                            )}
                          </Button>
                          <div className="flex space-x-2 items-center">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:inline">Download</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(audio)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:inline">Delete</span>
                          </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAudio.length === 0 && (
            <div className="text-center py-12">
              <Headphones className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No audio translations found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterLanguage !== "all"
                  ? "Try adjusting your search or filters"
                  : "Upload a document to generate audio translations"}
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-2 mx-auto">
                <Upload className="h-4 w-4" />
                Upload PDF for Audio
              </Button>
            </div>
          )}

      {/* Upload PDF Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={resetUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload PDF for Audio Translation</DialogTitle>
            <DialogDescription>Upload a PDF document to convert to speech in your preferred language</DialogDescription>
          </DialogHeader>

          {!isUploading && !uploadComplete ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select PDF Document</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedFile ? "border-primary-500 bg-primary-50/50" : "border-gray-300"
                  }`}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <FileText className="h-8 w-8 text-primary-600" />
                      </div>
                      <p className="font-medium text-primary-700">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFile(null)
                        }}
                      >
                        <X className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF files only (max 20MB)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-language">Target Language</Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-type">Voice Type</Label>
                <Select value={voiceType} onValueChange={setVoiceType}>
                  <SelectTrigger>
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
          ) : uploadComplete ? (
            <div className="py-6 text-center space-y-4">
              <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload Complete!</h3>
                <p className="text-sm text-gray-500">
                  Your PDF has been uploaded and is being processed for audio conversion.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Uploading...</Label>
                  <span className="text-xs text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
              <p className="text-sm text-gray-500 text-center">Please wait while we upload your document</p>
            </div>
          )}

          <DialogFooter>
            {!isUploading && !uploadComplete ? (
              <>
                <Button variant="outline" onClick={resetUploadDialog}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!selectedFile} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload & Convert
                </Button>
              </>
            ) : uploadComplete ? (
              <Button onClick={resetUploadDialog}>Done</Button>
            ) : (
              <Button disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audio Translation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this audio translation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

