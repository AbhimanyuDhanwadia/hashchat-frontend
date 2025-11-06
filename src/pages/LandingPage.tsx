import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Zap, Shield } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageCircle className="w-16 h-16 text-primary" />
            <h1 className="text-6xl font-bold">
              <span className="text-primary">Hash</span>
              <span className="text-foreground">Chat</span>
            </h1>
          </div>

          <p className="text-2xl text-muted-foreground mb-8">
            Connect. Chat. Share.
          </p>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience real-time communication at its finest. Join rooms, connect with friends, 
            and share moments instantly with our modern chat platform.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              Sign Up
            </Button>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto"
        >
          <div className="bg-card p-8 rounded-2xl shadow-md border border-border hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Messaging</h3>
            <p className="text-muted-foreground">
              Send and receive messages instantly with our lightning-fast WebSocket technology.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-md border border-border hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Create & Join Rooms</h3>
            <p className="text-muted-foreground">
              Start your own chat rooms or join existing ones with a simple room code.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-md border border-border hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your conversations are protected with modern security standards.
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-24"
        >
          <div className="bg-gradient-to-r from-primary to-primary-hover p-12 rounded-3xl max-w-3xl mx-auto text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Ready to start chatting?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users already connected on HashChat
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              Create Your Account
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
