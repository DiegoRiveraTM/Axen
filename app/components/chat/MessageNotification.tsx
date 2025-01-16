'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageNotificationProps {
  sender: string
  message: string
  avatar: string
  onClose: () => void
}

export default function MessageNotification({ sender, message, avatar, onClose }: MessageNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000) // Notification will auto-close after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '100%' }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: '100%' }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          className="fixed bottom-4 right-4 w-80 bg-[#1B3726] border border-[#2A633B] rounded-lg shadow-lg overflow-hidden z-50"
        >
          <div className="p-4 flex items-start">
            <img
              src={avatar || "/placeholder.svg"}
              alt={sender}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm mb-1 truncate">{sender}</h4>
              <p className="text-gray-300 text-sm line-clamp-2">{message}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors ml-2"
            >
              <X size={18} />
            </button>
          </div>
          <div className="bg-[#2A633B] px-4 py-2 flex justify-between items-center">
            <span className="text-xs text-gray-300">New message</span>
            <button
              onClick={handleClose}
              className="text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              Mark as read
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

