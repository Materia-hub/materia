# Phase 3 Social Features - Testing Guide

## 🎯 Quick Testing Guide

This guide will help you test all the new Phase 3 social features in 10 minutes!

---

## 🚀 Prerequisites

1. ✅ App is running (no special setup needed for social features!)
2. ✅ Have a test account (or use guest mode for directory)

**Note:** Email features require Resend API key, but social features work without it!

---

## 📋 Test Scenarios

### Scenario 1: Browse Sellers (No Login Required) ⏱️ 2 minutes

**Steps:**
1. Open the app
2. Click **"Seller Directory"** in the navigation
3. You should see a grid of seller cards

**What to Check:**
- ✅ Sellers displayed with avatars and names
- ✅ Stats showing (rating, sales, listings, followers)
- ✅ Badges visible (Verified Seller, Top Rated, etc.)
- ✅ Categories listed for each seller

**Test the Filters:**
4. Type "John" in the search box
   - ✅ Results filter to matching sellers
5. Select **"Wood"** from category filter
   - ✅ Only sellers with Wood category show
6. Change sort to **"Most Followers"**
   - ✅ Sellers reorder by follower count
7. Clear filters and search
   - ✅ All sellers return

---

### Scenario 2: View Seller Profile ⏱️ 2 minutes

**Steps:**
1. From Seller Directory, click any **"View Profile"** button
2. Seller profile page loads

**What to Check:**
- ✅ Seller avatar and name displayed
- ✅ Location and member since date visible
- ✅ Badges displayed correctly
- ✅ Bio text showing
- ✅ Four stats cards (Listings, Sales, Rating, Followers)

**Test the Tabs:**
3. Click **"Listings"** tab
   - ✅ Grid of seller's listings displayed
   - ✅ Each listing shows image, title, price, condition
4. Click **"Reviews"** tab
   - ✅ Reviews displayed with ratings
   - ✅ Reviewer names and dates showing
5. Click **"About"** tab
   - ✅ Response time displayed
   - ✅ Sales count shown
   - ✅ Average rating with stars

**Test Actions:**
6. Click **"Share"** button
   - ✅ Toast notification: "Profile link copied!"
7. Click a listing card
   - ✅ Navigates to listing detail page

---

### Scenario 3: Follow a Seller (Login Required) ⏱️ 2 minutes

**Steps:**
1. Login to your test account (if not already)
2. Navigate to any seller profile
3. Click **"Follow"** button

**What to Check:**
- ✅ Button changes to "Unfollow"
- ✅ Button color changes (gray)
- ✅ Follower count increases by 1
- ✅ Toast notification appears

**Test Unfollow:**
4. Click **"Unfollow"** button
   - ✅ Button changes back to "Follow"
   - ✅ Button color changes (blue)
   - ✅ Follower count decreases by 1
   - ✅ Toast notification appears

---

### Scenario 4: Activity Feed (Login Required) ⏱️ 2 minutes

**Steps:**
1. Ensure you're logged in
2. Click **"Activity Feed"** in navigation
3. Activity feed page loads

**What to Check:**
- ✅ Activities displayed as cards
- ✅ Each activity has icon, title, description
- ✅ Time ago displayed (e.g., "2h ago", "Just now")
- ✅ Seller avatar shown
- ✅ Color-coded cards by activity type

**Activity Types to See:**
- 🔵 **New Listing** - Blue card with Package icon
- 🟡 **New Review** - Yellow card with Star icon
- 🟢 **Sale** - Green card with TrendingUp icon
- 🟣 **New Follower** - Purple card with UserPlus icon
- 🔴 **Favorite** - Red card with Heart icon

**Test Filters:**
4. Click **"Following Only"** tab
   - ✅ Activities filter (currently shows all as demo)
5. Click **"All Activity"** tab
   - ✅ All activities displayed
6. Click **"Refresh"** button
   - ✅ Activities reload

**Test Actions:**
7. Click **"View Seller"** button on any activity
   - ✅ Navigates to seller profile
8. Click **"View Listing"** button (if available)
   - ✅ Navigates to listing detail

---

### Scenario 5: Navigation Flow ⏱️ 2 minutes

**Test Complete User Journey:**

1. **Start:** Browse Listings
   - Click a listing
   - See seller name in listing detail
   - Click seller name → **Goes to Seller Profile** ✅

2. **From Seller Profile:**
   - Follow the seller
   - Click back
   - Go to Activity Feed
   - See seller's activities ✅

