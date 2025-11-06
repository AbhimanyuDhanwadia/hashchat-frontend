import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { dummyUsers, dummyRooms, dummyMessages } from '@/data/mockData';

export interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  type: 'text' | 'image';
  timestamp: string;
  imageUrl?: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
}

export interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
}

interface ChatContextType {
  currentRoom: Room | null;
  messages: Message[];
  onlineUsers: OnlineUser[];
  rooms: Room[];
  isTyping: boolean;
  typingUser: string | null;
  joinRoom: (roomNameOrCode: string, isCreate?: boolean) => boolean;
  sendMessage: (content: string, type?: 'text' | 'image', imageUrl?: string) => void;
  leaveRoom: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>(dummyUsers);
  const [rooms, setRooms] = useState<Room[]>(dummyRooms);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Load rooms and current room from localStorage
  useEffect(() => {
    const storedRooms = localStorage.getItem('hashchat_rooms');
    const storedCurrentRoom = localStorage.getItem('hashchat_current_room');

    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }

    if (storedCurrentRoom) {
      const room = JSON.parse(storedCurrentRoom);
      setCurrentRoom(room);
      loadRoomMessages(room.id);
    }
  }, []);

  // Mock WebSocket simulation - random incoming messages
  useEffect(() => {
    if (!currentRoom) return;

    const interval = setInterval(() => {
      // Random chance to receive a message
      if (Math.random() > 0.7) {
        const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
        const randomContent = [
          'Hey everyone!',
          'How is everyone doing?',
          'Anyone working on something cool?',
          'This is awesome!',
          'Let me know what you think',
          'Great discussion!',
        ][Math.floor(Math.random() * 6)];

        const newMessage: Message = {
          id: `msg_${Date.now()}_${Math.random()}`,
          sender: randomUser.name,
          senderId: randomUser.id,
          content: randomContent,
          type: 'text',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };

        setMessages(prev => {
          const updated = [...prev, newMessage];
          saveRoomMessages(currentRoom.id, updated);
          return updated;
        });
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [currentRoom]);

  // Mock typing indicator
  useEffect(() => {
    if (!currentRoom) return;

    const typingInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
        setIsTyping(true);
        setTypingUser(randomUser.name);

        setTimeout(() => {
          setIsTyping(false);
          setTypingUser(null);
        }, 3000);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(typingInterval);
  }, [currentRoom]);

  // Simulate users joining/leaving
  useEffect(() => {
    if (!currentRoom) return;

    const userActivityInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
        const isJoining = Math.random() > 0.5;
        
        if (isJoining) {
          toast.info(`${randomUser.name} joined the room`, {
            duration: 2000,
          });
        } else {
          toast.info(`${randomUser.name} left the room`, {
            duration: 2000,
          });
        }
      }
    }, 20000); // Every 20 seconds

    return () => clearInterval(userActivityInterval);
  }, [currentRoom]);

  const loadRoomMessages = (roomId: string) => {
    const storedMessages = localStorage.getItem(`hashchat_messages_${roomId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Load default messages for the room
      const defaultMessages = dummyMessages.map(msg => ({
        ...msg,
        id: `msg_${Date.now()}_${Math.random()}`,
      }));
      setMessages(defaultMessages);
      saveRoomMessages(roomId, defaultMessages);
    }
  };

  const saveRoomMessages = (roomId: string, msgs: Message[]) => {
    localStorage.setItem(`hashchat_messages_${roomId}`, JSON.stringify(msgs));
  };

  const joinRoom = (roomNameOrCode: string, isCreate: boolean = false): boolean => {
    if (!roomNameOrCode.trim()) {
      toast.error('Please enter a room name or code');
      return false;
    }

    let room: Room | undefined;

    if (isCreate) {
      // Create new room
      const newRoom: Room = {
        id: `room_${Date.now()}`,
        name: roomNameOrCode,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      };

      const updatedRooms = [...rooms, newRoom];
      setRooms(updatedRooms);
      localStorage.setItem('hashchat_rooms', JSON.stringify(updatedRooms));
      room = newRoom;
      toast.success(`Room "${roomNameOrCode}" created successfully!`);
    } else {
      // Join existing room by name or code
      room = rooms.find(r => 
        r.name.toLowerCase() === roomNameOrCode.toLowerCase() || 
        r.code.toUpperCase() === roomNameOrCode.toUpperCase()
      );

      if (!room) {
        toast.error('Room not found');
        return false;
      }

      toast.success(`Joined room "${room.name}" successfully!`);
    }

    setCurrentRoom(room);
    localStorage.setItem('hashchat_current_room', JSON.stringify(room));
    loadRoomMessages(room.id);
    return true;
  };

  const sendMessage = (content: string, type: 'text' | 'image' = 'text', imageUrl?: string) => {
    if (!currentRoom) {
      toast.error('Please join a room first');
      return;
    }

    const user = JSON.parse(localStorage.getItem('hashchat_user') || '{}');

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: user.name || 'You',
      senderId: user.id || 'current',
      content,
      type,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      imageUrl,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveRoomMessages(currentRoom.id, updatedMessages);
  };

  const leaveRoom = () => {
    if (currentRoom) {
      toast.info(`Left room "${currentRoom.name}"`);
      setCurrentRoom(null);
      setMessages([]);
      localStorage.removeItem('hashchat_current_room');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        currentRoom,
        messages,
        onlineUsers,
        rooms,
        isTyping,
        typingUser,
        joinRoom,
        sendMessage,
        leaveRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
