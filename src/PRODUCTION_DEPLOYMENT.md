# Production Deployment Guide

## 🚨 BEFORE DEPLOYING TO PRODUCTION

Your app currently has **debug mode enabled**, which shows diagnostic tools and deployment information to all users. Follow these steps to prepare for production deployment.

---

## Quick Start - Turn Off Debug Mode

### Option 1: Disable Everything (Recommended for Production)

Open `/utils/config.ts` and change:
```typescript
export const DEBUG_MODE = true;  // Change to false
```

This single change will:
- ✅ Hide the deployment status indicator in the header
- ✅ Hide backend connectivity checker on Dashboard
- ✅ Hide deployment instructions on Dashboard  
- ✅ Hide listing debugger on Dashboard
- ✅ Keep your app looking professional for end users

### Option 2: Selective Debug Tools (For Staging/Testing)

Keep `DEBUG_MODE = true` but toggle individual features in `/utils/config.ts`:

```typescript
export const DEBUG_MODE = true; // Master switch

// Individual toggles (only work if DEBUG_MODE is true)
export const SHOW_DEPLOYMENT_STATUS = false;      // Header indicator
export const SHOW_BACKEND_CHECKER = false;        // Backend diagnostics
export const SHOW_DEPLOYMENT_INSTRUCTIONS = false; // Deployment guide
export const SHOW_LISTING_DEBUGGER = false;       // Listing debug panel
```

---

## What Debug Components Are Currently Visible?

When `DEBUG_MODE = true`, users will see:

### 1. **Deployment Status Indicator** (Header)
- Shows "Backend: Up-to-date" or "Backend: Needs deployment"
- Visible to all users in the top navigation bar

### 2. **Deployment Instructions** (Dashboard)
- Full backend deployment guide with commands
- Shows on logged-in user's dashboard

### 3. **Backend Checker** (Dashboard)  
- Tests backend connectivity and shows version info
- Displays JSON responses from health checks

### 4. **Listing Debugger** (Dashboard)
- Shows raw listing data and user IDs
- Displays technical debugging information

---

## Console Logs

Your app also has extensive `console.log()` statements throughout for debugging. These appear in the browser's Developer Console but won't be visible to normal users (unless they open DevTools).

**Note:** If you want to suppress console logs in production, you can wrap them with:
```typescript
if (DEBUG_MODE) {
  console.log('Debug info here');
}
```

---

## Deployment Checklist

- [ ] Set `DEBUG_MODE = false` in `/utils/config.ts`
- [ ] Test the app to ensure everything works without debug tools
- [ ] Deploy backend: `supabase functions deploy server`
- [ ] Verify backend is running with the KV Store fix (version 2.0.0-kv-fix)
- [ ] Test creating, viewing, and deleting listings
- [ ] Test user registration and login
- [ ] Check that no debug panels are visible to end users

---

## Testing in Production Mode

1. Set `DEBUG_MODE = false` in `/utils/config.ts`
2. Refresh your browser (hard refresh: Ctrl+F5 or Cmd+Shift+R)
3. Log in to your dashboard
4. Verify that:
   - No debug panels appear
   - No deployment instructions show
   - Header looks clean (no backend status indicator)
   - App functions normally

---

## Re-enabling Debug Mode for Troubleshooting

If you encounter issues in production and need to debug:

1. Set `DEBUG_MODE = true` in `/utils/config.ts`
2. Save and refresh the app
3. Debug tools will reappear
4. Remember to turn it off again when done!

---

## Current Configuration Location

**File:** `/utils/config.ts`

This is your single source of truth for debug settings. All debug features check this file.

---

## Questions?

- Debug mode controls only affect the **frontend** display of diagnostic tools
- The **backend** logging and error handling remains active regardless
- Setting `DEBUG_MODE = false` does **not** break any functionality
- You can toggle debug mode at any time without redeploying the backend

---

**Last Updated:** January 2025  
**App Version:** Materia v2.0 (with KV Store fix)
