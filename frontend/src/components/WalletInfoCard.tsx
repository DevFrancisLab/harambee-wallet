import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

type Props = {
  label?: string;
  address: string | null | undefined;
};

function shortenAddress(addr: string) {
  if (!addr) return "";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletInfoCard({ label = "Cardano", address }: Props) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({ title: "Copied", description: "Address copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      toast({ title: "Copy failed", description: "Could not copy address", variant: "destructive" });
    }
  }, [address, toast]);

  return (
    <Card className="shadow-warm border-0">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-medium break-words mt-1">{address ? shortenAddress(address) : "—"}</div>
          </div>

          <div className="ml-3 flex-shrink-0">
            <Button size="sm" variant="outline" onClick={handleCopy} disabled={!address}>
              <Copy className="mr-2" size={14} />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WalletInfoCard;
