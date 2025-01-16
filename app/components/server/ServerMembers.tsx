import { User } from 'lucide-react'

interface Member {
  id: string;
  name: string;
  isOnline: boolean;
  imageUrl?: string;
}

interface ServerMembersProps {
  members: Member[];
}

export default function ServerMembers({ members }: ServerMembersProps) {
  return (
    <div className="bg-[#1B3726] w-60 h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="p-2 border-b border-[#2a3f2a]">
        <div className="bg-black/20 backdrop-blur-sm rounded-md p-2 mb-2">
          <span className="text-white block text-center text-lg">Members</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center p-4 hover:bg-[#2A633B] cursor-pointer"
          >
            <div className="w-8 h-8 mr-3 relative">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-full h-full text-green-400" />
              )}
            </div>
            <span className="text-white text-lg flex-1">{member.name}</span>
            <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

