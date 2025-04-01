"use client"

import { useState } from "react"
import { FileAudio, Play, Pause, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface TextToSpeechDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: any
}

const voices = [
  { value: "en-US-female-1", label: "English (US) - Female" },
  { value: "en-US-male-1", label: "English (US) - Male" },
  { value: "en-GB-female-1", label: "English (UK) - Female" },
  { value: "en-GB-male-1", label: "English (UK) - Male" },
  { value: "es-ES-female-1", label: "Spanish - Female" },
  { value: "fr-FR-female-1", label: "French - Female" },
  { value: "de-DE-female-1", label: "German - Female" },
]

export function TextToSpeechDialog({ open, onOpenChange, document }: TextToSpeechDialogProps) {
  const [voice, setVoice] = useState("en-US-female-1")
  const [speed, setSpeed] = useState([1])
  const [generating, setGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const handleGenerate = async () => {
    if (!document) return

    try {
      setGenerating(true)

      // Mock API call - in real implementation, call your API
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: document.documentId,
          voice,
          speed: speed[0],
        }),
      })

      if (!response.ok) {
        throw new Error("Text-to-speech generation failed")
      }

      // For demo purposes, create a mock audio URL
      // In a real implementation, you would get the audio URL from the response
      const mockAudioUrl = "https://example.com/audio.mp3"
      setAudioUrl(mockAudioUrl)

      // Create audio element
      const audio = new Audio(mockAudioUrl)
      setAudioElement(audio)

      // For demo purposes, we'll just pretend we have audio
      setAudioUrl("mock-audio-url")
    } catch (error) {
      console.error("Error generating speech:", error)
    } finally {
      setGenerating(false)
    }
  }

  const togglePlayPause = () => {
    if (!audioElement) return

    if (isPlaying) {
      audioElement.pause()
    } else {
      audioElement.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleDownload = () => {
    if (!audioUrl) return

    // In a real implementation, you would download the actual audio file
    // For demo purposes, we'll just log a message
    console.log("Downloading audio file...")

    // Create a download link and trigger it
    const a = document.createElement("a")
    a.href = audioUrl
    a.download = `${document?.fileName || "document"}_audio.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileAudio className="h-5 w-5" />
            Text-to-Speech
          </DialogTitle>
          <DialogDescription>Convert "{document?.fileName}" to speech</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="rounded-md border p-4 h-[200px] overflow-y-auto">
            <p className="text-sm">
              {document?.content ||
                "Document content would be displayed here. This is a placeholder text since we don't have the actual content."}
            </p>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="voice" className="text-right">
              Voice
            </Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger id="voice" className="col-span-3">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voiceOption) => (
                  <SelectItem key={voiceOption.value} value={voiceOption.value}>
                    {voiceOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="speed" className="text-right">
              Speed: {speed[0]}x
            </Label>
            <div className="col-span-3">
              <Slider id="speed" min={0.5} max={2} step={0.1} value={speed} onValueChange={setSpeed} />
            </div>
          </div>

          {audioUrl && (
            <div className="flex items-center justify-center gap-4 mt-2">
              <Button variant="outline" size="icon" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="text-sm">{isPlaying ? "Playing audio..." : "Audio ready to play"}</div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:order-1">
            Cancel
          </Button>
          {audioUrl ? (
            <Button onClick={handleDownload} className="sm:order-3">
              <Download className="mr-2 h-4 w-4" />
              Download Audio
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={generating} className="sm:order-2">
              {generating ? "Generating..." : "Generate Speech"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

