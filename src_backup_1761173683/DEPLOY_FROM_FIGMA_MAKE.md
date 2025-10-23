# 🚀 Deploy Materia from Figma Make - Complete Guide

**You're here** → Inside Figma Make, app is working
**Next step** → Get code onto your computer and deploy it

---

## 🎯 The Complete Journey

```
Figma Make → Your Computer → Supabase → GitHub → Vercel → LIVE! 🎉
(Now)        (Export)        (Backend)   (Code)    (Frontend) (Done!)
```

---

## Step 1: Export Code from Figma Make ⬇️

### Option A: Using Figma Make Export Button

1. **Look for Export/Download button** in Figma Make interface
   - Usually top-right corner
   - May say "Export", "Download", or "Download Code"
   
2. **Click Export/Download**
   - It will download a ZIP file
   - Name like: `materia-code.zip` or similar

3. **Extract the ZIP file**
   - Right-click → Extract All (Windows)
   - Or double-click (Mac)
   - Choose a location you can find easily (Desktop or Documents)

4. **Verify you have the files**
   - Open the extracted folder
   - You should see:
     - `App.tsx`
     - `components/` folder
     - `supabase/` folder
     - `package.json`
     - All the files from your structure

---

## Step 2: Open in Code Editor 💻

### Install VS Code (if you don't have it)

1. Go to https://code.visualstudio.com/
2. Download for your OS
3. Install it

### Open Your Project

1. **Open VS Code**
2. **File → Open Folder**
3. **Select your extracted folder**
4. You should now see all your files in the sidebar

---

## Step 3: Set Up Production Supabase 🗄️

### Create Account

1. **Go to https://supabase.com**
2. **Click "Start your project"**
3. **Sign up** with GitHub or email
4. **Verify your email**

### Create Production Project

1. **Click "New Project"**
2. **Fill in details:**
   - Organization: Create new or use default
   - Name: `materia-prod`
   - Database Password: **Create strong password** (save it!)
   - Region: **Choose closest to your users** (e.g., US East, Europe West)
   
3. **Click "Create new project"**
4. **Wait 2-3 minutes** for setup (grab coffee!)

### Save Your Credentials

5. **When project is ready**, go to **Settings (⚙️) → API**
6. **Copy and save these THREE values:**

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
Project Ref: xxxxxxxxxx (last part of URL)
Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT: Save these in a notes app or password manager!**

### Create Storage Bucket

7. **Go to Storage** in left sidebar
8. **Click "New Bucket"**
9. **Fill in:**
   - Name: `make-8ae6fee0-listing-images`
   - Public bucket: **OFF** (keep private!)
10. **Click "Create bucket"**

✅ **Supabase setup complete!**

---

## Step 4: Install Required Tools 🔧

### Open Terminal/Command Prompt

**Mac**: 
- Spotlight search → type "Terminal"
- Or in VS Code: View → Terminal

**Windows**: 
- Start menu → type "cmd" or "PowerShell"
- Or in VS Code: View → Terminal

### Install Node.js (if needed)

1. **Check if you have it:**
```bash
node --version
npm --version
```

2. **If you get "command not found":**
   - Go to https://nodejs.org/
   - Download LTS version
   - Install it
   - Restart terminal
   - Try `node --version` again

### Install Supabase CLI

```bash
npm install -g supabase
```

Wait for installation to complete.

### Verify Installation

```bash
supabase --version
```

Should show version number (e.g., `1.123.4`)

✅ **Tools installed!**

---

## Step 5: Deploy Backend to Supabase 🚀

### Navigate to Your Project

```bash
# Replace with your actual path
cd /path/to/your/materia-folder

# Example (Mac/Linux):
cd ~/Desktop/materia-code

# Example (Windows):
cd C:\Users\YourName\Desktop\materia-code
```

**Tip**: In VS Code terminal, it should already be in the right folder!

### Login to Supabase

```bash
supabase login
```

- This will open your browser
- Login with your Supabase account
- You'll see "Logged in successfully"
- Return to terminal

### Link to Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**Replace `YOUR_PROJECT_REF` with the one you saved earlier!**

Example:
```bash
supabase link --project-ref abcdefghijklmnop
```

