'use client'

import { useState } from 'react'
import { Ban, UserX2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { useToast } from "@/components/ui/use-toast"

interface BannedUser {
  id: string
  name: string
  imageUrl: string
  bannedAt: string
  reason: string
}

// Mock data for banned users
const mockBannedUsers: BannedUser[] = [
  {
    id: '1',
    name: 'John Doe',
    imageUrl: '/images/user-avatar.jpg',
    bannedAt: '2024-01-05',
    reason: 'Spam in multiple channels'
  },
  {
    id: '2',
    name: 'Jane Smith',
    imageUrl: '/images/user-avatar.jpg',
    bannedAt: '2024-01-08',
    reason: 'Inappropriate behavior'
  }
]

interface BansViewProps {
  onUnbanUser?: (userId: string) => void
}

export default function BansView({ onUnbanUser }: BansViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>(mockBannedUsers)
  const { toast } = useToast()
  const [openDialogUserId, setOpenDialogUserId] = useState<string | null>(null);

  const filteredUsers = bannedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUnban = (userId: string, userName: string) => {
    console.log('Unban button clicked for:', userName);
    setOpenDialogUserId(null);
    
    // Simulate a loading state
    toast({
      title: "Unbanning user...",
      description: `Please wait while we process the unban for ${userName}.`,
      variant: "default",
      className: "bg-[#1B3726] border-green-500/20 text-white",
    });

    // Simulate an API call with a delay
    setTimeout(() => {
      if (onUnbanUser) {
        onUnbanUser(userId);
      }
      setBannedUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "User Unbanned",
        description: `${userName} has been unbanned and can now rejoin the server.`,
        variant: "default",
        className: "bg-[#1B3726] border-green-500/20 text-white",
      });
    }, 1500); // 1.5 second delay to simulate backend processing
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/20 p-3 rounded-full">
            <Ban className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Banned Users</h2>
            <p className="text-sm text-gray-400">Manage banned users in your server</p>
          </div>
        </div>

        <div className="relative">
          <Input
            placeholder="Search banned users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#2A633B] border-none text-white"
          />
        </div>

        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserX2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No banned users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-[#1B3726] rounded-lg p-4 flex items-center justify-between border border-[#2A633B]/30 hover:border-[#2A633B] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.imageUrl || "/placeholder.svg"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-medium">{user.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-400">
                        Banned on: {new Date(user.bannedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-red-400">
                        Reason: {user.reason}
                      </span>
                    </div>
                  </div>
                </div>

                <AlertDialog open={openDialogUserId === user.id} onOpenChange={(isOpen) => setOpenDialogUserId(isOpen ? user.id : null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-green-500 hover:text-green-400 hover:bg-[#2A633B]"
                    >
                      Unban
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#1B3726] border-[#2A633B] text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unban User</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to unban {user.name}? They will be able to join the server again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-[#2A633B] text-white hover:bg-[#2A633B]">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleUnban(user.id, user.name);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Confirm Unban
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          )}
        </div>
      </div>
    </ScrollArea>
  )
}

