/**
 * Integration Example: Update Dashboard with ConnectWallet
 * 
 * This file shows how to integrate the wallet connection flow into your existing
 * Dashboard page.
 */

import { ConnectWallet } from '../components/ConnectWallet';
import { WalletExample } from '../components/WalletExample';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

/**
 * Updated Dashboard page with wallet integration
 */
export function Dashboard() {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Harambee Wallet
          </h1>
          <p className="text-xl text-gray-600">
            Multi-chain wallet management for Cardano, Bitcoin, and Spark
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet Connection (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-6">Connect Your Wallet</h2>
              <ConnectWallet />
            </div>
          </div>

          {/* Right Column - Info (1/3 width) */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-bold text-lg text-blue-900 mb-4">
                Quick Start
              </h3>
              <ol className="space-y-3 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="font-bold flex-shrink-0">1.</span>
                  <span>Click "Connect Wallet"</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold flex-shrink-0">2.</span>
                  <span>Authorize the connection</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold flex-shrink-0">3.</span>
                  <span>View your balance</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold flex-shrink-0">4.</span>
                  <span>Sign transactions</span>
                </li>
              </ol>
            </div>

            {/* Features Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
              <h3 className="font-bold text-lg text-green-900 mb-4">
                Features
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Multi-chain support</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Secure signing</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Balance tracking</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Transaction history</span>
                </li>
              </ul>
            </div>

            {/* Support Card */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                View API examples and usage patterns
              </p>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
              >
                {showExamples ? 'Hide Examples' : 'Show Examples'}
              </button>
            </div>
          </div>
        </div>

        {/* Examples Section - Show/Hide */}
        {showExamples && (
          <div className="mt-12">
            <WalletExample />
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">Total Balance</p>
                    <p className="text-2xl font-bold text-blue-900">--</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600">Connected Wallets</p>
                    <p className="text-2xl font-bold text-green-900">0</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-purple-900">0</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="transactions">
                <div className="text-center py-8 text-gray-500">
                  <p>No transactions yet. Connect your wallet to get started.</p>
                </div>
              </TabsContent>

              <TabsContent value="network">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Cardano Mainnet</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Bitcoin Mainnet</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Idle
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Spark Network</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Idle
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* API Reference Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">API Reference</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Endpoint Cards */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                    POST
                  </span>
                  <code className="text-sm font-mono text-gray-700">
                    /api/wallets/save/
                  </code>
                </div>
                <p className="text-sm text-gray-600">
                  Save wallet address to backend database
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                    GET
                  </span>
                  <code className="text-sm font-mono text-gray-700">
                    /api/wallets/balance/...
                  </code>
                </div>
                <p className="text-sm text-gray-600">
                  Query wallet balance from blockchain
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                    POST
                  </span>
                  <code className="text-sm font-mono text-gray-700">
                    /api/wallets/sign/
                  </code>
                </div>
                <p className="text-sm text-gray-600">
                  Sign transaction server-side with API key secure
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                    POST
                  </span>
                  <code className="text-sm font-mono text-gray-700">
                    /api/wallets/enable/
                  </code>
                </div>
                <p className="text-sm text-gray-600">
                  Initialize Web3 wallet connection
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Development Notes */}
        <div className="mt-12 mb-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <h3 className="font-bold text-yellow-900 mb-2">
              Development Notes
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>
                • Currently using mock wallet. Replace with real wallet SDK (Nami, Eternl, etc.)
              </li>
              <li>
                • Backend API key is secure (server-side only)
              </li>
              <li>
                • Frontend .env can be public (no secrets)
              </li>
              <li>
                • Wallet state persists in localStorage
              </li>
              <li>
                • See WALLET_CONNECTION_FLOW.md for complete documentation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Quick Usage Guide - Add to your Dashboard.tsx:
 * 
 * import { ConnectWallet } from '../components/ConnectWallet';
 * 
 * export function DashboardPage() {
 *   return (
 *     <div>
 *       <h1>My Dashboard</h1>
 *       <ConnectWallet />
 *     </div>
 *   );
 * }
 */

/**
 * Using the useWalletAPI hook directly:
 * 
 * import { useWalletAPI } from '../hooks/useWalletAPI';
 * 
 * export function MyComponent() {
 *   const { saveWallet, getBalance, loading, error } = useWalletAPI();
 *   
 *   const handleSave = async () => {
 *     try {
 *       const result = await saveWallet({
 *         address: 'addr_test1vrr6r...',
 *         network: 'cardano'
 *       });
 *       console.log('Saved:', result);
 *     } catch (err) {
 *       console.error('Error:', error);
 *     }
 *   };
 *   
 *   return (
 *     <button onClick={handleSave} disabled={loading}>
 *       Save Wallet
 *     </button>
 *   );
 * }
 */
