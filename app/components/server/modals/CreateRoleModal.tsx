'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Permission } from '@/lib/mockData'

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateRole: (roleName: string, permissions: Permission[], color: string) => void
}

const permissionCategories = {
  'General': ['VIEW_CHANNELS', 'SEND_MESSAGES', 'ATTACH_FILES'],
  'Moderation': ['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_EVENTS'],
  'Administration': ['MANAGE_CHANNELS', 'MANAGE_ROLES']
} as const

const permissionDescriptions = {
  'MANAGE_EVENTS': 'Create and manage server events',
  'VIEW_CHANNELS': 'View channels in the server',
  'SEND_MESSAGES': 'Send messages in text channels',
  'ATTACH_FILES': 'Attach files to messages',
  'KICK_MEMBERS': 'Remove members from the server',
  'BAN_MEMBERS': 'Ban members from the server',
  'MANAGE_MESSAGES': 'Delete or pin messages',
  'MENTION_EVERYONE': 'Mention @everyone',
  'MANAGE_CHANNELS': 'Create and manage channels',
  'MANAGE_ROLES': 'Create and manage roles'
} as const

export default function CreateRoleModal({ isOpen, onClose, onCreateRole }: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
  const [roleColor, setRoleColor] = useState('#4CAF50')

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (roleName.trim()) {
      onCreateRole(roleName.trim(), selectedPermissions, roleColor)
      setRoleName('')
      setSelectedPermissions([])
      setRoleColor('#4CAF50')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1B3726] rounded-lg w-full max-w-md p-6 animate-modalIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Create New Role</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-400 mb-1">
              Role Name
            </label>
            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Moderator"
              className="bg-[#2A633B] border-green-500/30 text-white"
            />
          </div>
          <div>
            <label htmlFor="roleColor" className="block text-sm font-medium text-gray-400 mb-1">
              Role Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="roleColor"
                value={roleColor}
                onChange={(e) => setRoleColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-2 border-green-500/30"
              />
              <span className="text-white">{roleColor}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Permissions</h3>
            <ScrollArea className="h-64 rounded-md border border-green-500/30">
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <div key={category} className="mb-4 px-4">
                  <h4 className="text-white font-medium mb-2">{category}</h4>
                  {permissions.map((permission) => (
                    <div key={permission} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-white">{permission.split('_').join(' ')}</p>
                        <p className="text-xs text-gray-400">{permissionDescriptions[permission]}</p>
                      </div>
                      <Switch
                        checked={selectedPermissions.includes(permission)}
                        onCheckedChange={() => handlePermissionToggle(permission)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!roleName.trim()}>Create Role</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

