#!/bin/bash
# WALLET CONNECTION QUICK START

echo "
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║         React Wallet Connection Flow - Quick Start             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
"

echo "📁 FILES CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "
✅ frontend/src/hooks/useWalletAPI.js
   └─ Reusable hook for all wallet API operations
   └─ Exports: saveWallet, getBalance, signTransaction, enableWallet

✅ frontend/src/components/ConnectWallet.tsx
   └─ Complete wallet connection UI component
   └─ Features: connect, disconnect, balance display, localStorage

✅ frontend/src/components/WalletExample.tsx
   └─ Live examples showing all API operations
   └─ Demonstrates error handling and loading states

✅ frontend/src/pages/DashboardExample.tsx
   └─ Integration example for Dashboard page
   └─ Shows how to use components in real app

✅ frontend/WALLET_CONNECTION_FLOW.md
   └─ Comprehensive documentation
   └─ Usage patterns, troubleshooting, best practices
"

echo "🚀 QUICK USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
1. IMPORT & USE HOOK

   import { useWalletAPI } from '../hooks/useWalletAPI';
   
   const { saveWallet, getBalance, loading, error } = useWalletAPI();

2. SAVE WALLET ADDRESS

   await saveWallet({
     address: 'addr_test1vrr6r...',
     network: 'cardano'
   });

3. GET BALANCE

   const balance = await getBalance(address, 'cardano');
   console.log(balance.balance); // in lovelace

4. SIGN TRANSACTION

   const signed = await signTransaction({
     data: 'transaction_hex',
     network: 'cardano',
     address: 'addr_test1vrr6r...'
   });

5. HANDLE ERRORS

   if (error) {
     console.error('API Error:', error);
     // Show to user
   }

6. SHOW LOADING

   <button disabled={loading}>
     {loading ? 'Loading...' : 'Save'}
   </button>

EOF

echo "
📋 COMPONENT USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
// Simple: Just add to your page
import { ConnectWallet } from '../components/ConnectWallet';

export function Dashboard() {
  return <ConnectWallet />;
}

// Advanced: Use hook directly
import { useWalletAPI } from '../hooks/useWalletAPI';

export function MyComponent() {
  const { saveWallet, getBalance, loading, error } = useWalletAPI();
  
  const handleConnect = async () => {
    try {
      const result = await saveWallet({
        address: 'addr_test1vrr6r...',
        network: 'cardano'
      });
      console.log('Saved:', result);
    } catch (err) {
      console.error('Error:', error);
    }
  };
  
  return <button onClick={handleConnect}>Connect</button>;
}

EOF

echo "
🔧 CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
Frontend .env (frontend/.env):
  VITE_API_URL=http://localhost:8000
  VITE_UTXOS_PROJECT_ID=your-project-id

Backend .env (backend/.env):
  DJANGO_SECRET_KEY=...
  DJANGO_DEBUG=1
  UTXOS_API_KEY=sk_test_...  (KEEP SECRET!)
  ALLOWED_HOSTS=localhost,127.0.0.1

EOF

echo "
⚙️  API ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
POST /api/wallets/save/
  • Save wallet address to database
  • Body: { address: string, network: string }
  • Returns: { id, address, network, created_at }

GET /api/wallets/balance/<address>/?network=cardano
  • Get wallet balance
  • Query: ?network=cardano
  • Returns: { address, balance, network, currency }

POST /api/wallets/sign/
  • Sign transaction server-side
  • Body: { data: string, network: string, address: string }
  • Returns: { signature, signed_at, address, network }

POST /api/wallets/enable/
  • Initialize wallet connection
  • Body: {} or { project_id: string }
  • Returns: { enabled: bool, networks: array, message: string }

EOF

echo "
✓ STATE MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
Hook Return Values:

  loading: boolean
    • true while API request is in progress
    • Use to disable buttons: <button disabled={loading}>

  error: string | null
    • Error message if request failed
    • null if no error
    • Display to user in Alert component

  clearError(): void
    • Function to clear error state
    • Call before making new request

  saveWallet(walletData)
    • Save wallet address to backend
    • Params: { address: string, network: string }
    • Returns: Promise<WalletRecord>

  getBalance(address, network)
    • Get wallet balance
    • Params: address string, network string
    • Returns: Promise<BalanceInfo>

  signTransaction(payload)
    • Sign transaction server-side
    • Params: { data, network, address }
    • Returns: Promise<SignedTx>

  enableWallet(projectId)
    • Initialize wallet
    • Params: projectId string (optional)
    • Returns: Promise<WalletEnableResult>

EOF

echo "
💾 LOCAL STORAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
ConnectWallet component automatically saves:

  localStorage.setItem('wallet_address', address)
  localStorage.setItem('wallet_network', network)

On disconnect, automatically clears:

  localStorage.removeItem('wallet_address')
  localStorage.removeItem('wallet_network')

On mount, automatically restores from localStorage:

  const savedAddress = localStorage.getItem('wallet_address')
  // Restores wallet state

EOF

echo "
🧪 TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
1. Start backend
   cd backend && python manage.py runserver 127.0.0.1:8000

2. Start frontend
   cd frontend && npm run dev

3. Visit browser
   http://localhost:5173

4. Click "Connect Wallet"
   • Should show connected state
   • Should display balance
   • Should show network

5. Check browser console
   • Look for API responses
   • Check for errors
   • Verify localStorage updated

6. Disconnect and refresh
   • Wallet state should restore from localStorage

EOF

echo "
📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
Full documentation:
  frontend/WALLET_CONNECTION_FLOW.md

Includes:
  • Complete usage guide
  • Error handling patterns
  • Loading state management
  • localStorage persistence
  • Real wallet integration steps
  • Environment setup
  • Component structure
  • API endpoint reference
  • Best practices
  • Troubleshooting

View with:
  cat frontend/WALLET_CONNECTION_FLOW.md

EOF

echo "
🐛 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
"API Error 404"
  → Backend not running on http://localhost:8000
  → Check Django URLs configured
  → Verify VITE_API_URL in frontend/.env

"API Error 500"
  → Backend error - check Django logs
  → Verify backend/.env configured
  → Check Django server is running

"CORS Error"
  → Check CORS enabled in Django settings
  → Verify ALLOWED_HOSTS includes localhost
  → Restart Django server

"Loading never completes"
  → Check browser Network tab
  → Look for API response errors
  → Check JavaScript console for errors

"Wallet not persisting"
  → Check localStorage is enabled in browser
  → Verify browser isn't in private mode
  → Check keys: 'wallet_address', 'wallet_network'

EOF

echo "
✅ CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

cat << 'EOF'
Before going to production:

  [ ] Replace mock wallet with real wallet SDK
  [ ] Add real transaction signing logic
  [ ] Implement transaction history
  [ ] Add comprehensive error messages
  [ ] Set up error monitoring (Sentry, etc.)
  [ ] Add rate limiting
  [ ] Implement retry logic
  [ ] Add unit tests
  [ ] Add integration tests
  [ ] Setup staging environment
  [ ] Configure production backend URL
  [ ] Enable HTTPS for all endpoints
  [ ] Setup database backups
  [ ] Configure monitoring/alerts

EOF

echo "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Status: ✅ Ready to use"
echo "Last Updated: March 1, 2026"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
