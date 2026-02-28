import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Hero illustration area */}
      <div className="flex-1 bg-primary flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-secondary" />
          <div className="absolute bottom-20 right-16 w-48 h-48 rounded-full bg-accent" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-primary-foreground" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center"
        >
          <div className="text-7xl mb-6">🤝</div>
          <div className="flex gap-4 justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Heart className="text-primary-foreground" size={28} />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Users className="text-primary-foreground" size={28} />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Shield className="text-primary-foreground" size={28} />
            </div>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-sm">
            Community fundraising with full transparency. Every contribution tracked, every shilling accounted for.
          </p>
        </motion.div>
      </div>

      {/* Right: CTA */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md w-full text-center"
        >
          <h1 className="text-4xl lg:text-5xl font-800 text-foreground mb-4 leading-tight">
            Raise Together.{" "}
            <span className="text-primary">Help Faster.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Create transparent community fundraisers anyone can trust.
          </p>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full h-14 text-lg rounded-2xl font-bold"
              onClick={() => navigate("/dashboard")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg rounded-2xl font-bold border-2"
              onClick={() => navigate("/dashboard")}
            >
              <Smartphone className="mr-2" size={20} />
              Install App
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <Shield size={16} />
            <span>Secure wallet created automatically — no setup needed</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
