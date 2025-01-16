'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Shield, ChevronDown, Check, Users, Lock, Calendar } from 'lucide-react'
import type { Role, Permission } from '@/lib/mockData'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import CreateRoleModal from '../modals/CreateRoleModal'

interface RolesViewProps {
  roles: Role[]
  onCreateRole: (role: Omit<Role, 'id'>) => void
  onUpdateRole: (roleId: string, updates: Partial<Role>) => void
  onDeleteRole: (roleId: string) => void
}

const permissionCategories = {
  'General': ['VIEW_CHANNELS', 'SEND_MESSAGES', 'ATTACH_FILES'],
  'Moderation': ['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_EVENTS'],
  'Administration': ['MANAGE_CHANNELS', 'MANAGE_ROLES']
} as const

const categoryIcons = {
  'General': Users,
  'Moderation': Shield,
  'Administration': Lock,
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

export default function RolesView({
  roles,
  onCreateRole,
  onUpdateRole,
  onDeleteRole
}: RolesViewProps) {
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const getPermissionCount = (role: Role, category: keyof typeof permissionCategories) => {
    return permissionCategories[category].filter(p => role.permissions.includes(p)).length
  }

  const renderPermissionItem = (permission: Permission, role: Role) => {
    const isEnabled = role.permissions.includes(permission)
    
    return (
      <TooltipProvider key={permission}>
        <Tooltip>
          <TooltipTrigger asChild>
            <label
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#2A633B]/30 cursor-pointer group transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {permission.split('_').join(' ')}
                </div>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={(checked) => {
                  const newPermissions = checked
                    ? [...role.permissions, permission]
                    : role.permissions.filter((p) => p !== permission)
                  onUpdateRole(role.id, { permissions: newPermissions })
                }}
              />
            </label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{permissionDescriptions[permission]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const handleCreateRole = (roleName: string, permissions: Permission[], color: string) => {
    onCreateRole({
      name: roleName,
      permissions,
      color
    })
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-full">
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Roles</h2>
              <p className="text-sm text-gray-400">Manage permissions for different user roles</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus size={16} />
            Create Role
          </Button>
        </motion.div>

        <Separator className="bg-gray-800" />

        <div className="space-y-4">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1B3726] rounded-lg overflow-hidden border border-[#2A633B]/30 transition-all duration-200 hover:border-[#2A633B] shadow-lg"
            >
              <div className="p-4 flex items-center justify-between bg-[#1B3726]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-[#1B3726]"
                    style={{ backgroundColor: role.color }}
                  />
                  {editingRole === role.id ? (
                    <Input
                      value={role.name}
                      onChange={(e) => onUpdateRole(role.id, { name: e.target.value })}
                      onBlur={() => setEditingRole(null)}
                      autoFocus
                      className="h-8 w-48 bg-[#2A633B] border-green-500/30 text-white"
                    />
                  ) : (
                    <h3 className="text-white font-medium text-lg">{role.name}</h3>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingRole(role.id)}
                        >
                          <Pencil size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit role name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteRole(role.id)}
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete role</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                  >
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform duration-200 ${
                        expandedRole === role.id ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {expandedRole === role.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(Object.entries(permissionCategories) as [keyof typeof permissionCategories, Permission[]][]).map(([category, permissions]) => {
                      const CategoryIcon = categoryIcons[category]
                      return (
                        <div key={category} className="px-4 py-3 border-t border-[#2A633B]/30">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-1 rounded-md ${getCategoryColor(category)}`}>
                              <CategoryIcon size={16} />
                            </div>
                            <span className="font-medium text-white">{category}</span>
                            <Badge variant="secondary" className="rounded-full">
                              {getPermissionCount(role, category)}/{permissions.length}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {permissions.map((permission) => renderPermissionItem(permission, role))}
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRole={handleCreateRole}
      />
    </ScrollArea>
  )
}

function getCategoryColor(category: keyof typeof permissionCategories): string {
  const colors = {
    'General': 'bg-blue-500/20 text-blue-500',
    'Moderation': 'bg-yellow-500/20 text-yellow-500',
    'Administration': 'bg-red-500/20 text-red-500',
  }
  return colors[category] || 'bg-gray-500/20 text-gray-500'
}

