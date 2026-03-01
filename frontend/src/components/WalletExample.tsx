/**
 * WalletExample Component
 * 
 * Complete example showing how to use useWalletAPI hook
 * Demonstrates all wallet operations with error handling
 */

import { useState } from 'react';
import { useWalletAPI } from '../hooks/useWalletAPI';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

/**
 * Example showing all useWalletAPI operations
 */
export function WalletExample() {
  // State for example data
  const [exampleAddress] = useState('addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls');
  const [network] = useState('cardano');
  const [transactionData, setTransactionData] = useState(null);

  // Hook for wallet operations
  const { 
    saveWallet, 
    getBalance, 
    signTransaction, 
    enableWallet,
    loading, 
    error, 
    clearError 
  } = useWalletAPI();

  const { toast } = useToast();

  /**
   * Example 1: Save Wallet
   */
  const handleSaveWallet = async () => {
    try {
      clearError();
      const payload = {
        wallet_address: exampleAddress,
        chain: 'cardano',
      };
      console.log('Sending wallet:', payload);
      const result = await saveWallet(payload);

      toast({
        title: 'Success',
        description: `Wallet saved with ID: ${result.id}`,
      });

      console.log('Saved wallet:', result);
    } catch (err) {
      console.error('Save wallet error:', err);
    }
  };

  /**
   * Example 2: Get Balance
   */
  const handleGetBalance = async () => {
    try {
      clearError();
      const result = await getBalance(exampleAddress, network);

      toast({
        title: 'Balance Retrieved',
        description: `Balance: ${result.balance} ${result.currency}`,
      });

      console.log('Balance:', result);
    } catch (err) {
      console.error('Get balance error:', err);
    }
  };

  /**
   * Example 3: Sign Transaction
   */
  const handleSignTransaction = async () => {
    try {
      clearError();

      // Mock transaction data
      const txData = {
        data: 'transaction_hex_or_message_here',
        network: 'cardano',
        address: exampleAddress,
      };

      setTransactionData(txData);

      const result = await signTransaction(txData);

      toast({
        title: 'Transaction Signed',
        description: `Signature: ${result.signature.slice(0, 20)}...`,
      });

      console.log('Signed transaction:', result);
    } catch (err) {
      console.error('Sign transaction error:', err);
    }
  };

  /**
   * Example 4: Enable Wallet
   */
  const handleEnableWallet = async () => {
    try {
      clearError();
      const result = await enableWallet();

      toast({
        title: 'Wallet Enabled',
        description: `Networks: ${result.networks.join(', ')}`,
      });

      console.log('Wallet enabled:', result);
    } catch (err) {
      console.error('Enable wallet error:', err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">useWalletAPI Examples</h1>
        <p className="text-gray-600">
          Demonstrates all wallet API operations with loading and error handling
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State Info */}
      {loading && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Processing</AlertTitle>
          <AlertDescription>API request in progress...</AlertDescription>
        </Alert>
      )}

      {/* Example 1: Save Wallet */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 1: Save Wallet</h2>
        <p className="text-sm text-gray-600 mb-4">
          Send wallet address to the backend to persist it in the database.
        </p>

        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm font-mono">
            <pre className="text-xs overflow-x-auto">
{`const { saveWallet, loading, error } = useWalletAPI();

await saveWallet({
  address: '${exampleAddress}',
  network: 'cardano'
});`}
            </pre>
          </div>

          <Button 
            onClick={handleSaveWallet} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Try Save Wallet
          </Button>
        </div>
      </Card>

      {/* Example 2: Get Balance */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 2: Get Balance</h2>
        <p className="text-sm text-gray-600 mb-4">
          Query wallet balance from the backend (which queries the blockchain).
        </p>

        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm font-mono">
            <pre className="text-xs overflow-x-auto">
{`const { getBalance, loading, error } = useWalletAPI();

const balance = await getBalance(
  '${exampleAddress.slice(0, 20)}...',
  'cardano'
);

// Returns:
// {
//   address: '...',
//   balance: '1000000',
//   network: 'cardano',
//   currency: 'lovelace'
// }`}
            </pre>
          </div>

          <Button 
            onClick={handleGetBalance} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Try Get Balance
          </Button>
        </div>
      </Card>

      {/* Example 3: Sign Transaction */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 3: Sign Transaction</h2>
        <p className="text-sm text-gray-600 mb-4">
          Sign a transaction or message using the server-side SDK (API key secure).
        </p>

        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm font-mono">
            <pre className="text-xs overflow-x-auto">
{`const { signTransaction, loading, error } = useWalletAPI();

const signed = await signTransaction({
  data: 'transaction_hex_or_message',
  network: 'cardano',
  address: '${exampleAddress.slice(0, 20)}...'
});

// Returns:
// {
//   signature: 'mock_signature_1234',
//   signed_at: '2026-03-01T12:34:56Z',
//   address: '...',
//   network: 'cardano'
// }`}
            </pre>
          </div>

          {transactionData && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Signed</AlertTitle>
              <AlertDescription>
                Transaction signed successfully. Check console for details.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleSignTransaction} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Try Sign Transaction
          </Button>
        </div>
      </Card>

      {/* Example 4: Enable Wallet */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 4: Enable Wallet</h2>
        <p className="text-sm text-gray-600 mb-4">
          Initialize and enable Web3 wallet connection on the server.
        </p>

        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm font-mono">
            <pre className="text-xs overflow-x-auto">
{`const { enableWallet, loading, error } = useWalletAPI();

const result = await enableWallet();

// Returns:
// {
//   enabled: true,
//   networks: ['cardano', 'bitcoin', 'spark'],
//   message: 'Wallet enabled for project...'
// }`}
            </pre>
          </div>

          <Button 
            onClick={handleEnableWallet} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Try Enable Wallet
          </Button>
        </div>
      </Card>

      {/* Hook Return Values */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-xl font-bold mb-4">Hook Return Values</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-mono font-bold text-blue-700">loading: boolean</p>
            <p className="text-gray-700">True while an API request is in progress</p>
          </div>
          <div>
            <p className="font-mono font-bold text-blue-700">error: string | null</p>
            <p className="text-gray-700">Error message if a request fails, null otherwise</p>
          </div>
          <div>
            <p className="font-mono font-bold text-blue-700">clearError(): void</p>
            <p className="text-gray-700">Function to manually clear the error state</p>
          </div>
        </div>
      </Card>

      {/* Usage Tips */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h2 className="text-xl font-bold mb-4">✓ Best Practices</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span>✓</span>
            <span>Call <code className="bg-white px-1 rounded">clearError()</code> before making a request</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Use <code className="bg-white px-1 rounded">loading</code> state to disable buttons</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Display <code className="bg-white px-1 rounded">error</code> messages to users</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Wrap async calls in try/catch for full control</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Check browser console for detailed error logs</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
