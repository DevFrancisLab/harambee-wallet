# 📋 Browser Console Test Checklist

**Test Date**: March 1, 2026  
**Project**: Harambee Wallet  
**Tester**: ___________________  

---

## QUICK START

### Prerequisites ✓
Before starting tests, ensure:
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] Backend running: `cd backend && python manage.py runserver`
- [ ] Browser: http://localhost:5173
- [ ] DevTools: Press **F12** (Windows/Linux) or **Cmd+Option+I** (Mac)
- [ ] Tab: **Console**

---

## TEST 1: API Module Loading

### Steps
1. Open browser console (F12)
2. Copy and paste:
```javascript
import('./services/api.js').then(api => {
  console.log('✅ API Module Loaded:', api);
  console.log('Functions:', Object.keys(api));
});
```

### Expected Output
```
✅ API Module Loaded: {saveWallet: ƒ, getBalance: ƒ, signWallet: ƒ, enableWallet: ƒ}
Functions: ['saveWallet', 'getBalance', 'signWallet', 'enableWallet']
```

### Result
- [ ] **PASS** - All 4 functions present
- [ ] **FAIL** - Missing functions

**Notes**: ________________________________________________

---

## TEST 2: Environment Variables

### Steps
1. Open browser console
2. Copy and paste:
```javascript
console.log('📍 Environment Variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_UTXOS_PROJECT_ID:', import.meta.env.VITE_UTXOS_PROJECT_ID);
console.log('DEV mode:', import.meta.env.DEV);
```

### Expected Output
```
📍 Environment Variables:
VITE_API_URL: http://localhost:8000
VITE_UTXOS_PROJECT_ID: 2de3d6ca-26f6-4302-aa24-0487f23c6069
DEV mode: true
```

### Result
- [ ] **PASS** - All env vars correct
- [ ] **FAIL** - Env vars missing or incorrect

**Notes**: ________________________________________________

---

## TEST 3: Manual API Request (POST /api/wallets/save/)

### Steps
1. Open browser console
2. Copy and paste:
```javascript
const testPayload = {
  address: 'addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls',
  network: 'cardano'
};

console.log('📤 Sending POST request to /api/wallets/save/...');
console.log('Payload:', testPayload);

fetch('http://localhost:8000/api/wallets/save/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(testPayload)
})
.then(res => {
  console.log('📥 Response Status:', res.status, res.statusText);
  return res.json();
})
.then(data => console.log('✅ API Response:', data))
.catch(err => console.error('❌ Error:', err.message));
```

3. **IMPORTANT**: Switch to **Network** tab to verify request

### Expected Output
```
📤 Sending POST request to /api/wallets/save/...
Payload: {address: "addr_test1vrr...", network: "cardano"}
📥 Response Status: 201 Created
✅ API Response: {
  id: 1,
  address: "addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls",
  network: "cardano",
  created_at: "2026-03-01T12:00:00.000Z"
}
```

### Network Tab Check
- [ ] Request URL: `http://localhost:8000/api/wallets/save/`
- [ ] Method: `POST`
- [ ] Status: `201` Created or `200` OK
- [ ] Request body contains: `{"address":"...", "network":"cardano"}`
- [ ] Response has fields: `id`, `address`, `network`, `created_at`

### Result
- [ ] **PASS** - Status 201, response has all fields
- [ ] **FAIL** - Status error or missing fields

**Response Status Code**: ______  
**Response ID**: ______  
**Notes**: ________________________________________________

---

## TEST 4: Manual API Request (GET /api/wallets/balance/)

