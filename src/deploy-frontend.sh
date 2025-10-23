#!/bin/bash

# Materia Frontend-Only Deployment Script
# Deploys only the frontend via Git push (Vercel auto-deploys)

set -e  # Exit on error

echo "🎨 Materia Frontend Deployment"
echo "==============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# Get deployment message
read -p "Enter deployment message (or press Enter for default): " DEPLOY_MSG

if [ -z "$DEPLOY_MSG" ]; then
    DEPLOY_MSG="Frontend update - $(date '+%Y-%m-%d %H:%M')"
fi

echo ""
print_status "Message: $DEPLOY_MSG"
echo ""

# Deploy
print_status "Staging changes..."
git add .

print_status "Committing..."
git commit -m "$DEPLOY_MSG" || echo "Nothing to commit"

print_status "Pushing to GitHub..."
if git push; then
    echo ""
    echo "==============================="
    print_success "Frontend Deployed! 🎉"
    echo "==============================="
    echo ""
    echo "Vercel will auto-deploy in 2-3 minutes"
    echo "Check status: https://vercel.com/dashboard"
else
    print_error "Push failed - check your git remote configuration"
    exit 1
fi
