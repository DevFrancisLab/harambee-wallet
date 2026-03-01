from django.urls import path
from . import views

urlpatterns = [
    path("save/", views.SaveWalletView.as_view(), name="save-wallet"),
    path("sign/", views.SignWalletView.as_view(), name="sign-wallet"),
    path("balance/<str:wallet_address>/", views.BalanceView.as_view(), name="balance"),
    path("enable/", views.EnableWalletView.as_view(), name="enable-wallet"),
]
