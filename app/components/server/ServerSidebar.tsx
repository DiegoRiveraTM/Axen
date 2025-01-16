'use client'

import { useState } from 'react'
import ServerChannels from './ServerChannels'

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  category?: string;
}

interface ServerSidebarProps {
  serverName: string
  serverImage: string
  channels: Channel[]
}

export default function ServerSidebar({ serverName, serverImage, channels }: ServerSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-3 left-4 z-50 text-gray-300 hover:text-white transition-all hover:bg-[#2A633B]/50 p-1.5 rounded-md"
        aria-label={isOpen ? "Close server sidebar" : "Open server sidebar"}
      >
        <div className="w-[18px] h-[18px] flex gap-0.5">
          <div className={`w-[2px] h-full bg-current rounded-full transition-all duration-300 ${isOpen ? 'transform translate-x-[3px]' : ''}`} />
          <div className={`w-[2px] h-full bg-current rounded-full transition-all duration-300 ${isOpen ? 'transform -translate-x-[3px]' : ''}`} />
        </div>
      </button>

      {/* Sliding Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ServerChannels 
          serverName={serverName}
          serverImage={serverImage}
          channels={channels}
          onChannelSelect={(channel) => {
            // Aquí puedes manejar la selección del canal si es necesario
            console.log('Canal seleccionado:', channel);
          }}
        />
      </div>
    </div>
  )
}

