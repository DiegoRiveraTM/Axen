import Image from 'next/image'
import { Member } from '@/lib/mockData'

interface MembersListProps {
  members: Member[];
}

export default function MembersList({ members }: MembersListProps) {
  return (
    <div className="bg-[#1B3726] w-full h-full flex flex-col">
      <div className="p-2">
        <div className="bg-black/20 backdrop-blur-sm rounded-md p-2 mb-2">
          <span className="text-white block text-center text-lg">Members</span>
        </div>
        <div className="bg-black/20 backdrop-blur-sm rounded-md items-center p-2">
          <input
            type="text"
            placeholder="Search Someone"
            className="flex-1 bg-transparent text-white/50 text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center p-4 hover:bg-[#2A633B] cursor-pointer"
          >
            <div className="w-8 h-8 mr-3 relative">
              <Image
                src={member.imageUrl || "/placeholder.svg"}
                alt={`${member.name}'s profile`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <span className="text-white text-lg flex-1">{member.name}</span>
            <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

