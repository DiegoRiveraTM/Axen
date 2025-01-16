'use client'

import { motion } from 'framer-motion'

interface MinimalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const MinimalInput = ({ label, ...props }: MinimalInputProps) => {
  return (
    <motion.div 
      className="space-y-2"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <input
        {...props}
        placeholder={label}
        className="w-full px-3 py-3 bg-transparent border-2 rounded-lg border-green-500/20 dark:border-green-500/20 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:border-green-500 transition-all hover:border-green-500/40"
      />
    </motion.div>
  )
}