### Steps
1. Open browser console
2. Copy and paste:
```javascript
const address = 'addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls';
const network = 'cardano';

console.log('📤 Fetching balance for:', address);

fetch(`http://localhost:8000/api/wallets/balance/${encodeURIComponent(address)}/?network=${network}`)
  .then(res => {
    console.log('📥 Response Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('✅ Balance:', data);
    console.log('💰 Amount:', data.balance, data.currency);
  })
  .catch(err => console.error('❌ Error:', err.message));
```

### Expected Output
```
📤 Fetching balance for: addr_test1vrr6r...
📥 Response Status: 200
✅ Balance: {
  address: "addr_test1vrr6r...",
  balance: "1000000",
  network: "cardano",
  currency: "lovelace"
}
💰 Amount: 1000000 lovelace
```

### Result
- [ ] **PASS** - Status 200, has balance and currency
- [ ] **FAIL** - Status error or missing fields

**Response Status Code**: ______  
**Balance Amount**: ______  
**Currency**: ______  
**Notes**: ________________________________________________

---

## TEST 5: Component Click - Connect Wallet

### Steps
1. Navigate to Dashboard (or page with "Connect Wallet" button)
2. **Open Network tab** (DevTools → Network) - make it visible
3. Click **"Connect Wallet"** button
4. Watch both **Console** and **Network** tabs

### Expected Console Output
```
Wallet connected: {
  address: "addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls",
  network: "cardano",
  savedWallet: {id: 1, address: "...", network: "cardano", created_at: "..."},
  balance: {address: "...", balance: "1000000", network: "cardano", currency: "lovelace"}
}
```

### Expected Network Requests (in order)
1. **Request 1**: POST `/api/wallets/save/`
   - [ ] Status: **201** or **200**
   - [ ] Method: **POST**
   
2. **Request 2**: GET `/api/wallets/balance/...`
   - [ ] Status: **200**
   - [ ] Method: **GET**

### Expected UI Changes
- [ ] Wallet address displays on screen
- [ ] Balance displays (e.g., "1000000 lovelace")
- [ ] Toast notification: "Wallet Connected"
- [ ] Button changes to "Disconnect" or similar

### Result
- [ ] **PASS** - Both requests succeed, UI updates
- [ ] **FAIL** - Request fails or UI doesn't update

**Wallet Address Displayed**: ____________________  
**Balance Displayed**: ______  
**Toast Appeared**: YES / NO  
**Network Requests**: _____ (count)  
**Notes**: ________________________________________________

---

## TEST 6: localStorage Persistence

### Steps
1. Open browser console
2. Copy and paste:
```javascript
console.log('📦 localStorage Contents:');
console.log('wallet_address:', localStorage.getItem('wallet_address'));
console.log('wallet_network:', localStorage.getItem('wallet_network'));
```

### Expected Output
```
📦 localStorage Contents:
wallet_address: addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls
wallet_network: cardano
```

### Result
- [ ] **PASS** - Both values stored correctly
- [ ] **FAIL** - Values missing or empty

**Stored Address**: ____________________  
**Stored Network**: ______  
**Notes**: ________________________________________________

---

## TEST 7: Page Refresh - State Persistence

### Steps
1. Verify wallet is connected (from Test 5)
2. **Refresh page**: Press **F5** or **Ctrl+R**
3. Check if wallet remains connected

### Expected Behavior
- [ ] Wallet address still visible
- [ ] Balance still visible
- [ ] Button shows "Disconnect" (not "Connect")
- [ ] No extra network requests (from page load)

### Expected Console Check
```javascript
console.log('After refresh:');
console.log('Address:', localStorage.getItem('wallet_address'));
console.log('Connected:', !!localStorage.getItem('wallet_address'));
```

### Result
- [ ] **PASS** - State persists after refresh
- [ ] **FAIL** - State lost after refresh

**Address Persisted**: YES / NO  
**Balance Visible**: YES / NO  
**Notes**: ________________________________________________

---

## TEST 8: Disconnect Functionality

### Steps
1. Click **"Disconnect"** button (from connected state)
2. Check console and localStorage

### Expected Console Output
```
Wallet Disconnected
```

### Expected localStorage State
```javascript
localStorage.getItem('wallet_address')   // null
localStorage.getItem('wallet_network')   // null
```

### Expected UI Changes
- [ ] Wallet address hidden
- [ ] Balance hidden
- [ ] Button shows "Connect Wallet"
- [ ] Toast notification: "Wallet Disconnected"

### Result
- [ ] **PASS** - All state cleared, UI reverted
- [ ] **FAIL** - State not cleared

**Address After Disconnect**: ____________________  
**Toast Appeared**: YES / NO  
**Button Label**: ____________________  
**Notes**: ________________________________________________

---

## TEST 9: Error Handling (Offline Simulation)

### Steps
1. Open DevTools
2. Go to **Network** tab
3. Check the throttling dropdown (⚙️ → Offline)
4. Try to connect wallet
5. Re-enable network

### Expected Behavior
- [ ] Toast appears: "Connection Failed"
- [ ] Error message in console
- [ ] UI gracefully handles error
- [ ] After re-enabling network, connection works

### Expected Console Error
```
Wallet connection error: Failed to fetch
❌ Connection Failed
```

### Result
- [ ] **PASS** - Error handled gracefully
- [ ] **FAIL** - App crashes or hangs

**Error Message**: ________________________________________________  
**Recovered After Offline**: YES / NO  
**Notes**: ________________________________________________

---

## TEST 10: No Console Warnings/Errors

### Steps
1. After all tests, check console for warnings/errors
2. Filter by error level (right side of console)

### Expected Console
- [ ] **No errors** except expected ones
- [ ] **No "require is not defined"**
- [ ] **No "Buffer is not defined"**
- [ ] **No "process is not defined"**
- [ ] **No CORS errors**
- [ ] **No 404 errors** (except maybe favicon)

### Common Issues to Check
```javascript
// These should NOT appear:
console.error("require is not defined")        // ❌
console.error("Buffer is not defined")         // ❌
console.error("process is not defined")        // ❌
console.error("CORS policy blocked")           // ❌
```

### Result
- [ ] **PASS** - Clean console, no errors
- [ ] **FAIL** - Errors present

**Errors Found**: ________________________________________________  
**Warnings**: ________________________________________________  
**Notes**: ________________________________________________

---

## SUMMARY SCORECARD

### Test Results
| Test # | Name | Status | Notes |
|--------|------|--------|-------|
| 1 | API Module | ☐ PASS ☐ FAIL | |
| 2 | Env Variables | ☐ PASS ☐ FAIL | |
| 3 | POST API | ☐ PASS ☐ FAIL | |
| 4 | GET API | ☐ PASS ☐ FAIL | |
| 5 | Button Click | ☐ PASS ☐ FAIL | |
| 6 | localStorage | ☐ PASS ☐ FAIL | |
| 7 | Refresh State | ☐ PASS ☐ FAIL | |
| 8 | Disconnect | ☐ PASS ☐ FAIL | |
| 9 | Error Handle | ☐ PASS ☐ FAIL | |
| 10 | Clean Console | ☐ PASS ☐ FAIL | |

### Overall Result
**Total Passed**: _____ / 10  
**Total Failed**: _____ / 10  

### Final Status
- [ ] ✅ **ALL TESTS PASSED** - Frontend ready for development
- [ ] ⚠️ **SOME TESTS FAILED** - See notes for debugging
- [ ] ❌ **CRITICAL ISSUES** - Do not proceed, review errors

---

## Additional Notes

### Issues Encountered
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

### Debugging Steps Taken
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

### Recommended Next Steps
- [ ] Integrate real wallet SDK (Nami, Eternl, etc.)
- [ ] Add more comprehensive error handling
- [ ] Add loading animations
- [ ] Test with real blockchain (testnet)
- [ ] Performance testing

### Tester Information
**Name**: ____________________  
**Date**: ____________________  
**Time**: ____________________  
**Environment**: ☐ Windows ☐ macOS ☐ Linux  
**Browser**: ☐ Chrome ☐ Firefox ☐ Safari ☐ Edge  
**OS Version**: ____________________  

---

## Quick Reference: Copy-Paste Commands

### All Tests in One Go
```javascript
console.log('=== HARAMBEE WALLET CONSOLE TESTS ===');

// Test 1: API Module
import('./services/api.js').then(api => {
  console.log('✅ TEST 1 PASS: API Module loaded', Object.keys(api));
});

// Test 2: Env Vars
console.log('✅ TEST 2:', 'API_URL=' + import.meta.env.VITE_API_URL);

// Test 3-4: localStorage
console.log('✅ TEST 6:', localStorage.getItem('wallet_address'));

// Test 10: Check for errors
window.addEventListener('error', (e) => {
  console.error('❌ Error:', e.message);
});

console.log('🧪 Tests ready - see individual test sections above');
```

---

**Page Count**: 1 of 7  
**Last Updated**: March 1, 2026  
**Status**: ✅ Ready for Testing
