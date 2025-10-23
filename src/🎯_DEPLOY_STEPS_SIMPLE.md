# 🎯 Deploy Materia - Simple 3-Step Guide

## Step 1: Deploy Backend ⚡

**Run this command:**

### Linux/Mac/WSL:
```bash
./deploy-backend.sh
```

### Windows:
```cmd
deploy-backend.bat
```

### Or Manual:
```bash
cd supabase/functions
supabase functions deploy server --no-verify-jwt
cd ../..
```

**Wait for:** "Deployment complete" message (10-30 seconds)

---

## Step 2: Verify ✅

**Open Materia app in browser**

Look at the header (top right area):

- ✅ **Green badge:** "Backend: Up-to-date" → SUCCESS!
- 🟠 **Orange badge:** "Needs deployment" → Run deploy again
- 🔴 **Red badge:** "Offline" → Check logs

---

## Step 3: Test 🧪

### Test A: Create Listing with Zip Code
1. Log in
2. Click "Create Listing"
3. Fill out form
4. **Enter a 5-digit zip code** (e.g., "90210")
5. Submit
6. ✅ Should succeed

### Test B: Distance Filter
1. Go to "Browse Listings"
2. Click "Filters"
3. Toggle "Filter by Distance" ON
4. Enter your zip code
5. ✅ Distance dropdown appears in search bar

---

## 🎉 That's It!

Your app is deployed and ready to use.

---

## 🐛 Quick Troubleshooting

### "supabase: command not found"
```bash
npm install -g supabase
```

### "Not logged in"
```bash
supabase login
```

### "No project linked"
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
(Get YOUR_PROJECT_REF from Supabase Dashboard)

---

## 📚 Need More Help?

- **Full guide:** `/COMPLETE_DEPLOYMENT_GUIDE.md`
- **Quick checklist:** `/DEPLOY_NOW_CHECKLIST.md`
- **Feature details:** `/DISTANCE_FILTER_DEPLOYMENT.md`
- **Debug mode:** `/DEBUG_MODE_QUICK_GUIDE.md`

---

## ⚙️ Production Ready?

**Before launching to real users:**

1. Open `/utils/config.ts`
2. Change `DEBUG_MODE = true` to `DEBUG_MODE = false`
3. Save

This removes debug tools from user view.

---

**Ready? Deploy now! 🚀**

```bash
./deploy-backend.sh
```
