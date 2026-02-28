import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, BookOpen } from "lucide-react";
import { allLedgerEntries } from "@/lib/mock-data";
import { motion } from "framer-motion";

const Ledger = () => {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="text-primary" size={24} />
          <h1 className="text-2xl font-800 text-foreground">Transparency Ledger</h1>
        </div>
        <p className="text-muted-foreground mb-6">Every contribution is recorded and verified</p>
      </motion.div>

      <div className="space-y-3">
        {allLedgerEntries.map((entry, i) => (
          <motion.div
            key={entry.id + entry.fundraiserId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="shadow-warm border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-sm text-foreground truncate">{entry.name}</p>
                    {entry.verified && <Shield size={12} className="text-secondary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{entry.fundraiserTitle}</p>
                  <p className="text-xs text-muted-foreground">{entry.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-accent">KES {entry.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-[10px] text-muted-foreground">Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Ledger;
