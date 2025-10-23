# 📋 Production Deployment Checklist

Use this when you're ready to move from testing to production.

---

## ✅ Pre-Deployment Checklist

### Testing Complete
- [ ] Created and tested 10+ listings successfully
- [ ] Photo uploads working consistently
- [ ] Search and filters working correctly
- [ ] Mobile responsiveness verified
- [ ] Got feedback from 3+ beta testers
- [ ] All major bugs identified and fixed

### Content Ready
- [ ] Terms of Service written
- [ ] Privacy Policy written
- [ ] About page content ready
- [ ] FAQ section prepared (optional)
- [ ] Help documentation created (optional)

### Business Decisions
- [ ] Pricing confirmed ($0.99/listing or $20/year)
- [ ] Payment processor chosen (Stripe recommended)
- [ ] Refund policy decided
- [ ] Custom domain purchased (optional)
- [ ] Logo finalized

---

## 🚀 Deployment Steps

### Step 1: Set Up Production Supabase (30 minutes)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up (free tier is fine to start)

2. **Create New Project**
   - Click "New Project"
   - Choose project name: "supplywise-prod"
   - Choose a strong database password
   - Select region closest to your users
   - Wait 2-3 minutes for setup

3. **Save Credentials**
   - Go to Settings → API
   - Copy these three values:
     - Project URL
     - Anon/Public Key
     - Service Role Key (keep secret!)
   - Save them in a secure password manager

4. **Enable Storage**
   - Go to Storage in sidebar
   - Storage is auto-enabled, nothing to do here!

---

### Step 2: Deploy Backend to Supabase (20 minutes)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Export Your Code from Figma Make**
   - Click Export/Download in Figma Make
   - Extract the zip to your computer
   - Open in VS Code or your editor

4. **Link Your Project**
   ```bash
   cd your-project-folder
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   - Find PROJECT_REF in Supabase dashboard URL
   - Format: https://supabase.com/dashboard/project/YOUR_PROJECT_REF

5. **Deploy the Edge Function**
   ```bash
   cd supabase/functions
   supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
   ```

6. **Test the Backend**
   - Go to Supabase Dashboard → Edge Functions
   - You should see "make-server-8ae6fee0" listed
   - Click to view logs

---

### Step 3: Deploy Frontend to Vercel (15 minutes)

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Create new repository: "supplywise"
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin YOUR_GITHUB_URL
     git push -u origin main
     ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your "supplywise" repository
   - Click "Deploy"

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add these three:
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
     - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
   - Click "Save"
   - Redeploy the project

4. **Test Your Live Site**
   - Vercel will give you a URL: `your-app.vercel.app`
   - Open it and test creating a listing
   - Upload a photo
   - Refresh the page - data should persist!

---

### Step 4: Add Custom Domain (Optional, 10 minutes)

1. **Buy a Domain**
   - Namecheap, GoDaddy, Google Domains
   - Recommended: `supplywise.com` or `supplywiseapp.com`
   - Cost: $10-15/year

2. **Add to Vercel**
   - Vercel Dashboard → Settings → Domains
   - Click "Add"
   - Enter your domain
   - Follow DNS instructions

3. **Update DNS**
   - Go to your domain registrar
   - Add the CNAME or A record Vercel provides
   - Wait 5-10 minutes for DNS propagation

4. **Enable SSL**
   - Vercel automatically provisions SSL certificate
   - Your site will be https://yourdomain.com

---

## 🔄 Migrate from Testing to Production

### What Transfers:
✅ All code and components
✅ UI and design
✅ Features and functionality

### What Doesn't Transfer:
❌ Test listings (you start with clean database)
❌ Test users (users need to re-register)
❌ Test photos (start fresh in new storage bucket)

### This is Good!
- Clean slate for real users
- No test data polluting production
- Better for marketing ("brand new platform!")

---

## 🔐 Security Checklist

Before going live, verify:

- [ ] Environment variables set correctly
- [ ] Service Role Key NOT exposed in frontend
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured correctly
- [ ] File upload limits enforced (5MB)
- [ ] SQL injection prevention (handled by KV store)
- [ ] Password requirements enforced

---

## 📊 Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Test all features on production
- [ ] Create your first real listing
- [ ] Share with beta testers
- [ ] Monitor error logs in Supabase

### Week 1
- [ ] Set up Google Analytics (optional)
- [ ] Add monitoring/uptime alerts
- [ ] Create social media accounts
- [ ] Announce soft launch

### Month 1
- [ ] Implement Stripe for payments
- [ ] Add email notifications
- [ ] Set up customer support system
- [ ] Collect user feedback

---

## 💰 Production Costs

### Year 1 (Low Traffic)
- **Hosting**: $0 (Vercel free tier)
- **Database**: $0 (Supabase free tier)
- **Domain**: $12/year
- **Total**: $12/year

### Year 1 (Growing)
- **Hosting**: $0 (still free!)
- **Database**: $0 (free up to 500MB)
- **Domain**: $12/year
- **Total**: $12/year

### When to Upgrade (High Traffic)
- **Supabase Pro**: $25/month
  - When: >500MB database or >50K users
- **Vercel Pro**: $20/month
  - When: >100K page views/month

---

## 🆘 Common Deployment Issues

### "Edge function not deploying"
- Check Supabase CLI is latest version
- Verify you're in correct directory
- Try `supabase functions delete` then re-deploy

### "Environment variables not working"
- Redeploy after adding variables
- Check for typos in variable names
- Verify values don't have extra spaces

### "Images not uploading"
- Check storage bucket was created
- Verify service role key is correct
- Check CORS settings in Supabase

### "Data not persisting"
- Verify KV store access
- Check browser console for API errors
- Test backend endpoint directly

---

## 📈 Monitoring Your Production App

### Supabase Dashboard
- Check Edge Function logs daily
- Monitor database usage
- Watch storage consumption

### Vercel Dashboard
- View deployment logs
- Check page load times
- Monitor bandwidth usage

### User Feedback
- Set up feedback form
- Monitor social media mentions
- Respond to support requests

---

## 🎉 You Did It!

Once deployed, your app is:
- ✅ Live on the internet
- ✅ Accessible to anyone
- ✅ Backed by real database
- ✅ Ready for real users
- ✅ Scalable to thousands of users

---

## 🚀 Next: Growth & Features

After successful deployment, consider:
- Real authentication (Supabase Auth)
- Payment processing (Stripe)
- Email notifications (SendGrid)
- Push notifications
- Mobile apps (React Native)
- Analytics and insights
- SEO optimization
- Marketing campaigns

Want help with any of these? Just ask! 🎊
