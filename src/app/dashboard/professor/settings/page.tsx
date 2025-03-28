"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  User,
  Shield,
  HelpCircle,
  MessageSquare,
  LogOut,
  Mail,
  Eye,
  FileText,
  Download,
  Trash2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
} from "lucide-react"

export default function StudentSettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)

    // Simulate logout process
    setTimeout(() => {
      router.push("/auth/login")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>
      </div>

      <Card>
            <CardHeader>
              <div className="flex items-start justify-between w-full">
              <div className="space-y-2">
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get help with using EduLang</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
              <Button className="w-full mt-2" variant={"outline"}><MessageSquare className="h-5 w-5 text-primary-600 mr-2" /> Contact Support</Button>
              <Button variant="outline" className="w-full mt-2">
              <FileText className="h-5 w-5 text-primary-600 mr-2" />View Documentation
                    </Button>
              </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="font-medium">Video Tutorials</span>
                  </div>
                  <p className="text-sm text-gray-500">Watch tutorials on how to use EduLang features</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="rounded-lg border overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Coming Soon</span>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium">Getting Started</p>
                      </div>
                    </div>
                    <div className="rounded-lg border overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Coming Soon</span>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium">Using Translations</p>
                      </div>
                    </div>
                    <div className="rounded-lg border overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Coming Soon</span>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium">AI Features</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Feedback</h3>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="font-medium">Send Feedback</span>
                  </div>
                  <p className="text-sm text-gray-500">Help us improve EduLang by sharing your feedback</p>
                  <Button variant="outline" className="w-full mt-2 bg-primary-600 text-white">
                    Send Feedback
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
    </div>
  )
}

