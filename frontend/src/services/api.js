// API Base URL - adjust for your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Simple wrapper around fetch for JSON APIs
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
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
 * Save wallet address to the server.
 * 
 * @param {object} payload - Wallet data (e.g. { address: "addr_test...", network: "cardano" })
 * @returns {Promise<object>} Saved wallet record
 */
export function saveWallet(payload) {
  // backend expects `wallet_address` per WalletSerializer
  const body = JSON.stringify({
    wallet_address: payload.address || payload.wallet_address,
    // allow passthrough of any other fields if needed
    ...payload,
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
