# 🚀 Launch Materia to Production - Quick Guide

**Status**: Ready to deploy! All features working in Figma Make.

---

## Step 1: Export Your Code (5 minutes)

1. In Figma Make, click **Export** or **Download Code**
2. Extract the ZIP file to your computer
3. Open the folder in your code editor (VS Code, etc.)

---

## Step 2: Set Up Production Supabase (15 minutes)

### Create Account & Project
1. Go to **[supabase.com](https://supabase.com)** → Sign Up (FREE)
2. Click **"New Project"**
   - Name: `materia-prod`
   - Choose a strong database password (save it!)
   - Region: Choose closest to your users
   - Wait 2-3 minutes for setup

### Save Your Credentials
3. Go to **Settings → API** in Supabase dashboard
4. Copy these THREE values (save in notes app):
   ```
   Project URL: https://xxx.supabase.co
   Anon/Public Key: eyJhbG...
   Service Role Key: eyJhbG... (KEEP SECRET!)
   ```

### Enable Storage
5. Go to **Storage** in sidebar
6. Click **"New Bucket"**
   - Name: `make-8ae6fee0-listing-images`
   - Public bucket: NO (keep private)
   - Click Create

---

## Step 3: Deploy Backend (10 minutes)

### Install Supabase CLI
```bash
# Install globally
npm install -g supabase

# Login to Supabase
supabase login
```

### Deploy Your Edge Function
```bash
# Navigate to your project folder
cd your-materia-folder

# Link to your production project
supabase link --project-ref YOUR_PROJECT_REF
# (Find PROJECT_REF in your Supabase URL: supabase.com/dashboard/project/YOUR_PROJECT_REF)

# Deploy the server function
cd supabase/functions
supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
```

### Verify It Works
```bash
# Test your backend
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8ae6fee0/health
# Should return: {"status":"ok"}
```

---

## Step 4: Push to GitHub (5 minutes)

### Create Repository
1. Go to **[github.com](https://github.com)** → Sign in
2. Click **"New Repository"**
   - Name: `materia`
   - Private or Public: Your choice
   - DON'T initialize with README
   - Click Create

### Push Your Code
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - Materia v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/materia.git
git push -u origin main
```

---

## Step 5: Deploy to Vercel (10 minutes)

### Create Vercel Account
1. Go to **[vercel.com](https://vercel.com)** → Sign up (FREE)
2. Sign in with GitHub

### Deploy Your App
3. Click **"New Project"**
4. **Import** your `materia` repository
5. **Framework Preset**: Next.js (should auto-detect)
6. Click **"Deploy"** (don't add environment variables yet!)
7. Wait 2-3 minutes for initial deployment

### Add Environment Variables
8. Go to your project in Vercel Dashboard
9. Click **Settings → Environment Variables**
10. Add these THREE variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Anon/Public Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Service Role Key |

11. Click **Save**

### Redeploy
12. Go to **Deployments** tab
13. Click **"Redeploy"** on the latest deployment
14. Wait 2-3 minutes

---

## Step 6: Test Your Live Site! (10 minutes)

### Your Live URL
Vercel gives you: `https://materia-xxxx.vercel.app`

### Critical Tests
- [ ] Site loads successfully
- [ ] Sign up with a new account
- [ ] Create a test listing
- [ ] Upload a photo (this is the critical test!)
- [ ] Search for your listing
- [ ] Refresh page - listing should still be there!

---

## Step 7: Add Custom Domain (Optional, 20 minutes)

### Buy a Domain
1. Go to **Namecheap**, **Google Domains**, or **Cloudflare**
2. Search for: `materia.com` or `materiamarket.com` or `getmateria.com`
3. Purchase (~$12/year)

### Connect to Vercel
4. In Vercel Dashboard → **Settings → Domains**
5. Click **"Add"**
6. Enter your domain: `materia.com`
7. Follow the DNS instructions

### Update DNS Records
8. Go to your domain registrar
9. Add the CNAME or A record Vercel provides
10. Wait 10-60 minutes for DNS propagation
11. Vercel auto-provisions SSL certificate
12. Your site is now: `https://materia.com` ✨

---

## 🎉 You're Live!

Your Materia app is now:
- ✅ Accessible worldwide at your URL
- ✅ Running on production servers
- ✅ Backed by real Supabase database
- ✅ Ready for real users
- ✅ Automatically scaled by Vercel & Supabase

---

## What Happens Next?

### Immediate Actions
1. **Test Everything** - Go through all features on production
2. **Create Real Listings** - Add 5-10 real material listings
3. **Invite Beta Users** - Share with friends/colleagues
4. **Monitor Logs**:
   - Vercel Dashboard → Analytics
   - Supabase Dashboard → Edge Functions → Logs

### Week 1
- Monitor daily for errors
- Fix any bugs that appear
- Gather user feedback
- Share on social media

### Month 1
- Add more features based on feedback
- Consider implementing:
  - Email notifications
  - Payment processing (Stripe)
  - Real authentication with Supabase Auth
  - Rating/review system

---

## 💰 Production Costs

### Free Tier (Great for Starting!)
- **Vercel**: $0/month (unlimited bandwidth)
- **Supabase**: $0/month (500MB database, 1GB storage)
- **Domain**: $12/year
- **Total**: $12/year ✅

### When to Upgrade
- **Supabase Pro** ($25/month): When you hit 500MB database or need more storage
- **Vercel Pro** ($20/month): When you exceed 100GB bandwidth/month (rare!)

---

## 🆘 Troubleshooting

### "Images not uploading"
- Check storage bucket was created
- Verify service role key is correct
- Check CORS settings in Supabase Storage

### "Data not saving"
- Check browser console for errors
- Verify environment variables are set correctly
- Redeploy after adding variables

### "Edge function not working"
- Check function deployed: `supabase functions list`
- View logs in Supabase Dashboard
- Verify `--no-verify-jwt` flag was used

### "Site showing old version"
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait 2-3 minutes for Vercel CDN to update
- Check you redeployed after adding environment variables

---

## 📊 Monitoring Your App

### Daily Checks
- **Vercel Dashboard**: Check deployment status, errors
- **Supabase Dashboard**: Check edge function logs, database usage
- **User Reports**: Monitor feedback and bug reports

### Weekly Reviews
- Review analytics (if implemented)
- Check database size
- Monitor storage usage
- Review feature usage

---

## 🔒 Security Checklist

Before announcing publicly:
- [ ] All environment variables set correctly
- [ ] Service Role Key NOT in frontend code
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] File upload limits enforced (5MB per image)
- [ ] Storage bucket is PRIVATE (not public)
- [ ] Error messages don't expose sensitive info

---

## 🚀 Ready to Launch?

### Pre-Launch Checklist
- [ ] All core features tested in Figma Make
- [ ] Backend deployed to Supabase
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Custom domain connected (optional)
- [ ] Created 5+ test listings on production
- [ ] Tested on mobile device
- [ ] Prepared announcement post/email

### Launch Day Plan
1. **Morning**: Final testing pass
2. **Noon**: Announce on social media
3. **Afternoon**: Share with network
4. **Evening**: Monitor for issues
5. **Night**: Celebrate! 🎊

---

## 📣 Announcement Template

Use this to announce your launch:

```
🎉 Excited to launch Materia - a marketplace for builders, 
manufacturers, contractors, and artisans to buy, sell, and 
trade surplus, reclaimed, and recycled materials!

♻️ Reduce waste
💰 Save money
🌍 Support sustainability

Check it out: https://your-domain.com

#SustainableBuilding #Marketplace #Recycling #BuildingMaterials
```

---

## Need Help?

Common issues and where to find help:
- **Deployment Issues**: TROUBLESHOOTING.md
- **Photo Upload Problems**: PHOTO_UPLOAD_FIX.md
- **Backend Errors**: Check Supabase logs
- **Frontend Errors**: Check Vercel logs

---

## You've Got This! 💪

The technical work is done. Your app is production-ready. 

Now it's just:
1. Export code
2. Deploy backend (10 min)
3. Deploy frontend (10 min)
4. Test and launch!

**Total time: ~1 hour from start to launch** ⏱️

Good luck with Materia! 🚀
