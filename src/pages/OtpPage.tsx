import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const OtpPage = () => {
  const navigate = useNavigate();
  const { verifyOtp, tempUser } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!tempUser) {
      navigate('/signup');
    }
  }, [tempUser, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    const success = await verifyOtp(otpCode);
    setIsLoading(false);

    if (success) {
      navigate('/profile');
    }
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

          <h2 className="text-2xl font-semibold text-center mb-2">Verify Your Email</h2>
          <p className="text-muted-foreground text-center mb-8">
            Enter the 4-digit code sent to your email
          </p>

          {/* OTP Hint */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-center">
              Demo OTP: <span className="font-bold text-primary">1234</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-4 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-16 h-16 text-center text-2xl font-semibold border-2 border-input rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-background"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => toast.success('OTP resent! (Use 1234)')}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpPage;
