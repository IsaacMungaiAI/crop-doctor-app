import { useSession } from '@clerk/clerk-expo';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// You can also load these from environment variables if you prefer
const SUPABASE_URL = 'https://nyctjijugnpkkbeevqcf.supabase.co'; // Replace with your actual URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Y3RqaWp1Z25wa2tiZWV2cWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0Nzc3ODIsImV4cCI6MjA3MDA1Mzc4Mn0.b4YcohDIVsJf06UPTg9C1gNkkYJdzKP58s1mEAvZF9g'; // Replace with your actual anon/public API key



export const supabase = createClient(SUPABASE_URL,
    SUPABASE_ANON_KEY);

