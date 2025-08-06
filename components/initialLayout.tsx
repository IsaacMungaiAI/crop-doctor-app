
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { checkUserExists } from "@/utils/checkUserExists";
import { supabase } from "@/lib/supabase";

export default function InitialLayout() {
    const { isLoaded, isSignedIn } = useAuth();

    const { user, isLoaded: isUserLoaded } = useUser(); // ✅ add this

    const segments = useSegments();
    const router = useRouter();

    const [checkingUser, setCheckingUser] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (!isLoaded || !isUserLoaded || !segments.length) return;

            const inAuthScreen = segments[0] === "(auth)";
            if (!segments.length) return;

            if (!isSignedIn || !user) {
                if (!inAuthScreen) router.replace("/(auth)/login");
                return;
            }

            const exists = await checkUserExists(user.id);
            if (!exists) {
                await insertNewUser(user); // redirect to signup if user doesn't exist
            }
            if (inAuthScreen) router.replace("/(tabs)");


            setCheckingUser(false);
        };

        init();
    }, [isLoaded, isSignedIn, isUserLoaded, user, segments]);

    console.log("User:", user);
    console.log("Signed in:", isSignedIn);
    console.log("Segments:", segments);

    const insertNewUser = async (user: any) => {
        const { id, primaryEmailAddress, fullName, username } = user;
        await supabase.from("users").insert({
            user_id: id,
            email: primaryEmailAddress?.emailAddress,
            //name: fullName || username || "Unnamed User",
        });
    };


    if (checkingUser) return null;

    return <Stack screenOptions={{ headerShown: false }} />
}