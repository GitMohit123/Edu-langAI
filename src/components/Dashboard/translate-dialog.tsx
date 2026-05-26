"use client";

import { useEffect, useState } from "react";
import { Languages, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePDF } from "react-to-pdf";

interface TranslateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

const languages = [
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
];

interface TranslateDocumentResponse {
  success: boolean;
  error?: string;
  extractedText?: string;
  translatedText?: string;
  targetLanguage?: string;
}

export function TranslateDialog({
  open,
  onOpenChange,
  document,
}: TranslateDialogProps) {
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTranslatedText("");
    setExtractedText("");
    setErrorMessage("");
  }, [targetLanguage, document?.fileUrl]);

  useEffect(() => {
    if (!open) {
      setTranslatedText("");
      setExtractedText("");
      setErrorMessage("");
      setIsTranslating(false);
    }
  }, [open]);

  // Setup react-to-pdf hook
  const { toPDF, targetRef } = usePDF({
    filename: `${
      document?.fileName || "document"
    }_translated_${targetLanguage}.pdf`,
    page: {
      margin: 20,
      format: "A4",
    },
  });

  const handleTranslate = async () => {
    if (!document?.fileUrl) {
      setErrorMessage("This document is missing a valid file URL.");
      return;
    }

    try {
      setIsTranslating(true);
      setTranslatedText("");
      setExtractedText("");
      setErrorMessage("");

      const translationResponse = await fetch("/api/translate-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          s3FileUrl: document.fileUrl,
          targetLanguage,
        }),
      });

      const translationData =
        (await translationResponse.json()) as TranslateDocumentResponse;

      if (!translationResponse.ok || !translationData.success) {
        throw new Error(
          translationData.error || "Document translation failed."
        );
      }

      if (!translationData.translatedText?.trim()) {
        throw new Error(
          "The translation service returned an empty response."
        );
      }

      setExtractedText(translationData.extractedText || "");
      setTranslatedText(translationData.translatedText);
    } catch (error) {
      console.error("Error translating document:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred during translation. Please try again."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  // Determine file type to render appropriately
  const getFileType = () => {
    if (!document?.fileUrl) return "unknown";

    const url = document.fileUrl.toLowerCase();
    if (url.endsWith(".pdf")) return "pdf";
    if (
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.endsWith(".gif")
    )
      return "image";
    if (url.endsWith(".doc") || url.endsWith(".docx")) return "word";
    if (url.endsWith(".txt")) return "text";

    return "unknown";
  };

  const renderFileViewer = () => {
    if (!document?.fileUrl) {
      return (
        <div className="flex items-center justify-center h-[300px] border rounded-md">
          <p className="text-muted-foreground">No file available</p>
        </div>
      );
    }

    const fileType = getFileType();

    switch (fileType) {
      case "pdf":
        return (
          <iframe
            src={document.fileUrl}
            className="w-full h-[300px] border rounded-md"
            title={document.fileName || "Document"}
          />
        );
      case "image":
        return (
          <div className="flex items-center justify-center h-[300px] border rounded-md overflow-hidden">
            <img
              src={document.fileUrl || "/placeholder.svg"}
              alt={document.fileName || "Document"}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[300px] border rounded-md">
            <p className="text-muted-foreground mb-2">
              File preview not available
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(document.fileUrl, "_blank")}
            >
              Open in new tab
            </Button>
          </div>
        );
    }
  };

  // Get the language label for the current translation
  const getCurrentLanguageLabel = () => {
    const language = languages.find((lang) => lang.value === targetLanguage);
    return language ? language.label : targetLanguage;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Translate Document
          </DialogTitle>
          <DialogDescription>
            Translate "{document?.fileName}" to another language
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Side by side view */}
          {/* Language Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetLanguage" className="text-center">
              Target Language
            </Label>
            <Select
              value={targetLanguage}
              onValueChange={setTargetLanguage}
              disabled={isTranslating}
            >
              <SelectTrigger id="targetLanguage" className="col-span-3">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Original Document</h3>
              {renderFileViewer()}
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Translation</h3>

              {/* Translation content with ref for PDF generation */}
              {/* Hidden PDF Content (Not visible in UI) */}
              <div
                ref={targetRef}
                className="absolute left-[-9999px] top-0 w-[800px] p-2 bg-white text-black space-y-4"
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {translatedText}
                </div>

                {/* <div className="text-center text-xs text-muted-foreground mt-8">
    AI Translated Document
  </div> */}
              </div>

              <div>
                {translatedText ? (
                  <div className=" bg-white">
                    <h2 className="text-lg font-bold mb-2 hidden print:block">
                      Translation of "{document?.fileName}" to{" "}
                      {getCurrentLanguageLabel()}
                    </h2>
                    <Textarea
                      value={translatedText}
                      readOnly
                      className="h-[300px] resize-none font-medium"
                    />
                    {extractedText ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Extracted {extractedText.length.toLocaleString()}{" "}
                        characters from the original document.
                      </p>
                    ) : null}
                  </div>
                ) : isTranslating ? (
                  <div className="flex flex-col items-center justify-center h-[300px] border rounded-md">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p className="text-muted-foreground">
                      Extracting text and translating document...
                    </p>
                  </div>
                ) : errorMessage ? (
                  <div className="flex items-center justify-center h-[300px] border rounded-md px-4 text-center">
                    <p className="text-sm text-destructive">
                      {errorMessage}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] border rounded-md">
                    <p className="text-muted-foreground">
                      Translation will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:order-1"
            disabled={isTranslating}
          >
            Cancel
          </Button>

          {translatedText ? (
            <Button onClick={() => toPDF()} className="sm:order-3">
              <Download className="mr-2 h-4 w-4" />
              Download Translation
            </Button>
          ) : (
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !document?.fileUrl}
              className="sm:order-2"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating document...
                </>
              ) : (
                "Translate"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
