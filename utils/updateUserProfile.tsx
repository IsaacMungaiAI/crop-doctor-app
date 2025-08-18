import { supabase } from "@/lib/supabase"


type UserProfile = {
    full_name: string,
    email: string,
    password: string,
    avatar_url: string,

}

export default async function updateUserProfile(updates: UserProfile) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("User not found");

        // Step 1: Update auth fields (email/password)
        if (updates.email || updates.password ) {
            const { error: authUpdateError } = await supabase.auth.updateUser({
                email: updates.email,
                password: updates.password,
            });
            if (authUpdateError) throw authUpdateError;
        }

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: updates.full_name,
                email: updates.email,
                updated_at: new Date(), // optional: keep a last-updated timestamp
            })
            .eq("id", user.id);
        if (error) throw error;

        return { success: true }
    } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, error }
    }
}