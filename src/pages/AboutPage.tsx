import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HeartHandshake } from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card p-10 rounded-2xl shadow-md border border-border max-w-lg text-center"
      >
        <div className="flex justify-center mb-4">
          <HeartHandshake className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-4">About HashChat</h1>
        <p className="text-muted-foreground mb-6">
          HashChat is a modern, real-time chat application designed for seamless and instant communication.
          Whether you want to connect with friends, collaborate with colleagues, or join public discussions,
          HashChat provides a fast and intuitive platform for everyone.
        </p>
        <ul className="text-left text-muted-foreground mb-8 list-disc list-inside space-y-2">
          <li>Real-time messaging with instant delivery.</li>
          <li>Secure user authentication and profile management.</li>
          <li>Create and join custom chat rooms.</li>
          <li>Responsive design across all devices.</li>
          <li>User-friendly and modern interface.</li>
        </ul>
        <Button onClick={() => navigate("/login")} className="bg-primary text-primary-foreground">
          Back to Login
        </Button>
      </motion.div>
    </div>
  );
};

export default AboutPage;