"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Headphones, Sparkles, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
// Sample data


export default function StudentDashboardPage() {
  const {user, setUser} = useUserContext();
  const router = useRouter();
  console.log(user);
 
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
          <h1 className="text-3xl font-bold tracking-tight text-primary-600">Student Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name} Here are your classes and recent materials.</p>
        </div>
      </div>
      {/* AI Tools Section */}
      <div>
        <h2 className="mb-4 text-xl font-bold">AI Learning Tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Translation</CardTitle>
              <CardDescription>Translate materials to your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Access your learning materials in over 95 languages with our AI-powered translation.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <Link
                href="/dashboard/student/translations"
                className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Translate Materials
                <Sparkles className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text-to-Speech</CardTitle>
              <CardDescription>Listen to your materials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Convert any text material to natural-sounding speech in multiple languages and voices.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <Link
                href="/dashboard/student/audio"
                className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Listen to Materials
                <Headphones className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Summarization</CardTitle>
              <CardDescription>Get concise summaries of your materials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Let our AI create summaries of your learning materials to help you quickly grasp key concepts.
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <Link
                href="/dashboard/student/ai-tools"
                className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Summarize Materials
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
  
    </div>
  )
}

