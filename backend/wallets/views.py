import json
import subprocess
import logging
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Wallet
from .serializers import WalletSerializer
from .services.utxos_service import sign_transaction, get_wallet_balance, enable_wallet

logger = logging.getLogger(__name__)


class SaveWalletView(APIView):
    """Save a wallet address to the database."""
    def post(self, request):
        serializer = WalletSerializer(data=request.data)
        if serializer.is_valid():
            wallet = serializer.save()
            logger.info(f"Wallet saved: {wallet.wallet_address}")
            return Response(WalletSerializer(wallet).data, status=status.HTTP_201_CREATED)
        logger.warning(f"Invalid wallet data: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignWalletView(APIView):
    """
    Sign a transaction using the UTXOS SDK (server-side).
    
    The payload should contain:
    - data: transaction data or message to sign
    - network: (optional) network identifier (cardano, bitcoin, spark)
    - address: (optional) wallet address performing the signature
    """

    def post(self, request):
        """Sign a transaction payload using the server-side SDK service."""
        data = request.data or {}
        
        try:
            # Use the UTXOS service to sign the transaction
            result = sign_transaction(data)
            logger.info(f"Transaction signed successfully: {result.get('address')}")
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            logger.warning(f"Invalid signing request: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as e:
            logger.error(f"SDK error during signing: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during signing: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BalanceView(APIView):
    """Retrieve wallet balance using the UTXOS SDK."""

    def get(self, request, wallet_address):
        """Get balance for a wallet address."""
        network = request.query_params.get("network", "cardano")
        
        try:
            # Use the UTXOS service to get balance
            result = get_wallet_balance(wallet_address, network)
            logger.info(f"Balance retrieved for {wallet_address}: {result['balance']}")
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            logger.warning(f"Invalid balance request: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as e:
            logger.error(f"SDK error during balance retrieval: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during balance retrieval: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EnableWalletView(APIView):
    """Enable Web3 wallet connection (server-side)."""

    def post(self, request):
        """Enable wallet for the configured UTXOS project."""
        project_id = request.data.get("project_id") or getattr(settings, "UTXOS_PROJECT_ID", None)
        
        try:
            if not project_id:
                return Response({"error": "project_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Use the UTXOS service to enable wallet
            result = enable_wallet(project_id)
            logger.info(f"Wallet enabled for project: {project_id}")
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            logger.warning(f"Invalid wallet enable request: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as e:
            logger.error(f"SDK error during wallet enable: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during wallet enable: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BalanceView(APIView):
    def get(self, request, wallet):
        # In a real implementation you would query chain / DB for balance
        # Here we return a placeholder value for hackathon speed
        return Response({"wallet": wallet, "balance": 0})
