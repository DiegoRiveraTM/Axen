'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, X, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
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
import { useRouter } from 'next/navigation';

interface UserSettingsProps {
  onClose: () => void;
}

interface Server {
  id: string;
  name: string;
  imageUrl: string;
  joinedAt: string;
}

interface Friend {
  id: string;
  name: string;
  imageUrl: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
}

interface HelpItem {
  question: string;
  answer: string;
}

// Simulated user servers data
const userServers: Server[] = [
  { id: '1', name: 'Tecmilenio Chat', imageUrl: '/images/tecmilenio-logo.png', joinedAt: '2023-05-15' },
  { id: '2', name: 'Gaming Hub', imageUrl: '/images/gaming-hub.png', joinedAt: '2023-06-01' },
  { id: '3', name: 'Study Group', imageUrl: '/images/study-group.png', joinedAt: '2023-06-10' },
  { id: '4', name: 'Meme Central', imageUrl: '/images/meme-central.png', joinedAt: '2023-07-01' },
  { id: '5', name: 'Coding Challenges', imageUrl: '/images/coding-challenges.png', joinedAt: '2023-07-15' },
  { id: '6', name: 'Book Club', imageUrl: '/images/book-club.png', joinedAt: '2023-08-01' },
  { id: '7', name: 'Music Lovers', imageUrl: '/images/music-lovers.png', joinedAt: '2023-08-15' },
  { id: '8', name: 'Fitness Freaks', imageUrl: '/images/fitness-freaks.png', joinedAt: '2023-09-01' },
  { id: '9', name: 'Travel Enthusiasts', imageUrl: '/images/travel-enthusiasts.png', joinedAt: '2023-09-15' },
  { id: '10', name: 'Movie Buffs', imageUrl: '/images/movie-buffs.png', joinedAt: '2023-10-01' },
];

const initialFriends: Friend[] = [
  { id: '1', name: 'Alice Johnson', imageUrl: '/images/alice.jpg', status: 'online' },
  { id: '2', name: 'Bob Smith', imageUrl: '/images/bob.jpg', status: 'offline' },
  { id: '3', name: 'Charlie Brown', imageUrl: '/images/charlie.jpg', status: 'idle' },
  { id: '4', name: 'Diana Prince', imageUrl: '/images/diana.jpg', status: 'dnd' },
  { id: '5', name: 'Ethan Hunt', imageUrl: '/images/ethan.jpg', status: 'online' },
  { id: '6', name: 'Fiona Gallagher', imageUrl: '/images/fiona.jpg', status: 'offline' },
  { id: '7', name: 'George Weasley', imageUrl: '/images/george.jpg', status: 'idle' },
  { id: '8', name: 'Hermione Granger', imageUrl: '/images/hermione.jpg', status: 'online' },
  { id: '9', name: 'Ian Malcolm', imageUrl: '/images/ian.jpg', status: 'dnd' },
  { id: '10', name: 'Julia Roberts', imageUrl: '/images/julia.jpg', status: 'offline' },
  { id: '11', name: 'Kevin Hart', imageUrl: '/images/kevin.jpg', status: 'online' },
  { id: '12', name: 'Luna Lovegood', imageUrl: '/images/luna.jpg', status: 'idle' },
];

const helpItems: HelpItem[] = [
  {
    question: "How do I join a server?",
    answer: "To join a server, you need an invite link. Click on the '+' icon in the server list, then select 'Join a Server' and paste the invite link."
  },
  {
    question: "How do I create a new server?",
    answer: "Click on the '+' icon in the server list, then select 'Create a Server'. Follow the prompts to set up your new server, including choosing a name and icon."
  },
  {
    question: "How do I add friends?",
    answer: "To add a friend, click on the 'Add Friend' button in the Friends list. You can add friends by their username or by sharing your friend code."
  },
  {
    question: "How do I change my profile picture?",
    answer: "Go to User Settings > My Account. Click on your current profile picture and select a new image to upload."
  },
  {
    question: "How do I create a new channel in a server?",
    answer: "In a server where you have the necessary permissions, click on the '+' icon next to the channel category (e.g., TEXT CHANNELS). Name your channel and select its type (text or voice)."
  },
  {
    question: "How do I mute a channel or server?",
    answer: "Right-click on the channel or server name and select 'Mute'. You can choose to mute for a specific duration or until you turn it back on."
  },
  {
    question: "How do I use voice channels?",
    answer: "To join a voice channel, simply click on the voice channel name. To leave, click on the disconnect icon in the voice status panel."
  },
  {
    question: "How do I share my screen in a voice channel?",
    answer: "While in a voice channel, click on the 'Share Screen' button in the voice status panel. Select which application or screen you want to share."
  },
  {
    question: "How do I change my online status?",
    answer: "Click on your profile picture at the bottom of the friends list and select your desired status: Online, Idle, Do Not Disturb, or Invisible."
  },
  {
    question: "How do I report inappropriate behavior?",
    answer: "Right-click on the message, user, or server in question and select 'Report'. Follow the prompts to submit your report to our moderation team."
  }
];

const navigationItems = {
    'ACCOUNT SETTINGS': [
      { id: 'my-account', label: 'My account' },
      { id: 'servers', label: 'Servers' },
      { id: 'friends', label: 'Friends List' },
    ],
    'APP SETTINGS': [
      { id: 'help', label: 'Help' },
    ]
  }


