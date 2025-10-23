# 🎯 Materia Deployment - Visual Step-by-Step

**Current Status**: ✅ App working in Figma Make
**Goal**: 🚀 Live website accessible to the world

---

## 📍 The Journey (9 Steps)

```
START
  ↓
[1] Export from Figma Make
  ↓
[2] Open in VS Code
  ↓
[3] Create Supabase Account
  ↓
[4] Install Tools (Node.js, Supabase CLI)
  ↓
[5] Deploy Backend → Supabase
  ↓
[6] Push Code → GitHub
  ↓
[7] Deploy Frontend → Vercel
  ↓
[8] Add Environment Variables
  ↓
[9] Test Live Site
  ↓
🎉 LIVE!
```

---

## Step 1: Export from Figma Make ⬇️

**Where**: Figma Make interface
**Time**: 2 minutes
**What to do**:
1. Click "Export" or "Download Code" button
2. Save the ZIP file
3. Extract it to your Desktop or Documents

**You should have**:
```
materia-code/
├── App.tsx
├── components/
├── supabase/
├── package.json
└── ... all your files
```

✅ **Done when**: You can see all your files in a folder

---

## Step 2: Open in VS Code 💻

**Where**: Your computer
**Time**: 5 minutes
**What to do**:
1. Download VS Code from https://code.visualstudio.com/
2. Install it
3. Open VS Code
4. File → Open Folder → Select your extracted folder

**You should see**:
```
Explorer sidebar showing:
- App.tsx
- components/
- supabase/
- etc.
```

✅ **Done when**: All files visible in VS Code sidebar

---

## Step 3: Create Supabase Production 🗄️

**Where**: https://supabase.com
**Time**: 10 minutes
**What to do**:

### 3A. Sign up
- Go to supabase.com
- Click "Start your project"
- Sign up with GitHub or email

### 3B. Create project
- Click "New Project"
- Name: `materia-prod`
- Database Password: **CREATE STRONG PASSWORD**
- Region: Choose closest to you
- Click "Create new project"
- ☕ Wait 2-3 minutes

### 3C. Save credentials
Settings → API, copy these:
```
✏️ Project URL: https://xxxxx.supabase.co
✏️ Project Ref: xxxxx
✏️ Anon key: eyJhbG...
✏️ Service role key: eyJhbG...
```
**SAVE THESE IN NOTES APP!**

### 3D. Create storage bucket
- Storage → New Bucket
- Name: `make-8ae6fee0-listing-images`
- Public: OFF
- Create

✅ **Done when**: You have all 4 credentials saved

---

## Step 4: Install Tools 🔧

**Where**: Terminal/Command Prompt
**Time**: 5 minutes

### 4A. Open Terminal
- **Mac**: Spotlight → "Terminal"
- **Windows**: Start → "cmd" or "PowerShell"
- **Or**: VS Code → View → Terminal

### 4B. Check Node.js
```bash
node --version
```

**If error**: Download from https://nodejs.org/ and install

### 4C. Install Supabase CLI
```bash
npm install -g supabase
```

### 4D. Verify
```bash
supabase --version
```

Should show version number!

✅ **Done when**: `supabase --version` works

---

## Step 5: Deploy Backend to Supabase 🚀

**Where**: Terminal in your project folder
**Time**: 5 minutes

### 5A. Navigate to project
```bash
cd ~/Desktop/materia-code  # Mac
# or
cd C:\Users\YourName\Desktop\materia-code  # Windows
```

**Tip**: Use VS Code's integrated terminal - already in right place!

### 5B. Login to Supabase
```bash
supabase login
```
Browser opens → Login → Return to terminal

### 5C. Link to your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
**Replace YOUR_PROJECT_REF with the one you saved!**

Enter database password when prompted

### 5D. Deploy function
```bash
cd supabase/functions
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
```

Wait for: `Deployed Function make-server-8ae6fee0`

### 5E. Test it
```bash
curl https://YOUR_PROJECT_URL.supabase.co/functions/v1/make-server-8ae6fee0/health
```

Should return: `{"status":"ok"}`

✅ **Done when**: Curl returns status ok

---

## Step 6: Push to GitHub 📦

**Where**: Terminal
**Time**: 5 minutes

