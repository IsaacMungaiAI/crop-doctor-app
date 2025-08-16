// utils/createUser.ts
import { supabase } from "@/lib/supabase";

export const createUser = async ({
  userId,
  email,
  fullName,
  imageUrl,
  avatarUrl
}: {
  userId: string;
  email: string;
  fullName: string;
  imageUrl: string;
  avatarUrl: string;
}, supabaseClient: any) => {
  const { data, error } = await supabaseClient.from("users").insert([
    {
      user_id: userId,
      email,
      full_name: fullName,
      image_url: imageUrl,
      avatar_url: avatarUrl,
    },
  ]);

  if (error) {
    console.error("Error creating user:", error.message);
    return null;
  }

  return data;
};
