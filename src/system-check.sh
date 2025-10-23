#!/bin/bash

# Complete Materia System Check Script
# Checks all prerequisites and deployment status

set -e

echo "╔═══════════════════════════════════════════╗"
echo "║   Materia System Check & Diagnostics     ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[✓ PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[✗ FAIL]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[⚠ WARN]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

FAILED=0

# 1. Check Node.js
print_check "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_pass "Node.js installed: $NODE_VERSION"
else
    print_fail "Node.js not installed"
    print_info "Install from: https://nodejs.org"
    FAILED=1
fi
echo ""

# 2. Check NPM
print_check "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_pass "npm installed: $NPM_VERSION"
else
    print_fail "npm not installed"
    FAILED=1
fi
echo ""

# 3. Check Supabase CLI
print_check "Checking Supabase CLI installation..."
if command -v supabase &> /dev/null; then
    SUPABASE_VERSION=$(supabase --version 2>&1 | head -n 1)
    print_pass "Supabase CLI installed: $SUPABASE_VERSION"
else
    print_fail "Supabase CLI not installed"
    print_info "Install with: npm install -g supabase"
    FAILED=1
fi
echo ""

# 4. Check project structure
print_check "Checking project structure..."
if [ -d "supabase/functions" ]; then
    print_pass "supabase/functions directory exists"
else
    print_fail "supabase/functions directory not found"
    FAILED=1
fi

if [ -f "supabase/functions/server/index.tsx" ]; then
    print_pass "Backend server file exists"
else
    print_fail "Backend server file not found"
    FAILED=1
fi

if [ -f "utils/supabase/info.tsx" ]; then
    print_pass "Supabase info file exists"
else
    print_fail "Supabase info file not found"
    FAILED=1
fi
echo ""

# 5. Check project ID
print_check "Checking Supabase project configuration..."
if [ -f "utils/supabase/info.tsx" ]; then
    PROJECT_ID=$(grep "projectId.*=" utils/supabase/info.tsx | sed -E "s/.*'([^']+)'.*/\1/")
    if [ -n "$PROJECT_ID" ]; then
        print_pass "Project ID found: $PROJECT_ID"
    else
        print_fail "Project ID not found in utils/supabase/info.tsx"
        FAILED=1
    fi
else
    print_fail "Cannot check project ID - file missing"
    FAILED=1
fi
echo ""

# 6. Check backend deployment
if [ -n "$PROJECT_ID" ]; then
    print_check "Checking backend deployment status..."
    BACKEND_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-8ae6fee0"
    
    RESPONSE=$(curl -s "${BACKEND_URL}/health" || echo "")
    
    if [ -n "$RESPONSE" ]; then
        VERSION=$(echo $RESPONSE | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
        
        if [ "$VERSION" = "2.0.0-kv-fix" ]; then
            print_pass "Backend is deployed and UP-TO-DATE (version: $VERSION)"
        elif [ -n "$VERSION" ]; then
            print_warn "Backend is deployed but OUTDATED (version: $VERSION)"
            print_info "Expected version: 2.0.0-kv-fix"
            print_info "Run: ./deploy-backend.sh"
            FAILED=1
        else
            print_warn "Backend is deployed but version unknown"
            print_info "Response: $RESPONSE"
            FAILED=1
        fi
    else
        print_fail "Backend is OFFLINE or not responding"
        print_info "URL: $BACKEND_URL/health"
        print_info "Run: ./deploy-backend.sh"
        FAILED=1
    fi
fi
echo ""

# 7. Check deployment scripts
print_check "Checking deployment scripts..."
if [ -f "deploy-backend.sh" ]; then
    print_pass "deploy-backend.sh exists"
    if [ -x "deploy-backend.sh" ]; then
        print_pass "deploy-backend.sh is executable"
    else
        print_warn "deploy-backend.sh is not executable"
        print_info "Run: chmod +x deploy-backend.sh"
    fi
else
    print_fail "deploy-backend.sh not found"
    FAILED=1
fi

if [ -f "check-deployment.sh" ]; then
    print_pass "check-deployment.sh exists"
    if [ -x "check-deployment.sh" ]; then
        print_pass "check-deployment.sh is executable"
    else
        print_warn "check-deployment.sh is not executable"
        print_info "Run: chmod +x check-deployment.sh"
    fi
else
    print_warn "check-deployment.sh not found"
fi
echo ""

# 8. Summary
echo "╔═══════════════════════════════════════════╗"
echo "║              Summary                      ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Your Materia app is properly configured and deployed."
    echo ""
    echo "Next steps:"
    echo "  1. Open the app in your browser"
    echo "  2. Check for green 'Up-to-date' badge"
    echo "  3. Test creating a listing"
else
    echo -e "${RED}❌ Some checks failed${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    echo ""
    echo "Common fixes:"
    echo "  - Install Supabase CLI: npm install -g supabase"
    echo "  - Deploy backend: ./deploy-backend.sh"
    echo "  - Make scripts executable: chmod +x *.sh"
fi
echo ""

# 9. Quick action suggestions
if [ $FAILED -ne 0 ]; then
    echo "╔═══════════════════════════════════════════╗"
    echo "║          Quick Fix Commands               ║"
    echo "╚═══════════════════════════════════════════╝"
    echo ""
    
    if ! command -v supabase &> /dev/null; then
        echo "# Install Supabase CLI:"
        echo "npm install -g supabase"
        echo ""
    fi
    
    if [ -n "$VERSION" ] && [ "$VERSION" != "2.0.0-kv-fix" ]; then
        echo "# Deploy updated backend:"
        echo "./deploy-backend.sh"
        echo ""
    fi
    
    if [ -f "deploy-backend.sh" ] && [ ! -x "deploy-backend.sh" ]; then
        echo "# Make deployment scripts executable:"
        echo "chmod +x deploy-backend.sh check-deployment.sh"
        echo ""
    fi
fi

exit $FAILED
