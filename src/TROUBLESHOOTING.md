# SupplyWise Troubleshooting Guide 🔧

Quick fixes for common issues.

---

## Photo Upload Issues

### ❌ "Failed to upload image"

**Causes:**
- File too large (>5MB)
- Wrong file type
- Network issue
- Supabase storage not configured

**Solutions:**
1. **Check file size:**
   - Right-click image → Properties
   - Must be under 5MB
   - Use image compressor: tinypng.com

2. **Check file type:**
   - Must be: JPG, JPEG, PNG, GIF, WebP
   - Not: PDF, DOC, ZIP, etc.

3. **Try different photo:**
   - Use a smaller test image first
   - Phone photos are usually fine

4. **Check browser console:**
   - Press F12
   - Look for red error messages
   - Share the error for help

### ❌ Photo uploads but doesn't display

**Solutions:**
1. Refresh the page
2. Check that the listing was saved
3. View the listing detail page
4. Check browser console for image URL errors

### ❌ "Maximum 5 images allowed"

**This is normal!** Each listing can have up to 5 photos.
- Delete an existing photo first
- Or create a new listing for more items

---

## Listing Creation Issues

### ❌ "Please fill in all required fields"

**Required fields marked with *:**
- Title
- Description
- Category
- Condition
- Quantity
- Location
- At least 1 photo
- Price (unless enabling "Make an Offer")

**Solution:** Scroll through form and fill in missing fields.

### ❌ Listing doesn't appear after creation

**Solutions:**
1. Wait 2-3 seconds and refresh
2. Check that success message appeared
3. Go to Dashboard → My Listings
4. Check browser console for errors

### ❌ Can't edit or delete listing

**Solutions:**
1. Make sure you're logged in as the creator
2. Go to the listing detail page
3. Look for Edit/Delete buttons
4. Refresh if buttons don't appear

---

## Login & Account Issues

### ❌ "Invalid credentials"

**Solutions:**
1. Check username/email spelling
2. Check password (case-sensitive)
3. Try different username
4. Create new account if forgotten

### ❌ Logged out after refresh

**This shouldn't happen!** 
- Login uses localStorage for persistence
- Check if browser is in Private/Incognito mode
- Check browser settings for localStorage

### ❌ Can't sign up

**Solutions:**
1. Make sure all fields are filled
2. Choose a unique username
3. Password must be 6+ characters
4. Check browser console for errors

---

## Search & Filter Issues

### ❌ Search returns no results

**Solutions:**
1. Try simpler search terms (e.g., "wood" not "reclaimed oak wood planks")
2. Check spelling
3. Clear all filters first
4. Make sure listings exist in that category

### ❌ Filters not working

**Solutions:**
1. Refresh the page
2. Clear all filters and try again
3. Make sure you have listings that match
4. Try different filter combinations

---

## Subscription Issues

### ❌ Subscription dialog won't close

**Solutions:**
1. Click "Pay-per-listing" or "Annual" option
2. Click outside the dialog (on background)
3. Press ESC key
4. Refresh page as last resort

### ❌ Still shows "Free" after subscribing

**Solution:**
- Check Dashboard → Shows "Subscription: Annual" or "Pay-per-listing"
- Refresh page
- Try creating another listing

### ❌ Can't create 4th listing

**This is correct!**
- Free users: 3 listings max
- Must upgrade to create more
- Choose subscription option when prompted

---

## Performance Issues

### ❌ App is slow

**Solutions:**
1. **Check internet connection**
   - Slow connection = slow uploads
   
2. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

3. **Close other tabs:**
   - Browser using too much memory

4. **Reduce image sizes:**
   - Compress before uploading
   - Use tinypng.com or similar

5. **Try different browser:**
   - Chrome, Firefox, or Edge

### ❌ Images load slowly

**Solutions:**
1. Check internet speed
2. Use smaller image files
3. Wait for initial load (images cached after)

---

## Mobile Issues

### ❌ Layout broken on mobile

**Solutions:**
1. Rotate phone (portrait/landscape)
2. Zoom out if zoomed in
3. Try different browser (Chrome, Safari)
4. Close and reopen browser

