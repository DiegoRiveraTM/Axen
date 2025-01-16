'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { LogOut, AlertTriangle } from 'lucide-react'

interface LeaveServerModalProps {
  isOpen: boolean
  onClose: () => void
  serverName: string
  onLeaveServer: () => void
}

export default function LeaveServerModal({ 
  isOpen, 
  onClose, 
  serverName,
  onLeaveServer 
}: LeaveServerModalProps) {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useState(() => {
    setMounted(true)
    return () => setMounted(false)
  })

  if (!mounted || !isOpen) return null

  const handleLeaveServer = async () => {
    setIsLoading(true)
    try {
      await onLeaveServer()
      onClose()
    } catch (error) {
      console.error('Error leaving server:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const content = (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div 
        className="bg-[#1B3726] w-full max-w-md rounded-lg shadow-xl animate-modalIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2A633B]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Leave '{serverName}'</h2>
              <p className="text-sm text-gray-400 mt-1">
                Are you sure you want to leave this server?
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-red-500/10 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <LogOut className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="text-sm text-red-200">
                <p className="font-medium mb-1">This action cannot be undone</p>
                <p className="text-red-200/80">
                  You will need a new invite to rejoin this server.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleLeaveServer}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Leaving...
              </>
            ) : (
              'Leave Server'
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

