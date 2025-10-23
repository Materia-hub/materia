# Payment System - Quick Reference Card

## ⚡ 30-Second Start

```bash
# 1. Deploy
cd supabase/functions && supabase functions deploy make-server-8ae6fee0

# 2. Open
open manage-premium.html  # or grant-premium.html

# 3. Click "Grant Premium Status"

# Done! You have unlimited listings! 🎉
```

---

## 📋 What You Get

| Your Account Status |
|---------------------|
| ✅ Premium whitelisted |
| ♾️ Unlimited listings |
| 🆓 No payment required |
| ⏰ Never expires |

---

## 🎯 Quick Commands

### Deploy Backend
```bash
cd supabase/functions
supabase functions deploy make-server-8ae6fee0
```

### Add Stripe (Optional)
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase functions deploy make-server-8ae6fee0
```

### View Logs
```bash
supabase functions logs make-server-8ae6fee0
```

---

## 🛠️ Admin Tools

**Full Panel:** `/manage-premium.html`
- Grant premium
- Check account status
- View tiers

**Quick Tool:** `/grant-premium.html`
- One-click premium grant
- Pre-filled for you

---

## 💳 Pricing At a Glance

| Tier | Listings | Cost |
|------|----------|------|
| Free | 10 | $0 |
| Pay-per | +1 | $0.99 |
| Annual | ∞ | $20/yr |
| **Premium** | **∞** | **$0** ← You! |

---

## 🧪 Test Cards

**Success:** `4242 4242 4242 4242`  
**Declined:** `4000 0000 0000 0002`  
**Expiry:** `12/25`  
**CVV:** `123`  
**Zip:** `12345`

---

## 🔗 API Endpoints

### Premium
```
POST /grant-premium
POST /check-account-status
```

### Payments
```
POST /process-payment
POST /create-payment-intent
POST /confirm-stripe-payment
GET  /payments
```

---

## 📚 Documentation

1. **START_HERE_PAYMENT.md** ← Read first!
2. PAYMENT_SYSTEM_COMPLETE.md
3. STRIPE_SETUP_GUIDE.md
4. DEPLOY_PAYMENT_SYSTEM.md
5. DEPLOYMENT_CHECKLIST_PAYMENT.md
6. IMPLEMENTATION_SUMMARY_PAYMENT.md

---

## ✅ Deployment Checklist

- [ ] Deploy backend
- [ ] Grant premium
- [ ] Sign in
- [ ] Create listings
- [ ] Test payments (optional)
- [ ] Add Stripe (optional)

---

## 🆘 Quick Fixes

**User not found?**  
→ Sign up first, then grant

**Payment failing?**  
→ Normal in test mode

**Backend error?**  
→ Check deployment logs

**Stripe error?**  
→ Verify API key set

---

## 🎊 You're Whitelisted!

```
Email: dweldy9@gmail.com
Tier: Premium
Listings: Unlimited
Cost: $0
Expiry: Never
```

---

## 🚀 Deploy Now!

```bash
cd supabase/functions && \
supabase functions deploy make-server-8ae6fee0 && \
echo "✅ Deployed! Open manage-premium.html"
```

---

**Time to deploy:** 5 min  
**Time to premium:** 30 sec  
**Cost for you:** $0  
**Listings you get:** ♾️  

**Ready? Go! 🚀**
