import { supabase } from "@/lib/supabase";

export default async function getUserProfile() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw userError;
  }
  if (!user) {
    throw new Error("User not found");
  }
  // 2. Fetch profile row from your table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return null;
  }

  return profile;

}