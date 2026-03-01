# Django UTXOS Service Implementation Summary

## Files Created/Updated

### Backend Service Files

✅ **`wallets/services/utxos_service.py`** (NEW)
- Main service module with secure SDK initialization
- Functions:
  - `sign_transaction(payload)` - Sign transactions server-side
  - `get_wallet_balance(address, network)` - Query wallet balance
  - `enable_wallet(project_id)` - Initialize Web3 wallet
- All API keys loaded from `.env` via Django settings
- Never exposes sensitive credentials to frontend

✅ **`wallets/services/__init__.py`** (NEW)
- Package init file for the services module

### Configuration Files

✅ **`backend/.env`** (NEW)
- Environment variables for local development
- Contains `UTXOS_API_KEY` and `UTXOS_PROJECT_ID`
- Also loads `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`

✅ **`backend/.env.example`** (UPDATED)
- Template for `.env` configuration
- Documents all required variables
- Safe to commit to git (no secrets)

✅ **`utxos_backend/settings.py`** (UPDATED)
- Added `.env` loading via `python-dotenv`
- Loads `UTXOS_API_KEY` and `UTXOS_PROJECT_ID` into settings
- Added logging configuration for wallet operations

### View Layer Updates

✅ **`wallets/views.py`** (UPDATED)
- Refactored to use new `utxos_service`
- `SaveWalletView` - saves wallet addresses
- `SignWalletView` - calls `sign_transaction()`
- `BalanceView` - calls `get_wallet_balance()`
- `EnableWalletView` - calls `enable_wallet()` (NEW)
- Added comprehensive logging and error handling

### URL Routing

✅ **`wallets/urls.py`** (UPDATED)
- `/api/wallets/save/` - POST to save wallet
- `/api/wallets/sign/` - POST to sign transaction
- `/api/wallets/balance/<wallet_address>/` - GET balance
- `/api/wallets/enable/` - POST to enable wallet (NEW)

### Frontend Integration

✅ **`frontend/src/services/api.js`** (UPDATED)
- Added `API_BASE_URL` configuration from `.env`
- Updated `saveWallet()` to match backend payload
- Updated `getBalance()` with network parameter
- Updated `signWallet()` to call new endpoint
- Added `enableWallet()` helper function
- All functions now call Django backend

✅ **`frontend/.env`** (UPDATED)
- Added `VITE_API_URL=http://localhost:8000`
- Points to Django backend server

### Documentation

✅ **`backend/UTXOS_SERVICE_SETUP.md`** (NEW)
- Comprehensive setup and usage guide
- Error handling patterns
- Environment configuration
- Integration examples
- Development workflow
- Production deployment checklist
- Troubleshooting guide

## Key Design Decisions

### 1. **Security**: API keys never reach the browser
- All SDK operations are server-side only
- Frontend only knows about public wallet addresses
- Environment variables loaded securely in Django settings

### 2. **Error Handling**: Consistent patterns across service
- `ValueError` for invalid inputs (400 Bad Request)
- `RuntimeError` for SDK/configuration errors (500 Internal Server Error)
- Detailed logging for debugging
- User-friendly error messages in API responses

### 3. **Lazy Loading**: SDK initialized only when needed
- Import happens inside `_get_sdk()` function
- Allows graceful degradation if SDK unavailable
- Better startup performance during development

### 4. **API Design**: RESTful endpoints with clear contracts
- `POST /api/wallets/save/` - Save wallet address
- `GET /api/wallets/balance/<address>/` - Get balance
- `POST /api/wallets/sign/` - Sign transaction
- `POST /api/wallets/enable/` - Enable wallet

### 5. **Logging**: Comprehensive logging for operations
- Track all signing, balance, and wallet operations
- Helpful for debugging and audit trails
- Configured in Django settings

## How to Use

### 1. Setup Environment

```bash
cd backend
cp .env.example .env
# Edit .env with your UTXOS credentials
```

### 2. Import Service in Views

```python
from wallets.services.utxos_service import sign_transaction, get_wallet_balance, enable_wallet

result = sign_transaction({
    "data": "tx_data_here",
    "network": "cardano",
    "address": "addr_test..."
})
```

### 3. Frontend Calls Backend

```javascript
import { signWallet, getBalance, saveWallet, enableWallet } from './services/api.js';

// Sign a transaction
const signed = await signWallet({
    data: "transaction_hex",
    network: "cardano",
    address: "addr_test..."
});

// Get balance
const balance = await getBalance("addr_test...", "cardano");
```

### 4. Run Development Servers

**Backend:**
```bash
cd backend
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Testing Endpoints

### Sign Transaction
```bash
curl -X POST http://localhost:8000/api/wallets/sign/ \
  -H "Content-Type: application/json" \
  -d '{"data":"test_data","network":"cardano","address":"addr_test..."}'
```

### Get Balance
```bash
curl http://localhost:8000/api/wallets/balance/addr_test.../?network=cardano
```

### Save Wallet
```bash
curl -X POST http://localhost:8000/api/wallets/save/ \
  -H "Content-Type: application/json" \
  -d '{"address":"addr_test...","network":"cardano"}'
```

### Enable Wallet
```bash
curl -X POST http://localhost:8000/api/wallets/enable/ \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Current Implementation Status

✅ **Complete**
- Service structure with secure initialization
- Environment variable configuration
- All required functions with proper error handling
- Django integration (views, settings, URLs)
- Frontend API wrapper updated
- Documentation and examples

📝 **Notes**
- Currently using mock SDK implementation
- Replace `_get_mock_sdk()` with actual `@utxos/sdk` when available in Python
- Mock signer in `utxos_signer.js` also ready for real implementation

## Next Steps (Optional)

1. Install real `@utxos/sdk` when available in Python
2. Update service functions to use actual SDK calls
3. Add unit tests for service functions
4. Set up staging/production environment variables
5. Implement rate limiting and caching
6. Add audit logging for compliance

---

**Created**: March 1, 2026  
**Framework**: Django + Django REST Framework  
**Frontend**: Vite React TypeScript PWA  
**Status**: Ready for development 🚀
