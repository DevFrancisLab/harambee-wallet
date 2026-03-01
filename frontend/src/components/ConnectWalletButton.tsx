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
  /**
   * The backend returns a full balance object with the shape:
   * {
   *   address: string,
   *   balance: string,      // balance in smallest unit (lovelace)
   *   network: string,
   *   currency: string      // typically "lovelace"
   * }
   *
   * Previously we treated this as a simple number and cast the
   * response to `number` which meant `balance` ended up holding an
   * object and React attempted to render it directly.  That produced the
   * runtime error you saw:
   *
   *   "Objects are not valid as a React child (found: object with keys
   *    {address, balance, network, currency})"
   *
   * We now store the full response and render the relevant fields.
   */
  const [balance, setBalance] = React.useState<any | null>(null);
  const { toast } = useToast();

  const handleSave = React.useCallback(async () => {
    setLoading(true);
    try {
      // example wallet identifier; in a real app this would come from a form or
      // other interaction that collects the user's wallet information.
      const walletId = "user-wallet-id";
      // ensure the payload matches the backend serializer
      const payload = { wallet_address: walletId, chain: "cardano" };
      console.log("ConnectWalletButton sending wallet:", payload);
      await saveWallet(payload);
      toast({ title: "Saved", description: "Wallet info sent to server" });
      // default network is 'cardano', but specify explicitly for clarity
      const b = await getBalance(walletId, 'cardano');
      console.log('ConnectWalletButton balance response', b);
      setBalance(b);
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

        {balance && (
          <div className="text-sm mt-2">
            Balance: {balance.balance} {balance.currency === 'lovelace' ? 'ADA' : balance.currency}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectWalletButton;
