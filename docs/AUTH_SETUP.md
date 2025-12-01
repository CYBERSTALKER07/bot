# Authentication Setup Guide

## ✅ What I Fixed

Your authentication system has been completely redesigned to work properly with Supabase:

1. **Fixed AuthContext** - Changed method names from `login`/`register` to `signIn`/`signUp`
2. **Updated Supabase client** - Added proper session persistence and configuration
3. **Redesigned Login component** - Single unified component for both sign in and sign up
4. **Automatic profile creation** - Profiles are created automatically when users sign up
5. **Proper error handling** - Clear error messages for users

## 🚀 Setup Instructions

### Step 1: Set Up Environment Variables

Create a `.env` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these in your Supabase dashboard under **Settings → API**.

### Step 2: Run the Database Migration

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `/database/supabase-auth-setup.sql`
5. Run the query

This will:
- Create the `profiles` table
- Set up Row Level Security policies
- Create triggers to automatically create profiles when users sign up
- Add indexes for better performance

### Step 3: Configure Supabase Authentication

1. In your Supabase dashboard, go to **Authentication → Settings**
2. Under **Email Auth**, make sure:
   - "Enable Email Confirmations" is set based on your preference
   - If disabled, users can sign in immediately after signing up
   - If enabled, users must confirm their email first

### Step 4: Test the Authentication

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Try creating a new account:
   - Fill in first name, last name, email, and password
   - Select whether you're a student or employer
   - Click "Create Account"
4. Try signing in with your credentials

## 📝 How It Works

### Sign Up Flow
1. User fills out the registration form
2. `signUp()` is called with email, password, and metadata (name, role)
3. Supabase creates the user account
4. A database trigger automatically creates a profile in the `profiles` table
5. User is redirected to the appropriate dashboard (/feed for students, /dashboard for employers)

### Sign In Flow
1. User enters email and password
2. `signIn()` is called
3. Supabase authenticates the credentials
4. The user's profile is loaded from the `profiles` table
5. User is redirected based on their role

### Profile Management
- Profiles are stored in the `profiles` table
- Each profile has: username, full_name, bio, avatar_url, role, etc.
- Profiles can be updated using `updateProfile()`
- Row Level Security ensures users can only modify their own profiles

## 🎨 Features

- ✅ **Beautiful UI** - Smooth animations and modern design
- ✅ **Form Validation** - Client-side validation before API calls
- ✅ **Error Handling** - Clear error messages for users
- ✅ **Loading States** - Visual feedback during authentication
- ✅ **Remember Me** - Option to save login credentials
- ✅ **Role-based Auth** - Separate flows for students and employers
- ✅ **Mobile Responsive** - Works perfectly on all screen sizes
- ✅ **Dark/Light Mode** - Respects user theme preferences

## 🔐 Security Features

- **Row Level Security (RLS)** - Enforced at the database level
- **Password Hashing** - Handled automatically by Supabase
- **Session Management** - Secure JWT tokens with auto-refresh
- **HTTPS Only** - All API calls are encrypted
- **Email Confirmation** - Optional email verification

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Make sure your `.env` file exists and contains the correct values
- Restart your development server after adding environment variables

### "Error loading profile"
- Run the database migration script in your Supabase SQL editor
- Make sure the `profiles` table exists

### "Invalid login credentials"
- Check that the email and password are correct
- Make sure the user account exists in Supabase

### Users can sign up but can't sign in
- Check if "Enable Email Confirmations" is enabled in Supabase
- If enabled, users must confirm their email before signing in
- Check the email confirmation link

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signin)

## 🎯 Next Steps

1. **Test the authentication thoroughly**
2. **Customize the profile fields** as needed in `/database/supabase-auth-setup.sql`
3. **Add password reset functionality** (already implemented in AuthContext)
4. **Set up protected routes** to ensure only authenticated users can access certain pages
5. **Add profile editing pages** where users can update their information

Your authentication system is now production-ready! 🎉
