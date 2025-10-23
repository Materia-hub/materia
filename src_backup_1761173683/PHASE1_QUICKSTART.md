# Phase 1 Quick Start Guide

## 🚀 Get Started with Phase 1 Features in 5 Minutes

---

## Prerequisites
- SupplyWise app running
- User account created and signed in
- Supabase backend connected

---

## Feature 1: Favorites ❤️ (30 seconds)

### Try It Now:
1. Go to Browse Listings page
2. Look for heart icon on any listing card
3. **Click the heart** → It fills red ❤️
4. Click **"Favorites"** in navigation menu
5. See your saved listing!

### Quick Test:
```
✓ Click heart on 3 different listings
✓ Go to Favorites page
✓ Verify all 3 appear
✓ Click heart again to remove one
✓ Verify it's removed
```

---

## Feature 2: Reviews ⭐ (1 minute)

### Try It Now:
1. Click any listing to view details
2. **Scroll to bottom** → Find "Customer Reviews"
3. Click **"Write a Review"** button
4. **Click stars** to rate (1-5)
5. Type comment (optional)
6. Click **"Submit Review"**
7. See your review appear!

### Quick Test:
```
✓ Leave a 5-star review
✓ Verify it appears in the list
✓ Check average rating updated
✓ Look at review timestamp
```

---

## Feature 3: Notifications 🔔 (30 seconds)

### Try It Now:
1. Look at **top-right corner** of header
2. See the **bell icon** 🔔
3. Favorite a listing (creates notification for seller)
4. **Click the bell** → Dropdown opens
5. See your notifications!

### Quick Test:
```
✓ Click bell to open dropdown
✓ Look for red badge with count
✓ Click a notification
✓ Click "Mark all read"
✓ Verify badge disappears
```

**Note:** In real usage, notifications come from:
- Someone favoriting your listings
- Someone reviewing your listings  
- New messages
- New offers
- Purchase confirmations

---

## Feature 4: Payments 💳 (2 minutes)

### Try It Now (Development Mode):
1. Sign in to your account
2. Click **"Create Listing"**
3. If you've created 3+ listings already:
   - Subscription dialog appears
   - See pricing options:
     - **$0.99** for one listing
     - **$20/year** for unlimited
4. Click an option
5. Mock checkout completes
6. Create your listing!

### Quick Test:
```
✓ Create 3 listings (free tier)
✓ Start creating 4th listing
✓ See subscription dialog
✓ Click pay-per-listing option
✓ Mock payment completes
✓ Verify you can now create listing
```

**Production Setup Required:**
- Add Stripe API keys
- Configure webhook
- Test with real payment

---

## 🎯 Complete Walkthrough (5 minutes)

### Scenario: New User Experience

**Step 1:** Browse & Save (1 min)
- Browse listings
- Click ❤️ on 3 listings you like
- Go to Favorites to see them

**Step 2:** Research & Review (2 min)
- Click one of your favorites
- Scroll to reviews section
- Read existing reviews
- Leave your own review (5 stars + comment)

**Step 3:** Check Notifications (1 min)
- Click 🔔 bell icon
- See notification about your review
- Click to navigate
- Mark as read

**Step 4:** Create Listing (1 min)
- Click "Create Listing"
- Fill in basic info
- Upload photo
- Submit (within free 3)
- Or trigger subscription dialog

**Congratulations!** You've used all Phase 1 features! 🎉

---

## 🧪 Developer Testing Guide

### Test All Features Quickly

#### 1. Favorites Testing (2 min)
```bash
# As User A
1. Sign in
2. Browse listings
3. Favorite 5 listings
4. Go to Favorites page
5. Remove 2 favorites
6. Verify 3 remain
```

#### 2. Reviews Testing (3 min)
```bash
# As User A
1. View any listing
2. Submit 5-star review with comment
3. Verify review appears
4. Check average rating

# As User B (seller)
5. Sign in
6. Click notifications bell
7. See review notification
```

