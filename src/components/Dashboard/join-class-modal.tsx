"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface JoinClassModalProps {
  isOpen: boolean
  onClose: () => void
  setJoinClassStatus: (status: boolean) => void
  joinClassStatus: boolean
}

export function JoinClassModal({ isOpen, onClose, setJoinClassStatus, joinClassStatus }: JoinClassModalProps) {
  const [classCode, setClassCode] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState("")

  const handleJoinClass = async () => {
    if (!classCode.trim()) return

    setIsJoining(true)
    setError("")

    // Validate class code format
    const isValidFormat = /^[A-Z]{4}-[A-Z0-9]{5}$/.test(classCode)

    if (isValidFormat) {
      try {
        const response = await fetch('/api/class/join-class', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classCode }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to join class. Please try again.');
        } else {
          setJoinClassStatus(!joinClassStatus);
          onClose();
        }
      } catch (error) {
        setError('An error occurred while joining the class. Please try again.');
      } finally {
        setIsJoining(false);
      }
    } else {
      setError("Invalid class code format. Please check and try again.");
      setIsJoining(false);
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state after animation completes
    setTimeout(() => {
      setClassCode("")
      setError("")
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Class</DialogTitle>
          <DialogDescription>Enter the class code provided by your professor to join their class.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="classCode">
              Class Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="classCode"
              placeholder="e.g., LING-AB123"
              value={classCode}
              onChange={(e) => {
                setClassCode(e.target.value.toUpperCase())
                setError("")
              }}
              className="uppercase"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {error}
              </motion.p>
            )}
          </div>

          <div className="rounded-lg border p-4 bg-gray-50">
            <h4 className="font-medium mb-2 text-sm">Where to find your class code:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Ask your professor for the class code</li>
              <li>Check your email for an invitation</li>
              <li>Class codes are typically in the format XXXX-XXXXX</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isJoining}>
            Cancel
          </Button>
          <Button
            onClick={handleJoinClass}
            disabled={!classCode.trim() || isJoining}
            className="flex items-center gap-2"
          >
            {isJoining ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Join Class
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

