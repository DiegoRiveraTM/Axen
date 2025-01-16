'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const MainContent = () => {
  const [isExiting, setIsExiting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsExiting(false)
  }, [])

  const handleServerClick = () => {
    setIsExiting(true)
    const element = document.querySelector('.flex-1.flex.flex-col')
    if (element) {
      element.classList.add('bg-green-500')
    }
    setTimeout(() => {
      router.push('/server/1')
    }, 300)
  }

  return (
    <div className={`flex-1 flex flex-col bg-[#1E5B2F] h-screen transition-all duration-300 ${
      isExiting ? 'opacity-0 bg-green-500' : 'opacity-100'
    }`}>
      <div className="h-14 bg-[#1B3726] w-full">
        {/* Header container */}
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-2">Universidad</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Tecmilenio</h2>
        <p className="text-gray-300 text-sm">Pick a chat or a server to start</p>
        
        <button
          onClick={handleServerClick}
          className="mt-4 px-6 py-2 bg-[#2A633B] text-white rounded-md hover:bg-[#3A734B] transition-colors"
        >
          Join Test Server
        </button>
      </div>
    </div>
  )
}

export default MainContent

