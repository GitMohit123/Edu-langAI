"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bot,
  Check,
  Copy,
  Download,
  FileSearch,
  Loader2,
  Sparkles,
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AiSummarizeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: any
}

interface SummarizeResponse {
  success: boolean
  error?: string
  summary?: string
  extractedText?: string
  model?: string
  modelLabel?: string
  targetWords?: number
  sourceWordCount?: number
  summaryWordCount?: number
}

const summaryTypes = [
  {
    value: "concise",
    label: "Concise",
    description: "Short overview for quick revision",
  },
  {
    value: "detailed",
    label: "Detailed",
    description: "More context, examples, and explanation",
  },
  {
    value: "bullet",
    label: "Bullet Points",
    description: "Fast scanning with key takeaways",
  },
  {
    value: "academic",
    label: "Academic",
    description: "Formal tone with structured analysis",
  },
] as const

const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length

const estimateTargetWords = (summaryLength: number) =>
  Math.round(120 + ((summaryLength - 10) / 80) * 580)

export function AiSummarizeDialog({ open, onOpenChange, document }: AiSummarizeDialogProps) {
  const [summarizing, setSummarizing] = useState(false)
  const [summary, setSummary] = useState("")
  const [extractedText, setExtractedText] = useState("")
  const [summaryLength, setSummaryLength] = useState([50])
  const [summaryType, setSummaryType] = useState("concise")
  const [errorMessage, setErrorMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [modelName, setModelName] = useState("Gemini Flash")
  const [sourceWordCount, setSourceWordCount] = useState(0)
  const [summaryWordCount, setSummaryWordCount] = useState(0)

  useEffect(() => {
    if (!open) {
      setSummary("")
      setExtractedText("")
      setErrorMessage("")
      setCopied(false)
      setSummarizing(false)
      setModelName("Gemini Flash")
      setSourceWordCount(0)
      setSummaryWordCount(0)
    }
  }, [open])

  useEffect(() => {
    setSummary("")
    setExtractedText("")
    setErrorMessage("")
    setCopied(false)
    setSourceWordCount(0)
    setSummaryWordCount(0)
  }, [document?.fileUrl])

  const targetWords = useMemo(
    () => estimateTargetWords(summaryLength[0]),
    [summaryLength]
  )

  const selectedSummaryType = useMemo(
    () =>
      summaryTypes.find((item) => item.value === summaryType) ||
      summaryTypes[0],
    [summaryType]
  )

  const handleSummarize = async () => {
    if (!document?.fileUrl) {
      setErrorMessage("This document is missing a valid file URL.")
      return
    }

    try {
      setSummarizing(true)
      setErrorMessage("")
      setSummary("")
      setExtractedText("")
      setCopied(false)

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          s3FileUrl: document.fileUrl,
          fileName: document.fileName,
          length: summaryLength[0],
          type: summaryType,
        }),
      })

      const data = (await response.json()) as SummarizeResponse

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Summarization failed")
      }

      setSummary(data.summary || "")
      setExtractedText(data.extractedText || "")
      setModelName(data.modelLabel || data.model || "Gemini Flash")
      setSourceWordCount(data.sourceWordCount || countWords(data.extractedText || ""))
      setSummaryWordCount(data.summaryWordCount || countWords(data.summary || ""))
    } catch (error) {
      console.error("Error summarizing document:", error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while generating the summary."
      )
    } finally {
      setSummarizing(false)
    }
  }

  const handleDownload = () => {
    if (!summary) return

    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = window.document.createElement("a")
    a.href = url
    a.download = `${document?.fileName || "document"}_summary.txt`
    window.document.body.appendChild(a)
    a.click()
    window.document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    if (!summary) return

    navigator.clipboard
      .writeText(summary)
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy summary:", err)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[960px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Summarize
          </DialogTitle>
          <DialogDescription>Generate an AI summary of "{document?.fileName}"</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Generate a document summary with OpenRouter
                </p>
                <p className="text-sm text-muted-foreground">
                  Gemini Flash will first extract text from the uploaded file, then create a summary based on your preferred style and depth.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">OpenRouter</Badge>
                <Badge variant="outline">Gemini Flash</Badge>
                <Badge variant="outline">{selectedSummaryType.label}</Badge>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-2">
                <Label htmlFor="summaryType">Summary Style</Label>
                <Select
                  value={summaryType}
                  onValueChange={setSummaryType}
                  disabled={summarizing}
                >
                  <SelectTrigger id="summaryType">
                    <SelectValue placeholder="Select summary type" />
                  </SelectTrigger>
                  <SelectContent>
                    {summaryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {selectedSummaryType.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="summaryLength">Summary Depth</Label>
                  <span className="text-xs text-muted-foreground">
                    ~{targetWords} words
                  </span>
                </div>
                <Slider
                  id="summaryLength"
                  min={10}
                  max={90}
                  step={10}
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  disabled={summarizing}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Quick scan</span>
                  <span>{summaryLength[0]}%</span>
                  <span>More detail</span>
                </div>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <Alert variant="destructive">
              <AlertTitle>Summarization failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Extracted Source</p>
                  <p className="text-xs text-muted-foreground">
                    Text pulled from the uploaded document for summarization
                  </p>
                </div>
                {extractedText ? (
                  <Badge variant="outline">{sourceWordCount} words</Badge>
                ) : (
                  <Badge variant="outline">Pending extraction</Badge>
                )}
              </div>

              <ScrollArea className="h-[320px]">
                <div className="p-4">
                  {extractedText ? (
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {extractedText}
                    </p>
                  ) : (
                    <div className="flex h-[272px] flex-col items-center justify-center gap-3 text-center">
                      <FileSearch className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Source text will appear here
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Generate a summary to extract readable text from
                          "{document?.fileName}" before sending it to Gemini Flash.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="rounded-xl border">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-sm font-medium">AI Summary</p>
                  <p className="text-xs text-muted-foreground">
                    Generated by {modelName}
                  </p>
                </div>
                <Badge variant="secondary">{selectedSummaryType.label}</Badge>
              </div>

              <ScrollArea className="h-[320px]">
                <div className="p-4">
                  {summary ? (
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6">
                      {summary}
                    </pre>
                  ) : summarizing ? (
                    <div className="flex h-[272px] flex-col items-center justify-center gap-4 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Summarizing your document
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Extracting text from S3, then generating a {selectedSummaryType.label.toLowerCase()} summary with Gemini Flash.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[272px] flex-col items-center justify-center gap-3 text-center">
                      <Bot className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Summary will appear here
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred style and click Generate Summary.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {summary ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Source Size</p>
                <p className="mt-1 text-lg font-semibold">{sourceWordCount} words</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Summary Size</p>
                <p className="mt-1 text-lg font-semibold">{summaryWordCount} words</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Compression</p>
                <p className="mt-1 text-lg font-semibold">
                  {sourceWordCount > 0
                    ? `${Math.max(
                        0,
                        Math.round(
                          (1 - summaryWordCount / sourceWordCount) * 100
                        )
                      )}% shorter`
                    : "N/A"}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:order-1"
            disabled={summarizing}
          >
            Cancel
          </Button>
          {summary ? (
            <>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="sm:order-2"
              >
                {copied ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy Summary"}
              </Button>
              <Button onClick={handleDownload} className="sm:order-3">
                <Download className="mr-2 h-4 w-4" />
                Download Summary
              </Button>
              <Button
                onClick={handleSummarize}
                disabled={summarizing}
                className="sm:order-4"
              >
                {summarizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate Summary"
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleSummarize} disabled={summarizing} className="sm:order-2">
              {summarizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

