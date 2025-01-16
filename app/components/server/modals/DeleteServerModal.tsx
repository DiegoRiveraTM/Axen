'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'

interface DeleteServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  onDeleteServer: () => Promise<void>;
  canDeleteServer: boolean;
}

export default function DeleteServerModal({ 
  isOpen, 
  onClose, 
  serverName,
  onDeleteServer,
  canDeleteServer
}: DeleteServerModalProps) {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState('')

  useState(() => {
    setMounted(true)
    return () => setMounted(false)
  })

  if (!mounted || !isOpen) return null

  const handleDeleteServer = async () => {
    if (confirmText !== serverName) {
      setError('Server name does not match')
      return
    }

    setIsLoading(true)
    try {
      await onDeleteServer()
      onClose()
    } catch (error) {
      console.error('Error deleting server:', error)
      setError('Failed to delete server')
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
              <h2 className="text-xl font-semibold text-white">Delete '{serverName}'</h2>
              <p className="text-sm text-gray-400 mt-1">
                Are you absolutely sure you want to delete this server?
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-red-500/10 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="text-sm text-red-200">
                <p className="font-medium mb-1">This action cannot be undone</p>
                <p className="text-red-200/80">
                  This will permanently delete the server, its channels, and all messages.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Please type <span className="font-mono text-white">{serverName}</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value)
                  setError('')
                }}
                className="w-full px-3 py-2 bg-[#2A633B] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter server name"
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
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
          {canDeleteServer ? (
            <button
              onClick={handleDeleteServer}
              disabled={isLoading || confirmText !== serverName}
              className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Server'
              )}
            </button>
          ) : (
            <p className="text-red-400 text-sm">You don't have permission to delete this server.</p>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