### ❌ Can't upload photos on mobile

**Solutions:**
1. Allow camera/photo access in browser settings
2. Try taking photo directly vs. uploading from gallery
3. Make sure photo isn't too large
4. Try different browser app

### ❌ Buttons too small on mobile

**This should be fixed in responsive design.**
- Try rotating device
- Zoom in slightly
- Report the specific button location

---

## Data Issues

### ❌ Data disappeared after refresh

**Shouldn't happen!** Data is stored in Supabase.

**If it does:**
1. Check that you're logged in
2. Check browser console for API errors
3. Try logging out and back in
4. Data may be under different user account

### ❌ Changes didn't save

**Solutions:**
1. Make sure you clicked "Save" or "Update"
2. Wait for success message
3. Check for error messages
4. Try again with simpler changes

---

## Browser Console Errors

### How to Check Console:

**Chrome/Edge:**
- Press F12
- Click "Console" tab
- Look for red error messages

**Firefox:**
- Press F12
- Click "Console" tab

**Safari:**
- Develop → Show JavaScript Console

### Common Error Messages:

#### `Failed to fetch`
**Meaning:** Can't connect to backend server
**Solution:** 
- Check internet connection
- Backend might be starting (wait 30 seconds)
- Refresh page

#### `401 Unauthorized`
**Meaning:** Not logged in or session expired
**Solution:**
- Log out and log back in
- Check Supabase credentials

#### `CORS error`
**Meaning:** Backend security issue
**Solution:**
- This is a backend configuration issue
- Should be already fixed in server code

#### `Network error`
**Meaning:** Internet connection issue
**Solution:**
- Check WiFi/connection
- Try different network
- Wait and retry

---

## Getting Help

### Before Asking for Help:

1. ✅ Try the solutions above
2. ✅ Check browser console (F12)
3. ✅ Try on different browser
4. ✅ Clear cache and cookies
5. ✅ Refresh the page

### When Asking for Help, Include:

1. **What you were trying to do**
   - "I was creating a listing..."
   
2. **What happened**
   - "The photo won't upload..."
   
3. **Error messages**
   - Copy from browser console
   
4. **Screenshots**
   - Show the problem
   
5. **Your browser**
   - Chrome 120, Firefox 121, etc.
   
6. **Your device**
   - Windows 11, Mac, iPhone, Android

---

## Emergency Fixes

### 🚨 Nothing works!

**Nuclear option:**
1. Clear ALL browser data (cache, cookies, localStorage)
2. Close browser completely
3. Reopen browser
4. Go to app
5. Create new account
6. Test basic features

### 🚨 Lost all data!

**Data is in Supabase:**
- If stored correctly, data is permanent
- Try logging in again
- Check you're using correct account
- Data is NOT in localStorage (that's just login)

### 🚨 Can't access app at all!

1. Check internet connection
2. Try different browser
3. Try incognito/private mode
4. Clear cache
5. Wait 5 minutes and try again (server might be restarting)

---

## Known Limitations

### Current Version:
- ✅ **Photos**: Working! Real uploads to Supabase
- ✅ **Listings**: Persist permanently in database
- ✅ **Search**: Working
- ⚠️ **Messaging**: UI only (backend not connected)
- ⚠️ **Transactions**: UI only (backend not connected)
- ⚠️ **Payments**: Not implemented (Stripe integration needed)
- ⚠️ **Email**: No email notifications yet

These are normal for a prototype! Can be added later.

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Photo won't upload | Check size <5MB, try smaller photo |
| Can't create listing | Fill all required fields (*) |
| Logged out randomly | Use regular browser (not private mode) |
| Search no results | Use simpler keywords |
| Slow performance | Clear cache, compress images |
| Mobile broken | Rotate device, try different browser |
| Data missing | Log out and log back in |
| Console errors | F12 → Copy error → Ask for help |

---

## Still Stuck?

**Don't panic!** 🙂

Most issues are simple fixes. Go through the troubleshooting steps above, check the browser console, and provide details when asking for help.

Your SupplyWise app is working great - we'll fix any issues quickly! 💪
