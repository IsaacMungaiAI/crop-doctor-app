import { supabase } from "@/lib/supabase";
import {UserProfile} from "@/types/UserProfile"

export default async function getUserProfile(): Promise<UserProfile> {
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

  if (profile?.avatar_url) {
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("avatars")
    .createSignedUrl(profile.avatar_url, 60 * 60); // ✅ use path directly

  if (signedUrlData?.signedUrl) {
    profile.avatar_url = signedUrlData.signedUrl; // replace with actual signed URL
  }
}


  console.log("Signed Url: ", profile.avatar_url)

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    throw profileError;
  }

  return profile;

}