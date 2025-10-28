# CORS Configuration & Troubleshooting Guide

## Overview
Cross-Origin Resource Sharing (CORS) issues occur when your frontend (running on one domain) tries to fetch data from another domain. This guide covers the CORS setup and fixes applied to your application.

## Issues Fixed

### 1. **Supabase Storage Media URLs - Credentials Mismatch**
**Problem:** 
- Storage URLs were using `credentials: 'same-origin'` even for public resources
- This caused browsers to block cross-origin image/video requests

**Solution Applied:**
- Created separate fetch helpers: `fetchPublicResource()` and `fetchWithSafariHeaders()`
- Public storage resources now use `credentials: 'omit'`
- Authenticated requests still use `credentials: 'same-origin'`
- Added `fetchMediaWithCors()` helper to automatically choose correct mode

**Files Modified:**
- `src/lib/supabase.ts` - Added proper credentials handling

### 2. **LinkedIn API CORS Errors**
**Problem:**
- LinkedIn API calls didn't explicitly set CORS mode
- Missing Accept headers caused preflight request failures
- No error handling for CORS-specific failures

**Solution Applied:**
- Explicitly set `mode: 'cors'` for all LinkedIn API requests
- Added `credentials: 'omit'` for cross-origin API calls
- Added comprehensive error handling and logging
- Improved error messages to include response body

**Files Modified:**
- `src/lib/linkedin-api.ts` - Added CORS headers and error handling

### 3. **Vite Dev Server Missing CORS Configuration**
**Problem:**
- No CORS proxy for development environment
- Local API calls would fail in production due to different domain

**Solution Applied:**
- Added CORS proxy configuration to `vite.config.ts`
- Dev server now adds CORS headers to all responses
- Optional API proxy for backend development

**Files Modified:**
- `vite.config.ts` - Added server CORS configuration

## CORS Headers Explained

### For Public Resources (Storage URLs, Images, Videos)
```javascript
{
  mode: 'cors',           // Enable CORS
  credentials: 'omit',    // Don't send cookies/auth
  headers: {
    'Accept': 'application/json, text/plain, */*',
  }
}
```

### For Authenticated Requests (Same Domain)
```javascript
{
  mode: 'cors',           // Enable CORS
  credentials: 'same-origin', // Send cookies if same domain
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Authorization': 'Bearer token'
  }
}
```

### For Cross-Origin API Calls (LinkedIn, External APIs)
```javascript
{
  mode: 'cors',           // Enable CORS
  credentials: 'omit',    // Don't send credentials for cross-origin
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer token'
  }
}
```

## How to Test CORS Issues

### 1. **Check Browser Console**
Open DevTools (F12) → Console tab and look for errors like:
- `Access to XMLHttpRequest at 'X' from origin 'Y' has been blocked by CORS policy`
- `The server responded with a status of 401 (Unauthorized)`
- `Failed to fetch`

### 2. **Check Network Tab**
Open DevTools → Network tab:
1. Look for failed requests (red X)
2. Click on the request
3. Check Response Headers for:
   - `Access-Control-Allow-Origin: *` (or your domain)
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`

### 3. **Test Specific APIs**

**Test Supabase Storage:**
```javascript
// In browser console
fetch('YOUR_STORAGE_URL', {
  mode: 'cors',
  credentials: 'omit'
}).then(r => r.status).catch(e => console.error(e))
```

**Test LinkedIn API:**
```javascript
// In browser console
fetch('https://api.linkedin.com/v2/jobs/123', {
  method: 'GET',
  mode: 'cors',
  credentials: 'omit',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json'
  }
}).then(r => r.json()).catch(e => console.error(e))
```

## Common CORS Issues & Solutions

### Issue: "No 'Access-Control-Allow-Origin' Header"
**Cause:** Server doesn't allow requests from your domain

**Solutions:**
- ✅ **Supabase Storage:** Already configured as public - verify bucket is public
- ✅ **LinkedIn API:** Expected - use OAuth token in Authorization header
- ✅ **Your Backend:** Add CORS middleware (see production setup below)

### Issue: "Credentials Mode Mismatch"
**Cause:** Using `credentials: 'include'` or `'same-origin'` for cross-origin requests

**Solution:** Use `credentials: 'omit'` for cross-origin requests
```javascript
// ❌ WRONG
fetch('https://api.linkedin.com/v2/jobs', {
  credentials: 'include' // This will fail!
})

