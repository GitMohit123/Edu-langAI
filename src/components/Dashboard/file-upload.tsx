"use client";

import type React from "react";

import { useState, useRef } from "react";
import { FileUp, X, File, Check, Loader2, Cloud, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  classId?: string;
}

export function FileUpload({ isOpen, onClose, classId }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadXHRs = useRef<XMLHttpRequest[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...fileArray]);
    }
  };
  
  const cancelUpload = () => {
    // Cancel all ongoing uploads
    uploadXHRs.current.forEach((xhr) => {
      if (xhr && xhr.readyState !== 4) {
        xhr.abort()
      }
    })
    uploadXHRs.current = []
    setIsUploading(false)
    setUploadProgress(0)
  }

  const handleUpload = async () => {
    if (files.length === 0 || !classId) {
      setError("Please select files and provide a class ID.");
      return;
    }
  
    setIsUploading(true);
    setUploadProgress(0);
    setError(null); // Reset error state
  
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('classId', classId);
  
    try {
      const res = await fetch('/api/documents/upload-document', {
        method: 'POST',
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error("Failed to upload document.");
      }
  
      const { data: uploadUrls } = await res.json();
  
      let progress = 0;
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { uploadUrl, fileUrl } = uploadUrls[i];
  
        const putRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
  
        if (!putRes.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }
  
        // ✅ Save metadata to DynamoDB
        const saveRes = await fetch('/api/documents/save-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            classId,
            fileName: file.name,
            fileUrl,
          }),
        });

        if (!saveRes.ok) {
          throw new Error(`Failed to save metadata for ${file.name}`);
        }
  
        progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);
      }
  
      setTimeout(() => {
        setIsUploading(false);
        setShowSuccess(true);
  
        setTimeout(() => {
          setFiles([]);
          setUploadProgress(0);
          setShowSuccess(false);
          onClose();
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'An unknown error occurred.');
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Material</DialogTitle>
          <DialogDescription>
            Upload educational materials for your students
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">
              Upload Successful!
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Your file has been successfully uploaded and is now available to
              your students.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <X className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800">Upload Failed</AlertTitle>
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <FileUp className="h-10 w-10 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PDF, DOCX, PPTX, and other common formats
              </p>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-primary-50 rounded-md p-2"
                    >
                      <div className="flex items-center">
                        <File className="h-4 w-4 text-primary-600 mr-2" />
                        <span className="text-sm truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
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
                  <span className="text-xs text-gray-500">
                    {uploadProgress}%
                  </span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!showSuccess && (
            <>
              <Button variant="outline" onClick={isUploading ? cancelUpload : onClose}>
                {isUploading ? "Cancel Upload" : "Cancel"}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
                className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 hover:text-white"
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
  );
}
