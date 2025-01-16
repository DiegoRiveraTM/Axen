'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import Image from 'next/image'
import UserSettings from './UserSettings'
import AvatarSelector from './AvatarSelector'

interface StatusProps {
  career?: string;
  isInServer?: boolean;
}

export default function UserStatus({ career = "programming", isInServer = false }: StatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [userAvatar, setUserAvatar] = useState('/images/user-avatar.jpg')

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  return (
    <>
      <div className="bg-[#2A633B] h-14 w-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} mr-3`}
          />
          
          <div className="flex items-center">
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="w-8 h-8 relative mr-3 rounded-full overflow-hidden hover:opacity-90 transition-opacity"
            >
              <Image
                src={userAvatar || "/placeholder.svg"}
                alt="User Avatar"
                layout="fill"
                objectFit="cover"
              />
            </button>
            
            <div>
              <h3 className="text-white text-sm font-medium leading-tight">CrankySinger</h3>
              <p className="text-green-400/70 text-xs leading-tight">{career}</p>
            </div>
          </div>
        </div>

        <button 
          className="text-gray-400 hover:text-gray-300 transition-colors"
          onClick={() => setShowSettings(true)}
        >
          <Settings size={18} />
        </button>
      </div>

      {showSettings && (
        <UserSettings onClose={handleCloseSettings} />
      )}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelect={setUserAvatar}
        currentAvatar={userAvatar}
      />
    </>
  )
}