You'll be prompted for database password - enter the one you created!

### Deploy the Edge Function

```bash
cd supabase/functions
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
```

**Wait for:** `Deployed Function make-server-8ae6fee0 version x.x to region us-east-1`

### Test the Backend

```bash
# Replace YOUR_PROJECT_URL with your actual Supabase URL
curl https://YOUR_PROJECT_URL.supabase.co/functions/v1/make-server-8ae6fee0/health
```

**Should return:** `{"status":"ok"}`

✅ **Backend deployed!**

---

## Step 6: Push Code to GitHub 📦

### Create GitHub Account (if needed)

1. Go to https://github.com
2. Sign up (free)
3. Verify email

### Create New Repository

1. **Click the "+" icon** (top right) → "New repository"
2. **Repository name**: `materia`
3. **Description**: "Materia - Sustainable materials marketplace"
4. **Private or Public**: Your choice
5. **DON'T** check "Initialize with README"
6. **Click "Create repository"**
7. **Copy the repository URL** (shows on next page)

### Navigate Back to Project Root

```bash
# Go back to project root
cd ../..
```

Or open new terminal in VS Code at root folder.

### Initialize Git

```bash
# Initialize git
git init

# Set your identity (one time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Create .gitignore

Create a file named `.gitignore` in your project root with:

```
node_modules/
.env
.env.local
.vercel
.DS_Store
*.log
.supabase
```

**In VS Code**: Right-click in file explorer → New File → name it `.gitignore`

### Commit and Push

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Materia marketplace"

# Set main branch
git branch -M main

# Add your GitHub repository (replace with YOUR URL!)
git remote add origin https://github.com/YOUR_USERNAME/materia.git

# Push to GitHub
git push -u origin main
```

**You may need to login to GitHub** - follow the prompts!

✅ **Code on GitHub!**

---

## Step 7: Deploy to Vercel 🌐

### Create Vercel Account

1. Go to https://vercel.com
2. **Sign up with GitHub** (easiest!)
3. Authorize Vercel to access GitHub

### Import Your Repository

1. **Click "New Project"** (or "Add New..." → "Project")
2. **Find your `materia` repository**
3. **Click "Import"**

### Configure Project

1. **Framework Preset**: Should auto-detect as Next.js
2. **Root Directory**: Leave as `./`
3. **Build Command**: Leave default
4. **Output Directory**: Leave default
5. **DON'T add environment variables yet!**
6. **Click "Deploy"**

Wait 2-3 minutes for first deployment...

### Add Environment Variables

1. **After deployment**, go to your project dashboard
2. **Click "Settings"** tab
3. **Click "Environment Variables"** in left menu
4. **Add these THREE variables:**

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: Your Supabase Project URL (from Step 3)
- Click "Add"

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: Your Supabase Anon Key (from Step 3)
- Click "Add"

**Variable 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Your Supabase Service Role Key (from Step 3)
- Click "Add"

### Redeploy with Variables

1. **Go to "Deployments"** tab
2. **Click the three dots** (...) on the latest deployment
3. **Click "Redeploy"**
4. **Check "Use existing Build Cache"**
5. **Click "Redeploy"**

Wait 2-3 minutes...

✅ **Frontend deployed!**

---

## Step 8: Test Your Live Site! 🎉

### Get Your URL

Vercel gives you: `https://materia-xxxxx.vercel.app`

Find it in:
- Vercel dashboard → "Domains" section
- Or after deployment completes

### Critical Tests

Open your live site and test:

1. ✅ **Site loads without errors**
2. ✅ **Sign up with new account**
3. ✅ **Create a listing**
4. ✅ **Upload a photo** (this is critical!)
5. ✅ **Search for your listing**
6. ✅ **Refresh page** - listing should persist!

### Test on Mobile

1. Open your URL on your phone
2. Test creating a listing
3. Verify it's responsive

---

## Step 9: Custom Domain (Optional) 🌐

### Buy a Domain

1. Go to **Namecheap**, **Google Domains**, or **Cloudflare**
2. Search for domain:
   - `materia.com`
   - `materiamarket.com`
   - `getmateria.com`
   - etc.
3. Purchase (~$12/year)

### Add to Vercel

