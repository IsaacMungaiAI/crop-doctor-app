export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string; // optional because you replace it with signed URL
  created_at?: string; // add if your table has it
};
