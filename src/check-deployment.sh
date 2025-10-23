#!/bin/bash

# Quick script to check if backend needs deployment

echo "🔍 Checking Backend Deployment Status..."
echo ""

# Get project ID from utils/supabase/info.tsx
PROJECT_ID=$(grep "projectId.*=" utils/supabase/info.tsx | sed -E "s/.*'([^']+)'.*/\1/")

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Could not find project ID"
    exit 1
fi

BACKEND_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-8ae6fee0"

echo "Backend URL: $BACKEND_URL/health"
echo ""

# Make health check request
RESPONSE=$(curl -s "${BACKEND_URL}/health")

if [ -z "$RESPONSE" ]; then
    echo "❌ Backend is OFFLINE or not responding"
    echo ""
    echo "👉 Deploy with: ./deploy-backend.sh"
    exit 1
fi

echo "Response: $RESPONSE"
echo ""

# Check version
VERSION=$(echo $RESPONSE | grep -o '"version":"[^"]*"' | cut -d'"' -f4)

if [ "$VERSION" = "2.0.0-kv-fix" ]; then
    echo "✅ Backend is UP TO DATE (version: $VERSION)"
    echo ""
    echo "You're good to go! ✨"
else
    echo "⚠️  Backend is OUTDATED (version: ${VERSION:-unknown})"
    echo ""
    echo "Expected version: 2.0.0-kv-fix"
    echo "Current version:  ${VERSION:-unknown}"
    echo ""
    echo "👉 Deploy with: ./deploy-backend.sh"
    exit 1
fi
