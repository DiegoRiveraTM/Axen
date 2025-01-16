'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import RolesView from './RolesView'
import MembersView from './MembersView'
import ChannelsView from './ChannelsView'
import BansView from './BansView'
import type { Role, Channel, Member } from '@/lib/mockData'
import { useRouter } from 'next/navigation'
import DeleteServerModal from '../modals/DeleteServerModal'
import { hasPermission } from '@/lib/mockData'

interface ServerSettingsProps {
  onClose: () => void;
  server: {
    name: string;
    icon: string;
    banner: string;
    message?: string;
    channels: Channel[];
    roles: Role[];
    id: string;
    members: Member[];  // Asegúrate de incluir esta propiedad
  };
  onUpdateServer?: (updatedServer: {
    name: string;
    icon: string;
    banner: string;
    message?: string;
  }) => void;
  onCreateChannel?: (channel: Omit<Channel, 'id'>) => void;
  currentUserId: string;
}

export default function ServerSettings({ onClose, server, onUpdateServer, onCreateChannel, currentUserId }: ServerSettingsProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [serverName, setServerName] = useState(server.name)
  const [serverIcon, setServerIcon] = useState(server.icon)
  const [serverBanner, setServerBanner] = useState(server.banner)
  const [serverMessage, setServerMessage] = useState(server.message || '')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingMessage, setIsEditingMessage] = useState(false)
  const [roles, setRoles] = useState<Role[]>(server.roles || [])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleSave = () => {
    if (typeof onUpdateServer === 'function') {
      const updatedServer = {
        name: serverName,
        icon: serverIcon,
        banner: serverBanner,
        message: serverMessage,
      }
      onUpdateServer(updatedServer)
    }
    onClose()
  }

  const handleDeleteServer = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/')
  }

  const canDeleteServer = hasPermission({ id: currentUserId, roles: ['1'], name: '', imageUrl: '', isOnline: false, role: 'Admin' }, 'MANAGE_ROLES', server.id)

  const renderContent = () => {
    switch (activeTab) {
      case 'roles':
        return (
          <RolesView
            roles={roles}
            onCreateRole={(newRole) => {
              setRoles(prevRoles => [...prevRoles, { ...newRole, id: Date.now().toString() }])
            }}
            onUpdateRole={(roleId, updates) => {
              setRoles(prevRoles => prevRoles.map(role => 
                role.id === roleId ? { ...role, ...updates } : role
              ))
            }}
            onDeleteRole={(roleId) => {
              setRoles(prevRoles => prevRoles.filter(role => role.id !== roleId))
            }}
          />
        )
      case 'members':
        return <MembersView server={server} />
      case 'channels':
        return <ChannelsView 
          channels={server.channels} 
          onDeleteChannel={(channelId) => {
            console.log('Delete channel:', channelId)
          }}
          onUpdateChannel={(channelId, updates) => {
            console.log('Update channel:', channelId, updates)
          }}
          onCreateChannel={onCreateChannel}
        />
      case 'bans':
        return <BansView 
          onUnbanUser={(userId) => {
            console.log('Unbanning user:', userId)
          }}
        />
      case 'overview':
      default:
        return (
          <div className="max-w-[800px] mx-auto p-10">
            <div className="bg-[#0F231A] rounded-lg p-4 mb-8 shadow-lg">
              <h1 className="text-2xl font-bold text-white">Server Overview</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Server Icon */}
              <div className="bg-[#0F231A] rounded-lg p-6 shadow-lg transition-transform duration-200 hover:scale-[1.02]">
                <h3 className="text-white/80 text-sm font-medium mb-4">
                  Edit Server Icon
                </h3>
                <div className="relative w-32 h-32 mx-auto group">
                  <img
                    src={serverIcon || "/placeholder.svg"}
                    alt="Server icon"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <label htmlFor="icon-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-[#2A633B] rounded-full flex items-center justify-center transform translate-x-1 translate-y-1 transition-transform duration-200 hover:scale-110 cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M20 12H4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </label>
                  <input 
                    id="icon-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setServerIcon(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </div>
              </div>

              {/* Server Name */}
              <div className="bg-[#0F231A] rounded-lg p-6 shadow-lg transition-transform duration-200 hover:scale-[1.02]">
                <h3 className="text-white/80 text-sm font-medium mb-4">
                  Change Server Name
                </h3>
                <div className="flex items-center justify-between">
                  {isEditingName ? (
                    <input
                      type="text"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      autoFocus
                      className="bg-[#2A633B] text-white px-2 py-1 rounded"
                    />
                  ) : (
                    <span className="text-white text-lg font-medium">{serverName}</span>
                  )}
                  <button 
                    className="text-white/60 hover:text-white transition-colors duration-200"
                    onClick={() => setIsEditingName(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Server Banner */}
              <div className="col-span-2 bg-[#0F231A] rounded-lg p-6 shadow-lg transition-transform duration-200 hover:scale-[1.02]">
                <h3 className="text-white/80 text-sm font-medium mb-4">
                  Server Banner
                </h3>
                <div className="relative w-full h-[200px] rounded-lg overflow-hidden group">
                  <img
                    src={serverBanner || "/placeholder.svg"}
                    alt="Server banner"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  />
                  <label htmlFor="banner-upload" className="absolute bottom-4 right-4 w-8 h-8 bg-[#2A633B] rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M20 12H4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </label>
                  <input 
                    id="banner-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setServerBanner(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </div>
              </div>

              {/* Server Message */}
              <div className="col-span-2 bg-[#0F231A] rounded-lg p-6 shadow-lg transition-transform duration-200 hover:scale-[1.02]">
                <h3 className="text-white/80 text-sm font-medium mb-4">
                  Edit Server Message
                </h3>
                <div className="flex items-center justify-between">
                  {isEditingMessage ? (
                    <input
                      type="text"
                      value={serverMessage}
                      onChange={(e) => setServerMessage(e.target.value)}
                      onBlur={() => setIsEditingMessage(false)}
                      autoFocus
                      className="bg-[#2A633B] text-white px-2 py-1 rounded w-full"
                    />
                  ) : (
                    <span className="text-white">
                      {serverMessage || 'Add a server message...'}
                    </span>
                  )}
                  <button 
                    className="text-white/60 hover:text-white transition-colors duration-200"
                    onClick={() => setIsEditingMessage(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        )
    }
  }

  if (!mounted) return null

  const navigationItems = {
    'SERVER SETTINGS': [
      { id: 'overview', label: 'Overview' },
      { id: 'roles', label: 'Roles' },
      { id: 'members', label: 'Members' },
      { id: 'channels', label: 'Channels' },
      { id: 'bans', label: 'Bans' },
    ],
  };

  const content = (
    <div className="fixed inset-0 z-[9999] bg-[#1E5B2F] flex overflow-hidden">
      {/* Left Panel - Navigation */}
      <div className="w-[240px] bg-[#0F231A] flex flex-col flex-shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2A633B] scrollbar-track-transparent hover:scrollbar-thumb-[#3A734B]">
        <div className="p-4">
          <button 
            onClick={onClose}
            className="flex items-center text-white/80 hover:text-white gap-2 mb-6 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Settings
          </button>
          <h2 className="text-white text-lg font-medium mb-1">
            Settings/{serverName}
          </h2>
        </div>

        <div className="px-2">
          <h3 className="text-xs font-semibold text-white/60 px-2 py-3 uppercase">
            Server Settings
          </h3>
          <div className="space-y-0.5">
            {navigationItems['SERVER SETTINGS'].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-2 py-1.5 rounded text-left text-sm transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-[#2A633B] text-white'
                    : 'text-white/70 hover:bg-[#2A633B]/50 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4">
              {canDeleteServer && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-2 py-1.5 rounded text-left text-sm text-red-400 hover:bg-[#2A633B]/50 transition-colors duration-200 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Server
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2A633B] scrollbar-track-transparent hover:scrollbar-thumb-[#3A734B]">
        {renderContent()}
      </div>
      <DeleteServerModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        serverName={server.name}
        onDeleteServer={handleDeleteServer}
        canDeleteServer={canDeleteServer}
      />
    </div>
  )

  return createPortal(content, document.body)
}

