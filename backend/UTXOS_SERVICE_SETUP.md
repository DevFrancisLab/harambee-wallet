# UTXOS Service Documentation

## Overview

The `wallets/services/utxos_service.py` module provides a secure, server-side interface to the UTXOS SDK. This service ensures that:

1. **API keys are never exposed to the frontend** — all SDK operations happen server-side.
2. **SDK initialization is safe** — lazy loading with proper error handling.
3. **Sensitive operations are centralized** — signing, balance queries, and wallet management.

## Key Features

### 1. Safe SDK Initialization

```python
from wallets.services.utxos_service import sign_transaction, get_wallet_balance
```

The `_get_sdk()` function:
- Lazily loads the SDK only when needed
- Reads `UTXOS_API_KEY` from Django settings (loaded from `.env`)
- Logs initialization and errors for debugging
- Raises `RuntimeError` if API key is missing or SDK import fails

### 2. Core Functions

#### `sign_transaction(payload: Dict) -> Dict`

Signs a transaction or message using the UTXOS SDK.

**Parameters:**
- `payload` (dict): Must contain:
  - `data` (str): Transaction data or message to sign
  - `network` (str, optional): Network identifier (default: `"cardano"`)
  - `address` (str, optional): Wallet address performing the signature

**Returns:**
```json
{
  "signature": "mock_signature_1234",
  "signed_at": "2026-03-01T00:00:00Z",
  "address": "addr_test...",
  "network": "cardano",
  "transaction_id": null
}
```

**Example Usage in Views:**
```python
from .services.utxos_service import sign_transaction

def post(self, request):
    payload = request.data
    result = sign_transaction(payload)
    return Response(result)
```

#### `get_wallet_balance(address: str, network: str = "cardano") -> Dict`

Retrieves wallet balance from the blockchain.

**Parameters:**
- `address` (str): Wallet address to check
- `network` (str): Network to query (default: `"cardano"`)

**Returns:**
```json
{
  "address": "addr_test...",
  "balance": "1000000",
  "network": "cardano",
  "currency": "lovelace"
}
```

#### `enable_wallet(project_id: str) -> Dict`

Initialize and enable Web3 wallet connection.

**Parameters:**
- `project_id` (str): UTXOS project ID

**Returns:**
```json
{
  "enabled": true,
  "networks": ["cardano", "bitcoin", "spark"],
  "message": "Wallet enabled for project..."
}
```

## Environment Configuration

### Backend `.env` File

Create `backend/.env` with the following variables (never commit to git):

```env
DJANGO_SECRET_KEY=dev-secret-for-hackathon-12345
DJANGO_DEBUG=1

# UTXOS SDK Configuration (server-side only - NEVER expose to frontend)
UTXOS_API_KEY=sk_test_your_api_key_here_12345
UTXOS_PROJECT_ID=2de3d6ca-1234-5678-abcd-ef1234567890

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS allowed hosts
ALLOWED_HOSTS=localhost,127.0.0.1,localhost:3000,localhost:5173
```

### Django Settings Integration

In `utxos_backend/settings.py`:

```python
import os
from dotenv import load_dotenv

load_dotenv()

# UTXOS SDK Configuration
UTXOS_API_KEY = os.getenv("UTXOS_API_KEY", None)
UTXOS_PROJECT_ID = os.getenv("UTXOS_PROJECT_ID", None)
```

The service retrieves these values using:
```python
from django.conf import settings

api_key = getattr(settings, "UTXOS_API_KEY", None)
```

## Error Handling

All service functions follow a consistent error pattern:

```python
try:
    result = sign_transaction(payload)
except ValueError as e:
    # Invalid payload format
    return Response({"error": str(e)}, status=400)
except RuntimeError as e:
    # SDK initialization or operation failed
    return Response({"error": str(e)}, status=500)
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `UTXOS_API_KEY not configured` | `.env` not set up | Add `UTXOS_API_KEY` to `.env` and restart Django |
| `Failed to import UTXOS SDK` | SDK package not installed | `pip install @utxos/sdk` (when available in Python) |
| `Payload must contain 'data' field` | Missing required field | Ensure request includes `{"data": "..."}` |
| `Address cannot be empty` | Address is None or empty | Pass a valid wallet address |

## Integration with Views

### Example: Sign Transaction View

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.utxos_service import sign_transaction

class SignWalletView(APIView):
    def post(self, request):
        try:
            result = sign_transaction(request.data)
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

### Example: Balance View

```python
from .services.utxos_service import get_wallet_balance

