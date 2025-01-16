import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Auth
export const login = (email: string, password: string) => api.post('/auth/login', { email, password });
export const register = (username: string, email: string, password: string) => api.post('/auth/register', { username, email, password });

// Users
export const getCurrentUser = () => api.get('/users/me');
export const updateUserProfile = (data: any) => api.put('/users/me', data);

// Servers
export const getServers = () => api.get('/servers');
export const createServer = (data: any) => api.post('/servers', data);
export const getServerById = (id: string) => api.get(`/servers/${id}`);
export const updateServer = (id: string, data: any) => api.put(`/servers/${id}`, data);
export const deleteServer = (id: string) => api.delete(`/servers/${id}`);

// Channels
export const getChannels = (serverId: string) => api.get(`/servers/${serverId}/channels`);
export const createChannel = (serverId: string, data: any) => api.post(`/servers/${serverId}/channels`, data);
export const updateChannel = (serverId: string, channelId: string, data: any) => api.put(`/servers/${serverId}/channels/${channelId}`, data);
export const deleteChannel = (serverId: string, channelId: string) => api.delete(`/servers/${serverId}/channels/${channelId}`);

// Messages
export const getMessages = (channelId: string) => api.get(`/channels/${channelId}/messages`);
export const sendMessage = (channelId: string, content: string) => api.post(`/channels/${channelId}/messages`, { content });

// Friends
export const getFriends = () => api.get('/friends');
export const sendFriendRequest = (userId: string) => api.post('/friends/requests', { userId });
export const acceptFriendRequest = (requestId: string) => api.post(`/friends/requests/${requestId}/accept`);
export const rejectFriendRequest = (requestId: string) => api.post(`/friends/requests/${requestId}/reject`);
export const removeFriend = (friendId: string) => api.delete(`/friends/${friendId}`);

export default api;

