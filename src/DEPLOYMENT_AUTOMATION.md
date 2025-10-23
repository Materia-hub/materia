# 🚀 Automated Deployment Guide

This guide shows you how to use the automated deployment scripts to quickly push changes from Figma Make to your live production site.

---

## Quick Start

After making changes in Figma Make and exporting your code, run:

### On Mac/Linux:
```bash
chmod +x deploy.sh
./deploy.sh
```

### On Windows:
```bash
deploy.bat
```

That's it! Your changes will be live in 2-3 minutes.

---

## Available Scripts

### 1. `deploy.sh` / `deploy.bat` (RECOMMENDED)
**Full deployment** - Deploys both frontend and backend

**What it does:**
- ✅ Stages all your changes
- ✅ Creates a git commit with your message
- ✅ Pushes to GitHub (triggers Vercel deployment)
- ✅ Optionally deploys backend to Supabase
- ✅ Provides status updates throughout

**When to use:**
- You've made changes to frontend OR backend OR both
- This is your go-to deployment script

---

### 2. `deploy-frontend.sh`
**Frontend-only deployment**

**What it does:**
- ✅ Stages and commits changes
- ✅ Pushes to GitHub
- ✅ Skips backend deployment

**When to use:**
- You only changed React components, styles, or UI
- Backend/API code unchanged
- Faster than full deployment

---

### 3. `deploy-backend.sh`
**Backend-only deployment**

**What it does:**
- ✅ Deploys Supabase edge function
- ✅ Skips Git/GitHub/Vercel

**When to use:**
- You only changed `/supabase/functions/server/index.tsx`
- Frontend unchanged
- Need quick API fixes

---

## Step-by-Step Workflow

### When Working in Figma Make:

1. **Make changes in Figma Make**
   - Edit components, fix bugs, add features

2. **Export code from Figma Make**
   - Click Export/Download button
   - Download ZIP file
   - Extract to your project folder (replace existing files)

3. **Run deployment script**
   ```bash
   # Mac/Linux
   ./deploy.sh
   
   # Windows
   deploy.bat
   ```

4. **Enter deployment message** when prompted
   - Example: "Fixed CreateListing undefined listings bug"
   - Or press Enter for auto-generated message

5. **Choose backend deployment**
   - Type `y` if you changed backend code
   - Type `n` (or just press Enter) if frontend-only changes

6. **Wait for deployment**
   - Script completes in ~10 seconds
   - Vercel builds and deploys in 2-3 minutes
   - Your site updates automatically!

---

## First Time Setup

### Mac/Linux:

1. **Make scripts executable:**
   ```bash
   chmod +x deploy.sh
   chmod +x deploy-frontend.sh
   chmod +x deploy-backend.sh
   ```

2. **Configure Git (if not done):**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Link to GitHub repository:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/materia.git
   ```

4. **Link to Supabase (for backend deployment):**
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

### Windows:

1. **No setup needed!** Just run `deploy.bat`

2. **Configure Git (if not done):**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Link to GitHub repository:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/materia.git
   ```

4. **Link to Supabase (for backend deployment):**
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

---

## Common Scenarios

### Scenario 1: Fixed a UI Bug
```bash
# Export from Figma Make, then:
./deploy-frontend.sh
# Message: "Fixed button alignment on listing cards"
```

### Scenario 2: Added New Feature (Frontend + Backend)
```bash
# Export from Figma Make, then:
./deploy.sh
# Message: "Added distance filter feature"
# Deploy backend? y
```

### Scenario 3: Backend API Fix
```bash
# Export from Figma Make, then:
./deploy-backend.sh
# (No git commit - just updates API)
```

### Scenario 4: Quick Styling Update
```bash
# Export from Figma Make, then:
./deploy-frontend.sh
# Message: "Updated color scheme"
```

---

## Monitoring Deployments

### Frontend (Vercel):
1. Go to https://vercel.com/dashboard
2. Click your project
3. View "Deployments" tab
4. See real-time build logs
5. Deployment typically takes 2-3 minutes

### Backend (Supabase):
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Edge Functions" in sidebar
4. Click "make-server-8ae6fee0"
5. View logs and invocations

---

## Troubleshooting

### "Permission denied" error (Mac/Linux)
```bash
chmod +x deploy.sh
```

### "Git push failed"
**Check your remote:**
```bash
git remote -v
```

**Should show:**
```
origin  https://github.com/YOUR_USERNAME/materia.git (fetch)
origin  https://github.com/YOUR_USERNAME/materia.git (push)
```

**If not set:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/materia.git
```

### "Supabase CLI not found"
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### "Nothing to commit"
This is normal if you:
- Already committed these changes
- No files were actually changed
- The script will still push to trigger Vercel deployment

### "Vercel deployment failed"
1. Check Vercel dashboard for error logs
2. Verify environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Check build logs for specific errors

---

## Best Practices

### ✅ DO:
- Export from Figma Make before every deployment
- Write descriptive commit messages
- Test in Figma Make before deploying
- Deploy backend when API changes
- Monitor Vercel/Supabase dashboards after deployment

### ❌ DON'T:
- Deploy without testing in Figma Make first
- Skip commit messages (makes tracking changes hard)
- Deploy broken code to production
- Forget to export updated code from Figma Make
- Deploy backend unnecessarily (slower)

---

## Deployment Checklist

Before running deployment script:

- [ ] Tested changes in Figma Make
- [ ] Exported latest code from Figma Make
- [ ] Extracted ZIP to project folder
- [ ] Know what changed (frontend/backend/both)
- [ ] Have descriptive commit message ready
- [ ] Checked no critical errors in console

After deployment:

- [ ] Watched deployment complete in terminal
- [ ] Checked Vercel dashboard (2-3 min)
- [ ] Verified site loads without errors
- [ ] Tested the specific changes you made
- [ ] Checked browser console for errors
- [ ] Tested on mobile if relevant

---

## Quick Reference Commands

```bash
# Full deployment (recommended)
./deploy.sh

# Frontend only
./deploy-frontend.sh

# Backend only
./deploy-backend.sh

# Check git status
git status

# View deployment history
git log --oneline -5

# Check Vercel deployments
# Visit: https://vercel.com/dashboard

# Check Supabase logs
# Visit: https://supabase.com/dashboard

# Make scripts executable (Mac/Linux, one-time)
chmod +x *.sh
```

---

## Advanced: Custom Deployment

If you need more control, you can run commands manually:

```bash
# 1. Stage changes
git add .

# 2. Commit with message
git commit -m "Your message here"

# 3. Push to GitHub (triggers Vercel)
git push

# 4. Deploy backend (if needed)
cd supabase/functions
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
cd ../..
```

---

## Support

If deployments fail:

1. Check the terminal output for specific errors
2. Review Vercel/Supabase dashboards
3. Check TROUBLESHOOTING.md
4. Review error logs in browser console
5. Verify environment variables are set correctly

---

## Summary

The automated deployment scripts handle the entire workflow:

**Figma Make → Export → Run Script → GitHub → Vercel → LIVE!**

Total time: ~3 minutes from export to live site ✨

Happy deploying! 🚀
