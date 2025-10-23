# Quick Start Testing Guide 🧪

## Start Testing in 5 Minutes!

Your SupplyWise app is **fully functional RIGHT NOW**. Here's how to test it immediately:

---

## Test #1: Create Your First Listing (5 minutes)

1. **Sign Up**
   - Click "Sign Up" 
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Password: `password123`
   - Name: `John Smith`
   - Role: Select "Seller"
   - Click "Complete Profile"

2. **Create a Listing**
   - Click "Create Listing" button
   - **Title**: `Reclaimed Oak Wood Planks`
   - **Description**: `Beautiful reclaimed oak from old barn. Great for furniture or flooring. Slightly weathered with character.`
   - **Category**: Select "Lumber & Wood"
   - **Condition**: Select "Good"
   - **Quantity**: `50 pieces`
   - **Location**: `Portland, OR`

3. **Upload a Photo**
   - Click the "Upload" button in the Photos section
   - Select an image from your computer (any photo works for testing)
   - Wait for "Image uploaded successfully!" message
   - ✅ Your photo should appear!

4. **Set Pricing**
   - **Per Item Price**: `$15`
   - Enable "Bulk Order Pricing"
   - Add tier: Min 10, Max 20, Price $12
   - Add tier: Min 21, Max 50, Price $10

5. **Submit**
   - Click "Create Listing"
   - ✅ You should see "Listing created successfully!"
   - You'll be taken back to the dashboard

---

## Test #2: Browse & Search (2 minutes)

1. **View Your Listing**
   - You should see your listing on the dashboard
   - Click on it to see full details
   - ✅ Your photo should display
   - ✅ All details should be there

2. **Test Search**
   - Go back to Browse Listings
   - Search for "oak"
   - ✅ Your listing should appear

3. **Test Filters**
   - Click "Category" dropdown
   - Select "Lumber & Wood"
   - ✅ Only lumber listings show
   - Try "Condition" filter
   - Try sorting options

---

## Test #3: Create Multiple Listings (10 minutes)

Create 3 more listings to test different scenarios:

### Listing 2: Metal Material
- **Title**: `Steel I-Beams - Industrial Grade`
- **Category**: Metal & Steel
- **Price**: $200 each
- **Quantity**: 8 beams
- **Upload**: Different photo
- **Trade Available**: ✅ Enable

### Listing 3: Building Material
- **Title**: `Vintage Brick Pavers`
- **Category**: Brick & Stone
- **Price**: $5 per brick
- **Bulk Pricing**: 
  - 50-100: $4 each
  - 101+: $3 each
- **Upload**: Another photo
- **Delivery Available**: ✅ Enable

### Listing 4: Free Item
- **Title**: `Free Scrap Lumber - Must Pick Up`
- **Category**: Lumber & Wood
- **Buy It Now**: ✅ Enable
- **Price**: $0
- **Quantity**: Lots
- **Upload**: Photo
- **Note**: Add "Must pick up by weekend" in description

---

## Test #4: Photo Upload Extensively (5 minutes)

1. **Create New Listing**
2. **Upload Multiple Photos**
   - Click Upload → Select 1st image
   - Wait for upload
   - Click Upload → Select 2nd image
   - Repeat up to 5 photos total
   - ✅ All should appear in grid

3. **Test Photo Limits**
   - Try uploading a 6th photo
   - ✅ Should show "Maximum 5 images allowed"

4. **Delete Photos**
   - Hover over any photo
   - Click the red X button
   - ✅ Photo should disappear

5. **Test Large File**
   - Try uploading a very large image (>5MB)
   - ✅ Should show error about file size

---

## Test #5: Edit & Delete (3 minutes)

1. **Edit a Listing**
   - Click on any listing
   - Click "Edit" button
   - Change the title
   - Change the price
   - Add another photo
   - Click "Update Listing"
   - ✅ Changes should save

2. **Delete a Listing**
   - Click on a test listing
   - Click "Delete" (if available)
   - Or go to Dashboard → Find listing → Delete
   - ✅ Listing should be removed

---

## Test #6: Subscription Limits (5 minutes)

1. **Create Listing #4**
   - Create a 4th listing
   - ✅ Should trigger subscription dialog
   - Shows: "You've reached the 3 free listing limit"

