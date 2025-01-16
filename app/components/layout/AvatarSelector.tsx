'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import Image from 'next/image'

interface AvatarSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatarUrl: string) => void
  currentAvatar: string
}

const AVATARS = Array.from({ length: 20 }, (_, i) => `/images/avatars/avatar-${i + 1}.jpg`)

export default function AvatarSelector({ isOpen, onClose, onSelect, currentAvatar }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)

  if (!isOpen) return null

  const handleSelect = () => {
    onSelect(selectedAvatar)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div className="bg-[#1B3726] rounded-lg w-full max-w-md animate-modalIn">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Choose Avatar</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-6"> {/* Changed from grid-cols-4 to grid-cols-5 */}
            {AVATARS.map((avatar, index) => (
              <button
                key={index}
                onClick={() => setSelectedAvatar(avatar)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar 
                    ? 'border-green-500 scale-95' 
                    : 'border-transparent hover:border-green-500/50'
                }`}
              >
                <Image
                  src={avatar || "/placeholder.svg"}
                  alt={`Avatar ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Select Avatar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

