# Authentication Testing Guide for SupplyWise

## Overview
SupplyWise now has real persistent authentication using Supabase Auth. Users stay logged in even after page refreshes.

## How to Test

### Creating a New Account (Sign Up)
1. When you first load the app, you'll see the welcome screens
2. Click through the welcome screens (or skip)
3. You'll be taken to the **Sign Up** form
4. Fill in the required fields:
   - **Name**: Your full name
   - **Email**: Any valid email (doesn't need to be real for testing)
   - **Password**: At least 6 characters
   - **Business Type**: Choose from the dropdown (Builder, Manufacturer, Contractor, etc.)
   - **Location**: Optional
5. Click "Create Account"
6. You'll be automatically signed in and taken to the marketplace

### Signing In (Existing Account)
1. If you already created an account, click "Already have an account? **Sign in**"
2. Enter your **email** and **password**
3. Click "Sign In"
4. You'll be signed in and taken to the marketplace

## Important Notes

### "Invalid login credentials" Error
If you see this error, it means:
- **You don't have an account yet** - Click "Create one here" to sign up
- **Wrong email or password** - Double-check your credentials
- **You're trying to sign in before signing up** - Create an account first!

### First-Time Users
- **Always sign up first** if you're new
- The sign-in form is only for users who already created an account
- You cannot sign in until you've created an account

### Persistent Login
- Once logged in, you'll **stay logged in** even if you refresh the page
- Your session is stored securely and auto-refreshes
- To log out, click your profile avatar → "Sign Out"

### Email Confirmation
- Email confirmation is **disabled** for this prototype
- Accounts are automatically confirmed when created
- You can sign in immediately after creating an account

## Testing Flow

### Test Case 1: New User
```
1. Load app → See welcome screens
2. Click "Next" through welcome screens
3. Fill out sign-up form with new email
4. Click "Create Account"
5. ✅ Should be automatically signed in
6. Refresh page
7. ✅ Should still be signed in
```

### Test Case 2: Returning User
```
1. Load app → See welcome screens (if not logged in)
2. Click "Already have an account? Sign in"
3. Enter email and password from previous signup
4. Click "Sign In"
5. ✅ Should be signed in
6. Refresh page
7. ✅ Should still be signed in
```

### Test Case 3: Sign Out & Sign In Again
```
1. While signed in, click profile avatar
2. Click "Sign Out"
3. ✅ Should be taken back to welcome/sign-in screen
4. Click "Already have an account? Sign in"
5. Sign in with same credentials
6. ✅ Should work without issues
```

## Common Issues & Solutions

### Issue: "Invalid login credentials"
**Solution**: You need to create an account first! Click "Create one here" on the sign-in page.

### Issue: Can't remember if I created an account
**Solution**: Try signing in. If you get "Invalid login credentials", create a new account with a different email.

### Issue: Want to start fresh
**Solution**: 
1. Sign out if logged in
2. Create a new account with a different email
3. Each email can only have one account

### Issue: Stuck on loading screen
**Solution**: 
1. Check browser console for errors
2. Try refreshing the page
3. Clear browser cache and reload

## Developer Notes

### Authentication Flow
1. **Sign Up**: Server creates user with Supabase Auth → Auto sign-in → Fetch profile → Store session
2. **Sign In**: Supabase Auth validates → Fetch profile → Store session
3. **Session Check**: On app load, check for existing session → Fetch profile if session exists
4. **Sign Out**: Clear Supabase session → Return to welcome screen

### Session Storage
- Sessions are stored in browser localStorage
- Tokens auto-refresh before expiration
- Sessions persist across page reloads and browser restarts

### Backend
- User creation: `/make-server-8ae6fee0/signup`
- Get user profile: `/make-server-8ae6fee0/me`
- Uses Supabase Service Role Key (server-side only)
- Email confirmation auto-enabled for testing

## Quick Test Credentials
For quick testing, you can create accounts like:
- Email: `test1@supplywise.com`, Password: `password123`
- Email: `test2@supplywise.com`, Password: `password123`
- Email: `seller@supplywise.com`, Password: `password123`
- Email: `buyer@supplywise.com`, Password: `password123`

Remember: These are just examples. Create your own accounts with any email/password!
