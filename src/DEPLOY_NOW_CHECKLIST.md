# 🚀 Deploy Your Materia App - Quick Checklist

## ⚡ Quick Deploy (3 Steps)

### 1. Deploy Backend

**Run this command:**
```bash
# Linux/Mac/WSL:
./deploy-backend.sh

# Windows:
deploy-backend.bat
```

**Wait for:** "Deployment complete" message

---

### 2. Verify Deployment

**Check in your app:**
- Look at the header
- Should see: ✅ **"Backend: Up-to-date"** (green badge)

**OR run:**
```bash
./check-deployment.sh    # Linux/Mac
check-deployment.bat     # Windows
```

---

### 3. Test It Works

**Try creating a listing:**
1. Log in to Materia
2. Click "Create Listing"
3. Fill out the form **including a 5-digit zip code**
4. Submit
5. ✅ Should appear in your listings immediately

**Try distance filtering:**
1. Go to "Browse Listings"
2. Click "Filters"
3. Toggle "Filter by Distance" ON
4. Enter your zip code
5. ✅ Should see distance selector appear

---

## ✅ Full Pre-Deployment Checklist

Before you deploy, make sure:

- [ ] You have Supabase CLI installed (`npm install -g supabase`)
- [ ] You're logged in to Supabase (`supabase login`)
- [ ] Your project is linked (`supabase link --project-ref YOUR_REF`)
- [ ] You've saved all your work
- [ ] You've tested locally first

---

## 🎯 What Gets Deployed

### Backend Changes:
✅ KV Store bug fix (listings save properly)  
✅ Mandatory zip code validation  
✅ 5-digit zip code format check  
✅ Better error messages  
✅ Health check endpoint

### Frontend Changes (auto-deployed by Figma Make):
✅ Distance-based filtering  
✅ Distance radius dropdown  
✅ Zip code required in Create Listing form  
✅ Visual distance indicators  
✅ Debug mode controls

---

## 🔍 Post-Deployment Verification

### Check 1: Backend Health
Visit your Dashboard - should see **3 debug panels** (if DEBUG_MODE is on):
1. 🟠 Deployment Instructions
2. 🔵 Backend Diagnostics (with "Up-to-Date" badge)
3. 🟢 Listing Debugger

### Check 2: Listing Creation
- Try creating a listing WITHOUT zip code → ❌ Should fail
- Try creating a listing WITH zip code → ✅ Should succeed

### Check 3: Distance Filter
- Enable filter → ✅ Distance dropdown appears
- Enter zip code → ✅ Shows "Showing listings within X miles"
- Change radius → ✅ Listings update

---

## 🚨 Common Deployment Issues

### Issue: "supabase: command not found"
**Fix:**
```bash
npm install -g supabase
```

### Issue: "Not logged in"
**Fix:**
```bash
supabase login
```
Follow the browser prompts to authenticate.

### Issue: "No project linked"
**Fix:**
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
Get YOUR_PROJECT_REF from your Supabase Dashboard.

### Issue: Backend shows "Offline" or "Needs deployment"
**Fix:**
1. Wait 30 seconds after deployment
2. Hard refresh browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
3. Check Supabase Dashboard for deployment logs

### Issue: Listings still not showing
**Fix:**
1. Open browser console (F12)
2. Look for error messages
3. Click "Check Backend Directly" in Dashboard Listing Debugger
4. Verify you're logged in as the same user who created listings

---

## 🎨 Production Readiness

### Before Launching to Real Users:

1. **Turn off Debug Mode:**
   - Open `/utils/config.ts`
   - Change `DEBUG_MODE = true` to `DEBUG_MODE = false`
   - This hides all debug panels and deployment status indicators

2. **Test All Features:**
   - User registration/login
   - Creating listings (with zip codes)
   - Browsing listings
   - Distance filtering
   - Making offers
   - Messaging
   - Transactions
   - Pickup scheduling

3. **Check Mobile:**
   - Test on mobile browser
   - Verify distance filter works
   - Test geolocation button (📍)

4. **Data Quality:**
   - Remove any test listings
   - Ensure real listings have valid zip codes
   - Add some quality content for demo

---

## 📋 Deployment Commands Reference

### Deploy Backend Only:
```bash
cd supabase/functions
supabase functions deploy server --no-verify-jwt
cd ../..
```

### Check Deployment Status:
```bash
# Linux/Mac:
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8ae6fee0/health \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Should return: {"status":"ok","version":"2.0.0-kv-fix"}
```

### View Backend Logs:
```bash
supabase functions logs server
```

### Test Backend Directly:
```bash
# Check health
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8ae6fee0/health

# Get listings
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8ae6fee0/listings
```

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Backend status shows "Up-to-date" (green)  
✅ Can create listings with zip codes  
✅ Cannot create listings without zip codes  
✅ Distance filter appears and works  
✅ Listings are filtered by selected distance  
✅ No errors in browser console  
✅ No errors in backend logs  
✅ Test listings appear in Dashboard  

---

## 🎉 Next Steps After Successful Deployment

1. **Test Everything:**
   - Go through the entire user flow
   - Create multiple listings with different zip codes
   - Test distance filtering from different locations
   - Verify offers, messages, and transactions work

2. **Optional Cleanup:**
   - Set `DEBUG_MODE = false` in `/utils/config.ts` to hide debug tools
   - Remove test data
   - Add real product photos and descriptions

3. **Share With Users:**
   - Send app link to beta testers
   - Gather feedback
   - Monitor for issues

4. **Monitor:**
   - Check Supabase Dashboard for usage
   - Watch for error logs
   - Track user engagement

---

## 📞 Need Help?

### Quick Fixes:
- See `/TROUBLESHOOTING.md` for detailed solutions
- Check `/DISTANCE_FILTER_DEPLOYMENT.md` for feature-specific issues
- Review `/KV_STORE_BUG_FIX.md` for backend technical details

### Debug Tools:
- Enable DEBUG_MODE in `/utils/config.ts`
- Use Dashboard diagnostic panels
- Check browser console (F12)
- View Supabase logs

---

## 🔄 Rollback (If Needed)

If something goes wrong:

1. **Check the error:** Look at logs first
2. **Don't panic:** Your data is safe in the KV store
3. **Redeploy:** Run deployment command again
4. **Contact support:** Provide error logs for help

---

## ✨ You're Ready to Deploy!

**Run this now:**
```bash
./deploy-backend.sh
```

Then open your Materia app and start testing! 🎉

---

**Pro Tip:** Keep this terminal window open during deployment to see progress and catch any errors.

**Last Updated:** January 2025  
**Deployment Version:** v2.1 (KV Fix + Distance Filtering + Mandatory Zip)
