// API Base URL - adjust for your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Simple wrapper around fetch for JSON APIs
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  // grab auth token from storage or context (fallback to localStorage here)
  const token = localStorage.getItem("accessToken");
  if (token) {
    console.log("Found auth token, adding Authorization header");
  } else {
    // for endpoints that require auth we want to notify the user
    // using a simple alert so it cannot be missed. UI components may
    // also handle authentication state separately.
    console.warn("No auth token available for request to", path);
    // only notify once per request; this will pop up an alert every time
    // which is acceptable for development/runtime debugging.
    window.alert("Login required");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    credentials: "include",
    headers,
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
  }
  // if no content return null
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Save wallet address to the server. Authorization header will be
 * automatically set using a JWT stored under `accessToken` in
 * localStorage (or via your auth provider/context if you adapt the
 * request helper).
 * 
 * @param {object} payload - Wallet data (e.g. { wallet_address: "addr_test...", chain: "cardano" })
 * @returns {Promise<object>} Saved wallet record
 */
export function saveWallet(payload) {
  // backend expects `wallet_address` per WalletSerializer
  // normalize fields: prefer explicit wallet_address and chain
  // NOTE: do NOT spread the incoming payload because it might contain
  // legacy or unrelated keys that the serializer rejects.  we also guard
  // against accidentally sending an empty object.
  const walletAddress = payload.wallet_address || payload.address;
  if (!walletAddress) {
    console.error("saveWallet called without wallet_address", payload);
    throw new Error("wallet_address is required");
  }
  const body = JSON.stringify({
    wallet_address: walletAddress,
    chain: payload.chain || payload.network,
  });

  return request("/api/wallets/save/", {
    method: "POST",
    body,
  });
}

/**
 * Retrieve balance for a wallet address.
 * 
 * @param {string} walletAddress - The wallet address to query
 * @param {string} network - (optional) Network identifier (default: 'cardano')
 * @returns {Promise<object>} Balance information
 */
export function getBalance(walletAddress, network = "cardano") {
  const params = new URLSearchParams({ network });
  return request(`/api/wallets/balance/${encodeURIComponent(walletAddress)}/?${params.toString()}`);
}

/**
 * Sign a transaction or payload using the server-side SDK.
 * 
 * @param {object} payload - Data to sign (must contain 'data' field)
 * @returns {Promise<object>} Signed transaction result
 */
export function signWallet(payload) {
  return request("/api/wallets/sign/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Enable Web3 wallet connection on the server.
 * 
 * @param {string} projectId - (optional) UTXOS project ID
 * @returns {Promise<object>} Wallet initialization result
 */
export function enableWallet(projectId) {
  return request("/api/wallets/enable/", {
    method: "POST",
    body: JSON.stringify(projectId ? { project_id: projectId } : {}),
  });
}

// Other API helpers can go here
