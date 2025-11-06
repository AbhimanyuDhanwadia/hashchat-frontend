import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Plus, LogIn, Clock } from 'lucide-react';

const CreateJoinRoom = () => {
  const navigate = useNavigate();
  const { joinRoom, rooms } = useChat();
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = joinRoom(roomName, true);
    setIsLoading(false);
    
    if (success) {
      navigate('/chat');
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = joinRoom(roomCode, false);
    setIsLoading(false);
    
    if (success) {
      navigate('/chat');
    }
  };

  const handleQuickJoin = (room: any) => {
    setIsLoading(true);
    const success = joinRoom(room.name, false);
    setIsLoading(false);
    
    if (success) {
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-success/5 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <MessageCircle className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Hash</span>
              <span className="text-foreground">Chat</span>
            </h1>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-2">Join the Conversation</h2>
          <p className="text-muted-foreground text-center mb-8">
            Create a new room or join an existing one
          </p>

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-6">
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    type="text"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isLoading ? 'Creating...' : 'Create Room'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="join" className="mt-6">
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomCode">Room Code or Name</Label>
                  <Input
                    id="roomCode"
                    type="text"
                    placeholder="Enter room code or name"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {isLoading ? 'Joining...' : 'Join Room'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Available Rooms */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Available Rooms</h3>
            </div>

            <div className="space-y-2">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="text-sm text-muted-foreground">Code: {room.code}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleQuickJoin(room)}
                    disabled={isLoading}
                  >
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateJoinRoom;
