import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";
import { useUser } from "@clerk/clerk-expo"; // to get Clerk user info

export type UserProfile = {
  user_id: string; // this should match Clerk user.id
  full_name: string | null;
  email: string | null;
  image_url: string | null;
};

/**
 * Fetch the logged-in user's profile (from Supabase `users` table).
 * 
 * @param clerkUserId The Clerk user id (must be passed in from frontend)
 */
export async function getUserProfile(
  clerkUserId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("user_id, full_name, email, image_url")
    .eq("user_id", clerkUserId)
    .single();

  if (error) {
    Alert.alert("Error", error.message);
    console.error("Error fetching user profile data:", error);
    return null;
  }

  return data as UserProfile;
}

/**
 * Update the logged-in user's profile in Supabase.
 * 
 * @param clerkUserId The Clerk user id
 * @param updates Fields to update in the `users` table
 */
export async function updateUserProfile(
  clerkUserId: string,
  updates: { full_name?: string; email?: string; image_url?: string }
): Promise<{ data: UserProfile | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    Alert.alert("Error", error.message);
    console.error("Error updating user profile:", error);
    return { data: null, error };
  }

  return { data: data as UserProfile, error: null };
}
