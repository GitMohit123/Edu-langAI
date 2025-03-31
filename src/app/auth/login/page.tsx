"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, BookOpen, ArrowRight, Loader2, ArrowLeft, Sparkles } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useUserContext } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [role, setRole] = useState("student")
  const {user, setUser} = useUserContext();
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const target = e.target as HTMLFormElement;
    const userInput = {
      email: (target.elements.namedItem("email") as HTMLInputElement).value,
      password: (target.elements.namedItem("password") as HTMLInputElement).value,
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });

      const data = await response.json();
      if (!response.ok) {
        // Handle different error types based on the response
        if (response.status === 401) {
          setError("Invalid email or password. Please try again.")
        } else if (response.status === 404) {
          setError("Account not found. Please sign up first.")
        } else if (data.error) {
          setError(data.error)
        } else {
          setError("Login failed. Please try again later.")
        }
        setIsLoading(false)
        return
      }

      setUser(data.user);

      setIsLoading(false);
      // Redirect to appropriate dashboard based on role
      if (data.user.role === "professor") {
        router.push("/dashboard/professor");
      } else {
        router.push("/dashboard/student");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Network error. Please check your connection and try again.")
      console.error("Error logging in:", error);
      // Handle error (e.g., show a notification)
    }
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)

    // Simulate Google auth
    setTimeout(() => {
      setIsGoogleLoading(false)
      if (role === "professor") {
        router.push("/dashboard/professor")
      } else {
        router.push("/dashboard/student")
      }
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                  EduLang<span className="text-primary-600">AI</span>
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Log in to your EduLang account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                variant="outline"
                type="button"
                disabled
                className="w-full"
                onClick={handleGoogleLogin}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Image
                    src="/google.png"
                    width={16}
                    height={16}
                    alt="Google"
                    className="mr-2"
                  />
                )}
                {isGoogleLoading ? "Logging in..." : "Log in with Google"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div> */}

              <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </div>

            <div className="text-center text-xs text-gray-400 mt-4">
              <div className="flex items-center justify-center mb-1">
                <Sparkles className="h-3 w-3 text-primary-400 mr-1" />
                <span>Powered by EduLangAI</span>
              </div>
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

