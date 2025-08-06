// lib/supabaseWithToken.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nyctjijugnpkkbeevqcf.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

export const createSupabaseClientWithToken = (token: string) => {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
};
