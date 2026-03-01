# Harambee Wallet

**Harambee Wallet** is a full-stack proof-of-concept application that demonstrates
how to integrate a web frontend with a Django backend for managing blockchain
wallet information and interacting with a UTXO-based SDK.  It provides APIs to
save wallet addresses, retrieve balances, sign transactions, and enable
wallets via a secure server-side service.

---

## 🧱 Project Structure

```
/harambee-wallet
├── backend/            # Django REST API server
│   ├── wallets/        # Wallet app (models, serializers, views)
│   ├── utxos_backend/  # Django project settings and URLs
│   ├── manage.py
│   └── ...
├── frontend/           # React + Vite SPA
│   ├── src/
│   │   ├── components/ # UI components (ConnectWallet, examples...)
│   │   ├── hooks/      # Custom hooks (useWalletAPI, use-toast)
│   │   ├── services/   # API helpers (api.js)
│   │   └── pages/
│   ├── package.json
│   └── ...
└── README.md           # This file
```

Both backend and frontend are designed to run locally for development. The
database is SQLite by default, and the front end uses environment variables to
locally target the Django API.

---

## 🚀 Features

- **Save Wallet**: Accepts a wallet address and chain (Cardano, Bitcoin, etc.)
  and persists it to the database.
- **Get Balance**: Queries a (mock) UTXO service to return balance data for a
  given wallet address. The service can be hooked into a real blockchain SDK
  later.
- **Sign Transaction**: Sends transaction data to the server, which signs it
  using the UTXO SDK (currently mocked).
- **Enable Wallet**: Initializes server-side wallet connectivity for third-party
  Web3 providers.
- **JWT-aware API**: Frontend automatically adds a Bearer token from
  `localStorage`; backend logging demonstrates where authentication would be
  enforced.
- **CORS/CSRF configuration**: Backend is set up to accept requests from the
  front end during development.
- **Frontend mock wallet flow**: Components simulate wallet connection and
  display live balance results.

---

## 📦 Getting Started

### Backend

1. **Create and activate a virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Apply migrations and start the development server**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000`.

4. **(Optional)**: Create a superuser to view the Django admin.
   ```bash
   python manage.py createsuperuser
   ```

### Frontend

1. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install        # or yarn
   ```

2. **Create `.env` or set `VITE_API_URL`**
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` (default Vite port) in your browser to
   interact with the UI.

---

## 🧪 Testing

- **Backend**: No tests currently included, but you can run Django's test
  runner via `python manage.py test`.
- **Frontend**: A minimal example test is provided with Vitest. Run
  `npm run test` in `frontend/` to execute.

---

## 🛠️ Development Notes

- **Logging**: Both backend views and the frontend API layer include
  `console.log`/`logger.info` statements to observe payloads and responses.
- **Serializers**: The Django `WalletSerializer` normalizes incoming fields and
  performs an `update_or_create` to allow idempotent saves.
- **Balance response**: Returns an object with `{ address, balance, network,
  currency }`; frontend components must not attempt to render this object
  directly (see `ConnectWalletButton` patch).
- **Duplicate view removal**: A prior bug had two `BalanceView` classes defined
  in `views.py`; the duplicate was removed to avoid signature conflicts.
- **JWT handling**: Currently, middleware doesn't enforce token checks but the
  helper hints where authentication should occur.
- **Mock UTXO service**: Located in `wallets/services/utxos_service.py`; replace
  with a real SDK when available.

---

## 🗺️ Architecture Overview

A concise architecture diagram and step-by-step data flow are maintained in
`ARCHITECTURE.md`, but briefly:

1. Frontend calls helper (`api.js` or `useWalletAPI`) which makes HTTP requests
   to the Django API.
2. Django `APIView` handlers use the `utxos_service` to perform blockchain
   operations (mocked for now).
3. Responses are JSON; frontend displays results and stores wallet info locally.

---

## ✅ Walkthrough and Checklist

Several Markdown documents track implementation progress (`IMPLEMENTATION*` and
`QUICK_*` files).  They describe required endpoints, expected payloads, and
example `curl` commands for manual testing.

---

## 🤝 Contributions

This repository is structured to be approachable for collaborators:

- Backend: Add new views in `wallets/views.py`, create corresponding serializers
  and models as needed.
- Frontend: Add components under `src/components` and helpers/hooks as needed.
- Documentation: Update the various `*.md` files with clear examples.

Please open issues or PRs with tests when adding features, and use GitHub's
code review process to maintain quality.

---

## 📄 License

Currently unspecified – adapt to your organization’s requirements.

---

Happy hacking! 🎉
