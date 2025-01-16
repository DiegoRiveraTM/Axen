'use client'

import { FC, useRef, useEffect, useState } from 'react'
import { X, ChevronUp, ChevronDown } from 'lucide-react'
import Message from './Message'
import type { Message as MessageType } from '@/lib/mockData'
import { getMemberById } from '@/lib/mockData'

interface MessageListProps {
  messages: MessageType[];
  serverId: string;
  searchQuery: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onReply: (messageId: string) => void;
}

const MessageList: FC<MessageListProps> = ({ messages, serverId, searchQuery, onSearch, onClearSearch, onReply }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const matchRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [allMatches, setAllMatches] = useState<Array<{ text: string; index: number }>>([]);

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 1
      setShouldScrollToBottom(scrolledToBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, shouldScrollToBottom])

  useEffect(() => {
    if (searchQuery) {
      // Reset matches
      const newMatches: Array<{ text: string; index: number }> = [];
      let matchCount = 0;

      messages.forEach(msg => {
        const regex = new RegExp(searchQuery, 'gi');
        let match;
        while ((match = regex.exec(msg.content)) !== null) {
          newMatches.push({
            text: match[0],
            index: matchCount++
          });
        }
      });

      setAllMatches(newMatches);
      setTotalMatches(matchCount);
      setCurrentMatchIndex(matchCount > 0 ? 1 : 0);
    } else {
      setAllMatches([]);
      setTotalMatches(0);
      setCurrentMatchIndex(0);
    }
  }, [searchQuery, messages]);

  useEffect(() => {
    if (currentMatchIndex > 0 && matchRefs.current[currentMatchIndex - 1]) {
      matchRefs.current[currentMatchIndex - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentMatchIndex]);

  const navigateMatch = (direction: 'up' | 'down') => {
    setCurrentMatchIndex(prev => {
      const newIndex = direction === 'up' 
        ? (prev > 1 ? prev - 1 : totalMatches) 
        : (prev < totalMatches ? prev + 1 : 1);
      return newIndex;
    });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-white text-xl bg-[#1E5B2F]">
        No messages yet. Start the conversation!
      </div>
    )
  }

  const groupMessages = (msgs: MessageType[]): GroupedMessage[] => {
    const groups: GroupedMessage[] = []
    let currentGroup: GroupedMessage | null = null

    msgs.forEach((msg) => {
      if (!currentGroup || currentGroup.userId !== msg.userId) {
        if (currentGroup) {
          groups.push(currentGroup)
        }
        currentGroup = {
          userId: msg.userId,
          messages: [msg]
        }
      } else {
        currentGroup.messages.push(msg)
      }
    })

    if (currentGroup) {
      groups.push(currentGroup)
    }

    return groups
  }

  const groupedMessages = groupMessages(messages)

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    let currentMatchInText = 0;

    return parts.map((part, i) => {
      if (regex.test(part)) {
        const matchIndex = allMatches.findIndex(
          match => match.text.toLowerCase() === part.toLowerCase() && 
          !match.used
        );
        
        if (matchIndex !== -1) {
          const globalMatchNumber = matchIndex + 1;
          allMatches[matchIndex].used = true;
          
          return (
            <span 
              key={i}
              ref={el => {
                if (el) {
                  matchRefs.current[globalMatchNumber - 1] = el;
                }
              }}
              className={globalMatchNumber === currentMatchIndex ? 'bg-yellow-400 text-black px-0.5' : ''}
            >
              {part}
            </span>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Reset the used flag before rendering
  allMatches.forEach(match => match.used = false);

  return (
    <div className="relative flex-1 overflow-hidden">
      {searchQuery && (
        <div className="absolute top-4 right-16 z-10 flex items-center gap-2">
          <div className="flex items-center bg-[#2A633B] rounded-md px-3 py-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent text-white text-sm w-[200px] focus:outline-none"
              placeholder="Buscar..."
            />
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#3A734B]">
              <button
                onClick={() => navigateMatch('up')}
                className="text-white/80 hover:text-white disabled:opacity-50"
                disabled={totalMatches === 0}
              >
                <ChevronUp size={16} />
              </button>
              <span className="text-sm text-white/90 min-w-[60px] text-center">
                {totalMatches > 0 ? `${currentMatchIndex} de ${totalMatches}` : '0 de 0'}
              </span>
              <button
                onClick={() => navigateMatch('down')}
                className="text-white/80 hover:text-white disabled:opacity-50"
                disabled={totalMatches === 0}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            <button
              onClick={onClearSearch}
              className="ml-2 text-white/80 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto bg-[#1E5B2F] scrollbar-thin scrollbar-thumb-[#2A633B] scrollbar-track-[#1E5B2F]"
      >
        <div className="flex flex-col py-4">
          <div className="text-center mb-6">
            <div className="w-full border-t border-white/10 relative">
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1E5B2F] px-4 text-white/60 text-sm">
                Today
              </span>
            </div>
          </div>
          {groupedMessages.map((group, groupIndex) => {
            const member = getMemberById(serverId, group.userId)
            return (
              <Message
                key={`${group.userId}-${groupIndex}`}
                username={member?.name || 'Unknown User'}
                messages={group.messages}
                userImage={member?.imageUrl || '/images/default-avatar.png'}
                isNew={groupIndex === groupedMessages.length - 1}
                highlightText={(text) => highlightText(text, searchQuery)}
                onReply={onReply}
              />
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default MessageList

type GroupedMessage = {
  userId: string;
  messages: MessageType[];
}

