
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://znczhhwdybvncxbbwtgt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuY3poaHdkeWJ2bmN4YmJ3dGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Nzk0MTMsImV4cCI6MjA2NTE1NTQxM30.BoTCyAWtSxzxNCx6TutwaGZMWBO6sCK46bfe9Kl6vtY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
