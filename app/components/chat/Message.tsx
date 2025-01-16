'use client'

import type { FC, ReactNode } from 'react'
import { useState, useRef, useEffect } from 'react'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import { SmilePlus, Reply, MoreHorizontal, Flag, X } from 'lucide-react'
import type { Message as MessageType } from '@/lib/mockData'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MessageProps {
  username: string;
  messages: MessageType[];
  userImage: string | StaticImageData;
  isNew?: boolean;
  highlightText: (text: string) => ReactNode;
  onReply: (messageId: string) => void;
}

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface ReactionsRecord {
  [messageId: string]: {
    [emoji: string]: Reaction;
  };
}

const EMOJI_LIST = ['😊', '😂', '🤔', '👍', '❤️', '🎉', '🔥', '👀', '🙌', '💯']

const Message: FC<MessageProps> = ({ username, messages, userImage, isNew, highlightText, onReply }) => {
  const [showActions, setShowActions] = useState(false)
  const [reactions, setReactions] = useState<ReactionsRecord>({})
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [isReported, setIsReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const reportReasons = [
    "Inappropriate content",
    "Harassment",
    "Spam",
    "Off-topic",
    "Other"
  ];

  const handleReaction = (emoji: string, messageId: string) => {
    setReactions(prev => {
      const messageReactions = prev[messageId] || {};
      const current = messageReactions[emoji] || { emoji, count: 0, userReacted: false };

      if (current.userReacted) {
        // Remove reaction
        if (current.count === 1) {
          const { [emoji]: _, ...rest } = messageReactions;
          return { ...prev, [messageId]: rest };
        }
        return {
          ...prev,
          [messageId]: {
            ...messageReactions,
            [emoji]: {
              ...current,
              count: current.count - 1,
              userReacted: false
            }
          }
        };
      } else {
        // Add reaction
        return {
          ...prev,
          [messageId]: {
            ...messageReactions,
            [emoji]: {
              ...current,
              count: current.count + 1,
              userReacted: true
            }
          }
        };
      }
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleReportMessage = () => {
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (reportReason) {
      setIsReported(true);
      console.log('Message reported for:', reportReason);
      setShowReportModal(false);
      setReportReason('');
      setTimeout(() => setIsReported(false), 2000);
    }
  };

  const handleReply = (messageId: string) => {
    onReply(messageId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenuPos(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className="flex items-start p-2 hover:bg-[#2A633B] group transition-colors relative bg-[#1E5B2F]"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onContextMenu={handleContextMenu}
    >
      <div className="w-10 h-10 relative mr-3 flex-shrink-0">
        <Image
          src={userImage || "/placeholder.svg"}
          alt={username}
          width={40}
          height={40}
          className="rounded-full"
        />
        {isNew && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1E5B2F]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-medium text-white">{username}</span>
          <span className="text-xs text-gray-400/60">{messages[0].timestamp}</span>
        </div>
        <div className="space-y-1">
          {messages.map((message) => (
            <div key={message.id} className="group/message relative pl-6">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-[#3A734B]">
                      <SmilePlus size={16} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-[320px] bg-[#1B3726] border-[#2A633B] p-2"
                    align="start"
                    sideOffset={5}
                  >
                    <ScrollArea className="h-[100px] w-full">
                      <div className="grid grid-cols-5 gap-1">
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(emoji, message.id)}
                            className={`
                              p-2 rounded hover:bg-[#2A633B] transition-colors text-lg
                              ${reactions[message.id]?.[emoji]?.userReacted ? 'bg-[#2A633B]' : ''}
                            `}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-white/90 text-sm break-words">
                {highlightText(message.content)}
              </p>
              {message.image && (
                <div className="mt-2 max-w-md">
                  <Image
                    src={message.image || "/placeholder.svg"}
                    alt="Attached image"
                    width={400}
                    height={300}
                    className="rounded-md object-contain"
                  />
                </div>
              )}
              {reactions[message.id] && Object.keys(reactions[message.id]).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(reactions[message.id]).map(([emoji, reaction]) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji, message.id)}
                      className={`
                        flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all
                        ${reaction.userReacted 
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                          : 'bg-[#2A633B] text-white/90 hover:bg-[#3A734B]'
                        }
                      `}
                    >
                      <span>{emoji}</span>
                      <span className="text-xs opacity-80">{reaction.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1B3726] rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Report Message</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowReportModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <RadioGroup value={reportReason} onValueChange={setReportReason}>
              {reportReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="text-white">{reason}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white" 
              onClick={submitReport}
              disabled={!reportReason}
            >
              Submit Report
            </Button>
          </div>
        </div>
      )}

      {showActions && (
        <div className="absolute right-4 top-2 flex items-center gap-2 bg-[#2A633B] rounded-md px-2 py-1 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-white/60 hover:text-white transition-colors">
                <SmilePlus size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[320px] bg-[#1B3726] border-[#2A633B] p-2"
              align="end"
              sideOffset={5}
            >
              <ScrollArea className="h-[100px] w-full">
                <div className="grid grid-cols-5 gap-1">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji, messages[0].id)} 
                      className={`
                        p-2 rounded hover:bg-[#2A633B] transition-colors text-lg
                        ${reactions[messages[0].id]?.[emoji]?.userReacted ? 'bg-[#2A633B]' : ''}
                      `}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <button 
            onClick={() => handleReply(messages[0].id)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Reply size={16} />
          </button>
          <button 
            onClick={handleReportMessage}
            className={`text-white/60 hover:text-white transition-colors ${isReported ? 'animate-flag-report' : ''}`}
          >
            <Flag size={16} className={isReported ? 'text-red-500' : ''} />
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      )}
      {contextMenuPos && (
        <div
          ref={contextMenuRef}
          className="absolute z-50 bg-[#1B3726] border border-[#2A633B] rounded-md shadow-lg py-1"
          style={{ 
            top: contextMenuPos.y - 100, 
            left: Math.min(contextMenuPos.x - 100, window.innerWidth - 200)
          }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A633B] flex items-center"
            onClick={handleReportMessage}
          >
            <Flag className="mr-2 h-4 w-4" />
            Report Message
          </button>
        </div>
      )}
    </div>
  )
}

export default Message

