#!/bin/bash

# 🔧 HARAMBEE WALLET - DEBUGGING COMMANDS REFERENCE
# Quick reference for common debugging tasks
# Save this file and run: chmod +x debug.sh && ./debug.sh [command]

set -e

FRONTEND_DIR="/home/frank/harambee-wallet/frontend"
BACKEND_DIR="/home/frank/harambee-wallet/backend"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# ============================================================================
# FRONTEND DEBUGGING COMMANDS
# ============================================================================

cmd_frontend_build() {
  print_header "Frontend Build Test"
  cd "$FRONTEND_DIR"
  npm run build 2>&1 | tail -20
  print_success "Build completed"
}

cmd_frontend_check_imports() {
  print_header "Checking Import Compilation"
  cd "$FRONTEND_DIR"
  
  echo "Scanning for import errors..."
  npm run build 2>&1 | grep -i "error\|failed" && print_error "Build has errors" || print_success "No import errors"
}

cmd_frontend_check_commonjs() {
  print_header "Checking for CommonJS (require/module.exports)"
  cd "$FRONTEND_DIR"
  
  echo "Searching for require() usage..."
  if find src/ -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) -exec grep -l "require(" {} \; 2>/dev/null | grep -q .; then
    print_error "Found CommonJS require():"
    find src/ -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) -exec grep -H "require(" {} \;
  else
    print_success "No CommonJS require() found"
  fi
  
  echo ""
  echo "Searching for module.exports..."
  if find src/ -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) -exec grep -l "module.exports" {} \; 2>/dev/null | grep -q .; then
    print_error "Found CommonJS module.exports"
  else
    print_success "No CommonJS module.exports found"
  fi
}

cmd_frontend_check_deps() {
  print_header "Checking Dependencies"
  cd "$FRONTEND_DIR"
  
  echo "Top-level dependencies:"
  npm ls --depth=0 2>&1 | head -30
  
  echo ""
  echo "Verifying critical packages..."
  npm ls react react-dom vite @vitejs/plugin-react-swc 2>&1 | grep -E "react|vite" || print_error "Missing critical packages"
}

cmd_frontend_dev_server() {
  print_header "Starting Frontend Dev Server"
  cd "$FRONTEND_DIR"
  
  echo "Starting Vite dev server on http://localhost:5173"
  echo "Press Ctrl+C to stop"
  echo ""
  npm run dev
}

cmd_frontend_check_env() {
  print_header "Checking Frontend Environment Variables"
  cd "$FRONTEND_DIR"
  
  if [ -f .env ]; then
    echo "Found .env file:"
    cat .env
    print_success ".env file configured"
  else
    print_warning ".env file not found"
    echo "Creating .env file..."
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000
VITE_UTXOS_PROJECT_ID=2de3d6ca-26f6-4302-aa24-0487f23c6069
EOF
    print_success ".env file created"
  fi
}

cmd_frontend_check_components() {
  print_header "Checking Component Structure"
  cd "$FRONTEND_DIR"
  
  echo "ConnectWallet component:"
  [ -f src/components/ConnectWallet.tsx ] && print_success "Found" || print_error "Not found"
  
  echo "API service:"
  [ -f src/services/api.js ] && print_success "Found" || print_error "Not found"
  
  echo "useWalletAPI hook:"
  [ -f src/hooks/useWalletAPI.js ] && print_success "Found" || print_error "Not found"
  
  echo ""
  echo "Verifying ConnectWallet implementation:"
  grep -q "handleConnect" src/components/ConnectWallet.tsx && print_success "handleConnect function found" || print_error "handleConnect missing"
  grep -q "saveWallet" src/components/ConnectWallet.tsx && print_success "saveWallet call found" || print_error "saveWallet missing"
  grep -q "localStorage" src/components/ConnectWallet.tsx && print_success "localStorage usage found" || print_error "localStorage missing"
}

cmd_frontend_check_api() {
  print_header "Checking API Service"
  cd "$FRONTEND_DIR"
  
  echo "API functions:"
  grep -q "saveWallet" src/services/api.js && print_success "saveWallet function found" || print_error "saveWallet missing"
  grep -q "getBalance" src/services/api.js && print_success "getBalance function found" || print_error "getBalance missing"
  grep -q "signWallet" src/services/api.js && print_success "signWallet function found" || print_error "signWallet missing"
  grep -q "enableWallet" src/services/api.js && print_success "enableWallet function found" || print_error "enableWallet missing"
  
  echo ""
  echo "Endpoint configuration:"
  grep "VITE_API_URL\|api/wallets" src/services/api.js | head -5
}

