'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Link, UserPlus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState('')
  const [copied, setCopied] = useState(false)
  const inviteUrl = 'https://tecmilenio.chat/invite/xyz123'

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle friend request submission
    console.log('Friend request sent to:', username)
    setUsername('')
    onClose()
  }

  if (!mounted || !isOpen) return null

  const content = (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div 
        className="bg-[#1B3726] rounded-lg w-full max-w-md animate-modalIn"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-green-400">Add Friend</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <Tabs defaultValue="username" className="w-full">
            <TabsList className="w-full bg-[#2A633B] border-b border-[#3A734B]">
              <TabsTrigger 
                value="username" 
                className="flex-1 data-[state=active]:bg-[#3A734B] data-[state=active]:text-white"
              >
                Username
              </TabsTrigger>
              <TabsTrigger 
                value="invite" 
                className="flex-1 data-[state=active]:bg-[#3A734B] data-[state=active]:text-white"
              >
                Invite Link
              </TabsTrigger>
            </TabsList>
            <TabsContent value="username" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-4">
                    Enter your friend's username to send them a request
                  </p>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full px-4 py-3 bg-[#2A633B] text-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm border-green-500/20 border"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-[#2A633B] text-gray-300 rounded-xl hover:bg-[#3A734B] hover:text-white transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!username.trim()}
                    className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="invite" className="mt-4">
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Share this link with others to invite them to your server
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-[#2A633B] text-white rounded-xl border-green-500/20 border"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors min-w-[100px]"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

