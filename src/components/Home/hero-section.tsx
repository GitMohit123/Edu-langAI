"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  School,
  PenTool,
  FileText,
  Video,
  Users,
  MessageSquare,
  BarChart,
} from "lucide-react"
import { scrollToSection } from "@/utils/scroll-utils"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { TextShimmer } from "@/utils/text-shimmer"

// Education platform icons
const educationIcons = [
  {
    icon: <Image src="/placeholder.svg?height=40&width=40&text=GC" alt="Google Classroom" width={40} height={40} />,
    name: "Google Classroom",
  },
  {
    icon: <Image src="/placeholder.svg?height=40&width=40&text=K" alt="Kahoot" width={40} height={40} />,
    name: "Kahoot",
  },
  {
    icon: <Image src="/placeholder.svg?height=40&width=40&text=C" alt="Canvas" width={40} height={40} />,
    name: "Canvas",
  },
  {
    icon: <Image src="/placeholder.svg?height=40&width=40&text=BB" alt="Blackboard" width={40} height={40} />,
    name: "Blackboard",
  },
  {
    icon: <Image src="/placeholder.svg?height=40&width=40&text=MS" alt="Microsoft Teams" width={40} height={40} />,
    name: "Microsoft Teams",
  },
  {
    icon: <Image src="/placeholder.svg?height=40&width=40&text=M" alt="Moodle" width={40} height={40} />,
    name: "Moodle",
  },
  {
    icon: <Image src="/placeholder.svg?height=40&width=40&text=S" alt="Schoology" width={40} height={40} />,
    name: "Schoology",
  },
  {
    icon: <Image src="/placeholder.svg?height=40&width=40&text=E" alt="Edmodo" width={40} height={40} />,
    name: "Edmodo",
  },
]

// Feature icons for the background
const featureIcons = [
  <BookOpen key="book" className="h-8 w-8 text-primary-500" />,
  <GraduationCap key="grad" className="h-8 w-8 text-primary-600" />,
  <School key="school" className="h-8 w-8 text-primary-700" />,
  <PenTool key="pen" className="h-8 w-8 text-primary-500" />,
  <FileText key="file" className="h-8 w-8 text-primary-600" />,
  <Video key="video" className="h-8 w-8 text-primary-700" />,
  <Users key="users" className="h-8 w-8 text-primary-500" />,
  <MessageSquare key="message" className="h-8 w-8 text-primary-600" />,
  <BarChart key="chart" className="h-8 w-8 text-primary-700" />,
]

export default function HeroSection() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center bg-white text-gray-900 relative overflow-hidden py-10 light-gradient-1">
      {/* Static gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50 to-white"></div>

      {/* Animated background with auto-rotating education icons */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Revolving education platform icons */}

        {/* Floating feature icons */}
        {featureIcons.map((icon, index) => (
          <motion.div
            key={`feature-icon-${index}`}
            className="absolute rounded-full bg-white/80 p-3 shadow-sm"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              opacity: 0.6,
            }}
            animate={{
              x: [
                Math.random() * dimensions.width,
                Math.random() * dimensions.width,
                Math.random() * dimensions.width,
              ],
              y: [
                Math.random() * dimensions.height,
                Math.random() * dimensions.height,
                Math.random() * dimensions.height,
              ],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 md:px-8 relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="flex flex-col items-center w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 px-3 py-1 text-sm text-primary-700 mb-6"
            variants={itemVariants}
          >
            <span className="flex items-center">
              <GraduationCap className="mr-2 h-3.5 w-3.5" />
              Revolutionizing Education
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tighter text-center max-w-4xl mb-6 text-gray-900"
            variants={itemVariants}
          >
            Summarize, Translate, and Speak with <TextShimmer duration={2} >EduLangAI</TextShimmer>
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-10" variants={itemVariants}>
            EduLang uses cutting-edge artificial intelligence to translate, transcribe, and transform educational
            materials in real-time.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center" variants={itemVariants}>
            <Button asChild size="lg" className="px-8 bg-primary-600 hover:bg-primary-700 text-white font-medium group">
              <Link href="/signup" className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-200 text-primary-700 hover:bg-primary-50"
            >
              <a href="#features" onClick={(e) => scrollToSection(e, "features")}>
                Explore Features
              </a>
            </Button>
          </motion.div>

          {/* Dashboard preview with classroom image */}
          <motion.div
            className="w-full max-w-7xl mx-auto rounded-lg border border-gray-200 overflow-hidden shadow-2xl relative saas-card"
            variants={itemVariants}
          >
            <div className="w-full aspect-[16/9] relative">
              <Image
                src="/assets/dashboard.jpeg"
                fill
                alt="EduLang Dashboard Preview"
                className="object-cover"
                priority
              />

              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent" />

              {/* Bottom blur gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm" />

              {/* AI Translation Active badge */}
              <motion.div
                className="absolute top-[5%] right-[3%] bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-primary-100 shadow-lg"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-primary-700">AI Translation Active</span>
                </div>
              </motion.div>

              {/* Processing visualization */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                <motion.div
                  className="h-full bg-primary-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Integration logos */}
          <motion.div className="mt-16 text-center" variants={itemVariants}>
            <p className="text-sm text-gray-500 mb-4">Works with your favorite education platforms</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {educationIcons.slice(0, 5).map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-white p-2 rounded-lg shadow-sm">{item.icon}</div>
                  <span className="text-xs text-gray-500 mt-2">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

