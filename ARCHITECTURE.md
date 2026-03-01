# UTXOS Wallet Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vite React PWA)               │
│                         localhost:5173                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  src/components/                                                 │
│  ├── ConnectWalletButton.tsx  ────────┐                         │
│  └── WalletInfoCard.tsx               │                         │
│                                       │                         │
│  src/services/api.js                  │                         │
│  ├── saveWallet(payload)              ├──────► HTTP Calls       │
│  ├── getBalance(address)              │       (CORS enabled)    │
│  ├── signWallet(data)                 │                         │
│  └── enableWallet(projectId)          │                         │
│                                       │                         │
│  .env                                 │                         │
│  └── VITE_API_URL=http://localhost:8000
│                                       │                         │
└───────────────────────────────────────┼─────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DJANGO BACKEND REST API                       │
│                     localhost:8000                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  REST Endpoints:                                                 │
│  ├── POST   /api/wallets/save/               [SaveWalletView]   │
│  ├── POST   /api/wallets/sign/               [SignWalletView]   │
│  ├── GET    /api/wallets/balance/<address>/  [BalanceView]      │
│  └── POST   /api/wallets/enable/             [EnableWalletView] │
│                                                                   │
│  Django Views (wallets/views.py)                                │
│  ├── SaveWalletView                                             │
│  ├── SignWalletView                                             │
│  ├── BalanceView                                                │
│  └── EnableWalletView                                           │
│                 │                                                │
│                 ▼                                                │
│  wallets/services/utxos_service.py                              │
│  ├── sign_transaction(payload)                                  │
│  ├── get_wallet_balance(address, network)                       │
│  └── enable_wallet(project_id)                                  │
│                 │                                                │
│                 ▼                                                │
│  .env (Server-side only - API keys secure)                      │
│  ├── UTXOS_API_KEY          ◄─── NEVER sent to frontend        │
│  ├── UTXOS_PROJECT_ID       ◄─── Loaded in Django settings     │
│  ├── DJANGO_SECRET_KEY                                          │
│  └── DJANGO_DEBUG                                               │
│                                                                   │
│  Database (SQLite/PostgreSQL)                                   │
│  └── wallets/models.py                                          │
│      └── Wallet(wallet_address, created_at)                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
                    ┌─────────────────────────────┐
                    │   UTXOS SDK (When ready)    │
                    │  (Python wrapper or Node)   │
                    └─────────────────────────────┘
                                        │
                                        ▼
                    ┌─────────────────────────────┐
                    │  Blockchain Networks        │
                    ├─────────────────────────────┤
                    │ • Cardano                   │
                    │ • Bitcoin                   │
                    │ • Spark                     │
                    └─────────────────────────────┘
```

## Data Flow: Sign Transaction

```
User clicks "Sign" button
         │
         ▼
ConnectWalletButton.tsx calls signWallet()
         │
         ▼
api.js sends POST to /api/wallets/sign/ with payload
         │
         ▼
Django receives request at SignWalletView.post()
         │
         ▼
Validates payload (contains "data" field)
         │
         ▼
Calls utxos_service.sign_transaction(payload)
         │
         ▼
_get_sdk() initializes with UTXOS_API_KEY (from .env)
         │
         ▼
Returns mock signature (or real SDK call when available)
         │
         ▼
SignWalletView returns Response with signature
         │
         ▼
Frontend receives signed transaction result
         │
         ▼
Display success toast notification
```

## Data Flow: Get Balance

```
User views wallet card
         │
         ▼
WalletInfoCard.tsx calls getBalance(address)
         │
         ▼
api.js sends GET to /api/wallets/balance/<address>/?network=cardano
         │
         ▼
Django receives request at BalanceView.get()
         │
         ▼
Validates wallet_address parameter
         │
         ▼
Calls utxos_service.get_wallet_balance(address, network)
         │
         ▼
_get_sdk() initializes with UTXOS_API_KEY (from .env)
         │
         ▼
Returns mock balance (or real blockchain query when SDK ready)
         │
         ▼
BalanceView returns Response with balance data
         │
         ▼
Frontend receives balance and displays in card
```

## Security Model

### ✅ What the Frontend CAN see:
- Public wallet addresses
- Balance information
- Transaction status (signed/unsigned)
- Network information (Cardano, Bitcoin, etc.)

### ❌ What the Frontend CANNOT see:
- API keys (`UTXOS_API_KEY`)
- Private keys
- Secret credentials
- Signing logic implementation details

### 🔐 How Security is Maintained:
```
Backend .env (SECURE - server-side only)
    │
    ├─ UTXOS_API_KEY=sk_test_...        ◄──── Never leaves server
    ├─ UTXOS_PROJECT_ID=...
    └─ DJANGO_SECRET_KEY=...
    
Frontend .env (PUBLIC - safe to expose)
    │
    ├─ VITE_API_URL=http://localhost:8000
    └─ VITE_UTXOS_PROJECT_ID=...
