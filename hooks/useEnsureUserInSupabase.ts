// hooks/useEnsureUserInSupabase.ts
'use client'
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { checkUserExists } from "@/utils/checkUserExists";
import { createUser } from "@/utils/createUser";
import { supabase } from "@/lib/supabase";



export const useEnsureUserInSupabase = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return;

      const exists = await checkUserExists(user.id, supabase);
      if (!exists) {
        await createUser({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          imageUrl: user.imageUrl,
        }, supabase);
      }
    };

    syncUser();
  }, [isLoaded, user]);

  console.log("User in Supabase ensured:", user?.id);
};
