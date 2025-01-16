'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { Smile, Send, Reply, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
}

const EMOJI_LIST = [
  '👍', '👎', '❤️', '🥳', '🤔', '😊', '🙌', '👏', '💡', '❓',
  '✅', '✏️', '📌', '📚', '🖊️', '🖋️', '🧠', '🎓', '📖', '📝'
]

export default function MessageInput({ onSendMessage, replyingTo, onCancelReply }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      //Removed paste handling
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      //Removed drag handling
    }

    const handleDragLeave = (e: DragEvent) => {
      //Removed drag handling
    }

    const handleDrop = (e: DragEvent) => {
      //Removed drag handling
    }

    const dropZone = null//dropZoneRef.current
    if (dropZone) {
      dropZone.addEventListener('dragover', handleDragOver)
      dropZone.addEventListener('dragleave', handleDragLeave)
      dropZone.addEventListener('drop', handleDrop)

      return () => {
        dropZone.removeEventListener('dragover', handleDragOver)
        dropZone.removeEventListener('dragleave', handleDragLeave)
        dropZone.removeEventListener('drop', handleDrop)
      }
    }
  }, [])


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
      onCancelReply()
    }
  }

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1B3726] px-4 pr-[72px] flex flex-col w-full">
      {replyingTo && (
        <div className="bg-[#2A633B] px-4 py-1.5 flex justify-between items-center border-t border-b border-[#3A734B]">
          <div className="flex items-center gap-2">
            <Reply size={14} className="text-green-400" />
            <span className="text-sm text-green-400 font-medium">Replying to a message</span>
          </div>
          <button 
            onClick={onCancelReply} 
            className="text-xs text-gray-300 hover:text-white transition-colors hover:underline"
          >
            Cancel
          </button>
        </div>
      )}


      <div className="flex items-center bg-[#2A633B] rounded-lg px-2 h-10 w-full my-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-[#1B3726]/50"
              aria-label="Add emoji"
            >
              <Smile size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[320px] bg-[#1B3726] border-[#2A633B] p-2"
            align="start"
            sideOffset={5}
          >
            <ScrollArea className="h-[200px] w-full">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="p-2 rounded hover:bg-[#2A633B] transition-colors text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm mx-2"
        />
        
        <button
          type="submit"
          className={`text-white p-2 rounded-full transition-colors ${
            message.trim()
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-500 cursor-not-allowed'
          }`}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  )
}

