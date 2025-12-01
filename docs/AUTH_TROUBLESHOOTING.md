# Authentication Errors - Troubleshooting Guide

## Current Errors

You're seeing these errors:
- ❌ **422 error on /signup** - Sign up is failing
- ❌ **400 error on /token** - Token validation failing
- ❌ **404 errors on google.com/adobe.com** - OAuth providers not configured

## Root Cause

The errors indicate that Supabase email authentication is not properly configured in your project.

## 🔧 Fix Steps

### Step 1: Configure Supabase Email Authentication

1. **Go to your Supabase Dashboard**: https://wmpbjarrhbnvjzlszscc.supabase.co
2. **Navigate to**: Authentication → Providers
3. **Find "Email" provider** and click to expand
4. **Enable the following settings**:
   - ✅ **Enable Email provider** - Turn this ON
   - ✅ **Confirm email** - Turn this OFF (for development)
   - ✅ **Secure email change** - Turn this OFF (for development)
   - ✅ **Enable sign ups** - Turn this ON

5. **Click Save**

### Step 2: Configure Email Templates (Optional but Recommended)

1. **Go to**: Authentication → Email Templates
2. **For "Confirm signup"**:
   - Set "Confirmation URL" to: `{{ .SiteURL }}/auth/callback`
3. **For "Magic Link"**:
   - Set "Magic Link URL" to: `{{ .SiteURL }}/auth/callback`
4. **Click Save**

### Step 3: Configure Site URL

1. **Go to**: Authentication → URL Configuration
2. **Set "Site URL"** to: `http://localhost:5173` (for development)
3. **Add to "Redirect URLs"**:
   - `http://localhost:5173/**`
   - `http://localhost:5173/auth/callback`
4. **Click Save**

### Step 4: Verify Database Tables

Run the following migrations in order in your Supabase SQL Editor:

#### 1. Fix Profiles Table
```sql
-- Run: database/fix-profiles-table.sql
```

#### 2. Fix Posts Table
```sql
-- Run: database/fix-posts-table.sql
```

#### 3. Fix Comments Table
```sql
-- Run: database/complete-comments-setup.sql
```

### Step 5: Restart Your Dev Server

After making these changes:

```bash
# Stop your dev server (Ctrl+C)
# Then restart it
npm run dev
```

## 🧪 Test Authentication

After completing the above steps, test the following:

### Test Sign Up:
1. Go to `http://localhost:5173/login`
2. Click "Sign Up"
3. Fill in:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: test123456
   - Role: Student
4. Click "Create Account"
5. **Expected Result**: Should redirect to profile setup page

### Test Sign In:
1. Go to `http://localhost:5173/login`
2. Enter the credentials you just created
3. Click "Sign in"
4. **Expected Result**: Should redirect to feed

## 🔍 Common Issues & Solutions

### Issue: "User already registered" but can't sign in
**Solution**: The user exists but email confirmation is required. Either:
- Check the email for confirmation link
- OR disable email confirmation in Supabase settings (Step 1 above)

### Issue: Still getting 400 errors
**Solution**: 
1. Clear browser cache and cookies
2. Clear Supabase local storage:
   ```javascript
   // In browser console, run:
   localStorage.clear();
   sessionStorage.clear();
   ```
3. Restart dev server

### Issue: "Invalid login credentials"
**Solution**: 
1. Make sure email confirmation is disabled (see Step 1)
2. Try resetting password in Supabase dashboard
3. Create a new test user

### Issue: 404 errors for google.com/adobe.com
**Solution**: These are for OAuth providers (Google Sign-in, etc.). You can ignore these unless you want to add social login. To remove these errors:
1. Go to: Authentication → Providers
2. Disable any OAuth providers you're not using

## 📊 Verify Everything is Working

Run this query in Supabase SQL Editor to check your setup:

```sql
-- Check if profiles table exists and has correct structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if posts table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;

-- Check if comments table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 🎯 Quick Checklist

Before testing, make sure:
- [ ] Email provider is enabled in Supabase
- [ ] Email confirmation is disabled (for development)
- [ ] Sign ups are enabled
- [ ] Site URL is set to http://localhost:5173
- [ ] Redirect URLs include localhost
- [ ] All three migration scripts have been run
- [ ] Dev server has been restarted
- [ ] Browser cache has been cleared

## 💡 If Still Not Working

If you're still having issues after following all steps:

1. **Check Supabase Logs**:
   - Go to: Logs → Auth Logs
   - Look for specific error messages

2. **Verify Environment Variables**:
   - Make sure `.env` file has correct values
   - Restart dev server after any changes to `.env`

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Look at Console and Network tabs
   - Share any specific error messages for further help

4. **Test with Supabase Studio**:
   - Try creating a user directly in Supabase dashboard
   - Go to: Authentication → Users
   - Click "Add User"
   - Create a test user manually

## 📞 Need More Help?

If you're still experiencing issues, provide:
1. Screenshot of Supabase Auth Settings
2. Console errors from browser DevTools
3. Which step failed
4. Any specific error messages

Your authentication should now work perfectly! 🎉
