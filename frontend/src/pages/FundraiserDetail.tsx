import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Share2, Shield, Users } from "lucide-react";
import { mockFundraisers } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { toast } from "sonner";

const FundraiserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fundraiser = mockFundraisers.find((f) => f.id === id);

  if (!fundraiser) {
    return <div className="p-8 text-center text-muted-foreground">Fundraiser not found</div>;
  }

  const pct = Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4 font-semibold">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-warm-lg border-0 overflow-hidden">
          <CardContent className="p-6">
            {/* Category & Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {fundraiser.category}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
                <Shield size={12} /> Transparent
              </span>
            </div>

            <h1 className="text-2xl font-800 text-foreground mb-2 leading-tight">{fundraiser.title}</h1>

            <div className="flex items-center gap-2 mb-5">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {fundraiser.organizerAvatar}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Organized by <strong className="text-foreground">{fundraiser.organizer}</strong></span>
            </div>

            {/* Progress */}
            <div className="bg-background rounded-2xl p-5 mb-5">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-3xl font-800 text-accent">KES {fundraiser.raisedAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">raised of KES {fundraiser.goalAmount.toLocaleString()}</p>
                </div>
                <p className="text-2xl font-800 text-secondary">{pct}%</p>
              </div>
              <Progress value={pct} className="h-4 rounded-full" />
              <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                <Users size={14} />
                <span>{fundraiser.contributorCount} people contributed</span>
              </div>
            </div>

            {/* Story */}
            <div className="mb-6">
              <h2 className="font-bold text-foreground mb-2">The Story</h2>
              <p className="text-foreground/80 leading-relaxed">{fundraiser.story}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button
                size="lg"
                className="flex-1 h-14 rounded-2xl text-lg font-bold"
                onClick={() => navigate(`/donate/${fundraiser.id}`)}
              >
                ❤️ Donate
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-2xl font-bold border-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied! Share it with your community.");
                }}
              >
                <Share2 size={18} />
              </Button>
            </div>

            {/* Contributors */}
            <h2 className="font-bold text-foreground mb-3">Recent Contributors</h2>
            <div className="space-y-3">
              {fundraiser.contributors.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-secondary/10 text-secondary text-xs font-bold">
                      {c.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-sm text-foreground truncate">{c.name}</p>
                      {c.verified && <Shield size={12} className="text-secondary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{c.time}</p>
                  </div>
                  <p className="font-bold text-sm text-accent">KES {c.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FundraiserDetail;
