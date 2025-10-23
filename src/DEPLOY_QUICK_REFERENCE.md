# 🚀 Quick Deployment Reference

## One Command Deploy

```bash
./deploy-backend.sh    # Linux/Mac
deploy-backend.bat     # Windows
```

---

## Verify Deployment

**Look for green badge in app header:**
✅ "Backend: Up-to-date"

---

## What Changed

1. **Distance Filter** - Filter listings by miles from your location
2. **Mandatory Zip Codes** - All new listings require 5-digit zip code
3. **Debug Mode** - Easy on/off in `/utils/config.ts`

---

## Quick Tests

### Test 1: Zip Code Required
- Create listing without zip code → ❌ Should fail
- Create listing with "123" → ❌ Should fail
- Create listing with "12345" → ✅ Should succeed

### Test 2: Distance Filter
- Go to Browse Listings
- Click Filters → Toggle "Filter by Distance" ON
- Enter zip code
- ✅ Distance dropdown appears in search bar

---

## Production Ready?

**Turn off debug mode:**

1. Open `/utils/config.ts`
2. Change `DEBUG_MODE = true` to `false`
3. Save

**Hides:**
- Yellow warning banner
- Deployment status badge
- Debug panels on Dashboard

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Backend: Offline" | Wait 30 sec, refresh browser |
| "supabase: command not found" | `npm install -g supabase` |
| "Not logged in" | `supabase login` |
| Listings not showing | Click "Check Backend Directly" on Dashboard |

---

## Files You Need

**Deployment:**
- `./deploy-backend.sh` - Deploy script
- `./check-deployment.sh` - Verify script

**Documentation:**
- `/COMPLETE_DEPLOYMENT_GUIDE.md` - Full guide
- `/🎯_DEPLOY_STEPS_SIMPLE.md` - 3-step quick start
- `/IMPLEMENTATION_SUMMARY.md` - What was built

---

## Deploy Checklist

- [ ] Run `./deploy-backend.sh`
- [ ] See green "Up-to-date" badge
- [ ] Test zip code validation
- [ ] Test distance filter
- [ ] Set `DEBUG_MODE = false`
- [ ] Test on mobile
- [ ] ✅ Ready to launch!

---

**Deploy now:** `./deploy-backend.sh` 🚀
