/**
 * ConnectWallet Component
 * 
 * Complete wallet connection flow:
 * 1. User clicks "Connect Wallet"
 * 2. Mock wallet connection (replace with real wallet SDK)
 * 3. Send address to backend POST /api/wallets/save/
 * 4. Store address in localStorage
 * 5. Show success/error states
 * 6. Display connected wallet info
 */

import { useState, useEffect } from 'react';
import { useWalletAPI } from '../hooks/useWalletAPI';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle2, AlertCircle, Copy, LogOut } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const STORAGE_KEY = 'wallet_address';
const NETWORK_KEY = 'wallet_network';

/**
 * Mock wallet provider
 * Replace this with real wallet integration (e.g., Nami, Eternl, etc.)
 */
function mockWalletConnect() {
  return {
    address: 'addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls',
    network: 'cardano',
    publicKey: 'e0c3k8f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3',
  };
}

export function ConnectWallet() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletNetwork, setWalletNetwork] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const { saveWallet, getBalance, loading, error, clearError } = useWalletAPI();
  const { toast } = useToast();

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem(STORAGE_KEY);
    const savedNetwork = localStorage.getItem(NETWORK_KEY);

    if (savedAddress && savedNetwork) {
      setWalletAddress(savedAddress);
      setWalletNetwork(savedNetwork);
      setConnected(true);

      // Fetch balance for saved wallet
      getBalance(savedAddress, savedNetwork)
        .catch((err) => console.error('Failed to load balance:', err));
    }
  }, [getBalance]);

  /**
   * Handle wallet connection
   */
  const handleConnect = async () => {
    try {
      clearError();

      // Step 1: Connect to wallet (mock)
      const walletData = mockWalletConnect();

      // Step 2: Send to backend
      // build a payload that matches the backend serializer expectations
      const payload = {
        wallet_address: walletData.address,
        chain: walletData.network || "cardano",
      };
      console.log("Sending wallet:", payload);

      const savedWallet = await saveWallet(payload);

      // Step 3: Store in localStorage
      localStorage.setItem(STORAGE_KEY, walletData.address);
      localStorage.setItem(NETWORK_KEY, walletData.network);

      // Step 4: Update state
      setWalletAddress(walletData.address);
      setWalletNetwork(walletData.network);
      setConnected(true);

      // Step 5: Fetch balance
      const balanceData = await getBalance(walletData.address, walletData.network);
      setWalletBalance(balanceData);

      // Step 6: Show success
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected to ${walletData.network} wallet`,
      });

      console.log('Wallet connected:', {
        address: walletData.address,
        network: walletData.network,
        savedWallet,
        balance: balanceData,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      
      toast({
        title: 'Connection Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      console.error('Wallet connection error:', err);
    }
  };

  /**
   * Handle wallet disconnect
   */
  const handleDisconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NETWORK_KEY);
    setWalletAddress(null);
    setWalletNetwork(null);
    setWalletBalance(null);
    setConnected(false);
    clearError();

    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  /**
   * Copy address to clipboard
   */
  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: 'Copied',
        description: 'Wallet address copied to clipboard',
      });
    }
  };

  /**
   * Format address for display
   */
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 10)}...${addr.slice(-10)}`;
  };

  /**
   * Format balance for display
   */
  const formatBalance = (balance) => {
    if (!balance) return '0';
    // Convert from lovelace to ADA (1 ADA = 1,000,000 lovelace)
    const ada = parseInt(balance) / 1_000_000;
    return ada.toFixed(2);
  };

  // Not connected state
  if (!connected) {
    return (
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-gray-600">
              Connect your Cardano, Bitcoin, or Spark wallet to get started
            </p>

            <Button
              onClick={handleConnect}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </Button>

            <p className="text-sm text-gray-500">
              Using UTXOS Wallet Integration
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Connected state
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6 border-green-200 bg-green-50">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h2 className="font-bold text-lg">Wallet Connected</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-green-200" />

          {/* Wallet Info */}
          <div className="space-y-3">
            {/* Network Badge */}
            <div>
              <p className="text-sm text-gray-600">Network</p>
              <div className="mt-1 inline-block">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                  {walletNetwork}
                </span>
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="text-sm text-gray-600">Wallet Address</p>
              <div className="mt-1 flex items-center justify-between bg-white p-3 rounded border border-gray-200 hover:border-gray-300 transition-colors">
                <code className="text-sm font-mono text-gray-700">
                  {formatAddress(walletAddress)}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy full address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Full address (click copy):</p>
              <p className="text-xs text-gray-600 font-mono break-all">
                {walletAddress}
              </p>
            </div>

            {/* Balance */}
            {walletBalance && (
              <div>
                <p className="text-sm text-gray-600">Balance</p>
                <div className="mt-1 text-2xl font-bold text-green-600">
                  {formatBalance(walletBalance.balance)}{' '}
                  <span className="text-lg text-gray-600">
                    {walletBalance.currency === 'lovelace' ? 'ADA' : walletBalance.currency}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {walletBalance.balance} {walletBalance.currency}
                </p>
              </div>
            )}

            {/* Status Badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                ✓ Connected
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                ✓ Synced
              </span>
              {walletBalance && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                  ✓ Balance Loaded
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" disabled={loading}>
          Send Transaction
        </Button>
        <Button variant="outline" disabled={loading}>
          Sign Message
        </Button>
      </div>
    </div>
  );
}
