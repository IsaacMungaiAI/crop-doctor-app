import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

export async function pickAndUploadProfilePhoto(userId: string) {
  // Step 1: Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) return null;

  const file = result.assets[0];
  const fileExt = file.uri.split(".").pop();
  const filePath = `${userId}.${fileExt}`; // ✅ just the file path

  // Step 2: Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, {
      uri: file.uri,
      type: "image/*",
      name: filePath,
    } as any, { upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError.message);
    throw uploadError;
  }

  // Step 3: Update profile row with file path (NOT full URL)
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: filePath }) // ✅ store only path
    .eq("id", userId);

  if (updateError) {
    console.error("Update profile error:", updateError.message);
    throw updateError;
  }

  return filePath; // return path, not full URL
}