2. **Test Pay-Per-Listing**
   - Click "Pay $0.99 per listing"
   - ✅ Dialog closes
   - ✅ Can create listing #4

3. **Test Annual**
   - Create another account
   - Create 3 listings
   - On 4th, choose "Annual - $20/year"
   - ✅ Unlimited listings enabled

---

## Test #7: Mobile Responsiveness (5 minutes)

1. **Resize Browser**
   - Make browser window narrow (mobile size)
   - ✅ Layout should adjust
   - ✅ Navigation should work
   - ✅ Images should scale

2. **Test on Real Phone**
   - Open the app on your phone
   - Test all features
   - ✅ Should work smoothly

---

## Test #8: Data Persistence (2 minutes)

1. **Refresh the Page**
   - Press F5 or click refresh
   - ✅ All listings still there
   - ✅ Still logged in
   - ✅ Photos still display

2. **Close & Reopen**
   - Close the browser tab
   - Open app again
   - ✅ Everything persists!

---

## Test #9: Multiple Users (10 minutes)

1. **Sign Out**
   - Click user menu → Sign Out

2. **Create User #2**
   - Sign up as: `testuser2@example.com`
   - Role: "Buyer"
   - Complete profile

3. **Browse User #1's Listings**
   - Go to Browse Listings
   - ✅ Should see testuser1's listings
   - Click on one
   - ✅ Should see "Message Seller" button

4. **Create User #3**
   - Sign out
   - Create: `testuser3@example.com`
   - Role: "Seller"
   - Create 2-3 listings
   - ✅ Test that different users have separate listings

---

## Test #10: Advanced Features (10 minutes)

1. **Test Messaging Interface**
   - Click "Messages" in navigation
   - ✅ Interface loads
   - Try composing a message (UI only for now)

2. **Test Transactions**
   - Click "Transactions"
   - ✅ Interface loads
   - View "Make Offer" and "Buy It Now" sections

3. **Test Admin Panel**
   - Click "Admin" (if available)
   - ✅ See all listings
   - ✅ Can verify listings
   - ✅ Can see user stats

4. **Test User Profile**
   - Click on your profile
   - Edit bio
   - Change contact info
   - ✅ Changes save

---

## Common Issues & Solutions

### ❌ Photo Won't Upload
**Solution**: 
- Check file size (must be < 5MB)
- Make sure it's an image file (JPG, PNG, etc.)
- Try a different photo
- Check browser console for errors (F12)

### ❌ Listing Doesn't Save
**Solution**:
- Check that all required fields (*) are filled
- Make sure you uploaded at least 1 photo
- Try creating a simpler listing first
- Check browser console for errors

### ❌ Can't See Listings After Refresh
**Solution**:
- Data is stored in Supabase - should persist
- Check that you're logged in
- Try refreshing again
- Check browser console for API errors

### ❌ Subscription Dialog Won't Close
**Solution**:
- Click one of the subscription options
- Or click outside the dialog
- Refresh page if stuck

---

## Testing Scorecard

Track your testing progress:

- [ ] Created first listing with photo
- [ ] Uploaded 5 photos to one listing
- [ ] Created 5+ total listings
- [ ] Tested all categories
- [ ] Tested all conditions  
- [ ] Used bulk pricing
- [ ] Used size calculator
- [ ] Searched for listings
- [ ] Used category filter
- [ ] Used condition filter
- [ ] Edited a listing
- [ ] Deleted a listing
- [ ] Hit 3-listing limit
- [ ] Tested subscription options
- [ ] Tested on mobile (browser resize)
- [ ] Tested on real phone
- [ ] Created multiple user accounts
- [ ] Verified data persists after refresh
- [ ] Tested messaging interface
- [ ] Tested transactions interface
- [ ] Found 0 critical bugs! 🎉

---

## Report Issues

If you find bugs:
1. Note what you were doing
2. Check browser console (F12)
3. Copy any error messages
4. Take screenshots
5. Report back with details

---

## Next Steps After Testing

✅ Once you've completed most tests:
1. Review HYBRID_LAUNCH_PLAN.md for deployment
2. Fix any bugs found
3. Get feedback from friends
4. Start preparing for production launch

**Your app is working!** Test it thoroughly and have fun! 🚀
