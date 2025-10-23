# 🌐 Change Domain/URL - Quick Start Guide

## Current Situation

Your app is currently deployed at a **free Vercel URL**:
```
https://materia-[random-string].vercel.app
```

You have **two options**:

---

## Option 1: Keep Free Vercel Domain (Recommended for Testing)

**Pros:**
- ✅ Free forever
- ✅ HTTPS included
- ✅ No setup needed
- ✅ Perfect for testing/prototypes

**Cons:**
- ❌ Long, hard-to-remember URL
- ❌ Includes "vercel.app"
- ❌ Less professional

**Cost:** $0

**Action:** Nothing! You're already using this.

**Your Current URL:** Check your Vercel dashboard at https://vercel.com/dashboard

---

## Option 2: Custom Domain (Recommended for Production)

**Example:** `https://materia.com` or `https://getmateria.com`

**Pros:**
- ✅ Professional & memorable
- ✅ Your brand
- ✅ Easy to share
- ✅ Still includes free HTTPS

**Cons:**
- ❌ Costs ~$10-15/year
- ❌ Takes 1-2 hours to set up
- ❌ DNS propagation wait time

**Cost:** ~$10-15/year

---

## 🚀 How to Set Up Custom Domain (4 Steps)

### Step 1: Buy a Domain (15 minutes)

**Recommended Registrars:**

