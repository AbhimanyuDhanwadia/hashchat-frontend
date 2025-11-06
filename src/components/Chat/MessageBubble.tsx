import { Message } from '@/context/ChatContext';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
    >
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender}`}
            alt={message.sender}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
        )}
        
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && (
            <span className="text-xs font-medium text-muted-foreground mb-1 px-2">
              {message.sender}
            </span>
          )}
          
          <div className={`px-4 py-2 ${isOwn ? 'message-sent' : 'message-received'}`}>
            {message.type === 'image' && message.imageUrl ? (
              <div className="space-y-2">
                <img
                  src={message.imageUrl}
                  alt="Shared image"
                  className="max-w-full rounded-lg"
                />
                {message.content && <p className="text-sm">{message.content}</p>}
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground mt-1 px-2">
            {message.timestamp}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
