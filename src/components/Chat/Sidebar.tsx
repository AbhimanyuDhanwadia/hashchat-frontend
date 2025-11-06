import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Users, Hash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Sidebar = ({ onClose }: { onClose: () => void }) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const { onlineUsers, rooms, currentRoom } = useChat();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  function updateProfile(arg0: { avatar?: string; name?: string; bio?: string }) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="h-full bg-chat-sidebar border-r border-border flex flex-col">
      {/* User Profile */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="absolute bottom-0 right-0 status-online"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{user?.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Current Room */}
      {currentRoom && (
        <div className="p-4 bg-primary/5 border-b border-border">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{currentRoom.name}</p>
              <p className="text-xs text-muted-foreground">Code: {currentRoom.code}</p>
            </div>
          </div>
        </div>
      )}

      {/* Online Users */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Online Users ({onlineUsers.filter(u => u.status === 'online').length})</h4>
          </div>
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="relative">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={user.status === 'online' ? 'status-online' : 'status-offline'}></div>
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rooms List */}
        <div className="p-4 border-t border-border">
          <h4 className="font-semibold text-sm mb-3">Rooms</h4>
          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  currentRoom?.id === room.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <Hash className="w-4 h-4" />
                <span className="text-sm font-medium">{room.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
  <DialogHeader>
    <DialogTitle>Settings</DialogTitle>
    <DialogDescription>Manage your profile and preferences.</DialogDescription>
  </DialogHeader>

  <div className="space-y-6 py-4">
    {/* Profile Picture Upload */}
    <div className="space-y-2">
      <Label>Profile Picture</Label>
      <div className="flex items-center gap-4">
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
          alt="Profile"
          className="w-16 h-16 rounded-full border border-border object-cover"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              updateProfile({ avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
          }}
          className="text-sm text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Upload a new profile image (JPEG or PNG).
      </p>
    </div>

    <hr className="border-border" />

    {/* Editable Profile Info */}
    <div className="space-y-3">
      <Label htmlFor="name">Name</Label>
      <input
        id="name"
        type="text"
        defaultValue={user?.name}
        onChange={(e) => updateProfile({ name: e.target.value })}
        className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground focus:outline-none"
      />

      <Label htmlFor="bio">Bio</Label>
      <textarea
        id="bio"
        defaultValue={user?.bio}
        onChange={(e) => updateProfile({ bio: e.target.value })}
        className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground focus:outline-none resize-none"
        placeholder="Write something about yourself..."
      />
    </div>

    <hr className="border-border" />

    {/* Theme Toggle */}
    <div className="flex items-center justify-between">
      <Label htmlFor="theme-toggle">Dark Mode</Label>
      <Switch
        id="theme-toggle"
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      />
    </div>

    <hr className="border-border" />

    {/* Save Changes Button */}
    <Button
      onClick={() => toast.success('Profile updated successfully!')}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
    >
      Save Changes
    </Button>

    {/* Logout */}
    <Button
      variant="destructive"
      className="w-full justify-start"
      size="sm"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>

    {/* Optional: Reset Account */}
    <Button
      variant="outline"
      className="w-full justify-start text-muted-foreground hover:text-destructive"
      size="sm"
      onClick={() => {
        localStorage.clear();
        toast.info('Account data reset (mock).');
        logout();
      }}
    >
      Reset Account
    </Button>
  </div>
</DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          className="w-full justify-start"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
