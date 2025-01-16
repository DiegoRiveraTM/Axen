'use client'

import { useState, useRef, useEffect } from 'react'
import { Hash, Volume2, Plus, Settings, Bell, Calendar, ChevronDown, MicOff, PhoneOff } from 'lucide-react'
import Image from 'next/image'
import ServerSettingsMenu from './ServerSettingsMenu'
import { Channel } from '@/lib/mockData'
import CreateChannelModal from './CreateChannelModal'
import ScheduleEventModal from './modals/ScheduleEventModal'
import { hasPermission, getMemberById } from '@/lib/mockData'
import VoiceChannel from '../voice/VoiceChannel'
import { useState as useState2 } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComingSoonModal } from '../modals/ComingSoonModal'

interface Event {
  id: string
  title: string
  date: string
  time: string
  createdBy: string;
}

interface ServerChannelsProps {
  serverName: string;
  serverImage: string;
  channels: Channel[];
  currentUserId: string;
  serverId: string;
  onChannelSelect: (channel: Channel) => void;
  onCreateChannel: (channelName: string, channelType: 'voice' | 'text', category: string) => void;
  onDeleteChannel: (channelId: string) => void;
  onUpdateChannel: (channelId: string, updates: Partial<Channel>) => void;
  onOpenSettings: () => void;
}

