export interface Member {
  id: string;
  name: string;
  imageUrl: string;
  isOnline: boolean;
  roles: string[];
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  color: string;
}

export type Permission = 
  | 'MANAGE_CHANNELS'
  | 'MANAGE_ROLES'
  | 'KICK_MEMBERS'
  | 'BAN_MEMBERS'
  | 'SEND_MESSAGES'
  | 'MANAGE_MESSAGES'
  | 'MENTION_EVERYONE'
  | 'ATTACH_FILES'
  | 'VIEW_CHANNELS'
  | 'MANAGE_EVENTS'; // Added new permission type

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  channelId: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  category?: string;
  participants?: VoiceParticipant[];
}

export interface VoiceParticipant {
  id: string;
  name: string;
  imageUrl: string;
  isMuted: boolean;
  isDeafened: boolean;
}

export interface Server {
  id: string;
  name: string;
  imageUrl: string;
  members: Member[];
  channels: Channel[];
  roles: Role[];
}

// Mock data
const roles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'KICK_MEMBERS', 'BAN_MEMBERS', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'ATTACH_FILES', 'VIEW_CHANNELS'],
    color: '#FF0000'
  },
  {
    id: '2',
    name: 'Moderator',
    permissions: ['KICK_MEMBERS', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'ATTACH_FILES', 'VIEW_CHANNELS'],
    color: '#00FF00'
  },
  {
    id: '3',
    name: 'Member',
    permissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'VIEW_CHANNELS'],
    color: '#0000FF'
  }
];

const members: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    imageUrl: '/images/user-avatar.jpg',
    isOnline: true,
    roles: ['1']
  },
  {
    id: '2',
    name: 'Jane Smith',
    imageUrl: '/images/user-avatar.jpg',
    isOnline: false,
    roles: ['2']
  },
  {
    id: '3',
    name: 'Bob Johnson',
    imageUrl: '/images/user-avatar.jpg',
    isOnline: true,
    roles: ['3']
  },
];

const messages: Message[] = [
  {
    id: '1',
    content: 'Hello everyone!',
    timestamp: '2:30 PM',
    userId: '1',
    channelId: '1',
  },
  {
    id: '2',
    content: 'Hi there!',
    timestamp: '2:31 PM',
    userId: '2',
    channelId: '1',
  },
];

const channels: Channel[] = [
  { id: '1', name: 'General', type: 'text', category: 'TEXT CHANNELS' },
  { id: '2', name: 'Announcements', type: 'text', category: 'TEXT CHANNELS' },
  { id: '3', name: 'Voice Chat', type: 'voice', category: 'VOICE CHANNELS' },
];

let servers: { [key: string]: Server } = {
  '1': {
    id: '1',
    name: 'Tecmi Group',
    imageUrl: '/images/server-icon.png',
    members: members,
    channels: channels,
    roles: roles,
  },
};

export function getMemberById(serverId: string, userId: string): Member | undefined {
  return servers[serverId]?.members.find(member => member.id === userId);
}

export function getServerById(id: string): Server | undefined {
  return servers[id];
}

export function getMessagesForServer(serverId: string): Message[] {
  return messages;
}

export function getMessagesForChannel(channelId: string): Message[] {
  return messages.filter(message => message.channelId === channelId);
}

export function getRoleById(serverId: string, roleId: string): Role | undefined {
  return servers[serverId]?.roles.find(role => role.id === roleId);
}

export function hasPermission(member: Member, permission: Permission, serverId: string): boolean {
  const server = servers[serverId];
  if (!server) return false;

  return member.roles.some(roleId => {
    const role = server.roles.find(r => r.id === roleId);
    return role?.permissions.includes(permission);
  });
}

export function addServer(server: Server) {
  servers[server.id] = server;
}

