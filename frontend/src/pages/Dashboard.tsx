import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Heart, Users, Wallet } from "lucide-react";
import { mockFundraisers, mockUserProfile } from "@/lib/mock-data";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Heart, label: "My Fundraisers", value: mockUserProfile.fundraisersCreated, color: "text-primary" },
    { icon: Users, label: "Contributions", value: mockUserProfile.contributions.length, color: "text-secondary" },
    { icon: Wallet, label: "Total Given", value: `KES ${mockUserProfile.totalContributed.toLocaleString()}`, color: "text-accent" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-800 text-foreground mb-1">Welcome back, {mockUserProfile.name.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground mb-6">Your community is counting on you</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="shadow-warm border-0">
              <CardContent className="p-4 text-center">
                <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                <p className="text-xl font-800 text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Active Harambees</h2>
        <Button size="sm" className="rounded-xl font-bold" onClick={() => navigate("/create")}>
          <PlusCircle size={16} className="mr-1" /> New
        </Button>
      </div>

      {/* Campaign cards */}
      <div className="space-y-4">
        {mockFundraisers.map((f, i) => {
          const pct = Math.round((f.raisedAmount / f.goalAmount) * 100);
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <Card
                className="shadow-warm border-0 cursor-pointer hover:shadow-warm-lg transition-shadow"
                onClick={() => navigate(`/fundraiser/${f.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {f.category}
                      </span>
                      <h3 className="text-base font-bold text-foreground mt-2 leading-snug">{f.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">by {f.organizer}</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <Progress value={pct} className="h-3 rounded-full" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-accent">
                      KES {f.raisedAmount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      of KES {f.goalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Users size={14} />
                    <span>{f.contributorCount} contributors</span>
                    <span className="ml-auto font-semibold text-secondary">{pct}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* FAB mobile */}
      <Button
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-warm-lg z-40"
        onClick={() => navigate("/create")}
      >
        <PlusCircle size={28} />
      </Button>
    </div>
  );
};

export default Dashboard;
