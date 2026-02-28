import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowLeft, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const categories = ["Medical", "School Fees", "Community", "Emergency"] as const;

const CreateHarambee = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Harambee created! Secure wallet treasury generated automatically.", {
      duration: 4000,
    });
    navigate("/dashboard");
  };

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4 font-semibold">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-800 text-foreground mb-1">Create a Harambee</h1>
        <p className="text-muted-foreground mb-6">Start a transparent community fundraiser</p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="shadow-warm border-0">
          <CardContent className="p-6 space-y-5">
            <div>
              <Label className="text-base font-bold">Fundraiser Title</Label>
              <Input placeholder="e.g. Help Mary's Family" className="mt-2 h-12 rounded-xl text-base" required />
            </div>

            <div>
              <Label className="text-base font-bold">Your Story</Label>
              <Textarea placeholder="Tell people why this matters..." className="mt-2 rounded-xl text-base min-h-[120px]" required />
            </div>

            <div>
              <Label className="text-base font-bold">Goal Amount (KES)</Label>
              <Input type="number" placeholder="e.g. 50000" className="mt-2 h-12 rounded-xl text-base" required />
            </div>

            <div>
              <Label className="text-base font-bold">Category</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-colors ${
                      selectedCategory === cat
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-bold">Image (optional)</Label>
              <button
                type="button"
                className="mt-2 w-full h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 transition-colors"
              >
                <ImagePlus size={20} />
                <span className="text-sm font-semibold">Add a photo</span>
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 rounded-2xl text-lg font-bold">
              Create Harambee
            </Button>

            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
              <Shield size={14} />
              Secure wallet treasury created automatically
            </div>
          </CardContent>
        </Card>
      </motion.form>
    </div>
  );
};

export default CreateHarambee;