// ✅ CORRECT
fetch('https://api.linkedin.com/v2/jobs', {
  credentials: 'omit'  // Correct for cross-origin
})
```

### Issue: "Preflight Request Failed"
**Cause:** OPTIONS request returned error, usually 401/403

**Solution:** 
- Check authorization headers on OPTIONS requests
- Some APIs require auth on preflight (rare)
- Usually means credentials mode is wrong

### Issue: Images/Videos Not Loading
**Cause:** Storage URL fetch blocked by CORS

**Solutions:**
1. Use the `fetchPublicResource()` helper from `supabase.ts`
2. Ensure storage bucket is public (✅ Already configured)
3. Check browser console for specific error message

## Supabase Storage Configuration

All storage buckets are now configured for public access:

### Public Buckets (Anyone can read):
- `avatars` - User profile pictures
- `cover-images` - Profile cover images
- `post-images` - Post content images
- `videos` - Video content
- `company-assets` - Company logos and banners
- `event-banners` - Event images

### Private Buckets (Only owner can read):
- `documents` - PDFs and sensitive files (requires authentication)

### RLS Policies Applied:
- ✅ `Anyone can view` - Public read access
- ✅ `Users can upload their own` - User-specific write access
- ✅ `Users can delete their own` - User-specific delete access

## Development vs. Production

### Development (localhost)
- Vite server adds CORS headers automatically
- No additional configuration needed
- Can test with different origins using proxy settings

### Production (Vercel/Deployment)
1. **Supabase Storage:** Works automatically (already public)
2. **LinkedIn API:** Works automatically (external API)
3. **Your Backend API:** Add CORS middleware:

```javascript
// If using Express.js
const cors = require('cors');
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Or more permissive during development:
app.use(cors());
```

## Debugging Checklist

- [ ] Check browser console for CORS errors
- [ ] Open DevTools Network tab and check response headers
- [ ] Verify credentials mode matches request type:
  - `omit` for cross-origin APIs
  - `same-origin` for same-domain authenticated requests
- [ ] Ensure storage buckets are public in Supabase
- [ ] Verify Accept headers are set correctly
- [ ] Test with curl to isolate frontend issues:
  ```bash
  curl -H "Accept: application/json" \
       -H "Authorization: Bearer YOUR_TOKEN" \
       https://api.linkedin.com/v2/jobs
  ```

## Files With CORS Configuration

1. **`src/lib/supabase.ts`**
   - `fetchPublicResource()` - For public storage URLs
   - `fetchWithSafariHeaders()` - For authenticated requests
   - `fetchMediaWithCors()` - Auto-detect and handle correctly

2. **`src/lib/linkedin-api.ts`**
   - All LinkedIn API calls now have proper CORS headers
   - Better error handling and logging

3. **`vite.config.ts`**
   - Dev server CORS headers
   - Optional API proxy configuration

4. **`database/create-storage-buckets.sql`**
   - Storage bucket RLS policies
   - Public read access for all user-facing buckets

## Next Steps

1. ✅ Apply code changes (already done)
2. ⏳ Run application: `npm run dev`
3. ⏳ Test media loading in browser
4. ⏳ Check console for any remaining CORS errors
5. ⏳ If still having issues, enable more detailed logging:

```javascript
// Add to src/main.tsx or relevant component
if (import.meta.env.DEV) {
  // Log all fetch requests in development
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('FETCH:', args[0], args[1]);
    return originalFetch.apply(this, args);
  };
}
```

## Common Error Messages & What They Mean

| Error | Meaning | Solution |
|-------|---------|----------|
| `Access to XMLHttpRequest blocked by CORS` | Server doesn't allow your domain | Check origin or use proxy |
| `Credentials mode is 'include' but origin` | Wrong credentials for cross-origin | Use `credentials: 'omit'` |
| `OPTIONS 401 Unauthorized` | Preflight failed | Check auth headers or credentials mode |
| `Failed to fetch` | Network error or CORS (check console) | See console for details |
| `TypeError: Failed to fetch` | Network or CORS issue | Check Network tab in DevTools |

## Additional Resources

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Supabase: CORS](https://supabase.com/docs/guides/api/cors)
- [Fetch API: Credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
- [Supabase Storage: Public/Private](https://supabase.com/docs/guides/storage/security)

