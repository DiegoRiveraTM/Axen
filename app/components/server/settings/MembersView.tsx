'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Users, Shield, Crown, MoreVertical, UserPlus, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Tipos de datos
interface Member {
  id: string
  name: string
  imageUrl: string
  role: string
  isOnline: boolean
}

interface Role {
  id: string
  name: string
  color: string
}

interface MembersViewProps {
  server: {
    name: string
    members: Member[]
  }
}

// Datos de ejemplo
const roles: Role[] = [
  { id: 'all', name: 'All Roles', color: '#FFFFFF' },
  { id: '1', name: 'Admin', color: '#FF6B6B' },
  { id: '2', name: 'Moderator', color: '#4ECDC4' },
  { id: '3', name: 'Member', color: '#45B7D1' },
]

const members: Member[] = [
  { id: '1', name: 'Alice Johnson', imageUrl: '/images/alice.jpg', role: 'Admin', isOnline: true },
  { id: '2', name: 'Bob Smith', imageUrl: '/images/bob.jpg', role: 'Moderator', isOnline: false },
  { id: '3', name: 'Charlie Brown', imageUrl: '/images/charlie.jpg', role: 'Member', isOnline: true },
  { id: '4', name: 'Diana Prince', imageUrl: '/images/diana.jpg', role: 'Member', isOnline: true },
  { id: '5', name: 'Ethan Hunt', imageUrl: '/images/ethan.jpg', role: 'Moderator', isOnline: false },
]

export default function MembersView({ server }: MembersViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [isComboBoxOpen, setIsComboBoxOpen] = useState(false)
  const comboBoxRef = useRef<HTMLDivElement>(null)

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRole === 'all' || member.role === roles.find(r => r.id === selectedRole)?.name)
  )

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId)
    setIsComboBoxOpen(false)
  }

  const toggleComboBox = () => {
    setIsComboBoxOpen(!isComboBoxOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboBoxRef.current && !comboBoxRef.current.contains(event.target as Node)) {
        setIsComboBoxOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div 
          className="flex items-center" // Changed class name
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Members</h2>
              <p className="text-sm text-gray-400">Manage server members and their roles</p>
            </div>
          </div>
          
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#2A633B] border-none text-white"
            />
          </div>
          <div className="relative" ref={comboBoxRef}>
            <Button
              onClick={toggleComboBox}
              className="w-[200px] justify-between bg-[#2A633B] border-none text-white"
            >
              {roles.find(role => role.id === selectedRole)?.name || "Filter by role"}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isComboBoxOpen ? 'rotate-180' : ''}`} />
            </Button>
            {isComboBoxOpen && (
              <div className="absolute z-10 w-[200px] mt-2 bg-[#1B3726] border border-[#2A633B] rounded-md shadow-lg">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="px-4 py-2 hover:bg-[#2A633B] cursor-pointer text-white"
                    onClick={() => handleRoleChange(role.id)}
                  >
                    {role.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-[#1B3726] rounded-lg p-4 flex items-center justify-between border border-[#2A633B]/30 hover:border-[#2A633B] shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1B3726] ${member.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
                <div>
                  <h3 className="text-white font-medium">{member.name}</h3>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs px-2 py-1 rounded-full" 
                      style={{ 
                        backgroundColor: roles.find(r => r.name === member.role)?.color + '20',
                        color: roles.find(r => r.name === member.role)?.color 
                      }}
                    >
                      {member.role}
                    </span>
                    {member.role === 'Admin' && <Crown size={14} className="text-yellow-500" />}
                    {member.role === 'Moderator' && <Shield size={14} className="text-blue-500" />}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#2A633B] border-[#3A734B] text-white">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#3A734B]" />
                  <DropdownMenuItem className="hover:bg-[#3A734B] cursor-pointer">
                    Change Role
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#3A734B] cursor-pointer">
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#3A734B]" />
                  <DropdownMenuItem className="text-red-400 hover:bg-[#3A734B] hover:text-red-400 cursor-pointer">
                    Kick Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

