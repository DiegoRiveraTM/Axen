'use client'

import { useState } from 'react'
import { Hash, Volume2, Trash2, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Channel } from '@/lib/mockData'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ChannelsViewProps {
  channels?: Channel[]
  onDeleteChannel?: (channelId: string) => void
  onUpdateChannel?: (channelId: string, updates: Partial<Channel>) => void
  onCreateChannel?: (channel: Omit<Channel, 'id'>) => void
}

export default function ChannelsView({ 
  channels = [], 
  onDeleteChannel, 
  onUpdateChannel,
  onCreateChannel
}: ChannelsViewProps) {
  const [editingChannel, setEditingChannel] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const textChannels = channels.filter(channel => channel.type === 'text')
  const voiceChannels = channels.filter(channel => channel.type === 'voice')

  const handleStartEdit = (channel: Channel) => {
    setEditingChannel(channel.id)
    setEditValue(channel.name)
  }

  const handleSaveEdit = (channelId: string) => {
    if (editValue.trim() && onUpdateChannel) {
      onUpdateChannel(channelId, { name: editValue.trim() })
    }
    setEditingChannel(null)
    setEditValue('')
  }

  const handleCreateChannel = () => {
    if (onCreateChannel) {
      const newChannel = {
        name: 'new-channel',
        type: 'text',
        category: 'TEXT CHANNELS'
      }
      onCreateChannel(newChannel)
    }
  }

  const renderChannelList = (channelList: Channel[], icon: React.ReactNode) => (
    <div className="space-y-2">
      {channelList.map((channel) => (
        <div
          key={channel.id}
          className="group flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2A633B]/50"
        >
          {icon}
          {editingChannel === channel.id ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit(channel.id)
                if (e.key === 'Escape') {
                  setEditingChannel(null)
                  setEditValue('')
                }
              }}
              onBlur={() => {
                if (editValue.trim()) handleSaveEdit(channel.id)
                else {
                  setEditingChannel(null)
                  setEditValue('')
                }
              }}
              className="h-7 bg-[#2A633B] border-none text-white"
              autoFocus
            />
          ) : (
            <span className="text-gray-300 flex-1">{channel.name}</span>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#2A633B]"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1B3726] border-[#2A633B] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Channel</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Are you sure you want to delete the channel "{channel.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-[#2A633B] text-white hover:bg-[#2A633B]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteChannel && onDeleteChannel(channel.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  )

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Channel Settings</h1>
            <p className="text-gray-400">Manage your server channels</p>
          </div>
          <Button 
            onClick={handleCreateChannel}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Channel
          </Button>
        </div>

        <div className="space-y-6">
          {/* Text Channels */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-medium">Text Channels</h2>
              <span className="text-sm text-gray-400">{textChannels.length} channels</span>
            </div>
            {renderChannelList(textChannels, <Hash className="w-4 h-4 text-gray-400" />)}
          </div>

          {/* Voice Channels */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-medium">Voice Channels</h2>
              <span className="text-sm text-gray-400">{voiceChannels.length} channels</span>
            </div>
            {renderChannelList(voiceChannels, <Volume2 className="w-4 h-4 text-gray-400" />)}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

