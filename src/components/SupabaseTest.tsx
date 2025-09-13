import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

// Enhanced test component to diagnose the 406 error
export function SupabaseTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    const results: string[] = [];

    try {
      // Test 1: Check Supabase connection
      results.push('🔄 Testing Supabase connection...');
      results.push(`📍 URL: ${import.meta.env.VITE_SUPABASE_URL}`);
      results.push(`🔑 Key: ${import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...`);

      // Test 2: Test direct auth
      results.push('🔄 Testing authentication state...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        results.push(`❌ Session error: ${sessionError.message}`);
      } else if (session) {
        results.push(`✅ User authenticated: ${session.user.email}`);
        results.push(`🆔 User ID: ${session.user.id}`);
      } else {
        results.push('ℹ️ No active session');
      }

      // Test 3: Test profiles table access
      results.push('🔄 Testing profiles table access...');
      try {
        const { data: profiles, error: profilesError, status, statusText } = await supabase
          .from('profiles')
          .select('id, username, role')
          .limit(1);

        if (profilesError) {
          results.push(`❌ Profiles error (${status}): ${profilesError.message}`);
          results.push(`📊 Status text: ${statusText}`);
          
          // Specific 406 diagnosis
          if (status === 406) {
            results.push('🔍 406 Error Analysis:');
            results.push('   • Row Level Security (RLS) is likely enabled');
            results.push('   • No RLS policies allow access to profiles table');
            results.push('   • Need to create RLS policies or disable RLS');
          }
        } else {
          results.push(`✅ Profiles accessible. Found ${profiles?.length || 0} records`);
          if (profiles && profiles.length > 0) {
            results.push(`   First record: ${JSON.stringify(profiles[0])}`);
          }
        }
      } catch (fetchError) {
        results.push(`❌ Fetch error: ${fetchError}`);
      }

      // Test 4: Test creating a user (if not authenticated)
      if (!session) {
        results.push('🔄 Testing user creation...');
        try {
          const testEmail = `test-${Date.now()}@example.com`;
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: 'test123456',
          });

          if (signUpError) {
            results.push(`❌ Sign up error: ${signUpError.message}`);
          } else {
            results.push(`✅ Test user created: ${signUpData.user?.email}`);
            results.push(`🔄 Cleaning up test user...`);
          }
        } catch (error) {
          results.push(`❌ Sign up failed: ${error}`);
        }
      }

      // Test 5: Test with service role key (if available)
      results.push('🔄 Testing RLS bypass...');
      results.push('ℹ️ This requires service role key (not available in frontend)');

    } catch (error) {
      results.push(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setTestResults(results);
    setLoading(false);
  };

  const fixRLS = async () => {
    setTestResults(['🔄 Attempting to fix RLS policies...']);
    
    // This won't work from frontend, but we'll show the SQL needed
    const rlsPolicies = [
      '-- SQL to run in Supabase SQL Editor:',
      '',
      '-- 1. Enable RLS on profiles table',
      'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;',
      '',
      '-- 2. Allow users to read their own profile',
      'CREATE POLICY "Users can view own profile" ON public.profiles',
      '  FOR SELECT USING (auth.uid() = id);',
      '',
      '-- 3. Allow users to update their own profile', 
      'CREATE POLICY "Users can update own profile" ON public.profiles',
      '  FOR UPDATE USING (auth.uid() = id);',
      '',
      '-- 4. Allow users to insert their own profile',
      'CREATE POLICY "Users can insert own profile" ON public.profiles',
      '  FOR INSERT WITH CHECK (auth.uid() = id);',
      '',
      '-- 5. OR disable RLS entirely (less secure)',
      '-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;'
    ];

    setTestResults(rlsPolicies);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        🔧 Supabase 406 Error Diagnostics
      </h3>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Diagnose Issues'}
        </button>
        
        <button
          onClick={fixRLS}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Show RLS Fix
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-1 bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {testResults.map((result, index) => (
            <div key={index} className="text-gray-700 dark:text-gray-300">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}