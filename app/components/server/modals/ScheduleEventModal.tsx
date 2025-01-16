'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarIcon, Clock, X, Plus, ShieldAlert } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: string
  time: string
  createdBy?: string
}

interface ScheduleEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEvent: (event: Omit<Event, 'id'>) => void
  events: Event[]
  onDeleteEvent: (id: string) => void
  canManageEvents: boolean
}

export default function ScheduleEventModal({
  isOpen,
  onClose,
  onAddEvent,
  events,
  onDeleteEvent,
  canManageEvents
}: ScheduleEventModalProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isAddingNew, setIsAddingNew] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManageEvents) return
    
    onAddEvent({ title, date, time })
    setTitle('')
    setDate('')
    setTime('')
    setIsAddingNew(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const content = (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div 
        className="bg-[#1B3726] w-full max-w-md rounded-lg shadow-xl animate-modalIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A633B]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-white">Scheduled Events</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!canManageEvents && (
            <div className="mb-4 p-3 bg-red-500/10 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-200">
                You need moderator or admin permissions to create or manage events.
              </p>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-3 mb-4">
            {events.map((event) => (
              <div 
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#2A633B]/50 group"
              >
                <div>
                  <h3 className="text-white font-medium">{event.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <CalendarIcon size={14} />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
                {canManageEvents && (
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Event Form */}
          {canManageEvents ? (
            isAddingNew ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2A633B] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#2A633B] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#2A633B] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Schedule Event
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2A633B] text-white rounded-md hover:bg-[#2A633B]/80 transition-colors"
              >
                <Plus size={18} />
                Add New Event
              </button>
            )
          ) : null}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

