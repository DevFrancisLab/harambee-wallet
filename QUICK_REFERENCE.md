# ⚡ Quick Reference - Django UTXOS Service

## One-Liner Commands

```bash
# Setup
bash quickstart.sh

# Run backend
cd backend && source .venv/bin/activate && python manage.py runserver 127.0.0.1:8000

# Run frontend
cd frontend && npm run dev

# Test signing
curl -X POST http://localhost:8000/api/wallets/sign/ \
  -H "Content-Type: application/json" \
  -d '{"data":"test","network":"cardano","address":"addr_test..."}'

# Test balance
curl http://localhost:8000/api/wallets/balance/addr_test.../?network=cardano
```

## Files You Need to Know

| File | Purpose | Status |
|------|---------|--------|
| `backend/wallets/services/utxos_service.py` | Core service logic | ✅ NEW |
| `backend/.env` | Development secrets | ✅ NEW (git ignored) |
| `backend/.env.example` | Template | ✅ UPDATED |
| `backend/utxos_backend/settings.py` | Django config | ✅ UPDATED |
| `backend/wallets/views.py` | REST endpoints | ✅ UPDATED |
| `frontend/src/services/api.js` | Frontend HTTP client | ✅ UPDATED |
| `frontend/.env` | Frontend config | ✅ UPDATED |

## Service Functions

### `sign_transaction(payload: Dict) → Dict`
Signs a transaction server-side (API key secure).
```python
from wallets.services.utxos_service import sign_transaction

result = sign_transaction({
    "data": "transaction_hex",
    "network": "cardano",
    "address": "addr_test..."
})
# Returns: {"signature": "...", "signed_at": "...", ...}
```

### `get_wallet_balance(address: str, network: str = "cardano") → Dict`
Gets wallet balance from blockchain.
```python
from wallets.services.utxos_service import get_wallet_balance

result = get_wallet_balance("addr_test...", "cardano")
# Returns: {"address": "...", "balance": "1000000", "currency": "lovelace"}
```

### `enable_wallet(project_id: str) → Dict`
Initializes Web3 wallet connection.
```python
from wallets.services.utxos_service import enable_wallet

result = enable_wallet("your_project_id")
# Returns: {"enabled": true, "networks": [...]}
```

## API Endpoints

| Method | Endpoint | Backend View | Service Function |
|--------|----------|--------------|------------------|
| POST | `/api/wallets/save/` | SaveWalletView | (DB save) |
| POST | `/api/wallets/sign/` | SignWalletView | sign_transaction() |
| GET | `/api/wallets/balance/<addr>/` | BalanceView | get_wallet_balance() |
| POST | `/api/wallets/enable/` | EnableWalletView | enable_wallet() |

## Frontend Usage

```javascript
import { saveWallet, signWallet, getBalance, enableWallet } from './services/api.js';

// Save wallet
const wallet = await saveWallet({ address: "addr_test...", network: "cardano" });

// Sign transaction
const signed = await signWallet({ data: "tx_hex", network: "cardano" });

// Get balance
const balance = await getBalance("addr_test...", "cardano");

// Enable wallet
const enabled = await enableWallet();
```

## Environment Variables

### Backend (.env) - KEEP SECRET ⚠️
```env
DJANGO_SECRET_KEY=...              # Keep this secret!
DJANGO_DEBUG=1                      # Set to 0 in production
UTXOS_API_KEY=sk_test_...          # ⚠️ NEVER expose to frontend
UTXOS_PROJECT_ID=...               # ⚠️ NEVER expose to frontend
```

### Frontend (.env) - Safe ✅
```env
VITE_API_URL=http://localhost:8000
VITE_UTXOS_PROJECT_ID=...          # OK to expose (just identifier)
```

## Error Responses

### 400 Bad Request - Invalid Input
```json
{"error": "Payload must contain 'data' field"}
```

### 500 Internal Server Error - SDK Issue
```json
{"error": "UTXOS_API_KEY not configured in settings"}
```

## Troubleshooting

### "API key not configured"
- Check `backend/.env` has `UTXOS_API_KEY`
- Restart Django server
- Verify .env file exists and is readable

### "CORS error" (frontend can't call backend)
- Ensure Django CORS is enabled in settings
- Check `ALLOWED_HOSTS` includes localhost
- Frontend and backend must be running

### "API returns 404"
- Verify backend is running on localhost:8000
- Check frontend .env has correct `VITE_API_URL`
- Check Django URLs are mounted at `/api/`

### "Cannot import service"
- Verify `backend/wallets/services/utxos_service.py` exists
- Ensure `backend/wallets/services/__init__.py` exists
- Check Python path is correct

## Development Workflow

1. **Setup** (one time)
   ```bash
   bash quickstart.sh
   nano backend/.env  # Add credentials
   ```

2. **Run servers**
   ```bash
   # Terminal 1
   cd backend && source .venv/bin/activate && python manage.py runserver
   
   # Terminal 2
   cd frontend && npm run dev
   ```

3. **Development**
   - Frontend auto-reloads at http://localhost:5173
   - Backend auto-reloads when you save Python files
   - Check backend logs for debugging

4. **Test API**
   ```bash
   curl -X POST http://localhost:8000/api/wallets/sign/ \
     -H "Content-Type: application/json" \
     -d '{"data":"test"}'
   ```

## Documentation Files

- **UTXOS_SERVICE_SETUP.md** - Full service guide (500+ lines)
- **IMPLEMENTATION_SUMMARY.md** - Quick overview
- **ARCHITECTURE.md** - System design & data flows
- **WHAT_WAS_CREATED.md** - Visual summary
- **IMPLEMENTATION_CHECKLIST.md** - Verification checklist

## Key Security Points

✅ API keys in backend/.env only  
✅ Keys never sent to frontend  
✅ Frontend only sees public data  
✅ .env files gitignored  
✅ Error messages don't leak secrets  
✅ CORS configured for dev  

## Production Deployment

Before deploying:
- [ ] Set `DJANGO_DEBUG=0`
- [ ] Generate strong `DJANGO_SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` to your domain
- [ ] Set `CORS_ALLOWED_ORIGINS` (not `*`)
- [ ] Use HTTPS everywhere
- [ ] Store `.env` in secrets manager (not git)
- [ ] Set up database backups
- [ ] Enable error monitoring

## Next Steps

1. Run `bash quickstart.sh`
2. Edit `backend/.env` with credentials
3. Start both servers
4. Test endpoints
5. Read full documentation
6. Swap mock SDK for real SDK when ready

---

**Status**: ✅ Ready to use  
**API Key Security**: 🔐 Server-side only  
**Documentation**: 📚 Complete  
**Last Updated**: March 1, 2026
