'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/app/contexts/AppContext'
import ServerHeader from './ServerHeader'
import MessageList from '../chat/MessageList'
import MessageInput from '../chat/MessageInput'
import MembersList from './MembersList'
import ServerChannels from './ServerChannels'
import ServerBar from '../layout/ServerBar'
import UserStatus from '../layout/UserStatus'
import ServerSettings from './settings/ServerSettings'
import SearchModal from './SearchModal'
import { Server, Message, Channel, Role, Member } from '@/lib/mockData'
import MessageNotification from '../chat/MessageNotification'
import * as api from '@/lib/api';

interface ServerViewProps {
  server?: Server;
  initialMessages?: Message[];
  currentUserId: string;
}

export default function ServerView({ 
  server = {
    id: '1',
    name: 'Tecmi Group',
    imageUrl: '/images/server-icon.png',
    members: [],
    channels: [],
    roles: [], 
    banner: '/images/default-banner.jpg', 
    message: 'Welcome to our server!' 
  }, 
  initialMessages = [],
  currentUserId
}: ServerViewProps) {
  const { currentServer, setCurrentServer, currentChannel, setCurrentChannel } = useAppContext()
  const [showingChannels, setShowingChannels] = useState(true)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [channels, setChannels] = useState<Channel[]>(server.channels)
  const [serverData, setServerData] = useState(server)
  const [showSettings, setShowSettings] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [newMessage, setNewMessage] = useState({ sender: '', message: '', avatar: '' })
  const router = useRouter()

  useEffect(() => {
    setCurrentServer(server)
    setIsExiting(false)
  }, [server, setCurrentServer])

  const simulateNewMessage = () => {
    setNewMessage({
      sender: 'John Doe',
      message: 'Hey, check out this new feature!',
      avatar: '/images/john-doe-avatar.jpg'
    })
    setShowNotification(true)
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Simular un nuevo mensaje cuando el usuario cambia de pestaña
        setTimeout(simulateNewMessage, 3000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleReturnToMain = () => {
    setIsExiting(true)
    document.body.style.backgroundColor = '#1a4a2e'
    setTimeout(() => {
      setCurrentServer(null)
      router.push('/')
    }, 300) // Match transition duration
  }

  const handleSendMessage = async (content: string, image?: File) => {
    if (currentChannel) {
      try {
        const response = await api.sendMessage(currentChannel.id, content);
        const newMessage = response.data;
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        // Manejar el error (por ejemplo, mostrar una notificación al usuario)
      }
    }
  }

  const handleChannelSelect = async (channel: Channel) => {
    setCurrentChannel(channel);
    try {
      const response = await api.getMessages(channel.id);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Manejar el error
    }
  }

  const handleCreateChannel = async (channelName: string, channelType: 'voice' | 'text', category?: string) => {
    if (currentServer) {
      try {
        const response = await api.createChannel(currentServer.id, { name: channelName, type: channelType, category: category || '' });
        const newChannel = response.data;
        setChannels(prevChannels => [...prevChannels, newChannel]);
      } catch (error) {
        console.error('Error creating channel:', error);
        // Manejar el error
      }
    }
  }

  const toggleView = () => {
    setShowingChannels(!showingChannels)
  }

  const handleUpdateServer = (updatedServer: {
    name: string;
    icon: string;
    banner: string;
    message?: string;
  }) => {
    console.log('Updating server:', updatedServer);
    setServerData(prevData => ({
      ...prevData,
      name: updatedServer.name,
      imageUrl: updatedServer.icon,
      banner: updatedServer.banner,
      message: updatedServer.message
    }));
    setShowSettings(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
  };

  if (!currentServer) {
    return null
  }

  return (
    <div className={`flex h-screen ${
      isExiting ? 'fade-exit fade-exit-active bg-green-500' : 'fade-enter fade-enter-active'
    }`} style={{ backgroundColor: isExiting ? '#1a4a2e' : '#1E5B2F' }}>
      {/* Left side - Toggleable Members/Channels */}
      <div className="w-64 overflow-hidden relative bg-[#1B3726]">
        <div className={`absolute inset-0 transition-all duration-300 ease-in-out bg-[#1B3726] ${
          showingChannels ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}>
          <ServerChannels 
            serverName={serverData.name}
            serverImage={serverData.imageUrl}
            onChannelSelect={handleChannelSelect}
            channels={channels}
            onCreateChannel={handleCreateChannel}
            onDeleteChannel={(channelId) => {
              setChannels(prevChannels => prevChannels.filter(ch => ch.id !== channelId))
            }}
            onUpdateChannel={(channelId, updates) => {
              setChannels(prevChannels => prevChannels.map(ch => 
                ch.id === channelId ? { ...ch, ...updates } : ch
              ))
            }}
            onOpenSettings={() => setShowSettings(true)}
            currentUserId={currentUserId}  // Pasa la propiedad currentUserId aquí
            serverId={serverData.id} // Pasa la propiedad serverId aquí
          />
        </div>
        <div className={`absolute inset-0 transition-all duration-300 ease-in-out bg-[#1B3726] ${
          showingChannels ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <MembersList members={serverData.members} />
            </div>
            <UserStatus isInServer={true} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <ServerHeader 
          name={currentChannel ? currentChannel.name : serverData.name} 
          icon={serverData.imageUrl} 
          onToggleView={toggleView}
          showingChannels={showingChannels}
          serverId={serverData.id}
          onOpenSearch={() => setShowSearchModal(true)}
          onReturnToMain={handleReturnToMain}
        />
        <div className="flex-1 flex flex-col bg-[#1E5B2F] overflow-hidden">
          {currentChannel ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <MessageList 
                messages={messages.filter(m => m.channelId === currentChannel.id)} 
                serverId={serverData.id} 
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
                onReply={handleReply}
              />
              <MessageInput 
                onSendMessage={handleSendMessage} 
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white text-xl">
              Select a channel to start chatting
            </div>
          )}
        </div>
      </div>

      {/* Right side - Server List (fixed) */}
      <ServerBar />

      {showSettings && (
        <ServerSettings
          onClose={() => setShowSettings(false)}
          server={{
            name: serverData.name,
            icon: serverData.imageUrl,
            banner: serverData.banner || '/images/default-banner.jpg',
            message: serverData.message,
            channels: channels,
            roles: serverData.roles, // Agrega la propiedad roles
            id: serverData.id, // Agrega la propiedad id
            members: serverData.members // Agrega la propiedad members
          }}
          onUpdateServer={handleUpdateServer}
          onCreateChannel={(channel) => handleCreateChannel(channel.name, channel.type, channel.category)} // Corrige la firma aquí
          currentUserId={currentUserId}
        />
      )}

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
      />
      {showNotification && (
        <MessageNotification
          sender={newMessage.sender}
          message={newMessage.message}
          avatar={newMessage.avatar}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  )
}