| Registrar | Price/Year | Recommendation |
|-----------|------------|----------------|
| [Cloudflare](https://cloudflare.com) | ~$10 | ⭐ Cheapest, best DNS |
| [Namecheap](https://namecheap.com) | ~$12 | ⭐ Easy to use |
| [Porkbun](https://porkbun.com) | ~$10 | Good value |
| [Google Domains](https://domains.google) | ~$12 | Simple interface |

**Domain Ideas:**
- `materia.com` (probably taken)
- `getmateria.com` ⭐
- `materiamarket.com`
- `materiahub.com`
- `buymateria.com`
- `shopmateria.com`
- `materiamarketplace.com`
- `useMateria.com`

**Process:**
1. Go to registrar website
2. Search for your desired domain
3. Add to cart
4. Check out (~$10-15)
5. You now own the domain!

---

### Step 2: Add Domain to Vercel (5 minutes)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your **"materia"** project

2. **Settings → Domains**
   - Click **"Settings"** tab at top
   - Click **"Domains"** in left sidebar
   - Click **"Add"** button

3. **Enter Your Domain**
   ```
   Example: materia.com
   ```
   - Type your domain (without https://)
   - Click **"Add"**

4. **Vercel Shows DNS Instructions**
   - Vercel will display specific DNS records
   - Keep this tab open - you'll need these values!

**Example DNS instructions you'll see:**
```
Add these records to your domain registrar:

Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

---

### Step 3: Configure DNS (10 minutes)

Now go to your domain registrar and add the DNS records Vercel gave you.

#### For Cloudflare:

1. Login to Cloudflare
2. Click your domain
3. Click **"DNS"** tab
4. Click **"Add record"**

**Add Record 1:**
- Type: `A`
- Name: `@`
- IPv4 address: `76.76.21.21` (from Vercel)
- Proxy status: **DNS only** (gray cloud icon)
- Click **"Save"**

**Add Record 2:**
- Type: `CNAME`
- Name: `www`
- Target: `cname.vercel-dns.com` (from Vercel)
- Proxy status: **DNS only** (gray cloud icon)
- Click **"Save"**

---

#### For Namecheap:

1. Login to Namecheap
2. **Domain List** → Click **"Manage"** next to your domain
3. Click **"Advanced DNS"** tab
4. Click **"Add New Record"**

**Add Record 1:**
- Type: `A Record`
- Host: `@`
- Value: `76.76.21.21` (from Vercel)
- TTL: `Automatic`
- Click **"Save"**

**Add Record 2:**
- Type: `CNAME Record`
- Host: `www`
- Value: `cname.vercel-dns.com` (from Vercel)
- TTL: `Automatic`
- Click **"Save"**

---

#### For Porkbun:

1. Login to Porkbun
2. Click **"Domain Management"**
3. Click your domain
4. Scroll to **"DNS Records"**

**Add Record 1:**
- Type: `A`
- Host: *(leave blank or use @)*
- Answer: `76.76.21.21` (from Vercel)
- Click **"Add"**

**Add Record 2:**
- Type: `CNAME`
- Host: `www`
- Answer: `cname.vercel-dns.com` (from Vercel)
- Click **"Add"**

---

#### For Google Domains:

1. Login to Google Domains
2. Click your domain
3. Click **"DNS"** in left sidebar
4. Scroll to **"Custom records"**

**Add Record 1:**
- Host name: `@`
- Type: `A`
- TTL: `3600`
- Data: `76.76.21.21` (from Vercel)
- Click **"Save"**

**Add Record 2:**
- Host name: `www`
- Type: `CNAME`
- TTL: `3600`
- Data: `cname.vercel-dns.com` (from Vercel)
- Click **"Save"**

---

### Step 4: Wait for DNS Propagation (5-60 minutes)

**What happens now:**
- DNS records need to propagate worldwide
- Typical time: **5-60 minutes**
- Maximum time: 24-48 hours

**Check propagation status:**
- Visit: https://dnschecker.org
- Enter your domain
- See if DNS has propagated globally

**In Vercel:**
- Go back to Vercel → Settings → Domains
- You'll see your domain status:
  - ⏳ "Pending" or "Invalid Configuration" = Still waiting
  - ✅ "Valid Configuration" = DNS propagated!

**Once propagated:**
- ✅ Vercel automatically provisions SSL certificate
- ✅ Your site becomes: `https://yourdomain.com`
- ✅ Both `yourdomain.com` AND `www.yourdomain.com` work
- ✅ Auto-redirects to HTTPS

---

## ✅ Verification Checklist

After DNS propagates, test these URLs:

- [ ] `http://yourdomain.com` → Redirects to `https://yourdomain.com` ✅
- [ ] `https://yourdomain.com` → Works ✅
- [ ] `http://www.yourdomain.com` → Redirects to `https://yourdomain.com` ✅
- [ ] `https://www.yourdomain.com` → Works ✅
- [ ] Browser shows 🔒 lock icon (SSL working) ✅
- [ ] Browser title shows: "Materia - Buy and Sell Material For Your Project" ✅

---

## 🎉 Success!

Your app is now live at:
```
https://yourdomain.com
```

**What happened automatically:**
- ✅ Free SSL certificate (HTTPS)
- ✅ Auto-renewal of SSL
- ✅ www redirect configured
- ✅ Old Vercel URL still works (redirects to new domain)

---

## Troubleshooting

### "My domain isn't working yet"

**Check these:**

1. **Did you add BOTH DNS records?**
   - A record for `@`
   - CNAME record for `www`

2. **Did you turn OFF proxy in Cloudflare?**
   - Must be "DNS only" (gray cloud)
   - NOT "Proxied" (orange cloud)

3. **Check DNS propagation:**
   - Visit: https://dnschecker.org
   - Enter your domain
   - Wait if not fully propagated

4. **Wait longer:**
   - DNS can take up to 24 hours
   - Usually much faster (5-60 min)

---

### "I see 'Invalid Configuration' in Vercel"

**This is normal!**
- Shows until DNS fully propagates
- Just wait and check back in 30 minutes
- Will change to "Valid Configuration" automatically

---

### "SSL certificate not working"

**Vercel handles this automatically:**
- Provisions after DNS propagates
- Can take up to 24 hours
- Usually instant once DNS is ready
- No action needed on your part

---

### "www not working"

**Make sure you added the CNAME record:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

---

### "I want to remove the old Vercel domain"

**Don't!**
- Vercel automatically redirects it to your custom domain
- Useful as backup
- Doesn't hurt to keep it

**If you really want to remove it:**
1. Vercel Dashboard → Settings → Domains
2. Find the `.vercel.app` domain
3. Click **"Remove"**
4. Only do this if custom domain is working!

---

## Cost Breakdown

### Year 1:
- Domain registration: $10-15
- Vercel hosting: **$0** (free tier)
- SSL certificate: **$0** (included)
- **Total: ~$10-15**

### Year 2+:
- Domain renewal: $10-15/year
- Everything else: **$0**
- **Total: ~$10-15/year**

**Compare to traditional hosting:**
- Domain: $12/year
- Hosting: $5-20/month ($60-240/year)
- SSL: $50-100/year
- **Traditional total: $122-352/year**

**Your setup: ~$12/year** 🎉

---

## Timeline

| Step | Time |
|------|------|
| Buy domain | 15 min |
| Add to Vercel | 5 min |
| Configure DNS | 10 min |
| DNS propagation | 5-60 min |
| **Total** | **35-90 min** |

---

## Summary

### Current State:
- URL: `https://materia-xxxxx.vercel.app` (free Vercel domain)
- Cost: $0
- Status: ✅ Working

### After Custom Domain:
- URL: `https://yourdomain.com`
- Cost: ~$12/year
- Status: Professional & branded

---

## Quick Decision Guide

**Stay with free Vercel domain if:**
- ✅ Just testing/prototyping
- ✅ Not ready to launch publicly
- ✅ Want to save money
- ✅ Don't care about branding yet

**Get custom domain if:**
- ✅ Ready to launch
- ✅ Want professional URL
- ✅ Marketing the app
- ✅ Customers/users will visit
- ✅ Want to build your brand

---

## Need Help?

**Check full guide:** `/CHANGE_DOMAIN_AND_TITLE.md`

**Useful links:**
- Check DNS: https://dnschecker.org
- Vercel docs: https://vercel.com/docs/concepts/projects/domains
- Your Vercel dashboard: https://vercel.com/dashboard

---

## What's Next?

After domain is set up:

1. **Update social sharing:**
   - Share new URL on social media
   - Update email signatures

2. **SEO (optional):**
   - Submit to Google Search Console
   - Add sitemap

3. **Analytics (optional):**
   - Add Google Analytics
   - Track visitors

4. **Marketing:**
   - Your professional URL is ready!
   - Start promoting: `https://yourdomain.com` 🚀

---

**Ready to get started?** Follow Step 1 above! 👆
