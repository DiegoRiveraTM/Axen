'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainContent from './components/layout/MainContent'
import FriendsList from './components/layout/FriendsList'
import ServerBar from './components/layout/ServerBar'
import UserStatus from './components/layout/UserStatus'
import WelcomeModal from '@/components/WelcomeModal'
import { useAppContext } from './contexts/AppContext'

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const { isAuthenticated, user } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null // O podrías mostrar un componente de carga aquí
  }

  return (
    <main className="flex h-screen overflow-hidden">
      <div className="flex flex-col">
        <FriendsList />
        <UserStatus career={user.career || "programming"} />
      </div>
      <MainContent />
      <ServerBar />
      {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} />}
    </main>
  )
}

