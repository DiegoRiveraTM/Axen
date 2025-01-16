'use client'

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Search, Grid, Plus, Home, Inbox } from 'lucide-react'
import { useAppContext } from '@/app/contexts/AppContext'
import { Server, addServer } from '@/lib/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import CreateServerModal from '../server/CreateServerModal'
import InboxModal from './InboxModal'

const ServerBar: FC = () => {
  const router = useRouter()
  const { setCurrentServer, pinnedServers, setPinnedServers, togglePinnedServer, servers } = useAppContext()
  const [showServers, setShowServers] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isInboxOpen, setIsInboxOpen] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleServerClick = (server: Server) => {
    setCurrentServer(server)
    router.push(`/server/${server.id}`)
  }

  const handleCreateServer = (newServer: Server) => {
    addServer(newServer)
    setCurrentServer(newServer)
    router.push(`/server/${newServer.id}`)
    setIsCreateModalOpen(false)
  }

  // Filter servers based on pinned status
  const pinnedServerList = servers.filter(server => pinnedServers.includes(server.id))
  const unpinnedServerList = servers.filter(server => !pinnedServers.includes(server.id))

  return (
    <>
      <nav className={`fixed right-0 top-0 bottom-0 w-[72px] bg-[#1B3726] flex flex-col items-center py-3 space-y-2`}>
        <button 
          onClick={() => {
            document.body.style.backgroundColor = '#1a4a2e'
            setCurrentServer(null)
            router.push('/')
          }}
          className="w-10 h-10 rounded-full bg-[#2A633B] flex items-center justify-center text-white hover:bg-[#3A734B] transition-colors"
        >
          <Home size={20} />
        </button>
        <button 
          onClick={() => setIsInboxOpen(true)}
          className="w-10 h-10 rounded-full bg-[#2A633B] flex items-center justify-center text-white hover:bg-[#3A734B] transition-colors"
        >
          <Inbox size={20} />
        </button>
        {/*Removed Search Button as per update request*/}
        <button 
          onClick={() => setShowServers(!showServers)}
          className="w-10 h-10 rounded-full bg-[#2A633B] flex items-center justify-center text-white hover:bg-[#3A734B] transition-colors"
        >
          <Grid size={20} />
        </button>

        <div className="w-8 h-[2px] bg-[#2A633B] my-2" />

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-10 h-10 rounded-full bg-[#2A633B] flex items-center justify-center text-white hover:bg-[#3A734B] transition-colors"
        >
          <Plus size={20} />
        </button>

        <div className="w-8 h-[2px] bg-[#2A633B] my-2" />

        {/* Pinned servers are always visible */}
        <div className="space-y-2">
          {pinnedServerList.map((server) => (
            <button
              key={server.id}
              onClick={() => handleServerClick(server)}
              className="w-10 h-10 rounded-full bg-[#2A633B] flex items-center justify-center overflow-hidden hover:bg-[#3A734B] transition-all duration-300 ease-in-out"
            >
              <img src={server.imageUrl || "/placeholder.svg"} alt={server.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Unpinned servers can be toggled */}
        <AnimatePresence>
          {showServers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 overflow-hidden"
            >
              {unpinnedServerList.map((server) => (
                <button
                  key={server.id}
                  onClick={() => handleServerClick(server)}
                  className="w-10 h-10 rounded-full bg-[#2A633B] flex items-center justify-center overflow-hidden hover:bg-[#3A734B] transition-all duration-300 ease-in-out"
                >
                  <img src={server.imageUrl || "/placeholder.svg"} alt={server.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CreateServerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateServer={handleCreateServer}
      />

      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </>
  )
}

export default ServerBar

