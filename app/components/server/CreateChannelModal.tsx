'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface CreateChannelModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateChannel: (channelName: string, channelType: 'voice' | 'text') => void
}

export default function CreateChannelModal({ isOpen, onClose, onCreateChannel }: CreateChannelModalProps) {
  const [mounted, setMounted] = useState(false)
  const [channelName, setChannelName] = useState('')
  const [channelType, setChannelType] = useState<'voice' | 'text'>('text')
  //const [description, setDescription] = useState('')

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const handleCreateChannel = () => {
    if (channelName.trim()) {
      onCreateChannel(channelName.trim(), channelType)
      setChannelName('')
      onClose()
    }
  }

  const content = (
    <div 
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-[#1B3726] w-[440px] rounded-lg shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#2A633B] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Create Channel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Channel Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Channel Name
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-3 py-2 bg-[#2A633B] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A734B] border-none"
              placeholder="new-channel"
              autoFocus
            />
          </div>

          {/* Channel Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Channel Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={channelType === 'voice'}
                  onChange={() => setChannelType('voice')}
                  className="form-radio text-green-500 border-gray-600 bg-[#2A633B]"
                />
                <span className="text-gray-300">Voice channel</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={channelType === 'text'}
                  onChange={() => setChannelType('text')}
                  className="form-radio text-green-500 border-gray-600 bg-[#2A633B]"
                />
                <span className="text-gray-300">Text channel</span>
              </label>
            </div>
          </div>

          {/* Channel Description */}
          {/*<div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Channel Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#2A633B] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A734B] border-none"
              placeholder="Add a description for your channel"
            />
          </div>*/}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-[#2A633B]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateChannel}
            disabled={!channelName.trim()}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              channelName.trim()
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