#### 3. Notifications Testing (2 min)
```bash
# As User A
1. Favorite a listing owned by User B
2. Leave a review on listing by User B

# As User B
3. Sign in
4. Click bell icon
5. See 2 notifications (favorite + review)
6. Click one notification
7. Mark all as read
```

#### 4. Payment Testing (2 min)
```bash
# As User A
1. Create 3 listings (use free tier)
2. Start creating 4th listing
3. Subscription dialog appears
4. Select "Pay Per Listing"
5. Mock checkout completes
6. Continue creating listing
```

---

## 📱 API Testing with curl

### Test Favorites
```bash
# Get favorites
curl -X GET \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/favorites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Add favorite
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/favorites/LISTING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Remove favorite
curl -X DELETE \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/favorites/LISTING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Reviews
```bash
# Get listing reviews
curl -X GET \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/listings/LISTING_ID/reviews

# Create review
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/reviews \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "LISTING_ID",
    "sellerId": "SELLER_ID",
    "rating": 5,
    "comment": "Great materials!"
  }'
```

### Test Notifications
```bash
# Get notifications
curl -X GET \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/notifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Mark as read
curl -X PUT \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Mark all as read
curl -X PUT \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/notifications/read-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🐛 Troubleshooting

### Favorites Not Saving
**Problem:** Heart icon doesn't fill
**Solution:**
- Check you're signed in
- Open browser console
- Look for API errors
- Verify access token is valid
- Check Supabase connection

### Reviews Not Submitting
**Problem:** Submit button doesn't work
**Solution:**
- Ensure you selected a star rating (required)
- Check you're signed in
- Look for validation errors
- Verify API endpoint is working

### Notifications Not Appearing
**Problem:** Bell shows 0 notifications
**Solution:**
- Perform action that creates notification (favorite/review)
- Refresh page
- Check browser console
- Verify backend notification creation
- Test with another user account

### Payment Dialog Not Showing
**Problem:** No subscription prompt
**Solution:**
- Verify you've created 3+ listings
- Check subscription tier in profile
- Clear localStorage and re-login
- Review console for errors

---

## ✅ Verification Checklist

Before considering Phase 1 complete:

### Favorites
- [ ] Can save listing from browse page
- [ ] Can save listing from detail page
- [ ] Heart icon updates immediately
- [ ] Favorites page shows saved items
- [ ] Can remove from favorites
- [ ] Persists after page refresh

### Reviews
- [ ] Can submit rating only
- [ ] Can submit rating + comment
- [ ] Review appears in list
- [ ] Average rating updates
- [ ] Seller gets notification
- [ ] Timestamps are accurate

### Notifications
- [ ] Bell icon appears when signed in
- [ ] Unread count is accurate
- [ ] Dropdown opens on click
- [ ] Notifications sorted correctly
- [ ] Mark as read works
- [ ] Mark all read works
- [ ] Click navigates correctly

### Payments
- [ ] Free listings work (1-3)
- [ ] Dialog appears on 4th listing
- [ ] Both options are clickable
- [ ] Mock payment completes
- [ ] Can create listing after payment
- [ ] Subscription tier updates

---

## 🎓 Next Steps

### For Users
1. **Read** PHASE1_USER_GUIDE.md for detailed instructions
2. **Explore** all features at your own pace
3. **Provide** feedback on user experience
4. **Report** any bugs or issues

### For Developers
1. **Review** PHASE1_FEATURES.md for technical details
2. **Test** all API endpoints
3. **Monitor** backend logs
4. **Optimize** performance if needed
5. **Plan** Phase 2 features

### For Product Team
1. **Track** user engagement metrics
2. **Monitor** payment conversion
3. **Collect** user feedback
4. **Analyze** review quality
5. **Plan** marketing strategy

---

## 🎉 You're All Set!

Phase 1 features are ready to use. Start exploring and enjoy the enhanced SupplyWise experience!

**Need Help?**
- Check PHASE1_USER_GUIDE.md for detailed tutorials
- Read PHASE1_FEATURES.md for technical documentation
- Review PHASE1_SUMMARY.md for implementation overview

**Happy Building! 🏗️**
