# Deploy Payment Credentials Update

## Quick Deployment Guide

### What Changed?
1. ✅ Free listings increased from 3 to 10
2. ✅ Payment form with credit card collection added
3. ✅ Backend payment processing endpoint added
4. ✅ Subscription dialog enhanced with payment flow

### Deployment Steps

#### 1. Deploy Backend (Required)
The backend has a new payment processing endpoint that must be deployed.

**Option A: Using deployment script**
```bash
./deploy-backend.sh
```

**Option B: Manual deployment**
```bash
cd supabase
npx supabase functions deploy server
```

**Option C: Windows**
```bash
deploy-backend.bat
```

#### 2. Verify Deployment
Check that the backend is running with the new payment endpoint:

```bash
# Check health endpoint
curl https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-8ae6fee0/health

# Expected response:
{
  "status": "ok",
  "version": "2.1.0-distance-filter",
  "timestamp": "2025-10-23T..."
}
```

#### 3. Test Payment Flow

**A. Test in Browser**
1. Open your Materia app
2. Sign in or create an account
3. Create 10 listings (to reach the new limit)
4. Try to create an 11th listing
5. Subscription dialog should appear
6. Click "Continue to Payment" on either plan
7. Fill out the payment form:
   - Card: `4532 1234 5678 9010` (test card)
   - Expiry: `12/25`
   - CVV: `123`
   - Name: Your name
   - Address: Any valid US address
8. Click "Pay $X.XX"
9. Should see success message
10. Create listing successfully

**B. Verify Backend**
```bash
# Test payment endpoint (should return 400 for missing data)
curl -X POST https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-8ae6fee0/process-payment \
  -H "Authorization: Bearer YOUR-ANON-KEY" \
  -H "Content-Type: application/json"

# Expected: {"error":"Missing required payment fields"}
```

### Files Modified

**Frontend:**
- `/utils/config.ts` - Free listing limit updated
- `/components/Dashboard.tsx` - Listing count display updated
- `/components/CreateListing.tsx` - Payment handlers updated
- `/components/SubscriptionDialog.tsx` - Payment flow added
- `/utils/api.ts` - Payment API method added

**New Files:**
- `/components/PaymentForm.tsx` - Credit card form component

**Backend:**
- `/supabase/functions/server/index.tsx` - Payment endpoints added

### Configuration

No environment variables need to be changed. The payment system works out of the box with your existing Supabase configuration.

### Rollback (If Needed)

If you need to rollback:

1. **Restore previous backend:**
```bash
# Revert the server/index.tsx file to previous version
# Then redeploy
./deploy-backend.sh
```

2. **Revert free listing limit:**
   - Change FREE_LISTING_LIMIT back to 3 in:
     - `/utils/config.ts`
     - `/components/Dashboard.tsx`
     - `/components/CreateListing.tsx`

### Troubleshooting

**Problem:** Payment form doesn't appear
- **Check:** Browser console for errors
- **Fix:** Clear browser cache and reload

**Problem:** Backend returns 500 error
- **Check:** Supabase dashboard logs
- **Fix:** Redeploy backend with `./deploy-backend.sh`

**Problem:** "Unauthorized" error
- **Check:** User is logged in
- **Fix:** Sign out and sign in again

**Problem:** Payment succeeds but subscription not updated
- **Check:** Supabase Auth dashboard - verify user metadata updated
- **Fix:** Check server logs for update errors

### Production Notes

⚠️ **IMPORTANT:** Current implementation is for PROTOTYPING

Before production launch, you MUST:

1. **Integrate Real Payment Processor**
   - Stripe: https://stripe.com/docs
   - PayPal: https://developer.paypal.com
   - Square: https://developer.squareup.com

2. **Never Store Card Data**
   - Current implementation for demo only
   - Use payment processor tokenization
   - Follow PCI DSS compliance

3. **Add Webhook Handlers**
   - Handle payment success/failure
   - Process refunds
   - Update subscriptions

4. **Security Audit**
   - Review all payment-related code
   - Implement fraud detection
   - Add rate limiting

### Support

If you encounter issues:

1. Check the `/PAYMENT_CREDENTIALS_UPDATE.md` file for detailed documentation
2. Review browser console for frontend errors
3. Check Supabase dashboard logs for backend errors
4. Verify all files were updated correctly

### Next Steps

After successful deployment:

1. ✅ Test payment flow with multiple users
2. ✅ Verify free listing count displays correctly
3. ✅ Test both pay-per-listing and annual plans
4. ✅ Check payment history endpoint works
5. ✅ Verify subscription tiers update correctly

### Quick Test Checklist

- [ ] Backend deployed successfully
- [ ] Health endpoint responds
- [ ] Can create free listings (up to 10)
- [ ] Subscription dialog appears after 10 listings
- [ ] Payment form displays correctly
- [ ] Can fill out payment form
- [ ] Payment processes successfully
- [ ] Subscription tier updates
- [ ] Can create additional listings after payment
- [ ] Dashboard shows correct listing count
- [ ] No console errors

### Success Criteria

✅ All tests pass
✅ Users can create 10 free listings
✅ Payment flow works smoothly
✅ Subscriptions update correctly
✅ No errors in logs

## Ready to Deploy?

Run this command:
```bash
./deploy-backend.sh
```

Then test the payment flow in your browser!
