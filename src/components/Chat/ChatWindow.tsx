import { useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { Button } from '@/components/ui/button';
import { Menu, Users } from 'lucide-react';

interface ChatWindowProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ChatWindow = ({ onToggleSidebar, isSidebarOpen }: ChatWindowProps) => {
  const { currentRoom, messages, onlineUsers, isTyping, typingUser } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentRoom) {
    return null;
  }

  const onlineCount = onlineUsers.filter(u => u.status === 'online').length;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="md:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h2 className="text-xl font-semibold">{currentRoom.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{onlineCount} online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === user?.id || message.sender === 'You'}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && typingUser && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="flex gap-1">
              <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
              <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
              <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>{typingUser} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-card">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatWindow;
