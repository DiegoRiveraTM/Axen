'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Mail, Server, Users, UserPlus2, MessageCircle, AlertCircle, Bell } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppContext } from '@/app/contexts/AppContext'
import { toast } from '@/components/ui/use-toast'
import { Server as ServerType } from '@/lib/mockData'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface ServerInvite {
  id: string
  serverName: string
  serverIcon: string
  invitedBy: string
  timestamp: string
}

interface FriendRequest {
  id: string
  username: string
  avatar: string
  mutualFriends: number
  timestamp: string
}

interface InboxModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock data for server invites
const mockInvites: ServerInvite[] = [
  {
    id: '1',
    serverName: 'Gaming Hub',
    serverIcon: '/images/gaming-hub.png',
    invitedBy: 'Alex Johnson',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    serverName: 'Study Group',
    serverIcon: '/images/study-group.png',
    invitedBy: 'Maria Garcia',
    timestamp: '5 hours ago'
  }
]

// Mock data for friend requests
const mockFriendRequests: FriendRequest[] = [
  {
    id: '1',
    username: 'CoolGamer123',
    avatar: '/images/avatar-1.jpg',
    mutualFriends: 3,
    timestamp: '1 hour ago'
  },
  {
    id: '2',
    username: 'TechStudent',
    avatar: '/images/avatar-2.jpg',
    mutualFriends: 1,
    timestamp: '3 hours ago'
  },
  {
    id: '3',
    username: 'ArtLover',
    avatar: '/images/avatar-3.jpg',
    mutualFriends: 5,
    timestamp: '1 day ago'
  }
]

export default function InboxModal({ isOpen, onClose }: InboxModalProps) {
  const [mounted, setMounted] = useState(false)
  const [invites, setInvites] = useState<ServerInvite[]>(mockInvites)
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(mockFriendRequests)
  const [activeTab, setActiveTab] = useState<string>('invites');
  const { addFriend, addServer } = useAppContext()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  useState(() => {
    setMounted(true)
    return () => setMounted(false)
  })

  if (!mounted || !isOpen) return null

  const handleClose = () => {
    setActiveTab('invites');
    onClose();
  };

  const handleAcceptInvite = (invite: ServerInvite) => {
    const newServer: ServerType = {
      id: invite.id,
      name: invite.serverName,
      imageUrl: invite.serverIcon,
      members: [],
      channels: []
    };
    addServer(newServer);
    setInvites(prev => prev.filter(inv => inv.id !== invite.id));
    toast({
      title: "Server Joined",
      description: `You have successfully joined ${invite.serverName}.`,
      className: "bg-[#1B3726] border-green-500/20 text-white",
    });
  }

  const handleDeclineInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(invite => invite.id !== inviteId))
  }

  const handleAcceptFriend = (requestId: string) => {
    const request = friendRequests.find(req => req.id === requestId);
    if (request) {
      addFriend({
        id: request.id,
        name: request.username,
        imageUrl: request.avatar,
        isOnline: false
      });
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      toast({
        title: "Friend Added",
        description: `${request.username} has been added to your friends list.`,
        className: "bg-[#1B3726] border-green-500/20 text-white",
      });
    }
  };

  const handleDeclineFriend = (requestId: string) => {
    setFriendRequests(prev => prev.filter(request => request.id !== requestId))
  }

  const validateEmail = (email: string) => {
    if (!email) {
      return 'El email es requerido';
    }
    if (!email.endsWith('@tecmilenio.mx')) {
      return 'Debe ser un email de Tecmilenio';
    }
    return '';
  }

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    toast({
      title: "¡Notificación registrada!",
      description: `Te avisaremos en ${email} cuando los mensajes directos estén disponibles.`,
      className: "bg-[#1B3726] border-green-500/20 text-white",
    });

    setEmail('');
    setEmailError('');
    onClose();
  }

  const content = (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div className="bg-[#1B3726] w-full max-w-md rounded-lg shadow-xl animate-modalIn">
        <div className="p-4 border-b border-[#2A633B] flex justify-between items-center relative z-[99999]">
          <h2 className="text-xl font-semibold text-white">Inbox</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <Tabs defaultValue="invites" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-[#2A633B] border-b border-[#3A734B]">
            <TabsTrigger 
              value="invites" 
              className="flex-1 data-[state=active]:bg-[#3A734B] data-[state=active]:text-white"
            >
              Server Invites
            </TabsTrigger>
            <TabsTrigger 
              value="friends" 
              className="flex-1 data-[state=active]:bg-[#3A734B] data-[state=active]:text-white"
            >
              Friend Requests
            </TabsTrigger>
            <TabsTrigger 
              value="dms" 
              className="flex-1 data-[state=active]:bg-[#3A734B] data-[state=active]:text-white"
            >
              DMs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invites" className="p-4">
            <ScrollArea className="h-[400px]">
              {invites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Server className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-400">No pending server invites</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invites.map((invite) => (
                    <div 
                      key={invite.id}
                      className="bg-[#2A633B] rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={invite.serverIcon || "/placeholder.svg"}
                          alt={invite.serverName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-white font-medium">{invite.serverName}</h3>
                          <p className="text-sm text-gray-400">
                            Invited by {invite.invitedBy} • {invite.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeclineInvite(invite.id)}
                          className="px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptInvite(invite)}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="friends" className="p-4">
            <ScrollArea className="h-[400px]">
              {friendRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <UserPlus2 className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-400">No pending friend requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {friendRequests.map((request) => (
                    <div 
                      key={request.id}
                      className="bg-[#2A633B] rounded-lg p-4 flex items-center justify-between group hover:bg-[#3A734B] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={request.avatar || "/placeholder.svg"}
                          alt={request.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-white font-medium">{request.username}</h3>
                          <p className="text-sm text-gray-400">
                            {request.mutualFriends} mutual friends • {request.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeclineFriend(request.id)}
                          className="px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => handleAcceptFriend(request.id)}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="dms" className="p-4">
            <div className="flex flex-col items-center justify-center h-[400px] text-center bg-[#2A633B] rounded-lg">
              <AlertCircle className="w-12 h-12 text-green-400 mb-2" />
              <h3 className="text-xl font-bold text-green-400 mb-2">Próximamente: Mensajes Directos (DMs)</h3>
              <p className="text-white mb-4 px-4">
                Los mensajes directos te permitirán comunicarte de forma privada con otros usuarios. 
                Estamos finalizando los detalles para asegurar la mejor experiencia posible.
              </p>
              <form onSubmit={handleNotifySubmit} className="space-y-4 w-full max-w-xs px-4">
                <Label htmlFor="email" className="text-white block text-left">
                  ¿Quieres que te avisemos cuando esté listo?
                </Label>
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    placeholder="tu@tecmilenio.mx"
                    className={`bg-[#1B3726] border-green-500/30 text-white w-full ${
                      emailError ? 'border-red-500' : ''
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-400 text-sm">{emailError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifícame
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

