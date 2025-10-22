# 🚀 Materia Deployment Commands - Quick Reference

All the commands you need to deploy Materia to production.

---

## Prerequisites

```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Verify installation
node --version
npm --version
```

---

## 1️⃣ Supabase CLI Setup

```bash
# Install Supabase CLI globally
npm install -g supabase

# Verify installation
supabase --version

# Login to Supabase (opens browser)
supabase login
```

---

## 2️⃣ Link Your Supabase Project

```bash
# Navigate to your project folder
cd /path/to/your/materia-folder

# Link to production Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Example:
# supabase link --project-ref abcdefghijklmnop
```

💡 **Find YOUR_PROJECT_REF**: 
- Go to Supabase Dashboard
- Look at URL: `supabase.com/dashboard/project/YOUR_PROJECT_REF`

---

## 3️⃣ Deploy Edge Function

```bash
# Navigate to functions directory
cd supabase/functions

# Deploy the server function
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt

# Wait for: "Deployed Function make-server-8ae6fee0"
```

### Test the deployment:
```bash
# Replace YOUR_PROJECT_ID with your Supabase project ID
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8ae6fee0/health

# Should return: {"status":"ok"}
```

---

## 4️⃣ Initialize Git Repository

```bash
# Navigate back to project root
cd ../..

# Initialize git (if not already done)
git init

# Create .gitignore file (important!)
echo "node_modules/
.env
.env.local
.vercel
.DS_Store" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit - Materia v1.0"

# Set main branch
git branch -M main
```

---

## 5️⃣ Push to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/materia.git

# Push to GitHub
git push -u origin main

# Enter GitHub credentials when prompted
```

💡 **First time?** You may need to:
1. Create repository on GitHub first
2. Use GitHub CLI: `gh repo create materia --private --source=. --push`

---

## 6️⃣ Deploy to Vercel (CLI Method - Optional)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name? materia
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Anon Key when prompted

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your Service Role Key when prompted

# Deploy to production
vercel --prod
```

---

## 🔄 Update/Redeploy Commands

### Update Edge Function
```bash
cd supabase/functions
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
```

### Update Frontend
```bash
# Make your changes, then:
git add .
git commit -m "Update: description of changes"
git push

# Vercel auto-deploys on push!
# Or manually:
vercel --prod
```

---

## 📊 Monitoring Commands

### View Supabase Logs
```bash
# View function logs
supabase functions logs make-server-8ae6fee0

# Follow logs (live)
supabase functions logs make-server-8ae6fee0 --follow
```

### View Vercel Logs
```bash
# View deployment logs
vercel logs

# View production logs
vercel logs --prod

# Follow logs (live)
vercel logs --follow
```

---

## 🔍 Debugging Commands

### Check Function Status
```bash
# List all functions
supabase functions list

# Check specific function
supabase functions inspect make-server-8ae6fee0
```

### Test Backend Locally
```bash
# Start local Supabase (advanced)
supabase start

# Serve functions locally
supabase functions serve make-server-8ae6fee0
```

### Check Git Status
```bash
# View current status
git status

# View commit history
git log --oneline

# View remote URLs
git remote -v
```

---

## 🆘 Troubleshooting Commands

### Supabase Issues

**Can't login?**
```bash
# Logout and login again
supabase logout
supabase login
```

**Function won't deploy?**
```bash
# Delete and redeploy
supabase functions delete make-server-8ae6fee0
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
```

**Wrong project linked?**
```bash
# Unlink
supabase unlink

# Link to correct project
supabase link --project-ref CORRECT_PROJECT_REF
```

### Git Issues

**Wrong remote URL?**
```bash
# Remove old remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/materia.git
```

**Merge conflicts?**
```bash
# Force push (careful! overwrites remote)
git push -f origin main
```

### Vercel Issues

**Need to redeploy?**
```bash
# Remove current deployment
vercel remove materia

# Deploy fresh
vercel --prod
```

**Environment variables not working?**
```bash
# List current env vars
vercel env ls

# Remove and re-add
vercel env rm NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

---

## 📋 Pre-Deployment Checklist

Run these checks before deploying:

```bash
# 1. Verify you're in project directory
pwd

# 2. Check git status (should be clean)
git status

# 3. Verify Supabase link
supabase projects list

# 4. Test backend locally (optional)
cd supabase/functions
deno run --allow-all ./make-server-8ae6fee0/index.tsx

# 5. Check for errors in code
# Open in VS Code and check for red squiggles
```

---

## 🚀 Complete Deployment Script

Copy this entire script for one-command deployment:

```bash
#!/bin/bash

echo "🚀 Deploying Materia..."

# Deploy backend
echo "📦 Deploying backend to Supabase..."
cd supabase/functions
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
cd ../..

# Commit and push frontend
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Check Vercel dashboard for deployment status"
echo "📊 View logs: vercel logs --prod"
```

Save as `deploy.sh`, then:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🎯 Quick Deploy (After Initial Setup)

Once everything is configured, deploying updates is simple:

```bash
# Make your changes in code editor

# Then run:
git add .
git commit -m "Your change description"
git push

# That's it! Vercel auto-deploys
# Backend updates: cd supabase/functions && supabase functions deploy make-server-8ae6fee0
```

---

## 📱 Mobile Testing Commands

```bash
# Get local IP for mobile testing
# Mac/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows:
ipconfig | findstr IPv4

# Run dev server
npm run dev

# Access from phone: http://YOUR_IP:3000
```

---

## 💾 Backup Commands

```bash
# Backup database
supabase db dump > backup_$(date +%Y%m%d).sql

# Download all storage
supabase storage download make-8ae6fee0-listing-images --recursive

# Export environment variables
vercel env pull .env.production
```

---

## 🔑 Environment Variables Reference

These go in Vercel Dashboard → Settings → Environment Variables:

| Variable Name | Example Value | Where to Find |
|--------------|---------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Supabase → Settings → API |

⚠️ **Never commit these to Git!**

---

## ⏱️ Typical Deployment Times

| Step | Duration |
|------|----------|
| Edge Function Deploy | 30-60 seconds |
| Git Push | 5-10 seconds |
| Vercel Build & Deploy | 2-3 minutes |
| DNS Propagation (domain) | 10-60 minutes |
| Total (first time) | ~60 minutes |
| Total (updates) | ~3-5 minutes |

---

## 🎉 Success Indicators

After deployment, you should see:

### Supabase
```
✔ Function make-server-8ae6fee0 deployed successfully
```

### Vercel
```
✔ Preview: https://materia-xxx.vercel.app
✔ Production: https://materia.vercel.app
```

### Browser
- Site loads without errors
- Can create account
- Can upload images
- Data persists after refresh

---

## 📞 Get Help

If any command fails:

1. **Read the error message carefully**
2. **Check you're in the right directory**: `pwd`
3. **Verify you're logged in**: 
   - Supabase: `supabase projects list`
   - Vercel: `vercel whoami`
4. **Check documentation**: TROUBLESHOOTING.md
5. **View logs**: 
   - Supabase: Dashboard → Edge Functions → Logs
   - Vercel: Dashboard → Deployments → View Logs

---

## ✅ You're Ready!

These commands will deploy Materia to production. Take it step by step, and you'll be live in about an hour! 🚀

**Next Step**: Follow LAUNCH_NOW.md for complete deployment guide.
