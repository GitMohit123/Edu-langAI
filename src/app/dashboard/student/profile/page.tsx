"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, Upload, User, Mail, GraduationCap, Languages, Globe } from "lucide-react"

export default function StudentProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "student",
    bio: "I'm a language enthusiast studying linguistics and foreign languages.",
    profileImage: "/placeholder.svg?height=128&width=128&text=JD",
    preferredLanguage: "english",
    nativeLanguage: "english",
    learningLanguages: ["spanish", "french"],
    notificationSettings: {
      email: true,
      newMaterials: true,
      classUpdates: true,
      translationComplete: true,
    },
  })

  const handleSaveProfile = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Show success message or notification
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-gray-500">View and update your personal information</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="language">Language Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={userData.profileImage} alt={userData.name} />
                    <AvatarFallback className="text-2xl">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Change Picture
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        <Input
                          id="name"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4 text-gray-500" />
                      <Select
                        value={userData.role}
                        onValueChange={(value) => setUserData({ ...userData, role: value })}
                        disabled
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="professor">Professor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      rows={4}
                      value={userData.bio}
                      onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Language Preferences Tab */}
        <TabsContent value="language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language Preferences</CardTitle>
              <CardDescription>Set your preferred languages for translations and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferred-language">Preferred Interface Language</Label>
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-gray-500" />
                    <Select
                      value={userData.preferredLanguage}
                      onValueChange={(value) => setUserData({ ...userData, preferredLanguage: value })}
                    >
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="native-language">Native Language</Label>
                  <div className="flex items-center">
                    <Languages className="mr-2 h-4 w-4 text-gray-500" />
                    <Select
                      value={userData.nativeLanguage}
                      onValueChange={(value) => setUserData({ ...userData, nativeLanguage: value })}
                    >
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
                </div>
              </div>

              <div className="space-y-2">
                <Label>Languages I'm Learning</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["english", "spanish", "french", "german", "chinese", "japanese"].map((lang) => (
                    <Button
                      key={lang}
                      variant={userData.learningLanguages.includes(lang) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (userData.learningLanguages.includes(lang)) {
                          setUserData({
                            ...userData,
                            learningLanguages: userData.learningLanguages.filter((l) => l !== lang),
                          })
                        } else {
                          setUserData({
                            ...userData,
                            learningLanguages: [...userData.learningLanguages, lang],
                          })
                        }
                      }}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={userData.notificationSettings.email}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          notificationSettings: {
                            ...userData.notificationSettings,
                            email: e.target.checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Materials</Label>
                    <p className="text-sm text-gray-500">Get notified when new materials are uploaded</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={userData.notificationSettings.newMaterials}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          notificationSettings: {
                            ...userData.notificationSettings,
                            newMaterials: e.target.checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Class Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about class announcements and changes</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={userData.notificationSettings.classUpdates}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          notificationSettings: {
                            ...userData.notificationSettings,
                            classUpdates: e.target.checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Translation Completion</Label>
                    <p className="text-sm text-gray-500">Get notified when your translations are ready</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={userData.notificationSettings.translationComplete}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          notificationSettings: {
                            ...userData.notificationSettings,
                            translationComplete: e.target.checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

