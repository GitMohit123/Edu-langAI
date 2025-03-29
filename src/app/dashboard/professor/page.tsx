"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, FileText, Users, Plus, ArrowRight, Sparkles, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CreateClassModal } from "@/components/Dashboard/create-class-modal"
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
// Sample data
const initialClasses = [
  { id: "cls1", name: "Introduction to Linguistics", students: 28, materials: 12, code: "LING101" },
  { id: "cls2", name: "Advanced Spanish Literature", students: 15, materials: 8, code: "SPAN401" },
  { id: "cls3", name: "Comparative World Languages", students: 22, materials: 10, code: "LANG220" },
]

const recentActivities = [
  { id: 1, type: "join", student: "Emma Thompson", class: "Introduction to Linguistics", time: "2 hours ago" },
  {
    id: 2,
    type: "download",
    student: "Michael Chen",
    class: "Advanced Spanish Literature",
    material: "Week 5 Lecture Notes",
    time: "Yesterday",
  },
  {
    id: 3,
    type: "translation",
    student: "Sofia Rodriguez",
    class: "Comparative World Languages",
    language: "Portuguese",
    time: "2 days ago",
  },
]

export default function ProfessorDashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [classes, setClasses] = useState(initialClasses)
  const [recentlyCreatedClass, setRecentlyCreatedClass] = useState<string | null>(null)
  const {user, setUser} = useUserContext();
  const router = useRouter();

  const handleCreateClass = (classData: any) => {
    const newClass = {
      id: `cls${classes.length + 1}`,
      name: classData.name,
      students: 0,
      materials: 0,
      code: classData.code,
    }

    setClasses([...classes, newClass])
    setRecentlyCreatedClass(newClass.id)

    // Reset the highlight after animation
    setTimeout(() => {
      setRecentlyCreatedClass(null)
    }, 5000)
  }
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/api/auth/user', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
  
        const userData = await response.json();
        if(userData.session.role === "professor"){
          setUser(userData.session);
        }else{
          router.push("/dashboard/student");
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-600">Professor Dashboard</h1>
          <p className="text-gray-500">Welcome back, Dr. Smith! Here's what's happening with your classes.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 hover:text-white">
          <Plus className="h-4 w-4" />
          Create New Class
        </Button>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-gray-500">Active classes this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, cls) => acc + cls.students, 0)}</div>
            <p className="text-xs text-gray-500">Students enrolled in your classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, cls) => acc + cls.materials, 0)}</div>
            <p className="text-xs text-gray-500">Documents uploaded across all classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Classes</h2>
          <Link href="/dashboard/professor/classes" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Create class card */}
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className="flex h-full flex-col items-center justify-center border-2 border-dashed border-gray-200 p-6 text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-3">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mb-1 font-medium">Create New Class</h3>
              <p className="mb-4 text-sm text-gray-500">Set up a new class for your students</p>
              <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" className="mt-2">
                Create Class
              </Button>
            </Card>
          </motion.div>
          {classes.map((cls) => (
            <motion.div
              key={cls.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              animate={{
                backgroundColor:
                  recentlyCreatedClass === cls.id ? ["#f0f9ff", "#ffffff", "#f0f9ff", "#ffffff"] : "#ffffff",
                transition: { duration: 2, repeat: 2 },
              }}
              className="rounded-lg overflow-hidden"
            >
              <Card className="h-full">
                <CardHeader className="bg-primary-50 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{cls.name}</CardTitle>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-primary-600"
                        onClick={() => {
                          navigator.clipboard.writeText(cls.code)
                          // You could add a toast notification here
                        }}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy Code
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Class Code: {cls.code}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Students</span>
                      <span className="font-medium">{cls.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Materials</span>
                      <span className="font-medium">{cls.materials}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Engagement</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 px-6 py-3">
                  <Link
                    href={`/dashboard/professor/classes/${cls.id}`}
                    className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Manage Class
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {/* <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <Link href="/dashboard/professor/activity" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4">
                  <div className="rounded-full bg-primary-50 p-2">
                    {activity.type === "join" && <Users className="h-4 w-4 text-primary-600" />}
                    {activity.type === "download" && <FileText className="h-4 w-4 text-primary-600" />}
                    {activity.type === "translation" && <Sparkles className="h-4 w-4 text-primary-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.student} {activity.type === "join" && "joined your class"}
                      {activity.type === "download" && "downloaded a material"}
                      {activity.type === "translation" && "requested a translation"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.class}
                      {activity.material && ` - ${activity.material}`}
                      {activity.language && ` - to ${activity.language}`}
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateClass={handleCreateClass}
      />
    </div>
  )
}

