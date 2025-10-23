# Stripe Setup Guide for Materia

## Overview
This guide will help you integrate Stripe payment processing for the listing payment system.

## Current Status
✅ Backend endpoints created for Stripe integration  
✅ Premium whitelisting system enabled for `dweldy9@gmail.com`  
⏳ Stripe API key needs to be configured  
⏳ Frontend needs Stripe Elements integration  

---

## Step 1: Grant Premium Status to Your Account

Your account (`dweldy9@gmail.com`) has been whitelisted for automatic premium access!

### To Grant Premium:
1. Open the file: `/grant-premium.html` in your browser
2. Click "Grant Premium Status" button
3. Your account will be upgraded to Premium tier with unlimited listings
4. No payment required - you're whitelisted! 🎉

**Alternative**: You can also directly navigate to the HTML file after deploying.

---

## Step 2: Get Your Stripe API Keys

### Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete the account setup

### Get Your API Keys
1. Go to **Developers** → **API Keys** in your Stripe dashboard
2. You'll see two types of keys:
   - **Test keys** (for development) - Use these first!
   - **Live keys** (for production) - Use these when you're ready to accept real payments

3. Copy your **Secret Key** (it starts with `sk_test_` for test mode or `sk_live_` for live mode)

---

## Step 3: Configure Stripe in Your Backend

### Add Stripe Secret Key as Environment Variable

You have two options:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Settings**
3. Add a new secret:
   - Name: `STRIPE_SECRET_KEY`
   - Value: Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
4. Save the secret

#### Option B: Using Supabase CLI
```bash
# For test mode
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here

# For live mode (when ready for production)
supabase secrets set STRIPE_SECRET_KEY=sk_live_your_key_here
```

---

## Step 4: Test Stripe Integration

### Test Card Numbers
When using Stripe test mode, use these test card numbers:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- Zip: Any 5 digits (e.g., `12345`)

**Other Test Cards:**
- Declined: `4000 0000 0000 0002`
- Insufficient funds: `4000 0000 0000 9995`
- Authentication required: `4000 0025 0000 3155`

### How to Test
1. Sign in to Materia with any account
2. Try to create more than 10 listings (free tier limit)
3. You'll be prompted to upgrade
4. Choose either:
   - **Pay-per-listing** ($0.99) - One-time payment for one listing
   - **Annual Plan** ($20/year) - Unlimited listings for a year
5. Use a test card number from above
6. Complete the payment
7. Your listing should be created successfully

---

## Step 5: Frontend Integration (Optional Enhancement)

The current implementation uses a basic credit card form. For better security and UX, you can integrate Stripe Elements:

### Install Stripe.js
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Example Implementation
```tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

// In your payment component
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Create payment intent on backend
    const { clientSecret } = await createPaymentIntent();
    
    // Confirm payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });
    
    if (result.error) {
      console.error(result.error);
    } else {
      // Payment successful!
      await confirmPayment(result.paymentIntent.id);
    }
  };
};
```

---

## Step 6: Go Live with Real Payments

When you're ready to accept real payments:

1. **Complete Stripe Account Activation:**
   - Add business details
   - Connect bank account
   - Verify identity

2. **Switch to Live Keys:**
   - Update `STRIPE_SECRET_KEY` environment variable to use `sk_live_...`
   - Update frontend to use live publishable key `pk_live_...`

3. **Test Everything:**
   - Use a real card with small amount
   - Verify payment appears in Stripe dashboard
   - Check that user permissions are updated correctly

4. **Set Up Webhooks** (Recommended for production):
   - Go to Stripe Dashboard → **Developers** → **Webhooks**
   - Add endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/stripe-webhook`
   - Select events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`

---

## Current Payment Flow

### Without Stripe Configured (Test Mode)
- System simulates successful payments
- No real money is charged
- User subscriptions are updated immediately
- Perfect for development and testing

### With Stripe Configured (Production Mode)
- Real payment processing through Stripe
- Secure card handling
- PCI compliance handled by Stripe
- Automatic fraud detection
- Support for all major cards and payment methods

---

## Pricing Structure

Currently configured:
- **Free Tier:** 10 listings included
- **Pay-per-listing:** $0.99 per additional listing
- **Annual Unlimited:** $20/year for unlimited listings

To modify pricing, edit the `SubscriptionDialog.tsx` component or backend payment processing logic.

---

## Security Notes

1. ✅ **Never expose Stripe Secret Key** - It's safely stored as environment variable in backend only
2. ✅ **Use HTTPS in production** - Supabase provides this automatically
3. ✅ **Validate payments on backend** - Already implemented
4. ✅ **Store minimal card data** - Only last 4 digits stored for reference
5. ✅ **PCI compliance** - Handled by Stripe, no card data stored in your database

---

## Troubleshooting

### Payment not working?
1. Check Stripe secret key is set correctly
2. Verify the key starts with `sk_test_` (test) or `sk_live_` (production)
3. Check browser console for errors
4. Review backend logs in Supabase Functions

### User subscription not updating?
1. Check the `/make-server-8ae6fee0/confirm-stripe-payment` endpoint logs
2. Verify user metadata is being updated in Supabase Auth
3. Check if payment record is stored in KV store

### Webhook not receiving events?
1. Verify webhook URL is correct
2. Check webhook signing secret is configured
3. Test webhook with Stripe CLI:
   ```bash
   stripe listen --forward-to https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/stripe-webhook
   ```

---

## Support Resources

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Test Cards:** [https://stripe.com/docs/testing](https://stripe.com/docs/testing)
- **Supabase Edge Functions:** [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

---

## Next Steps

1. ✅ Grant premium to `dweldy9@gmail.com` using `/grant-premium.html`
2. ⏳ Get Stripe test API keys
3. ⏳ Configure `STRIPE_SECRET_KEY` environment variable
4. ⏳ Test payment flow with test cards
5. ⏳ When ready, switch to live keys and go to production!

---

**Questions or issues?** Check the troubleshooting section above or review the Stripe documentation.