### 6A. Create GitHub account
- Go to https://github.com
- Sign up (if you don't have account)

### 6B. Create repository
- Click "+" → New repository
- Name: `materia`
- Private or Public: Your choice
- **Don't** initialize with README
- Click "Create repository"
- **Copy the repository URL**

### 6C. Go back to project root
```bash
cd ../..
```

### 6D. Initialize git
```bash
git init
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 6E. Create .gitignore
Create file named `.gitignore` with:
```
node_modules/
.env
.env.local
.vercel
.DS_Store
```

### 6F. Commit and push
```bash
git add .
git commit -m "Initial commit - Materia"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/materia.git
git push -u origin main
```

✅ **Done when**: Code visible on GitHub

---

## Step 7: Deploy to Vercel 🌐

**Where**: https://vercel.com
**Time**: 3 minutes

### 7A. Sign up
- Go to https://vercel.com
- **Sign up with GitHub** (easiest)

### 7B. Import repository
- Click "New Project"
- Find your `materia` repository
- Click "Import"

### 7C. Configure
- Framework: Next.js (auto-detected)
- Root Directory: `./`
- **Don't add env vars yet!**
- Click "Deploy"

☕ Wait 2-3 minutes...

✅ **Done when**: First deployment succeeds

---

## Step 8: Add Environment Variables 🔑

**Where**: Vercel dashboard
**Time**: 3 minutes

### 8A. Go to Settings
- Your project → Settings tab
- Environment Variables (left menu)

### 8B. Add three variables

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co  (from Step 3)
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbG...  (from Step 3)
```

**Variable 3:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbG...  (from Step 3)
```

Click "Add" after each!

### 8C. Redeploy
- Deployments tab
- Three dots (...) on latest deployment
- Click "Redeploy"
- Click "Redeploy" again to confirm

☕ Wait 2-3 minutes...

✅ **Done when**: Deployment succeeds

---

## Step 9: Test Your Live Site! 🎉

**Where**: Your browser
**Time**: 10 minutes

### 9A. Get your URL
From Vercel: `https://materia-xxxxx.vercel.app`

### 9B. Critical tests
1. ✅ Site loads
2. ✅ Sign up for account
3. ✅ Create listing
4. ✅ Upload photo ← **Most critical!**
5. ✅ Search works
6. ✅ Refresh → data persists

### 9C. Mobile test
- Open URL on your phone
- Test creating a listing
- Verify responsive design

✅ **Done when**: All tests pass

---

## 🎊 CONGRATULATIONS! YOU'RE LIVE!

Your site is now:
- ✅ Accessible to anyone at your Vercel URL
- ✅ Running on production servers
- ✅ Backed by real database
- ✅ Ready for real users

---

## 🚀 Optional: Add Custom Domain

### Step 10A: Buy Domain
- Namecheap, Google Domains, or Cloudflare
- Search: `materia.com`, `materiamarket.com`, etc.
- Purchase (~$12/year)

### Step 10B: Add to Vercel
- Vercel → Settings → Domains
- Click "Add"
- Enter your domain
- Follow DNS instructions

### Step 10C: Update DNS
- Go to domain registrar
- Add the records Vercel provides
- Wait 10-60 minutes

### Step 10D: Verify
- Site now at: `https://materia.com` ✨

---

## 📊 Time Breakdown

| Step | Time | Running Total |
|------|------|---------------|
| 1. Export | 2 min | 2 min |
| 2. VS Code | 5 min | 7 min |
| 3. Supabase Setup | 10 min | 17 min |
| 4. Install Tools | 5 min | 22 min |
| 5. Deploy Backend | 5 min | 27 min |
| 6. GitHub | 5 min | 32 min |
| 7. Vercel | 3 min | 35 min |
| 8. Env Vars | 3 min | 38 min |
| 9. Testing | 10 min | 48 min |
| **Total** | **~50 minutes** | 🎉 |

**Custom domain adds**: +20-60 minutes (mostly waiting for DNS)

---

## ✅ Checklist View

Print this and check off as you go:

```
□ Step 1: Exported code from Figma Make
□ Step 2: Opened in VS Code
□ Step 3: Created Supabase account & project
□ Step 3: Saved all credentials
□ Step 3: Created storage bucket
□ Step 4: Installed Node.js
□ Step 4: Installed Supabase CLI
□ Step 5: Logged into Supabase
□ Step 5: Linked to project
□ Step 5: Deployed backend
□ Step 5: Tested backend (curl)
□ Step 6: Created GitHub account
□ Step 6: Created repository
□ Step 6: Pushed code to GitHub
□ Step 7: Created Vercel account
□ Step 7: Imported repository
□ Step 7: First deployment succeeded
□ Step 8: Added environment variables
□ Step 8: Redeployed
□ Step 9: Site loads
□ Step 9: Can create account
□ Step 9: Can upload photos
□ Step 9: Data persists
□ Step 9: Tested on mobile

🎉 LAUNCHED!
```

---

## 🆘 Quick Troubleshooting

### Step 5 Issues (Backend Deploy)
**Error: "command not found"**
```bash
npm install -g supabase
```

**Error: "not linked to project"**
```bash
supabase link --project-ref YOUR_REF
```

### Step 6 Issues (GitHub)
**Can't push to GitHub**
- Use GitHub Desktop app (easier)
- Download: https://desktop.github.com/

### Step 8 Issues (Environment Variables)
**Site not working after deploy**
- Double-check all 3 env vars are added
- Make sure you redeployed AFTER adding them
- Check for typos in variable names

### Step 9 Issues (Testing)
**Images won't upload**
- Verify storage bucket exists
- Check bucket name: `make-8ae6fee0-listing-images`
- Verify service role key is correct

**Data doesn't persist**
- Check browser console for errors (F12)
- Verify backend deployed successfully
- Test backend endpoint with curl

---

## 🎯 Current Status Tracker

**Where am I?**

- [ ] Haven't started → **Start with Step 1**
- [ ] Exported code → **Go to Step 2**
- [ ] Have VS Code open → **Go to Step 3**
- [ ] Have Supabase account → **Go to Step 4**
- [ ] Have tools installed → **Go to Step 5**
- [ ] Backend deployed → **Go to Step 6**
- [ ] Code on GitHub → **Go to Step 7**
- [ ] Deployed to Vercel → **Go to Step 8**
- [ ] Added env vars → **Go to Step 9**
- [ ] Everything works → **🎉 You're live!**

---

## 📞 Need More Details?

- **Complete guide**: DEPLOY_FROM_FIGMA_MAKE.md
- **Command reference**: DEPLOY_COMMANDS.md
- **Troubleshooting**: TROUBLESHOOTING.md
- **Quick start**: LAUNCH_NOW.md

---

## 💪 You Can Do This!

Each step is simple. Just go one at a time, don't skip ahead, and you'll be live before you know it!

**Start with Step 1: Export your code from Figma Make** 🚀
