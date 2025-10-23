# 🚀 How to Redeploy Materia with Distance Filter Updates

## Quick Overview

You've added:
1. **Mandatory zip codes** for all listings
2. **Distance-based filtering** with a user-friendly UI
3. **Backend validation** to ensure data quality

---

## Step-by-Step Deployment

### 1️⃣ Deploy the Backend

The backend now validates zip codes, so you **must** redeploy it.

**Choose your method:**

#### Option A: Automated Script (Recommended)

**Mac/Linux/WSL:**
```bash
./deploy-backend.sh
```

**Windows Command Prompt:**
```cmd
deploy-backend.bat
```

#### Option B: Manual Deployment

```bash
# Navigate to supabase functions directory
cd supabase/functions

# Deploy the server function
supabase functions deploy server --no-verify-jwt

# Return to root
cd ../..
```

---

### 2️⃣ Wait for Deployment to Complete

⏱️ **Wait 30-60 seconds** for the deployment to propagate through Supabase's edge network.

You'll see output like:
```
Deploying Function (project: your-project-id)
Bundled server size: XXX KB
✅ Deployed Function server
```

---

### 3️⃣ Verify Deployment

**Method 1: Check in your App**

1. Open your Materia app in the browser
2. Look at the **top-right corner** of the header
3. You should see a green badge: **"Backend: Up-to-date"**

**Method 2: Run Verification Script**

```bash
# Mac/Linux
./check-deployment.sh

# Windows
check-deployment.bat
```

**Method 3: Manual Check**

Open this URL in your browser:
```
https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-8ae6fee0/health
```

Look for:
```json
{
  "status": "ok",
  "version": "2.1.0-distance-filter",
  "timestamp": "..."
}
```

---

### 4️⃣ Test the New Features

#### Test 1: Zip Code is Mandatory ✅

1. Log in to Materia
2. Click **"Create Listing"**
3. Fill out the form but **leave Zip Code empty**
4. Click **Submit**
5. ✅ **Expected:** Error message "Please enter a valid 5-digit zip code"

#### Test 2: Invalid Zip Code Rejected ❌

1. Create a listing
2. Enter zip code: **"123"** (only 3 digits)
3. Click Submit
4. ✅ **Expected:** Error message "Please enter a valid 5-digit zip code"

#### Test 3: Valid Listing Creation ✅

1. Create a listing
2. Fill all fields including a valid zip code (e.g., **"90210"**)
3. Click Submit
4. ✅ **Expected:** Success! Listing is created

#### Test 4: Distance Filter Works 🎯

1. Go to **Browse Listings**
2. Click **"Filters"** button
3. Toggle ON **"Filter by Distance"**
4. Enter your zip code (e.g., **"10001"**)
5. ✅ **Expected:** 
   - Blue bar appears below search
   - Shows "Within X miles of ZIP 10001"
   - Dropdown lets you change distance

#### Test 5: Distance Filtering Actually Filters 📍

1. With distance filter enabled
2. Select **"10 miles"** from dropdown
3. ✅ **Expected:** Only listings within 10 miles show
4. Change to **"Nationwide"**
5. ✅ **Expected:** All listings show again

---

## Troubleshooting

### Problem: "Backend: Needs deployment" (Orange Badge)

**Solution:**
1. Redeploy backend: `./deploy-backend.sh`
2. Wait 60 seconds
3. Hard refresh browser: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)

---

### Problem: Can still create listing without zip code

**Possible causes:**
1. Backend not deployed yet
2. Old backend version still cached

**Solution:**
1. Check backend version at `/health` endpoint
2. Redeploy: `./deploy-backend.sh`
3. Clear browser cache and hard refresh

---

### Problem: Distance filter not showing any listings

**Causes:**
1. No listings within selected radius
2. Existing listings don't have zip codes

**Solution:**
1. Increase distance to **"Nationwide"**
2. Edit existing listings to add zip codes
3. Create a test listing with a nearby zip code

---

### Problem: "Use my location" button doesn't work

**Cause:** Browser blocked location permission

**Solution:**
1. Click the 🔒 icon in browser address bar
2. Allow location access for your site
3. Or just enter zip code manually

---

## Debug Mode

If you need to troubleshoot, **debug mode is currently ON**.

To see debug information:
1. Open Developer Console (F12)
2. Look for console.log messages
3. Check Dashboard for debug panels

To turn off debug mode before production:
1. Edit `/utils/config.ts`
2. Change `DEBUG_MODE = true` to `DEBUG_MODE = false`
3. Save file

---

## What Changed - Technical Details

### Frontend Changes:

**`/components/Listings.tsx`:**
- Added distance filter quick-access bar
- Enhanced distance dropdown with preset options (10, 25, 50, 100, 250, 500, 1000 miles)
- Visual indicator shows active filter with blue background
- Clear button to disable filter

**`/components/CreateListing.tsx`:**
- Zip code field now **required** (marked with asterisk)
- Frontend validation: must be exactly 5 digits
- Helper text: "Required for distance-based search"

### Backend Changes:

**`/supabase/functions/server/index.tsx`:**
- Version bumped to `2.1.0-distance-filter`
- POST `/listings`: Validates zip code presence and format
- PUT `/listings/:id`: Validates zip code on updates
- Returns error 400 if zip code missing or invalid

---

## Files to Check After Deployment

### Check these files in your app:

1. **`/components/DeploymentStatus.tsx`**
   - Should recognize version `2.1.0-distance-filter`
   - Shows green badge when deployed

2. **`/components/Listings.tsx`**
   - Distance filter toggle in Filters panel
   - Blue distance bar when active
   - Dropdown with distance presets

3. **`/components/CreateListing.tsx`**
   - Zip Code field has red asterisk (*)
   - Shows "Required for distance-based search"
   - Validates on submit

---

## Deployment Commands Summary

```bash
# Quick deploy (all-in-one)
./deploy-backend.sh                    # Mac/Linux
deploy-backend.bat                     # Windows

# Verify deployment
./check-deployment.sh                  # Mac/Linux
check-deployment.bat                   # Windows

# Manual deploy
cd supabase/functions
supabase functions deploy server --no-verify-jwt
cd ../..
```

---

## Next Steps After Deployment

1. ✅ Test all features (use checklist above)
2. ✅ Verify backend version shows `2.1.0-distance-filter`
3. ✅ Create a few test listings with valid zip codes
4. ✅ Test distance filtering with different radius values
5. ✅ Turn off debug mode if deploying to production

---

## Production Checklist

Before going live:

- [ ] Backend deployed and verified
- [ ] All tests passing (see Test section above)
- [ ] Debug mode turned OFF (`/utils/config.ts`)
- [ ] Existing listings updated with zip codes
- [ ] Test on mobile devices
- [ ] Test with real user accounts
- [ ] Distance filter works as expected

---

## Support

If you encounter issues:

1. Check browser console for errors (F12)
2. Check backend logs in Supabase dashboard
3. Review `/DISTANCE_FILTER_DEPLOYMENT.md` for detailed docs
4. Verify backend version at `/health` endpoint

---

**Ready? Deploy now:**

```bash
./deploy-backend.sh
```

Then open your app and test! 🎉
