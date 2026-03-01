import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-secret-for-hackathon")

DEBUG = os.getenv("DJANGO_DEBUG", "1") == "1"

ALLOWED_HOSTS = ["*"]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "wallets",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "utxos_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "utxos_backend.wsgi.application"

# Database - use sqlite for hackathon speed
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"

# Allow all origins during hackathon
# CORS Configuration
#
# In development we allow localhost origins but when using `credentials: "include"`
# the wildcard (`*`) value is not permitted by the spec.  Browsers reject the
# preflight response if credentials are sent unless a specific origin is returned
# and `Access-Control-Allow-Credentials` is true.
#
# For production set `CORS_ALLOWED_ORIGINS` to your actual domains and disable
# `DEBUG`.

# during early development we explicitly list the frontend origin(s)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# allow the browser to send cookies/credentials
CORS_ALLOW_CREDENTIALS = True

# since the frontend runs on a different origin, add it to the list of
# trusted sites for CSRF validation.  This prevents "Referer"/"Origin"
# mismatches when Django checks CSRF tokens on POST requests.
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

ALLOWED_HOSTS = ["*"]
# for development it's okay to allow all hosts, restrict in production

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# UTXOS SDK Configuration (loaded from .env, server-side only)
UTXOS_API_KEY = os.getenv("UTXOS_API_KEY", None)
UTXOS_PROJECT_ID = os.getenv("UTXOS_PROJECT_ID", None)

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "wallets": {
            "handlers": ["console"],
            "level": "DEBUG",
        },
    },
}