3. **From Activity Feed:**
   - Click "View Listing" on activity
   - See listing detail
   - Click "View Seller"
   - Back to seller profile ✅

4. **From Seller Directory:**
   - Search for seller
   - Click profile
   - Follow seller
   - Check follower count increased ✅

---

## 🔍 Detailed Feature Testing

### Seller Directory Features

#### Search Functionality
```
Test Input → Expected Result
-----------------------------------------
"John" → Shows "John Smith Construction"
"eco" → Shows "EcoBuilders Supply"
"Portland" → Shows sellers in Portland
"sustainable" → Shows sellers with "sustainable" in bio
"xyz123" → Shows "No sellers found" message
```

#### Category Filter
```
Category → Expected Sellers
-----------------------------------------
All Categories → All 5 sellers
Wood → John Smith, Vintage Salvage, Green Reclaim
Metal → John Smith, Metro Demolition
Brick & Stone → EcoBuilders, Green Reclaim
Fixtures → John Smith, Vintage Salvage, Green Reclaim
```

#### Sort Options
```
Sort By → Order
-----------------------------------------
Highest Rated → EcoBuilders (4.9) first
Most Sales → Vintage Salvage (203) first
Most Followers → Green Reclaim (178) first
Most Listings → Vintage Salvage (31) first
```

### Seller Profile Features

#### Stats to Verify
- **Active Listings**: Number matches seller's listing count
- **Sales**: Completed transaction count
- **Rating**: Average of all reviews (1-5 stars)
- **Followers**: Number of users following this seller

#### Badges to Check
- 🔵 **Verified Seller** - Seller is verified by platform
- ⭐ **Top Rated** - Rating ≥ 4.7
- 🌿 **Eco-Warrior** - Focus on sustainable materials
- 🚀 **Fast Shipper** - Quick response/delivery time

### Activity Feed Features

#### Activity Card Colors
- **Blue (New Listing)** - bg-blue-50, border-blue-200
- **Yellow (New Review)** - bg-yellow-50, border-yellow-200
- **Green (Sale)** - bg-green-50, border-green-200
- **Purple (New Follower)** - bg-purple-50, border-purple-200
- **Red (Favorite)** - bg-red-50, border-red-200

#### Time Display
- **< 1 minute** → "Just now"
- **< 60 minutes** → "30m ago"
- **< 24 hours** → "5h ago"
- **< 7 days** → "3d ago"
- **> 7 days** → Full date (e.g., "10/15/2024")

---

## ✅ Success Checklist

### Basic Functionality
- [ ] Seller Directory loads without errors
- [ ] Search filters sellers correctly
- [ ] Category filter works
- [ ] Sort options reorder sellers
- [ ] Seller cards are clickable
- [ ] Profile page loads for any seller
- [ ] Activity Feed loads (when logged in)
- [ ] Follow/unfollow works
- [ ] Navigation between pages works
- [ ] Mobile responsive design

### UI/UX
- [ ] All icons display correctly
- [ ] Colors match SupplyWise theme (blue)
- [ ] Text is readable
- [ ] Buttons have hover effects
- [ ] Cards have shadow on hover
- [ ] Loading states appear
- [ ] Toast notifications show
- [ ] No layout shifts
- [ ] Consistent spacing
- [ ] Professional appearance

### Error Handling
- [ ] Empty states show helpful messages
- [ ] Failed API calls show errors
- [ ] Unauthorized access redirects to signup
- [ ] Invalid routes handled gracefully
- [ ] Console has no errors
- [ ] Network failures handled

---

## 🐛 Common Issues & Solutions

### Issue: Seller Directory Not Showing
**Solution:** Check that component is imported in App.tsx

### Issue: Activity Feed Shows Empty
**Solution:** This is expected with mock data - activities are pre-generated

### Issue: Follow Button Doesn't Work
**Solution:** Ensure you're logged in - follow requires authentication

### Issue: Profile Page Shows Wrong Data
**Solution:** Check that sellerId is being passed correctly in navigation

### Issue: Navigation Doesn't Work
**Solution:** Verify page type is added to Page union type in App.tsx

---

## 📊 Test Data Reference

### Mock Sellers
1. **John Smith Construction**
   - Location: Denver, CO
   - Rating: 4.8
   - Sales: 156
   - Followers: 89
   - Categories: Wood, Metal, Fixtures

