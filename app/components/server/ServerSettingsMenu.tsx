'use client'

import { useState, useEffect } from 'react'
import { Settings, UserPlus, PlusCircle, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ServerSettings from './settings/ServerSettings'
import AddFriendModal from './AddFriendModal'
import CreateChannelModal from './CreateChannelModal'
import LeaveServerModal from './modals/LeaveServerModal'

interface ServerSettingsMenuProps {
  isOpen: boolean
  onClose: () => void
  serverName: string
  serverImage: string
  onCreateChannel: (channelName: string, channelType: 'voice' | 'text', category: string) => void
}

export default function ServerSettingsMenu({ isOpen, onClose, serverName, serverImage, onCreateChannel }: ServerSettingsMenuProps) {
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [showLeaveServer, setShowLeaveServer] = useState(false)

  const handleCreateChannel = () => {
    setShowCreateChannel(true)
    onClose()
  }

  const handleCloseCreateChannel = () => {
    setShowCreateChannel(false)
  }

  const handleLeaveServer = async () => {
    // Here you would implement the actual server leaving logic
    // For now, we'll just simulate it with a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/') // Redirect to home page after leaving
  }

  return (
    <>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#1E5B2F] ring-1 ring-black ring-opacity-5 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className="w-full px-4 py-2 text-sm text-white hover:bg-[#2A633B] flex items-center gap-2"
              role="menuitem"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="text-[#9BA7D6]" size={16} />
              Server Settings
            </button>
            <button
              className="w-full px-4 py-2 text-sm text-white hover:bg-[#2A633B] flex items-center gap-2"
              role="menuitem"
              onClick={() => setShowAddFriend(true)}
            >
              <UserPlus className="text-[#9BA7D6]" size={16} />
              Add friend
            </button>
            <button
              className="w-full px-4 py-2 text-sm text-white hover:bg-[#2A633B] flex items-center gap-2"
              role="menuitem"
              onClick={handleCreateChannel}
            >
              <PlusCircle className="text-[#9BA7D6]" size={16} />
              Create channel
            </button>
            <div className="border-t border-[#2A633B] my-1"></div>
            <button
              className="w-full px-4 py-2 text-sm text-white hover:bg-[#2A633B] flex items-center gap-2"
              role="menuitem"
              onClick={() => setShowLeaveServer(true)}
            >
              <LogOut className="text-[#9BA7D6]" size={16} />
              Leave Server
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <ServerSettings 
          onClose={() => setShowSettings(false)}
          server={{
            name: serverName,
            icon: serverImage,
            banner: '/images/server-banner.jpg',
            message: 'Welcome to our server!'
          }}
        />
      )}

      <AddFriendModal 
        isOpen={showAddFriend} 
        onClose={() => setShowAddFriend(false)} 
      />

      <CreateChannelModal 
        isOpen={showCreateChannel}
        onClose={handleCloseCreateChannel}
        onCreateChannel={onCreateChannel}
      />

      <LeaveServerModal
        isOpen={showLeaveServer}
        onClose={() => setShowLeaveServer(false)}
        serverName={serverName}
        onLeaveServer={handleLeaveServer}
      />
    </>
  )
}

