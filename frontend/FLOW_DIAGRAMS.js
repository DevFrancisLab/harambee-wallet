// VISUAL GUIDE: Complete Wallet Connection Flow

/**
 * ARCHITECTURE DIAGRAM
 * ═══════════════════════════════════════════════════════════════════════════
 */

/*
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          REACT FRONTEND (Vite)                             │
│                      http://localhost:5173                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Page / Component                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │                     Dashboard.tsx                              │      │
│  │  ┌─────────────────────────────────────────────────────────┐  │      │
│  │  │  <ConnectWallet />                                      │  │      │
│  │  │                                                         │  │      │
│  │  │  Shows UI:                                              │  │      │
│  │  │  • Connect Button (disconnected)                        │  │      │
│  │  │  • Wallet Info (connected)                              │  │      │
│  │  │  • Balance Display                                      │  │      │
│  │  │  • Disconnect Button                                    │  │      │
│  │  └─────────────────────────────────────────────────────────┘  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│           ▲                                    ▼                            │
│           │                                    │                            │
│  Hook Layer                        State Management                        │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │              useWalletAPI Hook                                  │      │
│  │  ┌──────────────────────────────────────────────────────────┐  │      │
│  │  │                                                          │  │      │
│  │  │  const {                                                │  │      │
│  │  │    saveWallet,      // POST /api/wallets/save/        │  │      │
│  │  │    getBalance,      // GET /api/wallets/balance/<>    │  │      │
│  │  │    signTransaction, // POST /api/wallets/sign/        │  │      │
│  │  │    enableWallet,    // POST /api/wallets/enable/      │  │      │
│  │  │    loading,         // boolean - API in progress       │  │      │
│  │  │    error,           // string | null - Error message   │  │      │
│  │  │    clearError       // () => void - Clear error state  │  │      │
│  │  │  } = useWalletAPI()                                    │  │      │
│  │  │                                                          │  │      │
│  │  └──────────────────────────────────────────────────────────┘  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│           ▲                                    ▼                            │
│           │                                    │                            │
│  Services Layer                       API Wrapper                         │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │                  src/services/api.js                            │      │
│  │  ┌──────────────────────────────────────────────────────────┐  │      │
│  │  │                                                          │  │      │
│  │  │  request(path, options) {                               │  │      │
│  │  │    • Constructs full URL from VITE_API_URL             │  │      │
│  │  │    • Sets Content-Type: application/json               │  │      │
│  │  │    • Handles response status codes                      │  │      │
│  │  │    • Throws on non-OK responses                         │  │      │
│  │  │    • Returns parsed JSON                                │  │      │
│  │  │  }                                                       │  │      │
│  │  │                                                          │  │      │
│  │  └──────────────────────────────────────────────────────────┘  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│           ▲                                    ▼                            │
│           │                             HTTP Requests                     │
│           │                             fetch() API                       │
│           │                                    ▼                            │
│           │         ┌──────────────────────────────────────────┐         │
│           │         │ Headers:                                 │         │
│           │         │ • Content-Type: application/json        │         │
│           │         │ • credentials: include                  │         │
│           │         └──────────────────────────────────────────┘         │
│           │                                    ▼                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Network (HTTP/HTTPS)                                                       │
│  ═══════════════════════════════════════════════════════════════════════════  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                       DJANGO BACKEND (REST API)                            │
│                      http://localhost:8000                                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Routes                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │  /api/wallets/save/       ──→  SaveWalletView                  │      │
│  │  /api/wallets/balance/<>/ ──→  BalanceView                     │      │
│  │  /api/wallets/sign/       ──→  SignWalletView                  │      │
│  │  /api/wallets/enable/     ──→  EnableWalletView                │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│           ▲                                    ▼                            │
│           │                            Django Views                        │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │  class SaveWalletView(APIView):                                 │      │
│  │    def post(self, request):                                     │      │
│  │      serializer = WalletSerializer(data=request.data)          │      │
│  │      if serializer.is_valid():                                  │      │
│  │        wallet = serializer.save()                               │      │
│  │        return Response(serializer.data, 201)                   │      │
│  │                                                                  │      │
│  │  class SignWalletView(APIView):                                 │      │
│  │    def post(self, request):                                     │      │
│  │      result = sign_transaction(request.data)                   │      │
│  │      return Response(result)                                    │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│           ▲                                    ▼                            │
│           │                           Service Layer                       │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │            wallets/services/utxos_service.py                    │      │
│  │  ┌──────────────────────────────────────────────────────────┐  │      │
│  │  │ sign_transaction(payload)                                │  │      │
│  │  │ └─ Loads UTXOS_API_KEY from settings                    │  │      │
│  │  │    (from .env, never exposed to frontend)               │  │      │
│  │  │ └─ Calls _get_sdk() for initialization                  │  │      │
│  │  │ └─ Signs transaction server-side                        │  │      │
│  │  │ └─ Returns signed result                                │  │      │
│  │  │                                                          │  │      │
│  │  │ get_wallet_balance(address, network)                    │  │      │
│  │  │ └─ Queries blockchain via SDK                           │  │      │
│  │  │ └─ Returns balance in lowest unit                       │  │      │
│  │  │                                                          │  │      │
│  │  │ enable_wallet(project_id)                               │  │      │
│  │  │ └─ Initializes wallet connection                        │  │      │
│  │  │ └─ Returns available networks                           │  │      │
│  │  └──────────────────────────────────────────────────────────┘  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│           ▲                                    ▼                            │
│           │                          SDK Abstraction                      │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │                  UTXOS SDK (Python Package)                     │      │
│  │                  @utxos/sdk equivalent for Python              │      │
│  │  ┌──────────────────────────────────────────────────────────┐  │      │
│  │  │ • Web3Wallet initialization                             │  │      │
│  │  │ • Transaction signing                                    │  │      │
│  │  │ • Balance queries                                        │  │      │
│  │  │ • Network support: Cardano, Bitcoin, Spark              │  │      │
│  │  │                                                          │  │      │
│  │  │ Current: Mock implementation (ready for real SDK)       │  │      │
│  │  └──────────────────────────────────────────────────────────┘  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│           ▲                                    ▼                            │
│           │                        Configuration                          │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │               backend/.env (SECURE - server-side only)          │      │
│  │  ┌──────────────────────────────────────────────────────────┐  │      │
│  │  │ UTXOS_API_KEY=sk_test_...        (⚠️  NEVER to frontend)│  │      │
│  │  │ UTXOS_PROJECT_ID=...                                     │  │      │
│  │  │ DJANGO_SECRET_KEY=...                                    │  │      │
│  │  │ DJANGO_DEBUG=1                                           │  │      │
│  │  │ ALLOWED_HOSTS=localhost,127.0.0.1                       │  │      │
│  │  │                                                          │  │      │
│  │  │ ✅ Keys loaded via django.conf.settings               │  │      │
│  │  │ ✅ Never logged or exposed                             │  │      │
│  │  │ ✅ Only used server-side                               │  │      │
│  │  └──────────────────────────────────────────────────────────┘  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
*/