cmd_frontend_check_types() {
  print_header "Checking TypeScript Configuration"
  cd "$FRONTEND_DIR"
  
  echo "Running TypeScript check..."
  if npx tsc --noEmit 2>&1 | grep -q "error"; then
    print_error "TypeScript errors found:"
    npx tsc --noEmit 2>&1 | head -20
  else
    print_success "No TypeScript errors"
  fi
}

cmd_frontend_check_vite_config() {
  print_header "Vite Configuration"
  cd "$FRONTEND_DIR"
  
  echo "vite.config.ts contents:"
  head -40 vite.config.ts
}

cmd_frontend_list_modules() {
  print_header "Vite Optimized Dependencies"
  cd "$FRONTEND_DIR"
  
  echo "Checking package.json..."
  grep -A 50 '"dependencies"' package.json | head -40
}

# ============================================================================
# BACKEND DEBUGGING COMMANDS
# ============================================================================

cmd_backend_check_env() {
  print_header "Checking Backend Environment"
  cd "$BACKEND_DIR"
  
  if [ -f .env ]; then
    echo "Backend .env configuration:"
    cat .env | grep -v "^$" | head -10
    print_success ".env file found"
  else
    print_error ".env file not found"
  fi
}

cmd_backend_check_settings() {
  print_header "Backend Django Settings"
  cd "$BACKEND_DIR"
  
  echo "Checking CORS configuration..."
  grep -A 3 "CORS" utxos_backend/settings.py | head -10
  
  echo ""
  echo "Checking API key loading..."
  grep "UTXOS_API_KEY\|UTXOS_PROJECT_ID" utxos_backend/settings.py
}

cmd_backend_check_urls() {
  print_header "Backend URL Routes"
  cd "$BACKEND_DIR"
  
  echo "Main URLs:"
  cat utxos_backend/urls.py
  
  echo ""
  echo "Wallet app URLs:"
  cat wallets/urls.py
}

cmd_backend_check_views() {
  print_header "Backend Views (Endpoints)"
  cd "$BACKEND_DIR"
  
  echo "Wallet views:"
  grep -E "class.*View|def " wallets/views.py | head -20
}

cmd_backend_start() {
  print_header "Starting Backend Django Server"
  cd "$BACKEND_DIR"
  
  echo "Starting Django development server on http://localhost:8000"
  echo "Press Ctrl+C to stop"
  echo ""
  python manage.py runserver 127.0.0.1:8000
}

cmd_backend_migrate() {
  print_header "Running Database Migrations"
  cd "$BACKEND_DIR"
  
  echo "Applying migrations..."
  python manage.py migrate
  print_success "Migrations applied"
}

cmd_backend_test_api() {
  print_header "Testing Backend API Endpoints"
  
  echo "Test 1: POST /api/wallets/save/"
  curl -X POST http://localhost:8000/api/wallets/save/ \
    -H "Content-Type: application/json" \
    -d '{"address":"addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls","network":"cardano"}' 2>/dev/null | jq .
  
  echo ""
  echo "Test 2: GET /api/wallets/balance/"
  curl http://localhost:8000/api/wallets/balance/addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls/?network=cardano 2>/dev/null | jq .
}

# ============================================================================
# INTEGRATION DEBUGGING COMMANDS
# ============================================================================

cmd_full_health_check() {
  print_header "Full System Health Check"
  
  echo ""
  echo "Frontend:"
  cd "$FRONTEND_DIR"
  [ -d node_modules ] && print_success "Dependencies installed" || print_error "Dependencies not installed"
  [ -f .env ] && print_success ".env configured" || print_warning ".env missing"
  npm run build > /dev/null 2>&1 && print_success "Build succeeds" || print_error "Build fails"
  
  echo ""
  echo "Backend:"
  cd "$BACKEND_DIR"
  [ -d "$BACKEND_DIR" ] && print_success "Backend directory exists" || print_error "Backend directory missing"
  [ -f .env ] && print_success ".env configured" || print_warning ".env missing"
  [ -f settings.py ] || [ -f utxos_backend/settings.py ] && print_success "Django settings found" || print_error "Django settings missing"
  
  echo ""
  echo "Connectivity:"
  if curl -s http://localhost:8000/api/wallets/balance/test/?network=cardano > /dev/null 2>&1; then
    print_success "Backend API responding"
  else
    print_warning "Backend API not responding (start with: cd backend && python manage.py runserver)"
  fi
}

