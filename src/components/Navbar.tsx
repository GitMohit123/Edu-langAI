"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react"
import { scrollToSection } from "@/utils/scroll-utils"
import { motion, AnimatePresence } from "framer-motion"

// Feature list for dropdown
const featuresList = [
  { name: "Classroom Groups", href: "#classroom-groups" },
  { name: "Language Translation", href: "#language-translation" },
  { name: "Text to Speech", href: "#text-to-speech" },
  { name: "Text Summarization", href: "#text-summarization" },
  { name: "Teacher Uploads", href: "#teacher-uploads" },
  { name: "Student Downloads", href: "#student-downloads" },
  { name: "AI Assistant", href: "#ai-assistant" },
  { name: "Learning Analytics", href: "#learning-analytics" },
  { name: "Personalized Learning", href: "#personalized-learning" },
]

// Solutions list for dropdown
const solutionsList = [
  { name: "Teacher Interface", href: "#teacher-interface" },
  { name: "Student Interface", href: "#student-interface" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)
  const solutionsRef = useRef<HTMLDivElement>(null)

  // Track scroll position to add shadow to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false)
      }
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [featuresRef, solutionsRef])

  // Modified scroll handler that also closes the menu
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    scrollToSection(e, sectionId)
    setIsMenuOpen(false)
    setFeaturesOpen(false)
    setSolutionsOpen(false)
  }

  // Toggle features dropdown
  const toggleFeatures = (e: React.MouseEvent) => {
    e.preventDefault()
    setFeaturesOpen(!featuresOpen)
    setSolutionsOpen(false)
  }

  // Toggle solutions dropdown
  const toggleSolutions = (e: React.MouseEvent) => {
    e.preventDefault()
    setSolutionsOpen(!solutionsOpen)
    setFeaturesOpen(false)
  }

  return (
    <header
      className={`w-full px-10 py-4 sticky top-0 z-50 transition-all duration-300 
      bg-white border-b border-gray-100
      ${isScrolled ? "shadow-md" : ""}`}
    >
      <div className="container px-0 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.span
            className="text-2xl font-bold text-primary-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            EduLangAI
          </motion.span>
        </Link>

        {/* Mobile menu button */}
        <button className="block md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Features dropdown */}
          <div className="relative" ref={featuresRef}>
            <NavLink href="#" onClick={toggleFeatures}>
              <div className="flex items-center">
                Features
                {featuresOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </div>
            </NavLink>

            <AnimatePresence>
              {featuresOpen && (
                <motion.div
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-2">
                    {featuresList.map((feature, index) => (
                      <a
                        key={index}
                        href={feature.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={(e) => handleScroll(e, feature.href.substring(1))}
                      >
                        {feature.name}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Solutions dropdown */}
          <div className="relative" ref={solutionsRef}>
            <NavLink href="#" onClick={toggleSolutions}>
              <div className="flex items-center">
                Solutions
                {solutionsOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </div>
            </NavLink>

            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-2">
                    {solutionsList.map((solution, index) => (
                      <a
                        key={index}
                        href={solution.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={(e) => handleScroll(e, solution.href.substring(1))}
                      >
                        {solution.name}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink href="#pricing" onClick={(e) => handleScroll(e, "pricing")}>
            Pricing
          </NavLink>
          <NavLink href="#team" onClick={(e) => handleScroll(e, "team")}>
            Team
          </NavLink>
          <NavLink href="#contact" onClick={(e) => handleScroll(e, "contact")}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <motion.div
            className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 z-50 md:hidden shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container flex flex-col py-4 space-y-4">
              {/* Mobile Features dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors px-2 py-1 rounded-md hover:bg-primary-50"
                  onClick={toggleFeatures}
                >
                  <span>Features</span>
                  {featuresOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                <AnimatePresence>
                  {featuresOpen && (
                    <motion.div
                      className="mt-2 ml-4 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {featuresList.map((feature, index) => (
                        <a
                          key={index}
                          href={feature.href}
                          className="block py-1 text-sm text-gray-600 hover:text-primary-700 transition-colors"
                          onClick={(e) => handleScroll(e, feature.href.substring(1))}
                        >
                          {feature.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Solutions dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors px-2 py-1 rounded-md hover:bg-primary-50"
                  onClick={toggleSolutions}
                >
                  <span>Solutions</span>
                  {solutionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                <AnimatePresence>
                  {solutionsOpen && (
                    <motion.div
                      className="mt-2 ml-4 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {solutionsList.map((solution, index) => (
                        <a
                          key={index}
                          href={solution.href}
                          className="block py-1 text-sm text-gray-600 hover:text-primary-700 transition-colors"
                          onClick={(e) => handleScroll(e, solution.href.substring(1))}
                        >
                          {solution.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <MobileNavLink href="#pricing" onClick={(e) => handleScroll(e, "pricing")}>
                Pricing
              </MobileNavLink>
              <MobileNavLink href="#team" onClick={(e) => handleScroll(e, "team")}>
                Team
              </MobileNavLink>
              <MobileNavLink href="#contact" onClick={(e) => handleScroll(e, "contact")}>
                Contact
              </MobileNavLink>
              <div className="flex items-center space-x-4 pt-2">
                <Button asChild className="flex-1 bg-primary-600 hover:bg-primary-700 text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

// Desktop navigation link component
interface NavLinkProps {
  href: string
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  children: React.ReactNode
  className?: string
}

function NavLink({ href, onClick, children, className = "" }: NavLinkProps) {
  return (
    <motion.a
      href={href}
      className={`text-sm font-medium relative group ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <span className="text-gray-700 group-hover:text-primary-700 transition-colors">{children}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
    </motion.a>
  )
}

// Mobile navigation link component
interface MobileNavLinkProps {
  href: string
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  children: React.ReactNode
}

function MobileNavLink({ href, onClick, children }: MobileNavLinkProps) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors px-2 py-1 rounded-md hover:bg-primary-50"
      onClick={onClick}
    >
      {children}
    </a>
  )
}