/**
 * DATA FLOW SEQUENCE DIAGRAM
 * ═══════════════════════════════════════════════════════════════════════════
 */

/*
CONNECT WALLET FLOW:

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend   │         │  Database   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
   1.  │ User clicks button    │                       │
       │ ─────────────────────→│                       │
       │                       │                       │
   2.  │ POST /save/           │                       │
       │ {address, network}    │                       │
       │ ─────────────────────→│                       │
       │                       │ Save wallet           │
       │                       │ ──────────────────────→
       │                       │                       │
       │                       │ ←──────────────────────
       │                       │ Return ID & address   │
       │                       │                       │
       │ ←─────────────────────│                       │
       │ 201 Created           │                       │
       │                       │                       │
   3.  │ Store in localStorage │                       │
       │ Update UI state       │                       │
       │                       │                       │
   4.  │ GET /balance/addr/    │                       │
       │ ─────────────────────→│                       │
       │                       │ Query SDK             │
       │                       │ (using API key)       │
       │                       │                       │
       │ ←─────────────────────│                       │
       │ {balance}             │                       │
       │                       │                       │
   5.  │ Display connected     │                       │
       │ with balance          │                       │
       │                       │                       │

STATE CHANGES IN FRONTEND HOOK:

1. Initial: loading=false, error=null
2. Request sent: loading=true, error=null
3. Response received: loading=false, error=null
4. Error: loading=false, error="message"

UI UPDATES:

loading=true:
  • Button disabled
  • Show spinner
  • "Connecting..." text

loading=false, error=null:
  • Button enabled
  • Hide spinner
  • Show normal text

error != null:
  • Show Alert with error
  • Button still enabled (retry)
  • clearError() on retry
*/

/**
 * COMPONENT INTERACTION DIAGRAM
 * ═══════════════════════════════════════════════════════════════════════════
 */

