'use client'

import { useState } from 'react'
import { Mic, MicOff, Headphones, PhoneOff, X } from 'lucide-react'

interface VoiceChannelProps {
  channelId: string
  channelName: string
  onLeave: () => void
}

export default function VoiceChannel({ channelId, channelName, onLeave }: VoiceChannelProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleDeafen = () => {
    setIsDeafened(!isDeafened)
    if (!isDeafened) setIsMuted(true)
  }

  return (
    <div className="bg-[#0A1F13] flex flex-col">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{channelName}</span>
          <span className="text-green-500 text-xs">(0)</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className={`w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center ${
              isMuted 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'text-white/80 hover:bg-[#1E5B2F] hover:text-white'
            }`}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button
            onClick={toggleDeafen}
            className={`w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center ${
              isDeafened 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'text-white/80 hover:bg-[#1E5B2F] hover:text-white'
            }`}
          >
            {isDeafened ? <PhoneOff size={18} /> : <Headphones size={18} />}
          </button>
          <button
            onClick={onLeave}
            className="w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

