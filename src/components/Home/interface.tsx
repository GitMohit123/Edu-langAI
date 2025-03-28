"use client"

import { useRef, ReactNode } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Users, GraduationCap, Sparkles } from "lucide-react"

interface InterfaceCardProps {
  icon: ReactNode;
  title: string;
  image: string;
  features: string[];
  id: string;
}

export default function InterfacesSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      id="interfaces"
      className="w-full py-20 md:py-32 border-t border-gray-100 bg-white text-gray-900 relative overflow-hidden light-gradient-2"
      ref={sectionRef}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/3 right-0 w-96 h-96 bg-primary-100 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Added a div with padding-top to ensure proper scroll positioning */}
      <div className="pt-4 relative z-10">
        <div className="container px-6 md:px-8 max-w-6xl">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 px-3 py-1 text-sm text-primary-700 mx-auto">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Specialized Interfaces
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900">
                Tailored for Teachers and Students
              </h2>
              <p className="text-xl text-gray-600 max-w-[800px] mx-auto mt-4">
                EduLang provides specialized interfaces for both educators and learners, optimizing the experience for
                each role.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <InterfaceCard
              icon={<Users className="h-8 w-8" />}
              title="Teacher Interface"
              image="/placeholder.svg?height=400&width=600&text=Teacher+Classroom"
              features={[
                "Upload educational materials in multiple formats",
                "Organize content by subject, grade level, or topic",
                "Track student engagement with materials",
                "Request automatic translations and summaries",
              ]}
              id="teacher-interface"
            />

            <InterfaceCard
              icon={<GraduationCap className="h-8 w-8" />}
              title="Student Interface"
              image="/placeholder.svg?height=400&width=600&text=Students+Learning"
              features={[
                "Browse and download materials in preferred language",
                "Convert text to speech for audio learning",
                "Generate summaries of lengthy documents",
                "Save favorite resources for quick access",
              ]}
              id="student-interface"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function InterfaceCard({ icon, title, image, features, id }: InterfaceCardProps) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  }

  return (
    <motion.div
      id={id}
      className="flex flex-col space-y-6"
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div
        className="rounded-lg border border-gray-200 overflow-hidden shadow-lg relative group saas-card max-w-md mx-auto w-full"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 mix-blend-overlay"></div>
        <Image
          src={image || "/placeholder.svg"}
          width={500}
          height={300}
          alt={title}
          className="w-full transition-transform group-hover:scale-105 duration-500"
        />

        {/* Overlay with icon */}
        <motion.div
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 border border-primary-100 shadow-md"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <div className="text-primary-600">{icon}</div>
        </motion.div>
      </motion.div>

      <motion.div className="space-y-4">
        <motion.h3 className="text-2xl font-bold text-primary-700 flex items-center gap-3" variants={itemVariants}>
          <div className="p-2 rounded-full bg-primary-50">{icon}</div>
          {title}
        </motion.h3>

        <motion.ul className="space-y-3" variants={itemVariants}>
          {features.map((feature: string, index: number) => (
            <motion.li key={index} className="flex items-start text-gray-600" variants={itemVariants} custom={index}>
              <motion.span
                className="mr-2 text-primary-600"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                ✓
              </motion.span>
              {feature}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div className="pt-4" variants={itemVariants} whileHover={{ x: 5 }}>
          <a href={`#${id}`} className="text-primary-600 hover:text-primary-700 flex items-center">
            Learn more about {title.toLowerCase()}
            <motion.span
              className="ml-1"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

