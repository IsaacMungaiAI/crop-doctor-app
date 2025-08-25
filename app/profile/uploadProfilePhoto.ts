import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

export async function pickAndUploadProfilePhoto(userId: string) {
  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) return null;

  const file = result.assets[0];
  const fileExt = file.uri.split(".").pop();
  const filePath = `${userId}.${fileExt}`;

  // ✅ Create FormData for RN upload
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: filePath,
    type: `image/${fileExt}`,
  } as any);

  // Upload to Supabase
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, formData, {
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError.message);
    throw uploadError;
  }

  // Update profile row in DB
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: filePath })
    .eq("id", userId);

  if (updateError) {
    console.error("Update profile error:", updateError.message);
    throw updateError;
  }

  return filePath;
}

