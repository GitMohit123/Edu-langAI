"use client"

import { useRef, ReactNode } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Users, Mic, Languages, FileText, Upload, Download, MessageSquare, BarChart, Sparkles } from "lucide-react"

// Feature data with images
const features = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Create & Join Classroom Groups",
    description:
      "Make a classroom for your students or join one with a simple code. Share materials and work together in one place.",
    image: "/assets/class.jpg",
    alt: "Classroom groups illustration",
    id: "classroom-groups",
  },
  {
    icon: <Languages className="h-8 w-8" />,
    title: "Learn in Your Language",
    description:
      "See content in over 95 languages. Our AI translates everything so you can learn in the language you're most comfortable with.",
    image: "/assets/language.jpg",
    alt: "Language translation illustration",
    id: "language-translation",
  },
  {
    icon: <Mic className="h-8 w-8" />,
    title: "Listen to Content",
    description:
      "Turn text into speech with natural-sounding voices. Listen to materials while commuting, exercising, or whenever reading isn't convenient.",
    image: "/assets/speech.jpg",
    alt: "Students listening to content",
    id: "text-to-speech",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Get Quick Summaries",
    description:
      "Turn long documents into short summaries. Quickly understand the main points without reading everything.",
    image: "/assets/summarize.avif",
    alt: "Student reading a summary",
    id: "text-summarization",
  },
//   {
//     icon: <MessageSquare className="h-8 w-8" />,
//     title: "Ask Questions Anytime",
//     description:
//       "Get help from our AI assistant when you're stuck. Ask questions about the content or how to use EduLang.",
//     image: "/placeholder.svg?height=400&width=600&text=Student+Questions",
//     alt: "Student asking questions",
//     id: "ai-assistant",
//   },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "See Your Progress",
    description: "Teachers can track how students engage with materials. Students can see their own learning journey.",
    image: "/assets/analytics.avif",
    alt: "Learning progress dashboard",
    id: "learning-analytics",
  },
]

interface FeatureType {
  icon: ReactNode;
  title: string;
  description: string;
  image: string;
  alt: string;
  id: string;
}

interface FeatureProps {
  feature: FeatureType;
  index: number;
}

// Individual feature component with scroll animations
function Feature({ feature, index }: FeatureProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Determine if feature should appear on left or right (alternating)
  const isEven = index % 2 === 0

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, x: isEven ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay: 0.2,
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay: 0.4,
      },
    },
  }

  return (
    <div
      id={feature.id}
      ref={ref}
      className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center mb-32`}
    >
      {/* Text content */}
      <motion.div
        className="w-full md:w-1/2 space-y-6"
        variants={textVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-50 text-primary-600 shadow-md">{feature.icon}</div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{feature.title}</h3>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
      </motion.div>

      {/* Image */}
      <motion.div
        className="w-full md:w-2/5"
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200 aspect-video group saas-card">
          <Image
            src={feature.image || "/placeholder.svg"}
            alt={feature.alt}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-transparent opacity-60 mix-blend-overlay" />

          {/* Interactive overlay */}
          <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-primary-800 text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="h-10 w-10 text-primary-600 mx-auto mb-3">{feature.icon}</div>
              <p className="font-medium">{feature.title}</p>
              <p className="text-sm text-gray-600 mt-2">Simple and easy to use</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Parallax header for the section
function ParallaxHeader() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={ref} className="relative h-[40vh] mb-24 overflow-hidden">
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
        style={{ y, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 px-3 py-1 text-sm text-primary-700">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">What You Can Do with EduLang</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple tools that make learning across languages easy for everyone
          </p>
        </motion.div>
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
    </div>
  )
}

export default function SimpleFeaturesSection() {
  return (
    <section id="features" className="w-full border-t border-gray-100 bg-white">
      <ParallaxHeader />

      <div className="container px-6 md:px-8 mx-auto max-w-6xl">
        {features.map((feature, index) => (
          <Feature key={index} feature={feature} index={index} />
        ))}
      </div>

      {/* Floating gradient orbs for visual interest */}
      <motion.div
        className="fixed -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 30, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="fixed top-1/2 -left-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </section>
  )
}

