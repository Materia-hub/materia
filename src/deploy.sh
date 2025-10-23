#!/bin/bash

# Materia Deployment Script
# Deploys both frontend (via Git/Vercel) and backend (Supabase functions)

set -e  # Exit on error

echo "🚀 Materia Deployment Script"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in a git repository
if [ ! -d .git ]; then
    print_error "Not a git repository. Run 'git init' first."
    exit 1
fi

# Get deployment message from user
echo ""
read -p "Enter deployment message (or press Enter for default): " DEPLOY_MSG

if [ -z "$DEPLOY_MSG" ]; then
    DEPLOY_MSG="Deploy changes from Figma Make - $(date '+%Y-%m-%d %H:%M')"
fi

echo ""
print_status "Deployment message: $DEPLOY_MSG"
echo ""

# Step 1: Check for changes
print_status "Checking for changes..."
if ! git diff-index --quiet HEAD --; then
    print_success "Changes detected"
else
    print_warning "No changes detected - deploying anyway"
fi

# Step 2: Add all changes
print_status "Staging all changes..."
git add .
print_success "Changes staged"

# Step 3: Commit
print_status "Committing changes..."
if git commit -m "$DEPLOY_MSG"; then
    print_success "Changes committed"
else
    print_warning "Nothing to commit (may have already been committed)"
fi

# Step 4: Push to GitHub
print_status "Pushing to GitHub..."
if git push; then
    print_success "Pushed to GitHub successfully"
else
    print_error "Failed to push to GitHub"
    echo ""
    echo "Possible issues:"
    echo "  1. No remote repository configured"
    echo "  2. Authentication required"
    echo "  3. Network issue"
    echo ""
    echo "Run 'git remote -v' to check your remote configuration"
    exit 1
fi

# Step 5: Deploy backend (optional)
echo ""
read -p "Deploy backend to Supabase? (y/N): " DEPLOY_BACKEND

if [[ $DEPLOY_BACKEND =~ ^[Yy]$ ]]; then
    print_status "Deploying backend to Supabase..."
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI not installed"
        echo "Install with: npm install -g supabase"
        exit 1
    fi
    
    # Check if we're in the functions directory
    if [ -d "supabase/functions" ]; then
        cd supabase/functions
        
        if supabase functions deploy make-server-8ae6fee0 --no-verify-jwt; then
            print_success "Backend deployed to Supabase"
            cd ../..
        else
            print_error "Backend deployment failed"
            cd ../..
            exit 1
        fi
    else
        print_error "supabase/functions directory not found"
        exit 1
    fi
else
    print_warning "Skipping backend deployment"
fi

# Success!
echo ""
echo "=============================="
print_success "Deployment Complete! 🎉"
echo "=============================="
echo ""
echo "Next steps:"
echo "  1. Vercel will auto-deploy in 2-3 minutes"
echo "  2. Check deployment status at: https://vercel.com/dashboard"
echo "  3. Monitor for errors in Vercel logs"
if [[ $DEPLOY_BACKEND =~ ^[Yy]$ ]]; then
    echo "  4. Check Supabase function logs at: https://supabase.com/dashboard"
fi
echo ""
print_status "Your changes will be live shortly!"
