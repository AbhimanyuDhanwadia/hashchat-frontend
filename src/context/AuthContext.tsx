import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  theme: 'light' | 'dark';
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  updateProfile: (profile: Partial<User>) => void;
  logout: () => void;
  toggleTheme: () => void;
  tempUser: { name: string; email: string; password: string } | null;
  setTempUser: (user: { name: string; email: string; password: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for login
const MOCK_USERS = [
  { email: 'abhimanyu@hashchat.com', password: 'password123', name: 'Abhimanyu', id: '1' },
  { email: 'harsh@hashchat.com', password: 'password123', name: 'Harsh', id: '2' },
  { email: 'demo@hashchat.com', password: 'demo123', name: 'Demo User', id: '3' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [tempUser, setTempUser] = useState<{ name: string; email: string; password: string } | null>(null);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return; // ✅ prevent SSR crash

      const storedUser = localStorage.getItem('hashchat_user');
      const storedToken = localStorage.getItem('hashchat_token');
      const storedTheme = localStorage.getItem('hashchat_theme') as 'light' | 'dark' | null;

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }

      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      }
    } catch (err) {
      console.error('⚠️ AuthContext init error:', err);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (mockUser) {
      const userData: User = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        avatar: `/avatars/${mockUser.id}.png`,
      };

      const mockToken = `mock_jwt_${Date.now()}_${mockUser.id}`;

      setUser(userData);
      setToken(mockToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hashchat_user', JSON.stringify(userData));
        localStorage.setItem('hashchat_token', mockToken);
      }

      toast.success(`Welcome back, ${mockUser.name}!`);
      return true;
    }

    toast.error('Invalid email or password');
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const existingUser = MOCK_USERS.find(u => u.email === email);

    if (existingUser) {
      toast.error('Email already registered');
      return false;
    }

    setTempUser({ name, email, password });
    toast.success('OTP sent to your email (Use 1234)');
    return true;
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (otp === '1234' && tempUser) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: tempUser.name,
        email: tempUser.email,
      };

      const mockToken = `mock_jwt_${Date.now()}_${newUser.id}`;

      setUser(newUser);
      setToken(mockToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hashchat_user', JSON.stringify(newUser));
        localStorage.setItem('hashchat_token', mockToken);
      }
      setTempUser(null);

      toast.success('Account verified successfully!');
      return true;
    }

    toast.error('Invalid OTP. Try 1234');
    return false;
  };

  const updateProfile = (profile: Partial<User>) => {
    useEffect(() => {
  const handleStorageChange = () => {
    const storedUser = localStorage.getItem("hashchat_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
  setUser((prevUser) => {
    if (!prevUser) return prevUser;
    const updatedUser = { ...prevUser, ...profile }; // ✅ Create a new object reference
    localStorage.setItem("hashchat_user", JSON.stringify(updatedUser));
    toast.success("Profile updated successfully!");
    return updatedUser;
  
  });
};

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hashchat_user');
      localStorage.removeItem('hashchat_token');
    }
    toast.success('Logged out successfully!');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hashchat_theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    toast.success(`Switched to ${newTheme} mode`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        theme,
        login,
        signup,
        verifyOtp,
        updateProfile,
        logout,
        toggleTheme,
        tempUser,
        setTempUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}