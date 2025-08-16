// utils/checkUserExists.ts
import { supabase } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export const checkUserExists = async (userId: string, supabaseClient: any) => {
    const { data, error } = await supabaseClient
        .from("users")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (error || !data) {
        console.warn("User check error:", error?.message);
        return false;
    }

    console.log("Checking user with id:", userId);
    console.log("Supabase returned:", data, error);


    return true;
};
