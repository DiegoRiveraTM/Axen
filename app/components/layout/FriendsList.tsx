import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Plus, Link, UserPlus, Menu, X, Trash2 } from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import * as api from '@/lib/api';
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

interface Friend {
  name: string;
  isOnline: boolean;
  imageUrl: string;
  id: string;
}

export default function FriendsList() {
  const { toast } = useToast()
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null)

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.getFriends();
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
        // Manejar el error
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleCopyInviteLink = () => {
    const inviteLink = "https://tecmilenio.chat/invite/xyz123"
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        className: "bg-[#1B3726] border border-green-500/20 text-white",
        title: "Invite Link Copied!",
        description: "The invite link has been copied to your clipboard",
        action: (
          <ToastAction altText="Close" className="border border-green-500/20 hover:bg-green-500/10 text-green-400">
            Close
          </ToastAction>
        ),
      })
    })
  }

  const handleAddFriend = async (username: string) => {
    try {
      await api.sendFriendRequest(username);
      toast({
        className: "bg-[#1B3726] border border-green-500/20 text-white",
        title: "Friend Request Sent",
        description: `A friend request has been sent to ${username}`,
        action: (
          <ToastAction altText="Close" className="border border-green-500/20 hover:bg-green-500/10 text-green-400">
            Close
          </ToastAction>
        ),
      })
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        className: "bg-[#1B3726] border border-red-500/20 text-white",
      });
    }
  }

  const createAddFriendDialog = () => {
    const dialog = document.createElement('dialog')
    
    const style = document.createElement('style')
    style.textContent = `
      dialog {
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
      }
      @keyframes modalIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-modalIn {
        animation: modalIn 0.2s ease-out;
      }
    `
    document.head.appendChild(style)
    
    dialog.innerHTML = `
      <form method="dialog" class="bg-[#1B3726] p-6 rounded-2xl shadow-xl w-[90vw] max-w-[420px] mx-auto overflow-hidden animate-modalIn">
        <div class="flex flex-col gap-6">
          <div>
            <h2 class="text-2xl font-semibold text-green-400">Add Friend</h2>
            <p class="text-gray-400 text-sm mt-1">Enter your friend's username to send them a request</p>
          </div>
          
          <div class="relative">
            <input 
              type="text" 
              id="username" 
              placeholder="Enter username" 
              class="w-full px-4 py-3 bg-[#2A633B] text-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm border-none" 
              required
            >
          </div>
          
          <div class="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              class="px-5 py-2.5 bg-[#2A633B] text-gray-300 rounded-xl hover:bg-[#3A734B] hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all duration-200 font-medium"
            >
              Send Request
            </button>
          </div>
        </div>
      </form>
    `
    document.body.appendChild(dialog)
    dialog.showModal()

    dialog.querySelector('form')?.addEventListener('submit', (e) => {
      e.preventDefault()
      const username = (dialog.querySelector('#username') as HTMLInputElement).value
      if (username) {
        handleAddFriend(username)
      }
      dialog.close()
    })

    dialog.querySelector('button[type="button"]')?.addEventListener('click', () => {
      dialog.close()
    })

    dialog.addEventListener('close', () => {
      document.body.removeChild(dialog)
      document.head.removeChild(style)
    })
  }

  const handleDeleteFriend = async (friend: Friend) => {
    try {
      await api.removeFriend(friend.id);
      setFriends(friends.filter(f => f.id !== friend.id));
      toast({
        title: "Amigo eliminado",
        description: `${friend.name} ha sido eliminado de tu lista de amigos.`,
        className: "bg-[#1B3726] border-green-500/20 text-white",
      });
      setFriendToDelete(null);
    } catch (error) {
      console.error('Error removing friend:', error);
      // Manejar el error
      toast({
        title: "Error",
        description: "Failed to remove friend. Please try again.",
        className: "bg-[#1B3726] border border-red-500/20 text-white",
      });
    }
  };

  const confirmDeleteFriend = () => {
    if (friendToDelete) {
      handleDeleteFriend(friendToDelete);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#2A633B] p-2 rounded-lg text-white hover:bg-[#3A734B] transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
        fixed lg:relative
        inset-0 lg:inset-auto
        bg-[#1B3726] 
        w-full lg:w-60 
        h-screen lg:h-[calc(100vh-3.5rem)]
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-40
      `}>
        <div className="p-2 border-b border-[#2a3f2a] mt-16 lg:mt-0">
          <div className="bg-black/20 backdrop-blur-sm rounded-md p-2 mb-2">
            <span className="text-white block text-center text-base sm:text-lg">Friends</span>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-md flex items-center p-2">
            <Input
              type="text"
              placeholder="Search Someone"
              className="flex-1 bg-transparent text-white/50 text-sm focus:outline-none border-none"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-[#2A633B] transition-colors">
                  <Plus className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1B3726] border-[#2A633B] text-white">
                <DropdownMenuItem 
                  onClick={handleCopyInviteLink}
                  className="hover:bg-[#2A633B] cursor-pointer flex items-center"
                >
                  <Link className="mr-2 h-4 w-4" />
                  <span>Send Invite Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={createAddFriendDialog}
                  className="hover:bg-[#2A633B] cursor-pointer flex items-center"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add Friend by Username</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center p-3 sm:p-4 hover:bg-[#2A633B] cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center flex-1 min-w-0">
                  <span className="text-white text-sm sm:text-base lg:text-lg truncate mr-2">{friend.name}</span>
                  <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                      src={friend.imageUrl || "/placeholder.svg"}
                      alt={`${friend.name}'s profile`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${friend.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFriendToDelete(friend);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>

      <AlertDialog open={!!friendToDelete} onOpenChange={(open) => setFriendToDelete(open ? friendToDelete : null)}>
        <AlertDialogContent className="bg-[#1B3726] border-[#2A633B] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar amigo?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar a {friendToDelete?.name} de tu lista de amigos? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2A633B] text-white hover:bg-[#3A734B]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFriend}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

