#!/bin/bash
# Quick Start Guide for UTXOS Django Service
# Run this file to quickly bootstrap your development environment

set -e

echo "🚀 UTXOS Harambee Wallet - Quick Start"
echo "========================================"
echo ""

# Backend Setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt
echo "✅ Dependencies installed"

# Setup .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your UTXOS_API_KEY and UTXOS_PROJECT_ID"
    echo "   File: backend/.env"
fi

# Run migrations
echo "Running database migrations..."
python manage.py migrate -q
echo "✅ Database ready"

# Go back to root
cd ..

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Edit backend/.env with your credentials:"
echo "   nano backend/.env"
echo ""
echo "2. Start the backend server:"
echo "   cd backend"
echo "   source .venv/bin/activate"
echo "   python manage.py runserver 127.0.0.1:8000"
echo ""
echo "3. In another terminal, start the frontend dev server:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Test an endpoint:"
echo "   curl -X POST http://localhost:8000/api/wallets/sign/ \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"data\":\"test\",\"network\":\"cardano\"}'"
echo ""
echo "📚 Documentation:"
echo "   - Backend service: backend/UTXOS_SERVICE_SETUP.md"
echo "   - Implementation: backend/IMPLEMENTATION_SUMMARY.md"
echo ""
