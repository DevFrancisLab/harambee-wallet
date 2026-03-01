import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import connectWallet from "@/services/walletService";

type WalletAddresses = {
  cardanoAddress: string | null;
  bitcoinAddress: string | null;
  sparkAddress: string | null;
};

const STORAGE_KEY = "harambee_wallet";

export function ConnectWalletButton(): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [addresses, setAddresses] = React.useState<WalletAddresses | null>(null);
  const { toast } = useToast();

  // Restore persisted addresses on component mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { cardanoAddress?: string; bitcoinAddress?: string; sparkAddress?: string };
      const restored: WalletAddresses = {
        cardanoAddress: parsed.cardanoAddress && parsed.cardanoAddress.length > 0 ? parsed.cardanoAddress : null,
        bitcoinAddress: parsed.bitcoinAddress && parsed.bitcoinAddress.length > 0 ? parsed.bitcoinAddress : null,
        sparkAddress: parsed.sparkAddress && parsed.sparkAddress.length > 0 ? parsed.sparkAddress : null,
      };
      setAddresses(restored);
    } catch (err) {
      console.error("Failed to restore wallet from localStorage:", err);
    }
  }, []);

  const handleConnect = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await connectWallet();
      setAddresses(result);

      // Persist to localStorage using requested JSON structure (empty string when absent)
      const toPersist = {
        cardanoAddress: result.cardanoAddress ?? "",
        bitcoinAddress: result.bitcoinAddress ?? "",
        sparkAddress: result.sparkAddress ?? "",
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
      } catch (e) {
        console.error("Failed to persist wallet to localStorage:", e);
      }
    } catch (err: any) {
      console.error("Connect wallet failed:", err);
      toast({
        title: "Connection failed",
        description: err?.message ?? "Unable to connect wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        <Button onClick={handleConnect} className="w-full" disabled={loading}>
          {loading ? (
            <svg className="h-4 w-4 mr-2 animate-spin text-current" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          ) : null}
          Connect Wallet
        </Button>

        {addresses && (
          <div className="rounded-md border p-4 bg-background">
            <div className="text-sm text-muted-foreground mb-2">Connected addresses</div>
            <div className="grid gap-2">
              <div>
                <div className="text-xs text-slate-500">Cardano</div>
                <div className="break-words text-sm">{addresses.cardanoAddress ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Bitcoin</div>
                <div className="break-words text-sm">{addresses.bitcoinAddress ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Spark</div>
                <div className="break-words text-sm">{addresses.sparkAddress ?? "—"}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectWalletButton;
