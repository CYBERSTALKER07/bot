import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

// Simple database test component
export function DatabaseTest() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const runDatabaseTests = async () => {
    setTesting(true);
    const results: string[] = [];

    try {
      // Test 1: Check if user is authenticated
      if (user) {
        results.push(`✅ User authenticated: ${user.email}`);
      } else {
        results.push('❌ User not authenticated');
        setTestResults(results);
        setTesting(false);
        return;
      }

      // Test 2: Check if comments table exists
      try {
        const { error } = await supabase.from('comments').select('id').limit(1);
        if (error) {
          results.push(`❌ Comments table error: ${error.message}`);
        } else {
          results.push('✅ Comments table exists');
        }
      } catch (err) {
        results.push(`❌ Comments table not accessible: ${err.message}`);
      }

      // Test 3: Check if posts table exists
      try {
        const { error } = await supabase.from('posts').select('id').limit(1);
        if (error) {
          results.push(`❌ Posts table error: ${error.message}`);
        } else {
          results.push('✅ Posts table exists');
        }
      } catch (err) {
        results.push(`❌ Posts table not accessible: ${err.message}`);
      }

      // Test 4: Check if profiles table exists
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
          results.push(`❌ Profiles table error: ${error.message}`);
        } else {
          results.push('✅ Profiles table exists');
        }
      } catch (err) {
        results.push(`❌ Profiles table not accessible: ${err.message}`);
      }

      // Test 5: Check user permissions
      try {
        const { data, error } = await supabase.rpc('auth.uid');
        if (error) {
          results.push(`❌ Auth function error: ${error.message}`);
        } else {
          results.push(`✅ Auth function works: ${data}`);
        }
      } catch (err) {
        results.push(`❌ Auth function not accessible: ${err.message}`);
      }

    } catch (err) {
      results.push(`❌ General error: ${err.message}`);
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 my-4">
      <h3 className="font-bold mb-2">Database Connection Test</h3>
      <Button onClick={runDatabaseTests} disabled={testing} size="sm">
        {testing ? 'Testing...' : 'Run Database Tests'}
      </Button>
      
      {testResults.length > 0 && (
        <div className="mt-4 space-y-1">
          {testResults.map((result, index) => (
            <div key={index} className="text-sm font-mono">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}