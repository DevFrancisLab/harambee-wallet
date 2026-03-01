from rest_framework import serializers
from .models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    # enforce presence and non-blank address at serializer level
    wallet_address = serializers.CharField(required=True, allow_blank=False)
    # optional chain field; serializer default mirrors model default
    chain = serializers.CharField(required=False, default="cardano")

    class Meta:
        model = Wallet
        fields = ["id", "wallet_address", "chain", "created_at"]

    def create(self, validated_data):
        """Create or update a wallet record.

        If a wallet with the same address already exists we update its
        chain value rather than creating a duplicate. This keeps the API
        idempotent and makes the frontend logic simpler.
        """

        address = validated_data.get("wallet_address")
        chain = validated_data.get("chain", "cardano")

        wallet, created = Wallet.objects.update_or_create(
            wallet_address=address,
            defaults={"chain": chain},
        )
        return wallet
