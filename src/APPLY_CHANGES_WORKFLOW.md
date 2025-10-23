# 🔄 How to Apply Figma Make Changes to Your Live Site

**Quick Answer:** Figma Make changes are NOT automatically deployed. You must export and redeploy manually.

---

## Understanding the Two Environments

### 🔧 Development (Figma Make)
- **Where you are now**
- Make changes, test features, fix bugs
- Has its own temporary database
- **Changes here DON'T affect your live site**

### 🌐 Production (Live Site)
- **Where users access your app**
- Hosted on Vercel (frontend) + Supabase (backend)
- Has production database with real user data
- **Needs manual deployment to update**

---

## The Workflow (Step-by-Step)

### Step 1: Make Changes in Figma Make
- Edit components
- Fix bugs
- Add features
- Test thoroughly in Figma Make preview

### Step 2: Export Code from Figma Make
1. Look for **Export** or **Download** button in Figma Make
2. Click it
3. Download the ZIP file (e.g., `materia-code.zip`)
4. Extract ZIP to your computer
5. **Replace your existing project folder** with the new files

### Step 3: Deploy to Production
Run the automated deployment script:

**Mac/Linux:**
```bash
cd /path/to/your/materia-folder
./deploy.sh
```

**Windows:**
```bash
cd C:\path\to\your\materia-folder
deploy.bat
```

### Step 4: Wait for Deployment
- Script completes in ~10 seconds
- Vercel auto-builds in 2-3 minutes
- **Your live site updates automatically!**

### Step 5: Verify Changes Live
1. Open your live site (e.g., `https://materia.vercel.app`)
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Test the changes you made
4. Check browser console for errors

---

## Visual Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FIGMA MAKE (Development)                                 │
│    - Make changes                                           │
│    - Test features                                          │
│    - Fix bugs                                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Export ZIP
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. YOUR COMPUTER                                            │
│    - Extract ZIP                                            │
│    - Replace project files                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Run deploy.sh
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. GITHUB                                                   │
│    - Code pushed to repository                              │
│    - Version controlled                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Auto-trigger
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. VERCEL (Auto-Deploy)                                     │
│    - Detects GitHub push                                    │
│    - Builds app (2-3 min)                                   │
│    - Deploys to production                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ LIVE!
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. PRODUCTION SITE (https://materia.vercel.app)             │
│    - Changes now live                                       │
│    - Accessible to all users                                │
│    - Connected to production database                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Real Example: Fixing the CreateListing Bug

### What You Did in Figma Make:
```typescript
// Fixed: CreateListing component receiving undefined listings
interface CreateListingProps {
  onListingCreated: () => void;
  currentSubscription: SubscriptionTier;
  listingsCount: number;
}
```

### Applying to Live Site:

1. **Export from Figma Make**
   - Click Export button
   - Download `materia-code.zip`
   - Extract to `~/Desktop/materia-code`

2. **Run Deployment Script**
   ```bash
   cd ~/Desktop/materia-code
   ./deploy.sh
   ```
   
3. **Enter Message**
   ```
   Enter deployment message: Fixed CreateListing undefined listings bug
   Deploy backend? (y/N): n
   ```

4. **Wait**
   - Terminal shows: ✓ Pushed to GitHub successfully
   - Vercel dashboard shows: Building...
   - After 2-3 minutes: Deployment Complete!

5. **Verify**
   - Visit your live site
   - Test creating a listing
   - Bug is now fixed in production! ✅

---

## When to Deploy

### Deploy Immediately:
- ✅ Critical bug fixes
- ✅ Security issues
- ✅ Broken functionality

### Deploy After Testing:
- ✅ New features (test thoroughly first)
- ✅ UI improvements
- ✅ Performance optimizations

### Deploy in Batches:
- ✅ Minor styling tweaks
- ✅ Copy changes
- ✅ Non-urgent improvements

---

## Common Questions

### Q: Can I skip exporting from Figma Make?
**A:** No! You must export the latest code. Changes only exist in Figma Make until exported.

### Q: How often should I deploy?
**A:** Whenever you have tested changes ready for users. Could be daily, weekly, or as needed.

### Q: What if I break production?
**A:** You can roll back in Vercel:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." → "Promote to Production"

### Q: Do database changes transfer?
**A:** No! Figma Make has its own test database. Production database is separate.

### Q: Can users see my Figma Make changes?
**A:** No. Only you can see Figma Make preview. Users only see production site.

---

## Deployment Frequency Examples

### Active Development (Pre-Launch):
- Daily deployments
- Multiple times per day for critical fixes
- Test features in Figma Make first

### Post-Launch (Stable):
- Weekly feature releases
- Immediate critical bug fixes
- Scheduled maintenance windows

### Maintenance Mode:
- Monthly updates
- As-needed bug fixes
- Feature updates when ready

---

## Troubleshooting

### "My changes aren't showing on live site"
1. Did you export from Figma Make?
2. Did you run the deployment script?
3. Did the deployment succeed? Check Vercel dashboard
4. Try hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
5. Check browser console for errors

### "Deployment failed"
1. Check terminal output for errors
2. Check Vercel dashboard for build logs
3. Verify environment variables are set
4. Check TROUBLESHOOTING.md

### "Site shows old version"
1. Hard refresh browser
2. Clear browser cache
3. Check Vercel dashboard - which version is deployed?
4. Verify deployment completed successfully

---

## Best Practices

### ✅ DO:
- Export fresh code from Figma Make every time
- Test thoroughly in Figma Make before deploying
- Write descriptive deployment messages
- Deploy during low-traffic hours (if applicable)
- Monitor deployments in Vercel dashboard
- Test production site after deployment
- Keep Figma Make and production code in sync

### ❌ DON'T:
- Deploy without testing first
- Make changes directly in production files
- Skip exporting from Figma Make
- Deploy broken code
- Ignore deployment errors
- Forget to verify changes went live

---

## Quick Commands Reference

```bash
# Navigate to project folder
cd /path/to/materia-folder

# Deploy everything (frontend + optional backend)
./deploy.sh

# Deploy frontend only (faster)
./deploy-frontend.sh

# Deploy backend only (API changes)
./deploy-backend.sh

# Check what's changed
git status

# Check deployment history
git log --oneline -5

# Manually push (if script fails)
git add .
git commit -m "Your message"
git push
```

---

## Summary

**Every time you make changes in Figma Make:**

1. 🔧 **Edit** in Figma Make
2. 🧪 **Test** in Figma Make preview
3. 📦 **Export** ZIP from Figma Make
4. 📂 **Extract** to your project folder
5. 🚀 **Run** `./deploy.sh`
6. ⏳ **Wait** 2-3 minutes
7. ✅ **Verify** changes are live

**Total time: ~5 minutes from export to live!**

---

## Need Help?

- Check DEPLOYMENT_AUTOMATION.md for script details
- Check TROUBLESHOOTING.md for common issues
- Check Vercel/Supabase dashboards for logs
- Review browser console for frontend errors

Your workflow is now streamlined! 🎉
