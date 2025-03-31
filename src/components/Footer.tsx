"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Send, ArrowUpRight, CheckCircle2, Github } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // In a real app, you would send this to your API
      console.log("Subscribing email:", email)
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <footer className="relative overflow-hidden bg-gray-900 text-white pt-20 pb-10">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                  EduLangAI
                </span>
              </div>
            </Link>

            <p className="text-gray-400 mb-8 max-w-md">
              EduLang uses cutting-edge AI to break language barriers in education, making learning accessible to
              everyone regardless of their native language.
            </p>

            <div className="flex items-center space-x-5 mb-8">
              <motion.a
                href="https://github.com/GitMohit123/Edu-langAI"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors duration-300"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">Github</span>
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors duration-300"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary-400" />
              <span className="text-gray-300">support@edulang.com</span>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl" />

              <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="md:flex-1">
                    <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
                    <p className="text-gray-400 mb-4">
                      Get the latest updates, news and special offers sent directly to your inbox.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="h-12 pl-4 pr-12 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className="absolute right-1 top-1 h-10 w-10 bg-primary-500 hover:bg-primary-600 rounded-md"
                        >
                          {isSubmitted ? <CheckCircle2 className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                        </Button>
                      </div>

                      {isSubmitted && (
                        <motion.p
                          className="text-green-400 text-sm flex items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Thank you for subscribing!
                        </motion.p>
                      )}

                      <p className="text-xs text-gray-500">
                        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                      </p>
                    </form>
                  </div>

                  <div className="hidden md:block md:w-1/3">
                    <div className="relative h-56 w-56 mx-auto">
                      <Image
                        src="/assets/newsletter.png"
                        alt="Newsletter illustration"
                        width={260}
                        height={260}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Supported Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {["English", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "Russian"].map(
                      (lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300"
                        >
                          {lang}
                        </span>
                      ),
                    )}
                    <span className="inline-flex items-center text-xs font-medium text-primary-400">+87 more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0 text-gray-500 text-sm">
            © {new Date().getFullYear()} EduLang. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-6">
            <Link
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
            >
              Terms of Service
              <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
            >
              Privacy Policy
              <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
            >
              Cookie Policy
              <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

