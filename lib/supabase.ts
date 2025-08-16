import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nyctjijugnpkkbeevqcf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Y3RqaWp1Z25wa2tiZWV2cWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0Nzc3ODIsImV4cCI6MjA3MDA1Mzc4Mn0.b4YcohDIVsJf06UPTg9C1gNkkYJdzKP58s1mEAvZF9g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

