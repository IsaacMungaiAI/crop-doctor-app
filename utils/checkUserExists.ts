import { useAuth, useUser } from "@clerk/clerk-expo";
import { createClient } from "@supabase/supabase-js";

// ...existing code...
export async function ensureUserInSupabase(token: string, user: any) {
    const { getToken } = useAuth();


    
    if (!token || !user) return;

    const supabase = createClient(
        process.env.EXPO_PUBLIC_SUPABASE_URL!,
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }
    );

    // Check if user exists
    const { data: existingUser, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

    if (!existingUser) {
        // Insert user if not exists
        await supabase.from("users").insert({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? "",
            full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        });
    }

    if(error){
    console.log("Error ensuring user in Supabase:", error);
    }
}