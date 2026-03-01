from django.db import models


class Wallet(models.Model):
    # primary identifier used by clients; never blank
    wallet_address = models.CharField(max_length=256)
    # optional chain/network the address belongs to, defaulting to cardano
    chain = models.CharField(max_length=64, default="cardano")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.wallet_address