```

## File Structure

```
backend/
├── .env                              ◄──── SECRET (never commit)
├── .env.example                      ◄──── Template (safe)
├── requirements.txt
├── manage.py
├── utxos_backend/
│   ├── settings.py                   ◄──── Loads .env vars
│   ├── urls.py
│   ├── wsgi.py
│   └── __init__.py
├── wallets/
│   ├── migrations/
│   ├── services/
│   │   ├── __init__.py
│   │   └── utxos_service.py          ◄──── Core service logic
│   ├── models.py
│   ├── serializers.py
│   ├── views.py                      ◄──── REST endpoints
│   ├── urls.py
│   ├── admin.py
│   ├── apps.py
│   └── tests.py
├── UTXOS_SERVICE_SETUP.md            ◄──── Full documentation
└── IMPLEMENTATION_SUMMARY.md         ◄──── This project summary

frontend/
├── .env                              ◄──── Frontend config
├── src/
│   ├── services/api.js               ◄──── HTTP client
│   ├── components/
│   │   ├── ConnectWalletButton.tsx
│   │   └── WalletInfoCard.tsx
│   └── pages/
│       └── Dashboard.tsx
└── vite.config.ts
```

## API Endpoint Contract

### 1. Save Wallet

```http
POST /api/wallets/save/
Content-Type: application/json

{
  "address": "addr_test1vrr6r...",
  "network": "cardano"
}

✅ 201 Created
{
  "id": 1,
  "address": "addr_test1vrr6r...",
  "network": "cardano",
  "created_at": "2026-03-01T12:34:56Z"
}

❌ 400 Bad Request
{
  "error": "Payload must contain 'address' field"
}
```

### 2. Sign Transaction

```http
POST /api/wallets/sign/
Content-Type: application/json

{
  "data": "transaction_hex_or_message",
  "network": "cardano",
  "address": "addr_test1vrr6r..."
}

✅ 200 OK
{
  "signature": "mock_signature_1234",
  "signed_at": "2026-03-01T12:34:56Z",
  "address": "addr_test1vrr6r...",
  "network": "cardano",
  "transaction_id": null
}

❌ 400 Bad Request
{
  "error": "Payload must contain 'data' field"
}

❌ 500 Internal Server Error
{
  "error": "UTXOS_API_KEY not configured in settings"
}
```

### 3. Get Balance

```http
GET /api/wallets/balance/addr_test1vrr6r.../?network=cardano
Content-Type: application/json

✅ 200 OK
{
  "address": "addr_test1vrr6r...",
  "balance": "1000000",
  "network": "cardano",
  "currency": "lovelace"
}

❌ 400 Bad Request
{
  "error": "Address cannot be empty"
}
```

### 4. Enable Wallet

```http
POST /api/wallets/enable/
Content-Type: application/json

{
  "project_id": "optional_override_project_id"
}

✅ 200 OK
{
  "enabled": true,
  "networks": ["cardano", "bitcoin", "spark"],
  "message": "Wallet enabled for project..."
}

❌ 400 Bad Request
{
  "error": "Project ID cannot be empty"
}
```

## Environment Variables

### Backend (.env) - KEEP SECRET ⚠️
```env
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=1
UTXOS_API_KEY=sk_test_your_api_key_here    # NEVER expose
UTXOS_PROJECT_ID=your-project-id-here       # NEVER expose
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env) - Safe to expose ✅
```env
VITE_API_URL=http://localhost:8000
VITE_UTXOS_PROJECT_ID=your-project-id  # Public identifier only
```

## Deployment Checklist

- [ ] Generate strong `DJANGO_SECRET_KEY`
- [ ] Set `DJANGO_DEBUG=0`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Set `CORS_ALLOWED_ORIGINS` to specific domains (not `*`)
- [ ] Use HTTPS everywhere
- [ ] Store `.env` in secure secrets manager (not git)
- [ ] Rotate API keys regularly
- [ ] Enable Django logging
- [ ] Set up database backups
- [ ] Configure error monitoring (Sentry, etc.)

## Next Steps

1. **Setup**:
   ```bash
   bash quickstart.sh
   ```

2. **Configure credentials**:
   ```bash
   nano backend/.env
   ```

3. **Run servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && source .venv/bin/activate && python manage.py runserver
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

4. **Test endpoints**:
   ```bash
   curl -X POST http://localhost:8000/api/wallets/sign/ \
     -H "Content-Type: application/json" \
     -d '{"data":"test","network":"cardano"}'
   ```

5. **Read documentation**:
   - `backend/UTXOS_SERVICE_SETUP.md` - Full service guide
   - `backend/IMPLEMENTATION_SUMMARY.md` - Implementation details

---

**Status**: ✅ Ready for development  
**Last Updated**: March 1, 2026  
**Architecture**: Django REST Backend + Vite React Frontend  
**Security**: API keys secured server-side ✅
