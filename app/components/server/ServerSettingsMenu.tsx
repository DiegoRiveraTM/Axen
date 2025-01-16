'use client'

import { useState } from 'react'
import { Settings, UserPlus, PlusCircle, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ServerSettings from './settings/ServerSettings'
import AddFriendModal from './AddFriendModal'
import CreateChannelModal from './CreateChannelModal'
import LeaveServerModal from './modals/LeaveServerModal'
import { Channel, Role, Member } from '@/lib/mockData'

interface ServerSettingsMenuProps {
  isOpen: boolean
  onClose: () => void
  serverName: string
  serverImage: string
  onCreateChannel: (channelName: string, channelType: 'voice' | 'text', category?: string) => void
  currentUserId: string  // Agrega esta propiedad
}

export default function ServerSettingsMenu({ isOpen, onClose, serverName, serverImage, onCreateChannel, currentUserId }: ServerSettingsMenuProps) {
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
    // Aquí se implementaría la lógica real para abandonar el servidor
    // Por ahora, simularemos con un retraso
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/') // Redirigir a la página de inicio después de abandonar
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
            message: 'Welcome to our server!',
            channels: [], // Agrega las propiedades faltantes
            roles: [],    // Agrega las propiedades faltantes
            id: '1',      // Agrega las propiedades faltantes
            members: []   // Agrega las propiedades faltantes
          }}
          currentUserId={currentUserId}  // Pasa la propiedad currentUserId aquí
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
