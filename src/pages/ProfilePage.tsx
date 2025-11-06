import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Upload, User } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });

    setIsLoading(false);
    navigate('/create-room');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-success/5 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
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

          <h2 className="text-2xl font-semibold text-center mb-2">Setup Your Profile</h2>
          <p className="text-muted-foreground text-center mb-8">
            Let others know who you are
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-border">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-hover transition-colors shadow-md"
                >
                  <Upload className="w-5 h-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Click to upload profile picture</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isLoading}
                rows={3}
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/150 characters
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
