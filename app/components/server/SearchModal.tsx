'use client'

import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchModal({ isOpen, onClose, onSearch, initialQuery = '' }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#1B3726] w-full max-w-md rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Search Messages</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Enter search query..."
            className="flex-grow p-2 rounded-l-md bg-[#2A633B] text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors"
          >
            <Search size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

