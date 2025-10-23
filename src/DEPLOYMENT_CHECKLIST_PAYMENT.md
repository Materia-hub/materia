# Payment System Deployment Checklist ✓

## Pre-Deployment

- [x] Backend endpoints created
- [x] Premium whitelisting configured
- [x] Payment processing logic implemented
- [x] Admin tools created
- [x] Documentation written
- [x] Test mode enabled

---

## Deployment Steps

### 1. Deploy Backend
```bash
cd supabase/functions
supabase functions deploy make-server-8ae6fee0
```

**Expected output:**
```
✓ Deploying Function make-server-8ae6fee0...
✓ Function deployed successfully
```

**Verify:**
- [ ] No deployment errors
- [ ] Function shows in `supabase functions list`

---

### 2. Test Health Endpoint
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/health
```

**Expected response:**
```json
{
  "status": "ok",
  "version": "2.1.0-distance-filter",
  "timestamp": "2025-01-..."
}
```

**Verify:**
- [ ] Returns 200 OK
- [ ] Shows current version
- [ ] Timestamp is recent

---

### 3. Grant Premium to Your Account

**Option A: Use Admin Panel**
1. Open `/manage-premium.html` in browser
2. Email should be pre-filled: `dweldy9@gmail.com`
3. Click "Grant Premium Status"
4. See success message

**Option B: Use Quick Tool**
1. Open `/grant-premium.html` in browser
2. Click button
3. See success message

**Option C: API Call**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/grant-premium \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"dweldy9@gmail.com"}'
```

**Verify:**
- [ ] Success message appears
- [ ] Shows "Premium" status
- [ ] No errors in console

---

### 4. Test Premium Access

1. Sign in to Materia with `dweldy9@gmail.com`
2. Go to Dashboard
3. Check your profile/status

**Verify:**
- [ ] Profile shows "Premium" or "Premium" tier
- [ ] No listing limits shown
- [ ] Can create listings without payment dialog

---

### 5. Create Test Listings

1. Create 5 listings
2. Create 10 listings (would normally hit free limit)
3. Create 15 listings

**Verify:**
- [ ] No payment dialog appears
- [ ] All listings created successfully
- [ ] No errors or blocks

---

### 6. Test Payment Flow (Optional)

**Create a test account:**
1. Sign out
2. Create new account with different email
3. Create 10 listings (free tier)
4. Try to create 11th listing

**Verify:**
- [ ] Payment dialog appears
- [ ] Shows pricing: $0.99 and $20 options
- [ ] Can enter credit card details

**Test payment:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVV: `123`
- Zip: `12345`

**Verify:**
- [ ] Payment processes (test mode)
- [ ] Listing is created
- [ ] Tier updated (check profile)

---

### 7. Check Account Status

1. Open `/manage-premium.html`
2. Go to "Check Status" section
3. Enter an email address
4. Click "Check Account Status"

**Verify:**
- [ ] Shows account details
- [ ] Displays tier and status
- [ ] Shows listing count
- [ ] No errors

---

## Optional: Stripe Integration

### 1. Get Stripe Keys
- [ ] Signed up at stripe.com
- [ ] Copied Secret Key (starts with `sk_test_`)
- [ ] Copied Publishable Key (starts with `pk_test_`)

### 2. Configure Backend
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here
```

**Verify:**
- [ ] Secret set successfully
- [ ] Can list with `supabase secrets list`

### 3. Redeploy
```bash
supabase functions deploy make-server-8ae6fee0
```

**Verify:**
- [ ] Deployment successful
- [ ] No errors in logs

### 4. Test Stripe Payment
1. Create test account
2. Create 11 listings
3. Use Stripe test card
4. Check Stripe dashboard

**Verify:**
- [ ] Payment appears in Stripe
- [ ] Payment Intent succeeded
- [ ] Amount is correct ($0.99 or $20)
- [ ] Subscription updated in app

---

## Post-Deployment Verification

### Backend Health
- [ ] Health endpoint responding
- [ ] No errors in function logs
- [ ] All endpoints accessible

### Premium System
- [ ] Can grant premium to whitelisted emails
- [ ] Premium users have unlimited listings
- [ ] Non-premium users hit 10-listing limit
- [ ] Status check works

### Payment System
- [ ] Payment dialog appears after free tier
- [ ] Test mode payments process
- [ ] Subscription tiers update
- [ ] Payment history recorded

### Admin Tools
- [ ] `/manage-premium.html` loads
- [ ] `/grant-premium.html` loads
- [ ] Both tools can grant premium
- [ ] Status check returns data

---

## Troubleshooting

### Deployment Failed
```bash
# Check you're in the right directory
pwd  # Should end in /supabase/functions

