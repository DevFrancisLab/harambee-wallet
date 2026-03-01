"""
UTXOS SDK Service for handling wallet operations server-side.

This service encapsulates all SDK interactions and ensures API keys are never
exposed to the client. All signing and wallet operations are performed here.
"""

import logging
from typing import Any, Dict, Optional

from django.conf import settings

logger = logging.getLogger(__name__)


def _get_sdk():
    """
    Lazily initialize and return the UTXOS SDK instance.
    
    Raises:
        RuntimeError: If SDK cannot be initialized (missing API key, import error, etc.)
    """
    api_key = getattr(settings, "UTXOS_API_KEY", None)
    if not api_key:
        logger.error("UTXOS_API_KEY not configured in settings.")
        raise RuntimeError("UTXOS_API_KEY environment variable is not set. Please check .env and settings.py")

    try:
        # Import SDK only when needed (lazy loading).
        # For now, we'll return a mock SDK. Replace with actual import when SDK is installed.
        # from @utxos/sdk import Web3Wallet  # This would be the real import (if available in Python)
        # Initialize and return the SDK
        logger.info("UTXOS SDK initialized successfully.")
        return _get_mock_sdk(api_key)
    except ImportError as e:
        logger.error(f"Failed to import UTXOS SDK: {e}")
        raise RuntimeError(f"UTXOS SDK import failed: {e}")
    except Exception as e:
        logger.error(f"Failed to initialize UTXOS SDK: {e}")
        raise RuntimeError(f"UTXOS SDK initialization failed: {e}")


def _get_mock_sdk(api_key: str) -> Dict[str, Any]:
    """
    Return a mock SDK instance for development.
    
    In production, replace this with the actual SDK initialization.
    This is a placeholder until @utxos/sdk is properly integrated.
    """
    return {
        "api_key": api_key,
        "initialized": True,
        "platform": "mock",
    }


def sign_transaction(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sign a transaction using the UTXOS SDK.
    
    Args:
        payload (dict): Transaction data to sign. Expected to contain:
            - data (str): The transaction data or message to sign.
            - network (str, optional): Network identifier (e.g., 'cardano', 'bitcoin', 'spark').
            - address (str, optional): Wallet address performing the signature.
    
    Returns:
        dict: Signed transaction result containing:
            - signature (str): The signed transaction/message.
            - signed_at (str): ISO 8601 timestamp of signing.
            - address (str): Address that signed the transaction.
            - network (str): Network used for signing.
            - transaction_id (str, optional): ID of the signed transaction.
    
    Raises:
        RuntimeError: If SDK initialization fails or signing fails.
        ValueError: If payload is missing required fields.
    """
    # Validate payload
    if not isinstance(payload, dict):
        raise ValueError("Payload must be a dictionary.")
    
    if "data" not in payload:
        raise ValueError("Payload must contain 'data' field.")
    
    data = payload.get("data")
    network = payload.get("network", "cardano")  # Default to cardano
    address = payload.get("address", None)
    
    try:
        # Initialize SDK (will raise RuntimeError if not properly configured)
        sdk = _get_sdk()
        
        # Mock signing (replace with actual SDK call)
        # In production: signature = sdk.sign_transaction(data, network, address)
        logger.info(f"Signing transaction for address: {address} on network: {network}")
        
        signed_result = {
            "signature": f"mock_signature_{hash(data) % 10000:04d}",  # Mock signature
            "signed_at": "2026-03-01T00:00:00Z",
            "address": address or "unknown",
            "network": network,
            "transaction_id": None,
        }
        
        logger.info(f"Transaction signed successfully for {address}.")
        return signed_result
        
    except RuntimeError as e:
        logger.error(f"SDK error during signing: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during signing: {e}")
        raise RuntimeError(f"Failed to sign transaction: {e}")


def get_wallet_balance(address: str, network: str = "cardano") -> Dict[str, Any]:
    """
    Retrieve wallet balance from the UTXOS SDK.
    
    Args:
        address (str): Wallet address to check.
        network (str): Network to query (default: 'cardano').
    
    Returns:
        dict: Balance information containing:
            - address (str): The queried address.
            - balance (str): Balance as a string (to preserve precision).
            - network (str): Network queried.
            - currency (str): Currency unit (e.g., 'lovelace', 'satoshi').
    
    Raises:
        RuntimeError: If SDK initialization or balance retrieval fails.
    """
    if not address:
        raise ValueError("Address cannot be empty.")
    
    try:
        sdk = _get_sdk()
        
        # Mock balance retrieval (replace with actual SDK call)
        logger.info(f"Fetching balance for address: {address} on network: {network}")
        
        balance_result = {
            "address": address,
            "balance": "1000000",  # Mock balance in lowest unit
            "network": network,
            "currency": "lovelace" if network == "cardano" else "satoshi",
        }
        
        logger.info(f"Balance retrieved for {address}: {balance_result['balance']} {balance_result['currency']}")
        return balance_result
        
    except RuntimeError as e:
        logger.error(f"SDK error during balance retrieval: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during balance retrieval: {e}")
        raise RuntimeError(f"Failed to retrieve balance: {e}")


def enable_wallet(project_id: str) -> Dict[str, Any]:
    """
    Initialize and enable Web3 wallet connection (server-side).
    
    Args:
        project_id (str): UTXOS project ID for wallet initialization.
    
    Returns:
        dict: Wallet initialization result containing:
            - enabled (bool): Whether wallet was successfully enabled.
            - networks (list): Available networks for this wallet.
            - message (str): Status message.
    
    Raises:
        RuntimeError: If SDK initialization or wallet enable fails.
    """
    if not project_id:
        raise ValueError("Project ID cannot be empty.")
    
    try:
        sdk = _get_sdk()
        
        # Mock wallet enable (replace with actual SDK call)
        # In production: wallet = sdk.enable_wallet(project_id)
        logger.info(f"Enabling wallet for project: {project_id}")
        
        wallet_result = {
            "enabled": True,
            "networks": ["cardano", "bitcoin", "spark"],
            "message": f"Wallet enabled for project {project_id}",
        }
        
        logger.info(f"Wallet enabled successfully.")
        return wallet_result
        
    except RuntimeError as e:
        logger.error(f"SDK error during wallet enable: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during wallet enable: {e}")
        raise RuntimeError(f"Failed to enable wallet: {e}")
