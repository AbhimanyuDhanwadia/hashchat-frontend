export const dummyUsers = [
  { 
    id: '1', 
    name: 'Abhimanyu', 
    status: 'online' as const, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abhimanyu' 
  },
  { 
    id: '2', 
    name: 'Harsh', 
    status: 'online' as const, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harsh' 
  },
  { 
    id: '3', 
    name: 'Riya', 
    status: 'online' as const, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya' 
  },
  { 
    id: '4', 
    name: 'Priya', 
    status: 'offline' as const, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' 
  },
  { 
    id: '5', 
    name: 'Rahul', 
    status: 'online' as const, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' 
  },
];

export const dummyRooms = [
  { id: 'room_1', name: 'General Chat', code: 'GEN001' },
  { id: 'room_2', name: 'Developers Hub', code: 'DEV002' },
  { id: 'room_3', name: 'Random', code: 'RND003' },
];

export const dummyMessages = [
  { 
    id: 'msg_1', 
    sender: 'Abhimanyu', 
    senderId: '1',
    content: 'Hey there! Welcome to HashChat!', 
    type: 'text' as const, 
    timestamp: '10:01 AM' 
  },
  { 
    id: 'msg_2', 
    sender: 'Harsh', 
    senderId: '2',
    content: 'Hi! How\'s your day going?', 
    type: 'text' as const, 
    timestamp: '10:02 AM' 
  },
  { 
    id: 'msg_3', 
    sender: 'Riya', 
    senderId: '3',
    content: 'This chat app looks amazing!', 
    type: 'text' as const, 
    timestamp: '10:05 AM' 
  },
];
