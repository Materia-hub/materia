# Photo Upload Testing Guide 📸

## Is Photo Upload Working? Test Now!

Follow these exact steps to verify photo uploads work:

---

## ✅ Test #1: Upload Single Photo (2 minutes)

### Steps:
1. Open your SupplyWise app
2. If not logged in, click "Sign Up" and create account
3. Click "Create Listing" button
4. Fill in required fields:
   - Title: `Test Listing - Photo Upload`
   - Description: `Testing photo upload functionality`
   - Category: Select any
   - Condition: Select any
   - Quantity: `1`
   - Location: `Test City`
   - Price: `$10`

5. **Scroll to "Photos" section**

6. **Click the "Upload" button** (dashed border box)

7. **Select a photo from your computer**
   - Any photo works
   - Must be under 5MB
   - JPG, PNG, GIF, or WebP

8. **Watch for these signs:**
   - ✅ Button changes to "Uploading..." with spinner
   - ✅ After 2-5 seconds: "Image uploaded successfully!" toast
   - ✅ Your photo appears in the grid
   - ✅ Can see the photo clearly

9. Click "Create Listing"

10. **Success indicators:**
    - ✅ "Listing created successfully!" message
    - ✅ Redirected to dashboard
    - ✅ Can see your listing
    - ✅ Photo displays on listing card

### Expected Result:
✅ **PASS** - Photo uploaded and displays correctly
❌ **FAIL** - See troubleshooting below

---

## ✅ Test #2: Upload Multiple Photos (3 minutes)

### Steps:
1. Click "Create Listing" again
2. Fill in basic info
3. **Upload 5 photos one by one:**
   - Click Upload → Select photo 1 → Wait for success
   - Click Upload → Select photo 2 → Wait for success
   - Click Upload → Select photo 3 → Wait for success
   - Click Upload → Select photo 4 → Wait for success
   - Click Upload → Select photo 5 → Wait for success

