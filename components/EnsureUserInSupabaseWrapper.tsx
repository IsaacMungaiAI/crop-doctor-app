// components/EnsureSupabaseUserWrapper.tsx
 // optional depending on Expo

import { useEnsureUserInSupabase } from "@/hooks/useEnsureUserInSupabase";

export default function EnsureSupabaseUserWrapper() {
  useEnsureUserInSupabase(); // ✅ This now runs within ClerkProvider
  return null;
}
