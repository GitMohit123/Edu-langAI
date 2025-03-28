"use client"

import type React from "react"
import { Check, ChevronDown, Sparkles, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { scrollToPricing } from "@/utils/scroll-utils"

export default function PricingSection() {
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
      transition: { type: "spring", stiffness: 50 },
    },
  }

  return (
    <section
      id="pricing"
      className="w-full md:py-32 bg-white text-gray-900 border-t border-gray-100 relative overflow-hidden light-gradient-1"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />

        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="neural-net-pricing" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1" fill="#3b82f6" />
                <circle cx="0" cy="0" r="1" fill="#3b82f6" />
                <circle cx="0" cy="100" r="1" fill="#3b82f6" />
                <circle cx="100" cy="0" r="1" fill="#3b82f6" />
                <circle cx="100" cy="100" r="1" fill="#3b82f6" />
                <line x1="50" y1="50" x2="0" y2="0" stroke="#3b82f6" strokeWidth="0.2" />
                <line x1="50" y1="50" x2="0" y2="100" stroke="#3b82f6" strokeWidth="0.2" />
                <line x1="50" y1="50" x2="100" y2="0" stroke="#3b82f6" strokeWidth="0.2" />
                <line x1="50" y1="50" x2="100" y2="100" stroke="#3b82f6" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-net-pricing)" />
          </svg>
        </div>

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

      {/* Rest of the component remains the same */}
      <div className="container px-6 md:px-8 max-w-6xl relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-2 max-w-3xl" variants={itemVariants}>
            <div className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 px-3 py-1 text-sm text-primary-700 mx-auto">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              AI-Powered Plans
            </div>
            <h2 id="pricing-title" className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900">
              Pricing Plans
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl">
              Enjoy unlimited access to all AI features and resources, empowering your educational journey to grow
              without limits.
            </p>
          </motion.div>

          {/* Add a scroll button to ensure users can see the plans */}
          <motion.button
            onClick={() => scrollToPricing()}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors mt-2"
            aria-label="View pricing plans"
            variants={itemVariants}
          >
            <span className="mr-1">View plans</span>
            <ChevronDown size={16} />
          </motion.button>
        </motion.div>

        <motion.div
          id="pricing-plans"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Free Plan */}
          <motion.div
            className="flex flex-col p-6 bg-white text-gray-900 rounded-lg border border-gray-200 relative overflow-hidden shadow-md saas-card"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="mb-5">
              <h3 className="text-xl font-bold">Free</h3>
              <p className="text-sm text-gray-500 mt-2">
                Perfect for students and individual teachers getting started.
              </p>
            </div>

            <div className="mb-5">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="mb-6 space-y-4 flex-1">
              <PricingItem icon={<Brain size={16} />}>1 teacher account</PricingItem>
              <PricingItem>1GB storage</PricingItem>
              <PricingItem>Up to 2 classes</PricingItem>
              <PricingItem>Community support</PricingItem>
              <PricingItem icon={<Sparkles size={16} />}>Basic AI translation</PricingItem>
            </ul>

            <Button
              asChild
              variant="outline"
              className="w-full bg-transparent border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            className="flex flex-col p-6 bg-white text-gray-900 rounded-lg border-2 border-primary-500 relative overflow-hidden shadow-lg saas-card"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Popular badge */}
            <div className="absolute -top-5 left-0 right-0 mx-auto w-fit px-4 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
              Most Popular
            </div>

            <div className="mb-5">
              <h3 className="text-xl font-bold">Premium</h3>
              <p className="text-sm text-gray-500 mt-2">Ideal for schools and educational institutions.</p>
            </div>

            <div className="mb-5">
              <span className="text-4xl font-bold">$49</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="mb-6 space-y-4 flex-1">
              <PricingItem icon={<Brain size={16} />}>4 teacher accounts</PricingItem>
              <PricingItem>8GB storage</PricingItem>
              <PricingItem>Up to 6 classes</PricingItem>
              <PricingItem>Priority support</PricingItem>
              <PricingItem icon={<Sparkles size={16} />}>Advanced AI translation</PricingItem>
              <PricingItem icon={<Zap size={16} />}>Real-time voice synthesis</PricingItem>
            </ul>

            <Button asChild className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium group">
              <Link href="/signup">
                Get Started
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            className="flex flex-col p-6 bg-white text-gray-900 rounded-lg border border-gray-200 relative overflow-hidden shadow-md saas-card"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="mb-5">
              <h3 className="text-xl font-bold">Enterprise</h3>
              <p className="text-sm text-gray-500 mt-2">For large educational organizations with advanced needs.</p>
            </div>

            <div className="mb-5">
              <span className="text-4xl font-bold">$139</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="mb-6 space-y-4 flex-1">
              <PricingItem icon={<Brain size={16} />}>10 teacher accounts</PricingItem>
              <PricingItem>20GB storage</PricingItem>
              <PricingItem>Up to 10 classes</PricingItem>
              <PricingItem>Phone & email support</PricingItem>
              <PricingItem icon={<Sparkles size={16} />}>Premium AI translation</PricingItem>
              <PricingItem icon={<Zap size={16} />}>Custom AI model training</PricingItem>
            </ul>

            <Button
              asChild
              variant="outline"
              className="w-full bg-transparent border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function PricingItem({
  children,
  icon = <Check className="h-5 w-5" />,
}: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <li className="flex items-center">
      <span className="text-primary-600 mr-2 flex-shrink-0">{icon}</span>
      <span className="text-gray-700">{children}</span>
    </li>
  )
}

