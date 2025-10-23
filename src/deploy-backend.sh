#!/bin/bash

# Materia Backend-Only Deployment Script
# Deploys only Supabase edge functions

set -e  # Exit on error

echo "⚙️  Materia Backend Deployment"
echo "==============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not installed"
    echo ""
    echo "Install with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

# Check if functions directory exists
if [ ! -d "supabase/functions" ]; then
    print_error "supabase/functions directory not found"
    exit 1
fi

# Navigate to functions directory
cd supabase/functions

# Deploy
print_status "Deploying edge function to Supabase..."

if supabase functions deploy make-server-8ae6fee0 --no-verify-jwt; then
    echo ""
    echo "==============================="
    print_success "Backend Deployed! 🎉"
    echo "==============================="
    echo ""
    echo "Check logs: https://supabase.com/dashboard"
    cd ../..
else
    print_error "Deployment failed"
    echo ""
    echo "Common issues:"
    echo "  1. Not logged in - run: supabase login"
    echo "  2. Not linked to project - run: supabase link --project-ref YOUR_REF"
    echo "  3. Network issue"
    cd ../..
    exit 1
fi
