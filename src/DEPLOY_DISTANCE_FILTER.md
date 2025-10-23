# 🚀 Quick Deployment Guide - Distance Filter Update

## What Changed

✅ **Mandatory Zip Codes** - All listings now require a valid 5-digit zip code  
✅ **Distance Filtering** - Users can filter listings by distance from their location  
✅ **Enhanced UI** - Blue indicator bar shows active distance filter with quick controls

---

## Deploy in 3 Steps

### Step 1: Deploy Backend (REQUIRED)

**Option A - Using Scripts:**
```bash
# Mac/Linux/WSL
./deploy-backend.sh

# Windows
deploy-backend.bat
```

**Option B - Manual:**
```bash
cd supabase/functions
supabase functions deploy server --no-verify-jwt
cd ../..
```

### Step 2: Verify Deployment

Open your app and check the header. You should see:
- ✅ **Green badge:** "Backend: Up-to-date"

Or run verification:
```bash
./check-deployment.sh    # Mac/Linux
check-deployment.bat     # Windows
```

### Step 3: Test It Works

1. **Create a listing** without a zip code → Should get error
2. **Create a listing** with valid zip code (e.g., "90210") → Should succeed
3. **Browse listings** → Click Filters → Enable "Filter by Distance"
4. **Enter your zip code** → See blue distance bar appear
5. **Select distance** from dropdown → See filtered results

---

## What Users Will See

### When Creating Listings:
- Zip Code field now has a **red asterisk** (*)
- Help text: "Required for distance-based search"
- **Cannot submit** without valid 5-digit zip code

### When Browsing Listings:
- New "Filter by Distance" toggle in Filters panel
- Enter zip code or click 📍 to use current location
- Blue bar appears showing: "Within X miles of ZIP 12345"
- Dropdown to quickly change distance: 10, 25, 50, 100, 250, 500 miles, or Nationwide
- "Clear" button to disable distance filter

---

## Testing Checklist

- [ ] Backend deployed successfully
- [ ] Header shows "Backend: Up-to-date" (green)
- [ ] Cannot create listing without zip code ❌
- [ ] CAN create listing WITH zip code ✅
- [ ] Distance filter toggle works
- [ ] Blue distance bar appears when enabled
- [ ] Dropdown changes distance radius
- [ ] Listings are filtered by distance
- [ ] "Clear" button disables filter

---

## Troubleshooting

**"Backend: Needs deployment" showing?**
→ Re-run `./deploy-backend.sh` and wait 30 seconds

**Zip code validation not working?**
→ Make sure backend is deployed (Step 1)  
→ Hard refresh browser: Ctrl+Shift+R (Cmd+Shift+R on Mac)

**Distance filter not showing listings?**
→ Increase radius to "Nationwide"  
→ Make sure existing listings have zip codes

---

## Files Changed

### Frontend:
- `/components/Listings.tsx` - Added distance filter UI
- `/components/CreateListing.tsx` - Made zip code mandatory

### Backend:
- `/supabase/functions/server/index.tsx` - Added zip code validation
- Version updated to `2.1.0-distance-filter`

---

## Need More Details?

See full documentation: `/DISTANCE_FILTER_DEPLOYMENT.md`

---

**Ready to deploy? Run:** `./deploy-backend.sh`
