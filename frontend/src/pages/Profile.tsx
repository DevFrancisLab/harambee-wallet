import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Wallet, Heart } from "lucide-react";
import { mockUserProfile, mockFundraisers } from "@/lib/mock-data";
import { motion } from "framer-motion";

const Profile = () => {
  const userFundraisers = mockFundraisers.slice(0, mockUserProfile.fundraisersCreated);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile header */}
        <Card className="shadow-warm border-0 mb-6">
          <CardContent className="p-6 flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {mockUserProfile.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-800 text-foreground">{mockUserProfile.name}</h1>
              <p className="text-sm text-muted-foreground">{mockUserProfile.email}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-secondary font-semibold">
                <Shield size={12} />
                Wallet active — created automatically
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="shadow-warm border-0">
            <CardContent className="p-4 text-center">
              <Heart className="mx-auto mb-1 text-primary" size={20} />
              <p className="text-lg font-800">KES {mockUserProfile.totalContributed.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Contributed</p>
            </CardContent>
          </Card>
          <Card className="shadow-warm border-0">
            <CardContent className="p-4 text-center">
              <Wallet className="mx-auto mb-1 text-accent" size={20} />
              <p className="text-lg font-800">{mockUserProfile.fundraisersCreated}</p>
              <p className="text-xs text-muted-foreground">Fundraisers Created</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contributions" className="w-full">
          <TabsList className="w-full rounded-xl bg-card mb-4">
            <TabsTrigger value="contributions" className="flex-1 rounded-lg font-semibold">My Contributions</TabsTrigger>
            <TabsTrigger value="fundraisers" className="flex-1 rounded-lg font-semibold">My Fundraisers</TabsTrigger>
          </TabsList>

          <TabsContent value="contributions">
            <div className="space-y-3">
              {mockUserProfile.contributions.map((c, i) => (
                <Card key={i} className="shadow-warm border-0">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{c.fundraiserTitle}</p>
                      <p className="text-xs text-muted-foreground">{c.date}</p>
                    </div>
                    <p className="font-bold text-accent shrink-0">KES {c.amount.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fundraisers">
            <div className="space-y-3">
              {userFundraisers.map((f) => (
                <Card key={f.id} className="shadow-warm border-0">
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      KES {f.raisedAmount.toLocaleString()} / {f.goalAmount.toLocaleString()} • {f.contributorCount} contributors
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Profile;