export default function UserSettings({ onClose }: UserSettingsProps) {
  const [activeSection, setActiveSection] = useState('my-account')
  const [isClosing, setIsClosing] = useState(false)
  const [servers, setServers] = useState<Server[]>(userServers);
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const { toast } = useToast()
  const router = useRouter();

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  useEffect(() => {
    console.log('Servers updated:', servers);
  }, [servers]);

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleLeaveServer = (serverId: string, serverName: string) => {
    setServers(prevServers => prevServers.filter(server => server.id !== serverId));
    toast({
      title: "Server Left",
      description: `You have left the server "${serverName}".`,
    })
  };

  const handleDeleteFriend = (friendId: string) => {
    setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
    toast({
      title: "Friend Removed",
      description: "The friend has been removed from your list.",
    });
  };

  const toggleQuestion = (question: string) => {
    setExpandedQuestions(prev => 
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'servers':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Servers</h2>
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              {servers.map((server) => (
                <div key={server.id} className="bg-[#1B3726] rounded-lg p-4 mb-4 flex items-center justify-between group hover:bg-[#2A633B] transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={server.imageUrl || "/placeholder.svg"}
                        alt={server.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{server.name}</h3>
                      <p className="text-gray-400 text-sm">Joined: {new Date(server.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Leave
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1B3726] border-[#2A633B] text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          This action cannot be undone. You will need to be invited again to rejoin this server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#2A633B] text-white hover:bg-[#3A734B]">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleLeaveServer(server.id, server.name)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Leave Server
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </ScrollArea>
          </div>
        );
      case 'friends':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Friends</h2>
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              {friends.map((friend) => (
                <div key={friend.id} className="bg-[#1B3726] rounded-lg p-4 mb-4 flex items-center justify-between group hover:bg-[#2A633B] transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={friend.imageUrl || "/placeholder.svg"}
                        alt={friend.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1B3726] ${
                        friend.status === 'online' ? 'bg-green-500' :
                        friend.status === 'idle' ? 'bg-yellow-500' :
                        friend.status === 'dnd' ? 'bg-red-700' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{friend.name}</h3>
                      <p className="text-gray-400 text-sm capitalize">{friend.status}</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1B3726] border-[#2A633B] text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to remove {friend.name} from your friends list? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#2A633B] text-white hover:bg-[#3A734B]">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteFriend(friend.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Remove Friend
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </ScrollArea>
          </div>
        );
      case 'help':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Help Center</h2>
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              {helpItems.map((item, index) => (
                <div key={index} className="bg-[#1B3726] rounded-lg p-4 mb-4">
                  <button
                    className="w-full text-left flex justify-between items-center text-white hover:text-green-400 transition-colors"
                    onClick={() => toggleQuestion(item.question)}
                  >
                    <span className="font-medium">{item.question}</span>
                    {expandedQuestions.includes(item.question) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  {expandedQuestions.includes(item.question) && (
                    <p className="mt-2 text-gray-300">{item.answer}</p>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        );
      case 'my-account':
      default:
        return (
          <>
            <h1 className="text-4xl font-bold text-white mb-8">My Account</h1>

            <div className="bg-[#1B3726] rounded-lg p-4 flex items-center mb-8">
              <div className="w-16 h-16 relative mr-4">
                <Image
                  src="/images/user-avatar.jpg"
                  alt="CrankySinger"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">CrankySinger</h2>
                <p className="text-gray-400">Ingeniería en Desarrollo de Software</p>
                <p className="text-gray-400">45415852@tecmilenio.mx</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1B3726] rounded-lg p-6">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-white/60">USERNAME</h3>
                  <Button variant="secondary" size="sm" className="bg-[#2A633B] hover:bg-[#3A734B] text-white">
                    Edit
                  </Button>
                </div>
                <p className="text-white text-lg">CrankySinger</p>
              </div>

              <div className="bg-[#1B3726] rounded-lg p-6">
                <h3 className="text-sm font-medium text-white/60 mb-1">EMAIL</h3>
                <p className="text-white text-lg">45415852@tecmilenio.mx</p>
              </div>

              <div className="bg-[#1B3726] rounded-lg p-6">
                <h3 className="text-sm font-medium text-white/60 mb-1">CAREER</h3>
                <p className="text-white text-lg">Ingeniería en Desarrollo de Software</p>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-lg font-medium text-white/80 mb-4">OTHER SETTINGS</h3>
              <Button 
                variant="destructive" 
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                DELETE ACCOUNT
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#1E5B2F] flex w-screen h-screen ${isClosing ? 'animate-modalOut' : 'animate-modalIn'}`}>
      {/* Left Sidebar */}
      <div className={`w-72 bg-[#1B3726] flex flex-col ${isClosing ? 'animate-slideOut' : 'animate-[slideIn_0.3s_ease-out]'}`}>
        <div className="p-4">
          <button 
            onClick={handleClose}
            className="flex items-center text-white/80 hover:text-white gap-2 mb-4"
          >
            <ArrowLeft size={20} />
            Settings
          </button>

          {Object.entries(navigationItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-xs font-semibold text-white/60 px-2 mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full px-2 py-1.5 rounded text-left ${
                      activeSection === item.id
                        ? 'bg-[#2A633B] text-white'
                        : 'text-white/70 hover:bg-[#2A633B]/50 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full px-2 py-1.5 rounded text-left text-red-400 hover:bg-[#2A633B]/50">
                Log Out
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1B3726] border-[#2A633B] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Log Out</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Are you sure you want to log out? You will need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#2A633B] text-white hover:bg-[#3A734B]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => {
                    router.push('/login')
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Log Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mt-auto p-4 flex items-center">
          <div className="w-10 h-10 relative mr-3">
            <Image
              src="/images/user-avatar.jpg"
              alt="CrankySinger"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="text-white text-sm font-medium">CrankySinger</h3>
            <p className="text-green-400/70 text-xs">Ingeniería en Desarrollo de Software</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  )
}