/*
┌─────────────────────────────────────────────────────────────────────────┐
│                         useWalletAPI Hook                              │
│                    (src/hooks/useWalletAPI.js)                         │
│                                                                         │
│  Manages:                                                               │
│  • loading state (useState)                                            │
│  • error state (useState)                                              │
│  • API requests (useCallback)                                          │
│                                                                         │
│  Returns:                                                               │
│  • saveWallet(walletData)      → Promise<Wallet>                      │
│  • getBalance(address, net)    → Promise<Balance>                     │
│  • signTransaction(payload)    → Promise<SignedTx>                    │
│  • enableWallet(projectId)     → Promise<WalletInfo>                  │
│  • loading                      → boolean                              │
│  • error                        → string | null                        │
│  • clearError()                 → void                                 │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │  const request = useCallback(async (path, options) => {      │   │
│  │    const url = ${API_BASE_URL}${path}                        │   │
│  │    setError(null)                                            │   │
│  │    setLoading(true)                                          │   │
│  │                                                               │   │
│  │    try {                                                       │   │
│  │      const response = await fetch(url, {                     │   │
│  │        credentials: 'include',                               │   │
│  │        headers: {'Content-Type': 'application/json'},       │   │
│  │        ...options                                            │   │
│  │      })                                                        │   │
│  │      if (!response.ok) throw new Error(...)                  │   │
│  │      return await response.json()                            │   │
│  │    } catch(err) {                                            │   │
│  │      setError(err.message)                                   │   │
│  │      throw err                                               │   │
│  │    } finally {                                               │   │
│  │      setLoading(false)                                       │   │
│  │    }                                                          │   │
│  │  })                                                           │   │
│  │                                                               │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
                      Used by components:
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                      ConnectWallet Component                            │
│               (src/components/ConnectWallet.tsx)                        │
│                                                                         │
│  const { saveWallet, getBalance, loading, error, clearError }          │
│    = useWalletAPI()                                                     │
│                                                                         │
│  States:                                                                │
│  • connected: boolean (from localStorage)                              │
│  • walletAddress: string | null                                        │
│  • walletNetwork: string | null                                        │
│  • walletBalance: BalanceInfo | null                                   │
│                                                                         │
│  Handlers:                                                              │
│  • handleConnect: async - Calls saveWallet + getBalance               │
│  • handleDisconnect: void - Clears state + localStorage               │
│  • handleCopyAddress: void - Copy to clipboard + toast                │
│                                                                         │
│  Rendering:                                                             │
│  • Not connected: Show connect button                                   │
│  • Connected: Show wallet info + balance                               │
│  • Loading: Show spinner + "Connecting..." text                        │
│  • Error: Show alert with error message                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
                      Used by pages:
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                      Dashboard Page                                     │
│               (src/pages/Dashboard.tsx)                                 │
│                                                                         │
│  import { ConnectWallet } from '../components/ConnectWallet'           │
│                                                                         │
│  export function Dashboard() {                                          │
│    return (                                                              │
│      <div>                                                               │
│        <h1>Dashboard</h1>                                               │
│        <ConnectWallet />                                               │
│      </div>                                                              │
│    )                                                                     │
│  }                                                                       │
│                                                                         │
│  Usage:                                                                  │
│  • Just add <ConnectWallet /> component                                │
│  • Handles all UI, state, and API calls                                │
│  • localStorage persistence automatic                                  │
│  • Toast notifications automatic                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
*/

/**
 * STATE FLOW DIAGRAM
 * ═══════════════════════════════════════════════════════════════════════════
 */

/*
Not Connected
┌───────────────────────┐
│ connected: false      │
│ address: null         │
│ balance: null         │
│ network: null         │
│                       │
│ UI: [Connect] button  │
└─────────────┬─────────┘
              │
              │ User clicks "Connect"
              │ saveWallet() called
              ▼
Connecting (Loading)
┌──────────────────────────┐
│ loading: true            │
│ error: null              │
│ connected: false         │
│                          │
│ UI: [Connecting...] (disabled)
│     Spinner shown        │
└─────────────┬────────────┘
              │
              │ Response received
              ▼
Connected (Success)
┌──────────────────────────┐
│ connected: true          │
│ loading: false           │
│ error: null              │
│ address: "addr_test..."  │
│ balance: "1000000"       │
│ network: "cardano"       │
│                          │
│ UI: Wallet info + balance
│     [Disconnect] button  │
│     Success toast        │
└─────────────┬────────────┘
              │
              │ Error occurs
              ▼
Error State
┌──────────────────────────┐
│ loading: false           │
│ error: "API Error..."    │
│ connected: false         │
│                          │
│ UI: Alert with error     │
│     [Retry] available    │
│     clearError() on retry
└──────────────────────────┘

LIFECYCLE:

Mount
  │
  ├─ Check localStorage
  │  └─ If wallet stored: restore state + fetch balance
  │
Connect
  │
  ├─ clearError()
  ├─ loading = true
  ├─ saveWallet(address, network)
  ├─ loading = false
  ├─ Save to localStorage
  ├─ getBalance()
  ├─ Update state
  ├─ Show toast
  │
Disconnect
  │
  ├─ Clear state
  ├─ Clear localStorage
  ├─ Show toast
  │
Error
  │
  ├─ error = message
  ├─ Show alert
  ├─ Button remains clickable
  ├─ clearError() on retry
  │
Cleanup (Unmount)
  │
  └─ (localStorage persists automatically)
*/
