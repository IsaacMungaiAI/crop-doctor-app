// app/(auth)/after-signup.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { createUser } from "@/utils/createUser";
import { checkUserExists } from "@/utils/checkUserExists";
import { createSupabaseClientWithToken } from "@/lib/supabaseWithToken";

export default function AfterSignup() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        const sync = async () => {
            if (!isLoaded || !user) return;

            // ✅ Get Clerk token
            const { getToken } = useAuth();
            const token = await getToken();

            if (!token) return;

            const supabaseClient = createSupabaseClientWithToken(token);

            

            const exists = await checkUserExists(user.id, supabaseClient);
            if (!exists) {
                const newUser = await createUser({
                    userId: user.id,
                    email: user.primaryEmailAddress?.emailAddress || "",
                    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                    imageUrl: user.imageUrl,
                }, supabaseClient);

                console.log("User created in Supabase:", newUser);
            } else {
                console.log("User already exists in Supabase");
            }

            // Navigate to home after syncing
            router.replace("/(tabs)");
        };

        sync();
    }, [isLoaded, user]);

    return null;
}