class BalanceView(APIView):
    def get(self, request, wallet_address):
        network = request.query_params.get("network", "cardano")
        try:
            result = get_wallet_balance(wallet_address, network)
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

## Frontend Integration

The frontend calls these endpoints via `src/services/api.js`:

```javascript
import { signWallet, getBalance, saveWallet } from './services/api.js';

// Sign a transaction
const signed = await signWallet({
  data: "transaction_hex_here",
  network: "cardano",
  address: "addr_test..."
});

// Get balance
const balance = await getBalance("addr_test...", "cardano");

// Save wallet
const saved = await saveWallet({
  address: "addr_test...",
  network: "cardano"
});
```

## Development Workflow

### 1. Setup Backend Environment

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and edit .env
cp .env.example .env
# Edit .env with your API keys
```

### 2. Run Migrations

```bash
python manage.py migrate
```

### 3. Start Django Server

```bash
python manage.py runserver 127.0.0.1:8000
```

### 4. Test Endpoints

```bash
# Sign a transaction
curl -X POST http://127.0.0.1:8000/api/wallets/sign/ \
  -H "Content-Type: application/json" \
  -d '{"data": "transaction_data", "network": "cardano", "address": "addr_test..."}'

# Get balance
curl http://127.0.0.1:8000/api/wallets/balance/addr_test.../?network=cardano

# Save wallet
curl -X POST http://127.0.0.1:8000/api/wallets/save/ \
  -H "Content-Type: application/json" \
  -d '{"address": "addr_test...", "network": "cardano"}'
```

### 5. Check Frontend Config

Ensure `frontend/.env` has:
```env
VITE_API_URL=http://localhost:8000
```

## Production Deployment

### Security Checklist

- [ ] Use strong `DJANGO_SECRET_KEY` (generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- [ ] Set `DJANGO_DEBUG=0` in production
- [ ] Use HTTPS for all backend/frontend communication
- [ ] Store `.env` securely (never commit to git; use secrets management)
- [ ] Restrict `ALLOWED_HOSTS` to your actual domain
- [ ] Set `CORS_ALLOWED_ORIGINS` to specific frontend domains (not `*`)
- [ ] Rotate `UTXOS_API_KEY` periodically
- [ ] Use environment-specific settings for staging/production

### Example Production `.env`

```env
DJANGO_SECRET_KEY=<generate-secure-key>
DJANGO_DEBUG=0

UTXOS_API_KEY=sk_live_your_production_key
UTXOS_PROJECT_ID=production_project_id

ALLOWED_HOSTS=wallet.example.com

CORS_ALLOWED_ORIGINS=https://wallet.example.com
```

## Future Enhancements

1. **Async Operations**: Use `async def` and `await` for non-blocking SDK calls
2. **Caching**: Cache balance queries with TTL to reduce blockchain queries
3. **Rate Limiting**: Add rate limiting per wallet address
4. **Audit Logging**: Log all signing and balance operations for compliance
5. **Multi-Wallet Support**: Support multiple wallet connections per user
6. **Real SDK Integration**: Replace mock signer with actual `@utxos/sdk` calls

## Troubleshooting

### SDK Not Importing

**Error**: `Failed to import UTXOS SDK`

**Solution**: Ensure the SDK is installed and available in Python:
```bash
pip install utxos-sdk  # Once available
```

### API Key Not Found

**Error**: `UTXOS_API_KEY not configured in settings`

**Solution**:
1. Check that `backend/.env` exists and has `UTXOS_API_KEY=...`
2. Restart Django server
3. Verify `dotenv` is loading correctly:
   ```python
   from django.conf import settings
   print(settings.UTXOS_API_KEY)
   ```

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Check Django CORS settings in `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

## Support

For issues related to the UTXOS SDK itself, refer to the official documentation or contact UTXOS support. For Django backend issues, check the logs and ensure `.env` is properly configured.
