import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import Sidebar from '@/components/Chat/Sidebar';
import ChatWindow from '@/components/Chat/ChatWindow';
import { motion } from 'framer-motion';

const ChatDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { currentRoom } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    if (!currentRoom) {
      navigate('/create-room');
      return;
    }
  }, [user, token, currentRoom, navigate]);

  if (!user || !currentRoom) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-chat-bg">
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 overflow-hidden md:block`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </motion.div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  );
};

export default ChatDashboard;
