'use client'

import { Bell, Pin, Search, Settings, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useAppContext } from '@/app/contexts/AppContext'

interface ServerHeaderProps {
  name: string
  icon: string
  onToggleView: () => void
  showingChannels: boolean
  serverId: string
  onOpenSearch: () => void
  onReturnToMain: () => void
}

export default function ServerHeader({ 
  name, 
  icon, 
  onToggleView, 
  showingChannels, 
  serverId, 
  onOpenSearch,
  onReturnToMain 
}: ServerHeaderProps) {
  const { pinnedServers, togglePinnedServer } = useAppContext()
  const isPinned = pinnedServers.includes(serverId)

  return (
    <div className="h-14 bg-[#1B3726] flex items-center justify-between px-4 border-b border-[#2A633B]/20 w-full overflow-hidden">
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onReturnToMain}
          className="text-gray-300 hover:text-white transition-all hover:bg-[#2A633B]/50 p-1.5 rounded-md"
          aria-label="Return to main menu"
        >
          <ArrowLeft size={20} />
        </button>
        <button 
          onClick={onToggleView}
          className="text-gray-300 hover:text-white transition-all hover:bg-[#2A633B]/50 p-1.5 rounded-md group flex-shrink-0"
          aria-label="Toggle view"
        >
          <div className="w-[18px] h-[18px] flex gap-0.5">
            <div className={`w-[2px] h-full bg-current rounded-full transition-all duration-300 ${showingChannels ? 'transform translate-x-[3px]' : ''}`} />
            <div className={`w-[2px] h-full bg-current rounded-full transition-all duration-300 ${showingChannels ? 'transform -translate-x-[3px]' : ''}`} />
          </div>
        </button>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#2A633B]/20 transition-colors cursor-pointer min-w-0">
          <div className="w-6 h-6 relative flex-shrink-0">
            <Image
              src={icon || "/placeholder.svg"}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="rounded-full ring-1 ring-white/10"
            />
          </div>
          <h1 className="text-white text-lg font-medium truncate">{name}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          {[
            { 
              icon: Pin, 
              label: isPinned ? 'Unpin Server' : 'Pin Server',
              onClick: () => togglePinnedServer(serverId),
              active: isPinned
            },
            { 
              icon: Search, 
              label: 'Search Messages',
              onClick: onOpenSearch
            },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={item.onClick}
              className={`text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-[#2A633B]/30 ${
                item.active ? 'text-green-400' : ''
              }`}
              aria-label={item.label}
            >
              <item.icon size={20} />
            </button>
          ))}
        </div>
        <button 
          className="text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-[#2A633B]/30"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  )
}

