# Phase 2 Quick Start Guide

## 🚀 Get Started with Phase 2 Features in 5 Minutes

All Phase 2 features are now live! Here's how to use them.

---

## Feature 1: Enhanced Messaging 💬 (2 minutes)

### Try It Now:
1. Sign in to your account
2. Click **"Messages"** in navigation
3. **Select a conversation** (or start a new one)
4. **Type a message** in the input box
5. Click the **paperclip icon** → Upload an image
6. Click **Send** → Message appears with image!

### Advanced Features:
```
✓ Send text messages
✓ Share images (click to view full-screen)
✓ See read receipts (✓ = sent, ✓✓ = read)
✓ Watch typing indicators
✓ Scroll through message history
```

### Quick Test:
1. Send a text message
2. Send an image
3. Click the image to view full-screen
4. Notice the read receipts update
5. Watch for typing indicator when other user types

---

## Feature 2: Saved Searches 🔍 (2 minutes)

### Try It Now:
1. Click **"Saved Searches"** in navigation
2. Click **"New Search"** button
3. **Name your search** (e.g., "Reclaimed Wood Denver")
4. **Add filters:**
   - Select category
   - Choose condition
   - Set price range
   - Enter keywords
5. **Toggle "Enable Alerts"** ON
6. Click **"Save Search"**

### Use Your Saved Search:
1. See your search in the list
2. Click **"Apply"** → Goes to listings with filters
3. Click **bell icon** → Toggle alerts on/off
4. Click **edit icon** → Modify search
5. Click **trash icon** → Delete search

### Quick Test:
```
✓ Create search with multiple filters
✓ Save with alerts enabled
✓ Apply search to listings
✓ Edit the search
✓ Toggle alerts off then on
✓ Delete a test search
```

---

## Feature 3: Seller Analytics 📊 (2 minutes)

### Try It Now:
1. Sign in to your account
2. Click **"Analytics"** in navigation
3. **View Overview Tab:**
   - See total listings, views, favorites, rating
   - Check recent activity (last 30 days)
   - Review engagement metrics
4. **Click "Top Listings" tab:**
   - See your best-performing listings
   - View views and favorites for each
5. **Click "By Category" tab:**
   - See pie chart of listings by category
   - Review category performance details

### Understanding Your Data:
```
Overview Card Metrics:
├── Total Listings (with +new this month)
├── Total Views (with avg per listing)
├── Total Favorites (with +new this month)
└── Average Rating (from reviews)

Charts:
├── Bar Chart: Views & Favorites by Category
├── Pie Chart: Listing Distribution
└── Progress Bars: Engagement Rates
```

### Quick Test:
```
✓ View overview metrics
✓ Check top 5 listings
✓ Explore category breakdown
✓ Hover over charts for details
✓ Click refresh to update data
✓ Switch between tabs
```

---

## Feature 4: Notification Preferences 🔔 (1 minute)

### Try It Now:
1. Sign in to your account
2. Go to **"Profile"**
3. Click **"Notification Preferences"** (in Quick Actions)
4. **Configure Email Settings:**
   - Toggle "Email Notifications" ON/OFF
   - Select digest frequency (instant/daily/weekly/never)
5. **Configure In-App Notifications:**
   - Toggle each notification type:
     - Favorites
     - Reviews
     - Messages
     - Offers
     - Purchases
6. Click **"Save Preferences"**

### Digest Options Explained:
```
Instant    → Email for every notification
Daily      → One email per day with summary
Weekly     → One email per week with summary
Never      → In-app notifications only
```

### Quick Test:
```
✓ Turn off all email notifications
✓ Set digest to weekly
✓ Disable message notifications
✓ Save preferences
✓ Refresh page to verify persistence
✓ Re-enable message notifications
✓ Save again
```

---

## 🎯 Complete Walkthrough (5 minutes)

### Scenario: Power User Experience

**Step 1:** Create Saved Search (1 min)
- Go to Saved Searches
- Create "Vintage Fixtures Under $500"
- Add filters: Category=Fixtures, MaxPrice=$500
- Enable alerts
- Save

**Step 2:** Send Message with Image (1 min)
- Go to Messages
- Select/start conversation
- Type "Check out this material!"
- Upload an image
- Send message
- View read receipt

**Step 3:** Check Analytics (2 min)
- Go to Analytics
- Review overview metrics
- Check which categories perform best
- Identify top listing
- Note engagement rates

**Step 4:** Configure Notifications (1 min)
- Go to Profile
- Click Notification Preferences
- Set email digest to Daily
- Keep all notification types enabled
- Save preferences

**Congratulations!** You're now using all Phase 2 features! 🎉

---

## 🧪 Developer Testing Guide

### Test Enhanced Messages (3 min)
```bash
# As User A
1. Send text message to User B
2. Send image to User B
3. Check message appears

# As User B
4. Sign in
5. View conversation with User A
6. See messages with image
7. Notice read receipts update
8. Reply to User A
9. Check typing indicator shows
```

