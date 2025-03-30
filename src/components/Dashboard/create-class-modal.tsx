"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateClassModalProps {
  isOpen: boolean
  onClose: () => void
  setFetchState: ((fetch:boolean)=>void)
  fetchState: boolean
}

export function CreateClassModal({ isOpen, onClose, setFetchState, fetchState }: CreateClassModalProps) {
  const [step, setStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Form state
  const [className, setClassName] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")

  // Generated class code
  const [classCode, setClassCode] = useState("")

  // Generate a unique class code
  const generateClassCode = () => {
    // In a real app, this would be generated on the server
    // This is a simple client-side implementation for demonstration
    const prefix = subject ? subject.substring(0, 4).toUpperCase() : "CLASS"
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase()
    return `${prefix}-${randomPart}`
  }

  const handleCreateClass = async () => {
    if (!className.trim()) {
      console.error('Class name is required');
      return;
    }

    setIsCreating(true);

    const newClassCode = generateClassCode();
    setClassCode(newClassCode);
    try {
      const response : any = await fetch('/api/class/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: className,
          description,
          subject,
          code: newClassCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create class:', errorData.message || 'Unknown error');
        return;
      }
      setFetchState(!fetchState); // Explicitly type 'prev' as boolean

      setStep(2);
    } catch (error) {
      console.error('Error occurred while creating class:', error);
    } finally {
      setIsCreating(false);
    }
  }

  const copyClassCode = () => {
    navigator.clipboard.writeText(classCode)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleClose = () => {
    onClose()
    // Reset state after animation completes
    setTimeout(() => {
      setStep(1)
      setClassName("")
      setDescription("")
      setSubject("")
      setClassCode("")
      setIsCopied(false)
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>Fill in the details to create a new class for your students.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">
                  Class Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="className"
                  placeholder="e.g., Introduction to Linguistics"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linguistics">Linguistics</SelectItem>
                    <SelectItem value="literature">Literature</SelectItem>
                    <SelectItem value="language">Language Studies</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="art">Art & Design</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a brief description of this class"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreateClass} disabled={!className.trim() || isCreating}>
                {isCreating ? "Creating..." : "Create Class"}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Class Created Successfully!</DialogTitle>
              <DialogDescription>Share this unique class code with your students so they can join.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="rounded-lg border p-4 bg-primary-50 text-center">
                <Label className="text-sm text-gray-500 mb-2 block">Class Code</Label>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-primary-700 tracking-wider"
                >
                  {classCode}
                </motion.div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Share with your students:</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={copyClassCode}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {isCopied ? "Copied!" : "Copy Code"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                    onClick={() => {
                      // In a real app, this would open a share dialog
                      // For now, we'll just copy the code
                      copyClassCode()
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:inline">Share</span>
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Instructions for students:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Log in to their EduLang student account</li>
                  <li>Click on "Join a Class" on their dashboard</li>
                  <li>
                    Enter the class code: <span className="font-medium">{classCode}</span>
                  </li>
                </ol>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

