"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, FileText, Users, Plus, ArrowRight, Sparkles, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CreateClassModal } from "@/components/Dashboard/create-class-modal"
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Class {
  classId: string;
  title: string;
  code: string;
  description: string;
  subject: string;
}

export default function ProfessorDashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [classes, setClasses] = useState<Class[]>([]);
  const { user, setUser } = useUserContext();
  const router = useRouter();
  const [fetchState, setFetchState] = useState(false);
  const [showTickMap, setShowTickMap] = useState<Record<string, boolean>>({})
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleCopyCode = (classId: string, code: string) => {
    navigator.clipboard.writeText(code)
    setShowTickMap((prev) => ({ ...prev, [classId]: true }))
    setTimeout(() => {
      setShowTickMap((prev) => ({ ...prev, [classId]: false }))
    }, 200)
  }
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/class/fetch', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching classes:', errorData);
          throw new Error(errorData.error || 'Failed to fetch classes');
        }
        const data = await response.json();
        console.log(data);
        setClasses(data);
      } catch (error) {
        console.error('An error occurred while fetching classes:', error);
        // Optionally, you can set an error state here to display a message to the user
      } finally {
        setTimeout(()=>{
          setLoading(false);
        }, 2000);
      }
    }
    fetchClasses();
  }, [fetchState])

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
        if (userData.session.role === "professor") {
          setUser(userData.session);
        } else {
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
          <p className="text-gray-500">Welcome back, {user && user.name ?  user?.name.charAt(0).toUpperCase() + user?.name.slice(1):"User"}! Here's what's happening with your classes.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 hover:text-white">
          <Plus className="h-4 w-4" />
          Create New Class
        </Button>
      </div>

      {/* Classes */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Classes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Create class card */}
          <motion.div transition={{ type: "spring", stiffness: 300, damping: 20 }}>
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
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={`skeleton-${index}`}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          animate={{
            backgroundColor: "#ffffff",
            transition: { duration: 2, repeat: 2 },
          }}
          className="rounded-lg overflow-hidden cursor-pointer"
        >
          <Card className="h-full flex flex-col shadow-md transition-all duration-200">
            <CardHeader className="pb-2 space-y-0">
              <div className="flex items-start justify-between">
                {/* Subject badge skeleton */}
                <Skeleton className="h-6 w-24 mb-2 rounded-full" />

                {/* Code button skeleton */}
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>

              {/* Title skeleton */}
              <Skeleton className="h-7 w-4/5 mt-1" />
            </CardHeader>

            <CardContent className="flex-grow pb-2">
              {/* Description skeleton - multiple lines */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>

            <CardFooter className="p-2">
              {/* Manage Class button skeleton */}
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
            </>
          ) : 
          classes.map((cls) => (
            <motion.div
              key={cls.classId}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              animate={{
                backgroundColor:"#ffffff",
                transition: { duration: 2, repeat: 2 },
              }}
              className="rounded-lg overflow-hidden cursor-pointer"
            >
              <Card
          key={cls.classId}
          className={`h-full flex flex-col shadow-md transition-all duration-200 `}
        >
          <CardHeader className="pb-2 space-y-0">
            <div className="flex items-start justify-between">
              <Badge variant="outline" className="mb-2 bg-blue-50 text-[#3b82f6] border-blue-200">
                {cls.subject}
              </Badge>
              <button
                onClick={() => handleCopyCode(cls.classId, cls.code)}
                className="inline-flex items-center text-xs text-gray-500 hover:text-[#3b82f6] transition-colors"
                aria-label={`Copy class code ${cls.code}`}
              >
                {showTickMap[cls.classId] ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                Code: {cls.code}
              </button>
            </div>
            <CardTitle className="text-xl font-semibold text-[#3b82f6]">{cls.title}</CardTitle>
          </CardHeader>

          <CardContent className="flex-grow pb-2">
            <p className="text-sm text-gray-600">{cls.description}</p>
          </CardContent>

          <CardFooter className="p-2">
            <Link href={`/dashboard/professor/classes/${cls.classId}`} className="w-full" onMouseEnter={() => setHoveredCard(cls.classId)} onMouseLeave={() => setHoveredCard(null)}>
              <div
                className={`flex w-full items-center justify-center py-3 text-sm font-medium rounded-md transition-colors ${
                  hoveredCard === cls.classId
                    ? "bg-blue-50 text-[#3b82f6] border border-blue-500"
                    : "bg-gray-50 text-gray-700 border border-gray-200"
                }`}
              >
                Manage Class
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          </CardFooter>
        </Card>
            </motion.div>
          ))
          }
        </div>
      </div>

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        setFetchState={setFetchState}
        fetchState={fetchState}
      />
    </div>
  )
}
