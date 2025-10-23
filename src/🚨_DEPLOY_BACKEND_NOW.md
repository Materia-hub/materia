# 🚨 ACTION REQUIRED: Deploy Backend

## ⚠️ Current Status
Your Materia app has **0 listings** showing because the backend needs to be deployed with a critical bug fix.

---

## ✅ What's Been Fixed

The backend code has been updated to fix the **KV Store bug** where listings weren't being saved/retrieved correctly.

**Fixed file:** `/supabase/functions/server/index.tsx`  
**New version:** `2.0.0-kv-fix`  
**Status:** ✅ Code fixed, ⚠️ **Deployment needed**

---

## 🚀 Deploy in 3 Steps

### Step 1: Run Deployment Script

**Linux/Mac/WSL:**
```bash
./deploy-backend.sh
```

**Windows Command Prompt:**
```cmd
deploy-backend.bat
```

**Manual (any OS):**
```bash
cd supabase/functions
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
cd ../..
```

### Step 2: Verify Deployment

**Option A - Via UI:**
1. Open Materia app in browser
2. Go to Dashboard  
3. Check the badge next to "🔧 Backend Diagnostics"
4. ✅ Should show: **"Up-to-Date"** (green badge)

**Option B - Via Script:**
```bash
./check-deployment.sh          # Linux/Mac
check-deployment.bat           # Windows
```

### Step 3: Test It Works

1. Click **"Create Test Listing"** button in Backend Diagnostics
2. Should show success message with listing ID
3. Click **"Check Listings"** - should show count > 0
4. Try creating a real listing - should appear immediately

---

## 🎯 Expected Results

### Before Deployment:
- ❌ No listings showing
- ❌ Backend version: unknown or old
- ❌ Badge shows: "Needs Update" (orange) or "Offline" (red)

### After Deployment:
- ✅ Listings save and appear
- ✅ Backend version: `2.0.0-kv-fix`
- ✅ Badge shows: "Up-to-Date" (green)
- ✅ Test listing creation works
- ✅ Real listings appear in Dashboard

---

## 📋 UI Changes You'll See

When you open the Dashboard, you'll now see **3 diagnostic cards** at the top:

### 1. 🟠 Deployment Instructions (Orange)
- Shows deployment commands
- Can hide/show
- Will be visible until you deploy

### 2. 🔵 Backend Diagnostics (Blue)
- Auto-checks backend version on load
- Shows status badge (green/orange/red)
- Has 3 test buttons:
  - **Check Backend Health** - Tests connectivity
  - **Check Listings** - Shows count from backend
  - **Create Test Listing** - Tests save functionality

### 3. 🟢 Listing Debugger (Green)
- Shows listing counts (My Listings vs All Listings)
- **Check Backend Directly** - Bypasses UI cache
- **Refresh Listings** - Forces reload

---

## 🐛 What Was The Bug?

**Technical details:**
- The protected KV store file (`/supabase/functions/server/kv_store.tsx`) cannot be modified
- Its `getByPrefix()` function returns **values only** (line 86)
- But the backend code was expecting `{key, value}` objects
- This caused all filter operations to fail silently
- Result: No listings were returned

**The fix:**
Changed the backend to work with values directly instead of trying to access `.value` property.

---

## 🆘 Troubleshooting

### "Command not found: supabase"
Install Supabase CLI:
```bash
npm install -g supabase
```

### "Not logged in"
Login to Supabase:
```bash
supabase login
```

### "Project not linked"
Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
(Get YOUR_PROJECT_REF from Supabase Dashboard)

### Backend still shows old version
1. Wait 30 seconds for deployment to propagate
2. Hard refresh browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
3. Check Supabase Dashboard logs for errors

### Deployment succeeds but listings still don't work
1. Check browser console (F12) for errors
2. Click "Check Backend Directly" in Listing Debugger
3. Look for error messages in logs
4. Verify you're logged in with the same account that created listings

---

## 📚 Additional Resources

- **Quick Fix Guide:** `QUICK_FIX.md`
- **Comprehensive Testing:** `DEPLOY_AND_TEST.md`
- **Technical Details:** `KV_STORE_BUG_FIX.md`

---

## ⏭️ After Deployment

Once deployment succeeds and tests pass:

1. ✅ Create some real listings
2. ✅ Test all features (browse, search, offers, messaging)
3. ✅ Optionally remove the diagnostic cards from Dashboard
4. ✅ Share the app with test users

---

## 🎉 Ready to Deploy?

Run this command now:

```bash
# Linux/Mac/WSL:
./deploy-backend.sh

# Windows:
deploy-backend.bat
```

Then check the Dashboard to see the green "Up-to-Date" badge! ✅