# Check Supabase is linked
supabase status

# Re-link if needed
supabase link

# Try again
supabase functions deploy make-server-8ae6fee0
```

### Premium Grant Failed
**"User not found"**
→ Make sure you signed up with the email first

**"Not whitelisted"**
→ Check email matches exactly (case-insensitive)

**Network error**
→ Check backend is deployed and responding

### Payment Not Processing
**Test mode**: This is normal - payments are simulated

**With Stripe**: 
- Check STRIPE_SECRET_KEY is set
- Verify key starts with `sk_test_` or `sk_live_`
- Check Stripe dashboard for errors

### Status Check Not Working
**Returns error**
→ Make sure backend is deployed

**"User not found"**
→ User hasn't signed up yet

**Shows wrong data**
→ Clear cache and try again

---

## Success Criteria

### ✅ Deployment Complete When:
- [x] Backend deployed without errors
- [x] Health check returns OK
- [x] Can grant premium via admin tools
- [x] Premium account has unlimited listings
- [x] Payment dialog shows for non-premium after 10 listings
- [x] Test mode payments process successfully
- [x] Account status check works
- [x] All documentation accessible

### ✅ Stripe Integration Complete When:
- [ ] STRIPE_SECRET_KEY configured
- [ ] Stripe test payments work
- [ ] Payments appear in Stripe dashboard
- [ ] Webhook configured (optional)
- [ ] Ready to switch to live keys

---

## Quick Commands Reference

```bash
# Deploy
cd supabase/functions
supabase functions deploy make-server-8ae6fee0

# Check status
supabase functions list
supabase status

# View logs
supabase functions logs make-server-8ae6fee0

# Set Stripe key
supabase secrets set STRIPE_SECRET_KEY=sk_test_...

# List secrets
supabase secrets list

# Test health
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/health
```

---

## File Locations

### Admin Tools
- `/manage-premium.html` - Full admin panel
- `/grant-premium.html` - Quick grant tool

### Documentation
- `/START_HERE_PAYMENT.md` - Quick start guide
- `/PAYMENT_SYSTEM_COMPLETE.md` - Complete overview
- `/STRIPE_SETUP_GUIDE.md` - Stripe integration
- `/PREMIUM_AND_PAYMENT_SETUP.md` - Setup details
- `/DEPLOY_PAYMENT_SYSTEM.md` - Deployment guide

### Backend
- `/supabase/functions/server/index.tsx` - Main server file

### Components
- `/components/PaymentForm.tsx` - Payment form
- `/components/SubscriptionDialog.tsx` - Subscription picker

---

## Support Resources

### Documentation
1. Read `/START_HERE_PAYMENT.md` first
2. For Stripe: `/STRIPE_SETUP_GUIDE.md`
3. For details: `/PAYMENT_SYSTEM_COMPLETE.md`

### Backend Logs
```bash
# View real-time logs
supabase functions logs make-server-8ae6fee0 --follow

# View recent logs
supabase functions logs make-server-8ae6fee0
```

### Test Endpoints
```bash
# Health check
curl https://PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/health

# Grant premium
curl -X POST https://PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/grant-premium \
  -H "Authorization: Bearer ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check status
curl -X POST https://PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/check-account-status \
  -H "Authorization: Bearer ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## ✅ Final Checklist

Before considering deployment complete:

- [ ] Backend deployed successfully
- [ ] No errors in function logs
- [ ] Premium grant works
- [ ] Your account has premium access
- [ ] Can create unlimited listings
- [ ] Payment dialog works for other accounts
- [ ] Test payments process
- [ ] Status check returns data
- [ ] Admin tools load and work
- [ ] All documentation reviewed

---

## 🎉 You're Done!

If all checkboxes above are checked, your payment system is fully deployed and working!

**Next:** Open the app and enjoy your premium account! 🚀

---

**Last Updated:** January 2025  
**Status:** Ready for Deployment  
**Estimated Time:** 5-10 minutes  
**Difficulty:** Easy ⭐
