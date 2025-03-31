"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Plus,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { JoinClassModal } from "@/components/Dashboard/join-class-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
interface Class {
  classId: string;
  title: string;
  professorName: string;
  code: string;
  joinedAt: string;
  materials: number;
}
export default function StudentClassesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const { user, setUser } = useUserContext();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinClassStatus, setJoinClassStatus] = useState(false);
  const [joinedClasses, setJoinedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const router = useRouter();
  // Filter and sort classes
  // const filteredClasses = joinedClasses
  //   .filter(
  //     (cls) =>
  //       cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       cls.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       cls.code.toLowerCase().includes(searchQuery.toLowerCase()),
  //   )
  //   .sort((a, b) => {
  //     if (sortBy === "name") return a.name.localeCompare(b.name)
  //     if (sortBy === "recent") {
  //       // Sort by last active date (simplified for demo)
  //       const aValue = a.lastActive === "Today" ? 0 : a.lastActive === "Yesterday" ? 1 : 2
  //       const bValue = b.lastActive === "Today" ? 0 : b.lastActive === "Yesterday" ? 1 : 2
  //       return aValue - bValue
  //     }
  //     if (sortBy === "materials") return b.materials - a.materials
  //     return 0
  //   })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/class/get-classes");
        if (!response.ok) {
          throw new Error(`Error fetching classes: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        setJoinedClasses(data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [joinClassStatus]);
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
        if(userData.session.role === "student"){
          setUser(userData.session);
        }else{
          router.push("/dashboard/professor");
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
          <h1 className="text-3xl font-bold tracking-tight text-primary-600">
            Student Dashboard
          </h1>
          <p className="text-gray-500">
            View and manage all your enrolled classes
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsJoinModalOpen(true)}
          className="py-4 mr-2 bg-primary-600 text-white hover:bg-primary-700 hover:text-white"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Join a Class
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search classes by name, professor, or code..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Active</SelectItem>
              <SelectItem value="name">Class Name</SelectItem>
              <SelectItem value="materials">Most Materials</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Classes grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="flex h-full flex-col items-center justify-center border-2 border-dashed border-gray-200 p-6 text-center">
            <div className="mb-4 rounded-full bg-primary-50 p-3">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mb-1 font-medium">Join the Class</h3>
            <p className="mb-4 text-sm text-gray-500">
              Join a new class to start learning
            </p>
            <Button
              onClick={() => setIsJoinModalOpen(true)}
              variant="outline"
              className="mt-2"
            >
              Join Class
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
        ) : (
          joinedClasses.map((cls) => (
            <motion.div
              key={cls.classId}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              animate={{
                backgroundColor: "#ffffff",
                transition: { duration: 2, repeat: 2 },
              }}
              className="rounded-lg overflow-hidden cursor-pointer"
            >
              <Card
                key={cls.classId}
                className={`h-full flex flex-col shadow-md transition-all duration-200 justify-between`}
              >
                <div className="flex flex-col">
                  <CardHeader className="pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold text-[#3b82f6]">
                      {cls.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex pb-2 items-center">
                    <User className="h-4 w-4 mr-1" />
                    <p className="text-sm text-gray-600">
                      Professor: {cls.professorName}
                    </p>
                  </CardContent>
                  <CardContent className="flex pb-2 items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <p className="text-sm text-gray-600">
                      Joined At: {cls.joinedAt}
                    </p>
                  </CardContent>
                </div>

                <CardFooter className="p-2">
                  <Link
                    href={`/dashboard/student/classes/${cls.classId}`}
                    className="w-full"
                    onMouseEnter={() => setHoveredCard(cls.classId)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`flex w-full items-center justify-center py-3 text-sm font-medium rounded-md transition-colors ${
                        hoveredCard === cls.classId
                          ? "bg-blue-50 text-[#3b82f6] border border-blue-500"
                          : "bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      View Class
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        setJoinClassStatus={setJoinClassStatus}
        joinClassStatus={joinClassStatus}
      />
    </div>
  );
}
