import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveWallet, getBalance } from "@/services/api";

type WalletAddresses = {
  cardanoAddress: string | null;
  bitcoinAddress: string | null;
  sparkAddress: string | null;
};

const STORAGE_KEY = "harambee_wallet";

export function ConnectWalletButton(): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [balance, setBalance] = React.useState<number | null>(null);
  const { toast } = useToast();

  const handleSave = React.useCallback(async () => {
    setLoading(true);
    try {
      // example wallet identifier; in a real app this would come from a form or
      // other interaction that collects the user's wallet information.
      const walletId = "user-wallet-id";
      await saveWallet({ walletId });
      toast({ title: "Saved", description: "Wallet info sent to server" });
      const b = await getBalance(walletId);
      setBalance(b as number);
    } catch (err: any) {
      console.error("API call failed:", err);
      toast({
        title: "Error",
        description: err?.message ?? "Unable to save wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        <Button onClick={handleSave} className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Wallet"}
        </Button>

        {balance !== null && (
          <div className="text-sm mt-2">Balance: {balance}</div>
        )}
      </div>
    </div>
  );
}

export default ConnectWalletButton;
