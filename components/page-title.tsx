"use client"

import { motion } from "framer-motion"

interface PageTitleProps {
  title: string
  subtitle?: string
}

const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <div className="bg-[#EEEEEA] py-16">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-lg text-gray-600 mt-2 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default PageTitle
