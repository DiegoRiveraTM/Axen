'use client'

import { useState, useRef } from 'react'
import { X, Upload, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { Server } from '@/lib/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import * as api from '@/lib/api';

interface CreateServerModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateServer: (serverData: Server) => void
}

export default function CreateServerModal({ isOpen, onClose, onCreateServer }: CreateServerModalProps) {
  const [serverName, setServerName] = useState('')
  const [serverIcon, setServerIcon] = useState<string | null>(null)
  const [serverBanner, setServerBanner] = useState<string | null>(null)
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})
  
  const iconInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setServerIcon(reader.result as string)
        setTouched(prev => ({ ...prev, icon: true }))
        setErrors(prev => ({ ...prev, icon: '' }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setServerBanner(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!serverName.trim()) {
      newErrors.name = 'Server name is required'
    }
    if (!serverIcon) {
      newErrors.icon = 'Server icon is required'
    }
    if (!welcomeMessage.trim()) {
      newErrors.message = 'Welcome message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      name: true,
      icon: true,
      message: true
    })

    if (!validateForm()) return

    try {
      const response = await api.createServer({
        name: serverName,
        icon: serverIcon,
        banner: serverBanner,
        message: welcomeMessage,
      });
      const newServer = response.data;
      onCreateServer(newServer);
      onClose();
    } catch (error) {
      console.error('Error creating server:', error);
      // Manejar el error (por ejemplo, mostrar un mensaje de error al usuario)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#1B3726] rounded-lg w-[440px] max-w-[95vw] shadow-xl"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2A633B]/20">
          <h2 className="text-xl font-semibold text-white">Create a New Server</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#2A633B]/30 p-2"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2 py-3">
            <label className="block text-sm font-medium text-white/90">
              Server Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={serverName}
                onChange={(e) => {
                  setServerName(e.target.value)
                  if (touched.name) validateForm()
                }}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                className={`w-full h-11 px-4 bg-[#2A633B] rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${
                  errors.name && touched.name ? 'ring-2 ring-red-500/50' : 'focus:ring-green-500/50'
                }`}
                placeholder="Enter server name"
              />
              <AnimatePresence>
                {errors.name && touched.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-1.5 left-0 text-red-400 text-sm flex items-center gap-1.5 mb-6"
                  >
                    <AlertTriangle size={14} />
                    {errors.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-2 py-3">
            <label className="block text-sm font-medium text-white/90">
              Server Icon <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => iconInputRef.current?.click()}
                className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  errors.icon && touched.icon 
                    ? 'bg-red-500/10 ring-2 ring-red-500/50' 
                    : serverIcon ? 'ring-2 ring-green-500/50' : 'bg-[#2A633B] hover:bg-[#3A734B]'
                }`}
              >
                {serverIcon ? (
                  <Image 
                    src={serverIcon || "/placeholder.svg"} 
                    alt="Server Icon" 
                    width={64} 
                    height={64} 
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <Upload className={`${errors.icon && touched.icon ? 'text-red-400' : 'text-white/40'}`} size={24} />
                )}
              </div>
              <button
                type="button"
                onClick={() => iconInputRef.current?.click()}
                className="h-11 px-4 bg-[#2A633B] text-white rounded-md hover:bg-[#3A734B] transition-colors text-sm font-medium"
              >
                Upload Icon
              </button>
              <input
                type="file"
                ref={iconInputRef}
                onChange={handleIconUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <AnimatePresence>
              {errors.icon && touched.icon && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm flex items-center gap-1.5 mt-1.5 mb-6"
                >
                  <AlertTriangle size={14} />
                  {errors.icon}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2 py-3">
            <label className="block text-sm font-medium text-white/90">
              Server Banner <span className="text-white/40">(Optional)</span>
            </label>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => bannerInputRef.current?.click()}
                className="relative w-32 h-20 bg-[#2A633B] hover:bg-[#3A734B] rounded-md flex items-center justify-center cursor-pointer overflow-hidden transition-colors"
              >
                {serverBanner ? (
                  <Image 
                    src={serverBanner || "/placeholder.svg"} 
                    alt="Server Banner" 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Upload className="text-white/40" size={24} />
                )}
              </div>
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="h-11 px-4 bg-[#2A633B] text-white rounded-md hover:bg-[#3A734B] transition-colors text-sm font-medium"
              >
                Upload Banner
              </button>
              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2 py-3">
            <label className="block text-sm font-medium text-white/90">
              Welcome Message <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <textarea
                value={welcomeMessage}
                onChange={(e) => {
                  setWelcomeMessage(e.target.value)
                  if (touched.message) validateForm()
                }}
                onBlur={() => setTouched(prev => ({ ...prev, message: true }))}
                className={`w-full px-4 py-3 bg-[#2A633B] rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all min-h-[100px] resize-none ${
                  errors.message && touched.message ? 'ring-2 ring-red-500/50' : 'focus:ring-green-500/50'
                }`}
                placeholder="Enter welcome message"
              />
              <AnimatePresence>
                {errors.message && touched.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-1.5 left-0 text-red-400 text-sm flex items-center gap-1.5 mb-6"
                  >
                    <AlertTriangle size={14} />
                    {errors.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium text-sm mt-6"
          >
            Create Server
          </button>
        </form>
      </motion.div>
    </div>
  )
}

