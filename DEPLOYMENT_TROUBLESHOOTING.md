# Deployment Troubleshooting Guide

## 🚨 Issues Found:
1. **401 Unauthorized for manifest.json** - Fixed with vercel.json configuration
2. **Login not working** - Likely due to missing environment variables and Supabase redirect URLs

## ✅ Fixes Applied:
1. Created `vercel.json` with proper routing and headers
2. Created `.env.production` with correct environment variables

## 🔧 Next Steps Required:

### 1. Set Environment Variables in Vercel
Go to your Vercel dashboard → Project Settings → Environment Variables and add:
```
VITE_SUPABASE_URL = https://pfipjhgtxgdzsenhqukx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmaXBqaGd0eGdkenNlbmhxdWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4OTA1MzUsImV4cCI6MjA1MjQ2NjUzNX0.XAfv8GwV-_QTaOH6MHX7mHXqjwPi5tVAaK3iCy8DdJQ
```

### 2. Configure Supabase Redirect URLs
In your Supabase dashboard → Authentication → URL Configuration, add:
- Site URL: `https://authandshake-ku5hlpmo6-cyberstalker07s-projects.vercel.app`
- Redirect URLs: 
  - `https://authandshake-ku5hlpmo6-cyberstalker07s-projects.vercel.app/**`
  - `https://authandshake-ku5hlpmo6-cyberstalker07s-projects.vercel.app/auth/callback`

### 3. Deploy Changes
After setting environment variables, redeploy your application.

### 4. Test Login
Try logging in on your deployed version after the above changes.

## 📞 If Issues Persist:
- Check browser console for specific error messages
- Verify environment variables are loaded in production
- Check Supabase logs in the dashboard