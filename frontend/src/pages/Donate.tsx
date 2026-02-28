import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, CheckCircle2 } from "lucide-react";
import { mockFundraisers } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

const presets = [100, 500, 1000, 2500, 5000];

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fundraiser = mockFundraisers.find((f) => f.id === id);
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  if (!fundraiser) {
    return <div className="p-8 text-center text-muted-foreground">Fundraiser not found</div>;
  }

  const handleConfirm = () => {
    if (!amount || Number(amount) <= 0) return;
    setSuccess(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <CheckCircle2 size={80} className="text-secondary mb-4" />
            </motion.div>
            <h1 className="text-3xl font-800 text-foreground mb-2">Contribution Successful!</h1>
            <p className="text-muted-foreground mb-2">
              You contributed <strong className="text-accent">KES {Number(amount).toLocaleString()}</strong>
            </p>
            <p className="text-muted-foreground mb-8">to "{fundraiser.title}"</p>
            <Button size="lg" className="rounded-2xl font-bold h-14 px-10" onClick={() => navigate("/dashboard")}>
              Back to Home
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4 font-semibold">
              <ArrowLeft size={18} /> Back
            </button>
            <h1 className="text-2xl font-800 text-foreground mb-1">Make a Contribution</h1>
            <p className="text-muted-foreground mb-6">to "{fundraiser.title}"</p>

            <Card className="shadow-warm border-0">
              <CardContent className="p-6 space-y-5">
                <div>
                  <label className="text-base font-bold text-foreground">Amount (KES)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="mt-2 h-14 rounded-xl text-xl text-center font-bold"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(String(p))}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                        amount === String(p)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      {p.toLocaleString()}
                    </button>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 rounded-2xl text-lg font-bold"
                  onClick={handleConfirm}
                  disabled={!amount || Number(amount) <= 0}
                >
                  <Heart size={20} className="mr-2" /> Confirm Contribution
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Donate;