cmd_test_full_flow() {
  print_header "Testing Full Integration Flow"
  
  echo "Starting backend..."
  cd "$BACKEND_DIR"
  python manage.py runserver &
  BACKEND_PID=$!
  sleep 2
  
  echo "Testing API endpoints..."
  echo ""
  
  echo "1. Save Wallet:"
  SAVE_RESULT=$(curl -s -X POST http://localhost:8000/api/wallets/save/ \
    -H "Content-Type: application/json" \
    -d '{"address":"addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls","network":"cardano"}')
  echo "$SAVE_RESULT" | jq .
  
  echo ""
  echo "2. Get Balance:"
  curl -s http://localhost:8000/api/wallets/balance/addr_test1vrr6r5y62m7xdyvvz7cfz7qh5x9dmjpfq08t9pnl4m4m3qxg5vls/?network=cardano | jq .
  
  echo ""
  echo "Stopping backend..."
  kill $BACKEND_PID
  print_success "Flow test completed"
}

# ============================================================================
# HELP AND USAGE
# ============================================================================

print_usage() {
  cat << 'EOF'

🔧 HARAMBEE WALLET - DEBUGGING COMMANDS

USAGE:
  ./debug.sh [command]

FRONTEND COMMANDS:
  frontend-build              Build frontend and check for errors
  frontend-check-imports      Check for import compilation errors
  frontend-check-commonjs     Verify no CommonJS require() usage
  frontend-check-deps         List installed dependencies
  frontend-dev-server         Start Vite dev server (http://localhost:5173)
  frontend-check-env          Check/create .env file
  frontend-check-components   Verify React components exist
  frontend-check-api          Verify API service functions
  frontend-check-types        Run TypeScript type checking
  frontend-check-vite-config  Show Vite configuration
  frontend-list-modules       List npm modules

BACKEND COMMANDS:
  backend-check-env           Check backend .env configuration
  backend-check-settings      Check Django settings (CORS, API keys)
  backend-check-urls          Show URL routes
  backend-check-views         Show view functions
  backend-start               Start Django server (http://localhost:8000)
  backend-migrate             Run database migrations
  backend-test-api            Test API endpoints with curl

INTEGRATION COMMANDS:
  health-check                Run full system health check
  test-flow                   Test full integration flow

EXAMPLES:
  ./debug.sh frontend-build
  ./debug.sh frontend-check-commonjs
  ./debug.sh backend-start
  ./debug.sh health-check

For more info, see FRONTEND_TEST_GUIDE.md

EOF
}

# ============================================================================
# MAIN
# ============================================================================

case "${1:-}" in
  frontend-build) cmd_frontend_build ;;
  frontend-check-imports) cmd_frontend_check_imports ;;
  frontend-check-commonjs) cmd_frontend_check_commonjs ;;
  frontend-check-deps) cmd_frontend_check_deps ;;
  frontend-dev-server) cmd_frontend_dev_server ;;
  frontend-check-env) cmd_frontend_check_env ;;
  frontend-check-components) cmd_frontend_check_components ;;
  frontend-check-api) cmd_frontend_check_api ;;
  frontend-check-types) cmd_frontend_check_types ;;
  frontend-check-vite-config) cmd_frontend_check_vite_config ;;
  frontend-list-modules) cmd_frontend_list_modules ;;
  backend-check-env) cmd_backend_check_env ;;
  backend-check-settings) cmd_backend_check_settings ;;
  backend-check-urls) cmd_backend_check_urls ;;
  backend-check-views) cmd_backend_check_views ;;
  backend-start) cmd_backend_start ;;
  backend-migrate) cmd_backend_migrate ;;
  backend-test-api) cmd_backend_test_api ;;
  health-check) cmd_full_health_check ;;
  test-flow) cmd_test_full_flow ;;
  *)
    print_header "🔧 HARAMBEE WALLET - DEBUGGING COMMANDS"
    print_usage
    ;;
esac