export default function ServerChannels({ serverName, serverImage, channels = [], currentUserId, serverId, onChannelSelect, onCreateChannel, onDeleteChannel, onUpdateChannel, onOpenSettings }: ServerChannelsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [textChannelsCollapsed, setTextChannelsCollapsed] = useState(false)
  const [voiceChannelsCollapsed, setVoiceChannelsCollapsed] = useState(false)
  const [notificationsMuted, setNotificationsMuted] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [hasUnreadEvents, setHasUnreadEvents] = useState(false)
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<Channel | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [showComingSoonPopup, setShowComingSoonPopup] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [selectedVoiceChannel, setSelectedVoiceChannel] = useState<Channel | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null)

  const textChannels = channels.filter(channel => channel.type === 'text')
  const voiceChannels = channels.filter(channel => channel.type === 'voice')

  const currentMember = getMemberById(serverId, currentUserId)
  const canManageEvents = currentMember && hasPermission(currentMember, 'MANAGE_MESSAGES', serverId)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCreateChannel = (channelName: string, channelType: 'voice' | 'text', category: string) => {
    onCreateChannel(channelName, channelType, category)
    setIsCreateChannelModalOpen(false)
  }

  const handleAddEvent = (newEvent: Omit<Event, 'id'>) => {
    if (!canManageEvents) {
      return // Early return if user doesn't have permission
    }
    const event = {
      ...newEvent,
      id: Date.now().toString(),
      createdBy: currentUserId
    }
    setEvents(prev => [...prev, event])
    setHasUnreadEvents(true)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id))
  }

  const handleVoiceChannelClick = (channel: Channel) => {
    setSelectedVoiceChannel(channel);
    setShowComingSoonModal(true);
  }

  return (
    <div className="w-full h-full bg-[#1B3726] flex flex-col">
      {/* Server Header */}
      <div className="h-12 flex items-center justify-between px-4 bg-[#1B3726] shadow-md relative">
        <div className="flex items-center space-x-2">
          <div className="relative w-6 h-6">
            <Image
              src={serverImage || "/placeholder.svg"}
              alt={serverName}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <span className="text-white font-medium truncate">{serverName}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-around py-2 px-2 border-b border-[#2A633B]/20">
        <button 
          className={`text-gray-300 hover:text-white p-2 rounded-md relative group transition-all duration-200 ${
            notificationsMuted ? 'bg-red-500/10' : 'hover:bg-[#2A633B]/30'
          }`}
          onClick={() => setNotificationsMuted(!notificationsMuted)}
          aria-label={notificationsMuted ? "Unmute notifications" : "Mute notifications"}
        >
          <Bell 
            size={20} 
            className={`transition-all duration-200 ${
              notificationsMuted 
                ? "text-red-400" 
                : "text-gray-300"
            }`}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {notificationsMuted ? 'Notifications muted' : 'Mute notifications'}
          </div>
        </button>
        <button 
          className={`text-gray-300 hover:text-white p-2 rounded-md hover:bg-[#2A633B]/30 relative group ${
            !canManageEvents ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => {
            if (canManageEvents) {
              setShowScheduleModal(true)
              setHasUnreadEvents(false)
            }
          }}
          title={!canManageEvents ? "You need moderator or admin permissions to manage events" : ""}
        >
          <Calendar size={20} />
          {hasUnreadEvents && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
          )}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {!canManageEvents 
              ? "You need moderator or admin permissions to manage events"
              : events.length > 0 
                ? `${events.length} scheduled event${events.length === 1 ? '' : 's'}` 
                : 'Schedule event'
            }
          </div>
        </button>
        <div ref={settingsRef}>
          <button 
            className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-[#2A633B]/30"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings size={20} />
          </button>
          <ServerSettingsMenu 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            serverName={serverName}
            serverImage={serverImage}
            onCreateChannel={() => setIsCreateChannelModalOpen(true)}
          />
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Text Channels */}
          <div className="px-2 pt-4">
            <div className="flex items-center justify-between px-2 mb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTextChannelsCollapsed(!textChannelsCollapsed)}
                  className="text-gray-300 hover:text-white"
                  aria-label={textChannelsCollapsed ? "Expand text channels" : "Collapse text channels"}
                >
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-200 ${
                      textChannelsCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </button>
                <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                  Text Channels
                </span>
              </div>
              <button 
                className="text-gray-300 hover:text-white w-4 h-4 flex items-center justify-center"
                aria-label="Create text channel"
                onClick={() => setIsCreateChannelModalOpen(true)}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className={`space-y-0.5 overflow-hidden transition-all duration-200 ${
              textChannelsCollapsed ? 'h-0' : 'h-auto'
            }`}>
              {textChannels.map((channel) => (
                <button
                  key={channel.id}
                  className="w-full group flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#2A633B]/50 cursor-pointer"
                  onClick={() => onChannelSelect(channel)}
                >
                  <Hash className="w-4 h-4 text-gray-400 group-hover:text-gray-200" />
                  <span className="text-gray-400 group-hover:text-gray-200 text-sm">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Channels */}
          <div className="px-2 pt-4">
            <div className="flex items-center justify-between px-2 mb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceChannelsCollapsed(!voiceChannelsCollapsed)}
                  className="text-gray-300 hover:text-white"
                  aria-label={voiceChannelsCollapsed ? "Expand voice channels" : "Collapse voice channels"}
                >
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-200 ${
                      voiceChannelsCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </button>
                <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                  Voice Channels
                </span>
              </div>
              <button 
                className="text-gray-300 hover:text-white w-4 h-4 flex items-center justify-center"
                aria-label="Create voice channel"
                onClick={() => setIsCreateChannelModalOpen(true)}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className={`space-y-0.5 overflow-hidden transition-all duration-200 ${
              voiceChannelsCollapsed ? 'h-0' : 'h-auto'
            }`}>
              {voiceChannels.map((channel) => (
                <div key={channel.id} className="group">
                  <button
                    className="w-full group flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#2A633B]/50 cursor-pointer"
                    onClick={() => handleVoiceChannelClick(channel)}
                  >
                    <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-gray-200" />
                    <span className="text-gray-400 group-hover:text-gray-200 text-sm">{channel.name}</span>
                    {channel.participants && channel.participants.length > 0 && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {channel.participants.length}
                      </span>
                    )}
                  </button>
                  {channel.participants && channel.participants.length > 0 && (
                    <div className="ml-6 mt-1 space-y-1">
                      {channel.participants.map(participant => (
                        <div key={participant.id} className="flex items-center gap-2 px-2 py-1 text-sm text-gray-400">
                          <div className="relative w-5 h-5">
                            <Image
                              src={participant.imageUrl || "/placeholder.svg"}
                              alt={participant.name}
                              layout="fill"
                              className="rounded-full"
                            />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#1B3726] ${
                              participant.isDeafened ? 'bg-red-500' : 
                              participant.isMuted ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`} />
                          </div>
                          <span className="truncate">{participant.name}</span>
                          {participant.isMuted && <MicOff className="w-3 h-3 ml-auto text-yellow-500" />}
                          {participant.isDeafened && <PhoneOff className="w-3 h-3 ml-auto text-red-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      {activeVoiceChannel && (
        <div className="mt-auto border-t border-[#2A633B]">
          <VoiceChannel
            channelId={activeVoiceChannel.id}
            channelName={activeVoiceChannel.name}
            onLeave={() => setActiveVoiceChannel(null)}
          />
        </div>
      )}

      <CreateChannelModal 
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      <ScheduleEventModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onAddEvent={handleAddEvent}
        events={events}
        onDeleteEvent={handleDeleteEvent}
        canManageEvents={canManageEvents}
      />
      <AnimatePresence>
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
        >
          Próximamente
        </motion.div> */}
      </AnimatePresence>
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        featureName={selectedVoiceChannel ? `Canal de voz: ${selectedVoiceChannel.name}` : 'Canales de voz'}
      />
    </div>
  )
}