### Test Saved Searches (2 min)
```bash
# As User A
1. Create search: "Wood in Denver"
2. Add filters: Category=Wood, search="reclaimed"
3. Enable alerts
4. Save

5. Create second search: "Cheap Bricks"
6. Add filters: Category=Brick, MaxPrice=100
7. Disable alerts
8. Save

9. Apply first search
10. Verify filters are applied to listings
11. Edit second search (change price)
12. Delete first search
```

### Test Analytics (2 min)
```bash
# As Seller with listings
1. Go to Analytics
2. Verify metrics match actual data:
   - Count listings manually
   - Check views add up
   - Confirm favorites count
3. View top listings
4. Verify they're sorted by views
5. Check category breakdown
6. Verify pie chart segments match counts
```

### Test Notification Preferences (1 min)
```bash
# As User A
1. Go to preferences
2. Toggle email OFF
3. Save
4. Refresh page
5. Verify email is still OFF
6. Set digest to weekly
7. Disable favorites notifications
8. Save
9. Verify all changes persist
```

---

## 📱 API Testing with curl

### Test Messaging
```bash
# Get conversations
curl -X GET \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/conversations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Send message
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/messages \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "RECIPIENT_ID",
    "text": "Hello!",
    "image": "data:image/jpeg;base64,..."
  }'
```

### Test Saved Searches
```bash
# Create saved search
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/saved-searches \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Search",
    "filters": {
      "category": "Wood",
      "priceMax": 500
    },
    "alertEnabled": true
  }'

# Get saved searches
curl -X GET \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/saved-searches \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Analytics
```bash
# Get analytics
curl -X GET \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/analytics \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Preferences
```bash
# Get preferences
curl -X GET \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/notification-preferences \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Update preferences
curl -X PUT \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-8ae6fee0/notification-preferences \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emailNotifications": true,
    "emailDigest": "daily",
    "notifyOnMessage": true
  }'
```

---

## 🐛 Troubleshooting

### Messages Not Sending
**Problem:** Message doesn't appear
**Solution:**
- Check you're signed in
- Verify recipient ID is valid
- Check network tab for errors
- Ensure access token is valid

### Charts Not Showing
**Problem:** Analytics charts are blank
**Solution:**
- Create some test listings first
- Favorite a few listings
- Leave some reviews
- Refresh the analytics page

### Saved Searches Not Working
**Problem:** Search doesn't save
**Solution:**
- Ensure you added at least one filter
- Check search name is not empty
- Verify you're signed in
- Look for validation errors

### Preferences Not Persisting
**Problem:** Settings reset after refresh
**Solution:**
- Click "Save Preferences" button
- Check browser console for errors
- Verify network request succeeds
- Clear browser cache and retry

---

## ✅ Verification Checklist

Before considering Phase 2 complete:

### Enhanced Messages
- [ ] Can view conversation list
- [ ] Can send text messages
- [ ] Can upload and send images
- [ ] Images display correctly
- [ ] Full-screen image view works
- [ ] Read receipts display
- [ ] Messages persist after refresh

### Saved Searches
- [ ] Can create new search
- [ ] Can add multiple filters
- [ ] Can toggle alerts
- [ ] Can apply search to listings
- [ ] Can edit existing search
- [ ] Can delete search
- [ ] Searches persist after refresh

### Seller Analytics
- [ ] Metrics display correctly
- [ ] Charts render properly
- [ ] Top listings show
- [ ] Category breakdown accurate
- [ ] Tabs switch correctly
- [ ] Refresh button works
- [ ] Empty states handle gracefully

### Notification Preferences
- [ ] Preferences load correctly
- [ ] Email toggle works
- [ ] Digest frequency changes
- [ ] Per-type toggles work
- [ ] Save button persists data
- [ ] Changes survive refresh
- [ ] Accessible from profile

---

## 🎓 Pro Tips

### Messaging Best Practices
- Send images to show material condition
- Use read receipts to gauge interest
- Respond quickly to maintain engagement
- Keep conversations professional

### Search Management
- Create specific searches for better matches
- Enable alerts on high-priority searches
- Use descriptive names for easy identification
- Regularly clean up old searches

### Analytics Insights
- Check analytics weekly
- Identify top-performing categories
- Focus on listings with high views
- Adjust strategy based on data

### Notification Strategy
- Start with daily digest to reduce noise
- Disable low-priority notifications
- Keep message notifications on
- Review and adjust preferences monthly

---

## 🎉 You're All Set!

Phase 2 features are ready to use. You now have:
- ✅ Professional messaging with images
- ✅ Smart search management
- ✅ Powerful analytics dashboard
- ✅ Complete notification control

**Next Steps:**
- Explore each feature
- Customize to your needs
- Share feedback
- Enjoy the enhanced SupplyWise!

**Need Help?**
- Check PHASE2_SUMMARY.md for technical details
- Review component documentation
- Test with provided examples
- Report any issues

**Happy Selling! 🏗️**