1. **Vercel Dashboard** → Your project
2. **Settings** → **Domains**
3. **Click "Add"**
4. **Enter your domain** (e.g., `materia.com`)
5. **Follow the DNS instructions**

### Update DNS Records

1. **Go to your domain registrar** (Namecheap, etc.)
2. **Find DNS settings**
3. **Add the records Vercel provides:**
   - Usually a CNAME or A record
4. **Save changes**
5. **Wait 10-60 minutes** for DNS propagation

### Verify

- Vercel will auto-provision SSL certificate
- Your site is now: `https://materia.com` ✨

✅ **Custom domain live!**

---

## 🎉 YOU'RE LIVE!

Your Materia marketplace is now:
- ✅ Running on production servers
- ✅ Accessible to anyone worldwide
- ✅ Backed by real database
- ✅ Automatically scaling
- ✅ Deployed at your URL!

---

## 📊 What Happens Next?

### Immediate (Today)
- Share your URL with friends
- Create 5-10 real listings
- Test everything thoroughly
- Monitor for any errors

### This Week
- Invite beta testers
- Gather feedback
- Fix any bugs
- Share on social media

### This Month
- Add requested features
- Implement payment processing (Stripe)
- Add email notifications
- Grow your user base!

---

## 🆘 Troubleshooting

### "supabase: command not found"
```bash
# Reinstall Supabase CLI
npm install -g supabase

# If still fails, try with sudo (Mac/Linux)
sudo npm install -g supabase
```

### "git: command not found"
- Install Git: https://git-scm.com/downloads
- Restart terminal

### "Can't find project folder"
```bash
# List current directory
ls        # Mac/Linux
dir       # Windows

# Go to Desktop
cd ~/Desktop          # Mac/Linux
cd C:\Users\YourName\Desktop  # Windows

# Then navigate to your folder
cd materia-code
```

### "Edge function won't deploy"
```bash
# Make sure you're in functions directory
pwd  # Should show: .../supabase/functions

# Try deploying again
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt

# Check you're linked to correct project
supabase projects list
```

### "GitHub push failed"
```bash
# Set up GitHub authentication
# Use GitHub CLI or Personal Access Token
# See: https://docs.github.com/en/authentication

# Or use GitHub Desktop app (easier!)
# Download: https://desktop.github.com/
```

### "Vercel deployment fails"
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure you redeployed after adding variables

### "Images won't upload on production"
- Verify storage bucket was created in Supabase
- Check bucket name is: `make-8ae6fee0-listing-images`
- Verify bucket is PRIVATE (not public)
- Check service role key is correct in Vercel

---

## 📋 Quick Reference

### Key URLs
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub**: https://github.com/YOUR_USERNAME/materia
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Live Site**: https://materia-xxxxx.vercel.app

### Key Commands
```bash
# Check where you are
pwd

# List files
ls

# Navigate
cd folder-name
cd ..  # go up one level

# Supabase
supabase login
supabase link --project-ref YOUR_REF
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt

# Git
git status
git add .
git commit -m "message"
git push

# Test backend
curl https://YOUR_URL.supabase.co/functions/v1/make-server-8ae6fee0/health
```

---

## ✅ Deployment Checklist

- [ ] Code exported from Figma Make
- [ ] Opened in VS Code
- [ ] Supabase account created
- [ ] Production project created
- [ ] Credentials saved
- [ ] Storage bucket created
- [ ] Node.js installed
- [ ] Supabase CLI installed
- [ ] Backend deployed to Supabase
- [ ] Tested backend (curl command works)
- [ ] GitHub account created
- [ ] Repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Environment variables added
- [ ] Redeployed with variables
- [ ] Site loads without errors
- [ ] Can create account
- [ ] Can create listing with photo
- [ ] Data persists after refresh
- [ ] Tested on mobile
- [ ] Custom domain added (optional)

---

## 💪 You've Got This!

These steps will take you from Figma Make to a live, production website. Take it one step at a time, and you'll be live in a few hours!

**Any questions? Check TROUBLESHOOTING.md or the error logs in Supabase/Vercel dashboards.**

**Ready to start? Begin with Step 1: Export your code from Figma Make!** 🚀
