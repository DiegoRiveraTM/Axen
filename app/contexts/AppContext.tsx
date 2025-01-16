'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Server, Channel } from '@/lib/mockData'
import * as api from '@/lib/api'

interface Friend {
  id: string;
  name: string;
  imageUrl: string;
  isOnline: boolean;
}

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AppContextType {
  currentServer: Server | null
  setCurrentServer: (server: Server | null) => void
  currentChannel: Channel | null
  setCurrentChannel: (channel: Channel | null) => void
  pinnedServers: string[]
  setPinnedServers: (servers: string[]) => void
  togglePinnedServer: (serverId: string) => void
  friends: Friend[];
  setFriends: (friends: Friend[]) => void;
  addFriend: (friend: Friend) => void;
  servers: Server[];
  addServer: (server: Server) => void;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentServer, setCurrentServer] = useState<Server | null>(null)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [pinnedServers, setPinnedServers] = useState<string[]>([])
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'DiegoRivera', imageUrl: '/images/diego-rivera.jpg', isOnline: false },
    { id: '2', name: 'Barbara', imageUrl: '/images/barbara.jpg', isOnline: false },
    { id: '3', name: 'Hugo Irungaray', imageUrl: '/images/hugo-irungaray.jpg', isOnline: false },
    { id: '4', name: 'Diego Zamora', imageUrl: '/images/diego-zamora.jpg', isOnline: true },
  ]);
  const [servers, setServers] = useState<Server[]>([
  { 
    id: '1', 
    name: 'BoboCrypto', 
    imageUrl: '/images/server-icon.png',
    members: [],
    channels: []
  },
  { id: '2', name: 'Server 2', imageUrl: '/images/default-server-icon.png', members: [], channels: [] },
  { id: '3', name: 'Server 3', imageUrl: '/images/default-server-icon.png', members: [], channels: [] },
  { id: '4', name: 'Server 4', imageUrl: '/images/default-server-icon.png', members: [], channels: [] },
  { id: '5', name: 'Landscape', imageUrl: '/images/landscape-server.jpg', members: [], channels: [] }
])
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.setAuthToken(token);
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching current user:', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      api.setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    api.clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const togglePinnedServer = (serverId: string) => {
    setPinnedServers(current => 
      current.includes(serverId) 
        ? current.filter(id => id !== serverId)
        : [...current, serverId]
    )
  }

  const addFriend = (friend: Friend) => {
    setFriends(prev => [...prev, friend]);
  };

  const addServer = (server: Server) => {
  setServers(prev => [...prev, server]);
};

  return (
    <AppContext.Provider value={{ 
      currentServer, 
      setCurrentServer, 
      currentChannel, 
      setCurrentChannel,
      pinnedServers,
      setPinnedServers,
      togglePinnedServer,
      friends,
      setFriends,
      addFriend,
      servers,
      addServer,
      user,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}