2. **EcoBuilders Supply**
   - Location: Portland, OR
   - Rating: 4.9
   - Sales: 92
   - Followers: 134
   - Categories: Brick & Stone, Concrete, Glass

3. **Vintage Salvage Co**
   - Location: Austin, TX
   - Rating: 4.7
   - Sales: 203
   - Followers: 156
   - Categories: Fixtures, Wood, Glass

4. **Metro Demolition**
   - Location: Chicago, IL
   - Rating: 4.6
   - Sales: 67
   - Followers: 45
   - Categories: Metal, Concrete, Other

5. **Green Reclaim LLC**
   - Location: Seattle, WA
   - Rating: 4.9
   - Sales: 145
   - Followers: 178
   - Categories: Wood, Brick & Stone, Fixtures

---

## 🎯 Performance Benchmarks

### Expected Load Times
- **Seller Directory**: < 1 second
- **Seller Profile**: < 1 second
- **Activity Feed**: < 1 second
- **Follow Action**: < 500ms
- **Page Navigation**: Instant

### UI Responsiveness
- **Search Input**: Real-time filtering
- **Filter Changes**: Instant reorder
- **Sort Changes**: Instant reorder
- **Button Clicks**: Immediate feedback
- **Toast Notifications**: Appear instantly

---

## 📱 Mobile Testing

### Test on Mobile/Small Screen
1. Resize browser to mobile width (< 768px)
2. Check navigation menu is hamburger icon
3. Test all features on mobile layout
4. Verify cards stack vertically
5. Ensure text remains readable
6. Test touch interactions

### Expected Mobile Behavior
- ✅ Hamburger menu for navigation
- ✅ Stacked layout for cards
- ✅ Full-width components
- ✅ Touch-friendly buttons (min 44px)
- ✅ Readable text sizes
- ✅ No horizontal scrolling

---

## 🔐 Authentication Testing

### Guest User (Not Logged In)
**Can Access:**
- ✅ Browse Listings
- ✅ Seller Directory
- ✅ View Seller Profiles
- ✅ View Listing Details

**Cannot Access:**
- ❌ Activity Feed (redirects to signup)
- ❌ Follow/Unfollow (shows signup prompt)
- ❌ Dashboard
- ❌ Messages

### Authenticated User (Logged In)
**Can Access:**
- ✅ Everything above, plus:
- ✅ Activity Feed
- ✅ Follow/Unfollow functionality
- ✅ Dashboard
- ✅ Messages
- ✅ All user features

---

## 🚀 Advanced Testing

### Test Backend Integration
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform follow action
4. Check for API call:
   - `POST /sellers/:sellerId/follow`
   - Status: 200 OK
   - Response: `{ success: true, following: true }`

### Test State Management
1. Follow a seller
2. Navigate away
3. Come back to profile
4. Follow state should persist (until page refresh)

### Test Error Scenarios
1. Network offline → Should show error message
2. Invalid seller ID → Should show "not found"
3. Server error → Should show "try again"

---

## 📝 Test Report Template

```markdown
## Social Features Test Report

**Date:** [Date]
**Tester:** [Name]
**Browser:** [Chrome/Firefox/Safari]
**Device:** [Desktop/Mobile]

### Results:

#### Seller Directory
- [ ] Loads successfully
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Navigation works

#### Seller Profile
- [ ] Profile loads
- [ ] Stats display correctly
- [ ] Tabs work
- [ ] Follow/unfollow works
- [ ] Share works

#### Activity Feed
- [ ] Feed loads
- [ ] Activities display
- [ ] Filters work
- [ ] Actions work
- [ ] Refresh works

### Issues Found:
1. [Issue description]
2. [Issue description]

### Overall Rating: [Pass/Fail]
```

---

## 🎉 Testing Complete!

If all tests pass, you've successfully verified:
- ✅ Seller Directory functionality
- ✅ Seller Profile pages
- ✅ Follow/unfollow system
- ✅ Activity Feed
- ✅ Navigation and routing
- ✅ Mobile responsiveness
- ✅ Authentication guards

**Phase 3 social features are working perfectly!** 🚀

---

## 📞 Need Help?

**Issues?**
- Check console for errors
- Verify imports in App.tsx
- Ensure components are in `/components/`
- Check backend routes are defined

**Documentation:**
- See `PHASE3_STATUS.md` for feature overview
- See `PHASE3_PLAN.md` for full roadmap
- See `MASTER_INDEX.md` for all docs

**Happy Testing!** 🎯