4. **Verify:**
   - ✅ All 5 photos appear in grid
   - ✅ First photo has no special indicator (it's the cover)
   - ✅ Each photo has X button on hover
   - ✅ Message says "Upload up to 5 photos (max 5MB each)"

5. **Try uploading 6th photo:**
   - ✅ Should show error: "Maximum 5 images allowed"
   - ✅ Upload button should not appear anymore

### Expected Result:
✅ **PASS** - Can upload exactly 5 photos, no more
❌ **FAIL** - See troubleshooting below

---

## ✅ Test #3: Remove Photos (1 minute)

### Steps:
1. In same listing with 5 photos
2. **Hover over 3rd photo**
   - ✅ Should see red X button appear
3. **Click the red X**
   - ✅ Photo disappears immediately
   - ✅ Now have 4 photos
   - ✅ Upload button appears again
4. **Upload a new photo**
   - ✅ Can add 5th photo back

### Expected Result:
✅ **PASS** - Can remove and re-add photos
❌ **FAIL** - See troubleshooting below

---

## ✅ Test #4: Photo Persistence (2 minutes)

### Steps:
1. Create a listing with 2-3 photos
2. Click "Create Listing"
3. **Verify listing shows photos**
4. **Refresh the page (F5)**
   - ✅ Photos still display
5. **Click into listing detail**
   - ✅ All photos show correctly
6. **Close browser completely**
7. **Reopen and go to app**
8. **Find the listing**
   - ✅ Photos still there!

### Expected Result:
✅ **PASS** - Photos persist permanently
❌ **FAIL** - See troubleshooting below

---

## ✅ Test #5: Photo File Validation (3 minutes)

### Test 5A: Large File
1. Create listing
2. Try uploading image over 5MB
3. **Expected:**
   - ❌ Error: "filename is too large. Max size is 5MB"

### Test 5B: Wrong File Type
1. Try uploading PDF or text file
2. **Expected:**
   - ❌ Error: "filename is not an image"

### Test 5C: Valid File
1. Upload normal JPG under 5MB
2. **Expected:**
   - ✅ Uploads successfully

### Expected Result:
✅ **PASS** - Validates files correctly
❌ **FAIL** - See troubleshooting below

---

## ✅ Test #6: Edit Listing Photos (3 minutes)

### Steps:
1. Find a listing you created
2. Click on it
3. Click "Edit" button (if available in UI)
4. **Or go to Dashboard → Find listing → Edit**
5. **Verify existing photos display**
   - ✅ All uploaded photos show
6. **Remove one photo** (click X)
7. **Add a new photo**
8. Click "Update Listing"
9. **Verify:**
   - ✅ Changes saved
   - ✅ New photo displays
   - ✅ Removed photo is gone

### Expected Result:
✅ **PASS** - Can edit listing photos
❌ **FAIL** - See troubleshooting below

---

## 🎯 Complete Test Scorecard

Mark each test:

- [ ] Test #1: Upload single photo ✅
- [ ] Test #2: Upload multiple (5) photos ✅
- [ ] Test #3: Remove and re-add photos ✅
- [ ] Test #4: Photos persist after refresh ✅
- [ ] Test #5: File validation works ✅
- [ ] Test #6: Edit listing photos ✅

### Scoring:
- **6/6** = 🎉 Perfect! Photos working 100%
- **5/6** = ✅ Great! Minor issue
- **4/6** = ⚠️ Good, but needs attention
- **3/6** = ❌ Needs troubleshooting
- **0-2/6** = 🚨 See troubleshooting section

---

## 🚨 Troubleshooting

### ❌ "Failed to upload image"

**Check these:**

1. **File size:**
   ```
   Right-click photo → Properties
   Must be < 5MB (5,000,000 bytes)
   ```

2. **File type:**
   ```
   Must be: .jpg, .jpeg, .png, .gif, .webp
   Not: .pdf, .doc, .txt, .heic
   ```

3. **Internet connection:**
   - Check WiFi is connected
   - Try smaller file first

4. **Browser console:**
   - Press F12
   - Click "Console" tab
   - Look for red errors
   - Copy and share error message

### ❌ Photos don't display after upload

**Try these:**

1. **Refresh the page** (F5)
2. **Check browser console** (F12)
3. **Look for errors like:**
   - `Failed to fetch` = Network issue
   - `403 Forbidden` = Supabase permissions
   - `CORS error` = Backend config issue

4. **Try different browser:**
   - Chrome, Firefox, or Edge

### ❌ Upload button does nothing

**Check:**

1. **Are you at the 5 photo limit?**
   - Remove a photo first

2. **Is button disabled?**
   - Wait for previous upload to finish

3. **Browser console errors:**
   - Press F12 → Console tab
   - Try clicking again
   - Note any errors

### ❌ Photos disappear after refresh

**This shouldn't happen!**

Photos are stored in Supabase Storage, not localStorage.

**If photos disappear:**

1. Check you're logged in as same user
2. Check that listing actually saved
3. Look for console errors about Supabase
4. Verify listing still exists in database

**To verify:**
```
Go to Dashboard → My Listings
→ Should see all your listings
→ Click on one → Photos should display
```

---

## 🔍 How Photo Upload Works

### Behind the Scenes:

1. **You click Upload button**
   - Triggers hidden file input
   
2. **You select photo**
   - Browser reads file into memory
   
3. **File is validated**
   - Checks size (<5MB)
   - Checks type (image)
   
4. **Converted to base64**
   - For API transmission
   
5. **Sent to backend**
   - POST to `/upload-image`
   
6. **Backend processes:**
   - Decodes base64
   - Generates unique filename
   - Uploads to Supabase Storage bucket
   
7. **Backend returns URL**
   - Signed URL (valid 1 year)
   
8. **Frontend displays photo**
   - Shows in listing form
   
9. **Listing saved**
   - Photo URLs stored in database
   
10. **Photos persist forever**
    - Stored in Supabase Storage
    - URLs in database
    - Accessible anytime

---

## 📊 Technical Specs

### Limits:
- **Max photos per listing:** 5
- **Max file size:** 5MB
- **Allowed formats:** JPG, JPEG, PNG, GIF, WebP
- **Storage location:** Supabase Storage
- **Bucket name:** `make-8ae6fee0-listings`
- **Access:** Private (signed URLs)
- **URL validity:** 1 year (auto-renewed)

### Upload Speed:
- **Small photo (<500KB):** 1-2 seconds
- **Medium photo (1-2MB):** 2-4 seconds
- **Large photo (3-5MB):** 4-8 seconds

*Times vary based on internet speed*

---

## ✅ Success Indicators

### You know it's working when:

1. ✅ Click Upload → File picker opens
2. ✅ Select photo → Spinner shows "Uploading..."
3. ✅ 2-5 seconds → Success toast appears
4. ✅ Photo displays in grid immediately
5. ✅ Can create listing successfully
6. ✅ Photo shows on listing card
7. ✅ Photo persists after refresh
8. ✅ Can upload up to 5 photos
9. ✅ Can remove photos with X button
10. ✅ Validation works (size/type checks)

### If ALL these work:
🎉 **PHOTO UPLOAD IS WORKING PERFECTLY!**

---

## 🎬 Quick Video Test Script

Follow this 60-second test:

```
0:00 - Open app, sign up/login
0:10 - Click "Create Listing"
0:15 - Fill title, description, category
0:25 - Scroll to Photos section
0:30 - Click Upload button
0:32 - Select a photo from device
0:35 - Watch spinner (Uploading...)
0:38 - See success toast
0:40 - Photo appears in grid!
0:45 - Click Upload again
0:47 - Select another photo
0:52 - Second photo uploads
0:55 - Both photos visible
1:00 - ✅ WORKING!
```

Record this test to verify it works! 📹

---

## 🎉 What Success Looks Like

```
You click Upload
  ↓
File picker opens
  ↓
Select photo from device
  ↓
Button shows "Uploading..." with spinner
  ↓
2-5 seconds pass
  ↓
Toast: "Image uploaded successfully!"
  ↓
Photo appears in grid
  ↓
Can see thumbnail clearly
  ↓
Can remove with X button
  ↓
Can upload up to 5 total
  ↓
Create listing
  ↓
Photo displays on listing
  ↓
Refresh page
  ↓
Photo still there!
  ↓
SUCCESS! ✅✅✅
```

---

## 📞 Still Having Issues?

1. Complete ALL tests above
2. Note which tests fail
3. Check browser console (F12)
4. Copy any error messages
5. Try different browser
6. Clear cache (Ctrl+Shift+Delete)
7. Review TROUBLESHOOTING.md

---

## 🚀 Ready to Launch?

Once photos work perfectly:

✅ Move to QUICK_START_TESTING.md
✅ Test all other features
✅ Follow HYBRID_LAUNCH_PLAN.md
✅ Deploy in 4-5 weeks!

**Photo uploads are the foundation of your marketplace!** 📸

Make sure they work perfectly before launching! ✨
