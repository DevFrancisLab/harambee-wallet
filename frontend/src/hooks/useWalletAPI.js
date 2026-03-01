/**
 * useWalletAPI Hook
 * 
 * Reusable hook for wallet operations with loading and error state management.
 * Handles all wallet API interactions with the Django backend.
 */

import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Custom hook for wallet API operations
 * 
 * @returns {Object} Wallet API interface with:
 *   - saveWallet: Save wallet address to backend
 *   - getBalance: Fetch wallet balance
 *   - signTransaction: Sign a transaction server-side
 *   - enableWallet: Initialize wallet connection
 *   - loading: Current loading state
 *   - error: Current error message (null if no error)
 *   - clearError: Clear error state
 */
export function useWalletAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make an API request with error handling
   * @private
   */
  const request = useCallback(async (path, options = {}) => {
    const url = `${API_BASE_URL}${path}`;
    
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save wallet address to the backend
   * 
   * @param {Object} walletData - Wallet information
   * @param {string} walletData.address - Wallet address
   * @param {string} walletData.network - Network (cardano, bitcoin, spark)
   * @returns {Promise<Object>} Saved wallet record
   * 
   * @example
   * const wallet = await saveWallet({
   *   address: 'addr_test1vrr6r...',
   *   network: 'cardano'
   * });
   */
  const saveWallet = useCallback(
    (walletData) => {
      return request('/api/wallets/save/', {
        method: 'POST',
        body: JSON.stringify(walletData),
      });
    },
    [request]
  );

  /**
   * Retrieve wallet balance from the backend
   * 
   * @param {string} address - Wallet address
   * @param {string} network - Network (default: 'cardano')
   * @returns {Promise<Object>} Balance information
   * 
   * @example
   * const balance = await getBalance('addr_test1vrr6r...', 'cardano');
   */
  const getBalance = useCallback(
    (address, network = 'cardano') => {
      const params = new URLSearchParams({ network });
      return request(`/api/wallets/balance/${encodeURIComponent(address)}/?${params.toString()}`);
    },
    [request]
  );

  /**
   * Sign a transaction using the server-side SDK
   * 
   * @param {Object} payload - Transaction data to sign
   * @param {string} payload.data - Transaction hex or message
   * @param {string} payload.network - Network identifier
   * @param {string} payload.address - Wallet address
   * @returns {Promise<Object>} Signed transaction result
   * 
   * @example
   * const signed = await signTransaction({
   *   data: 'transaction_hex_here',
   *   network: 'cardano',
   *   address: 'addr_test1vrr6r...'
   * });
   */
  const signTransaction = useCallback(
    (payload) => {
      return request('/api/wallets/sign/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    [request]
  );

  /**
   * Enable wallet connection on the backend
   * 
   * @param {string} projectId - Optional project ID override
   * @returns {Promise<Object>} Wallet enabled result
   * 
   * @example
   * const result = await enableWallet();
   */
  const enableWallet = useCallback(
    (projectId = null) => {
      return request('/api/wallets/enable/', {
        method: 'POST',
        body: JSON.stringify(projectId ? { project_id: projectId } : {}),
      });
    },
    [request]
  );

  /**
   * Clear the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    saveWallet,
    getBalance,
    signTransaction,
    enableWallet,
    loading,
    error,
    clearError,
  };
}
