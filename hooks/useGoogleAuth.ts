import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  async function signInWithGoogle() {
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
    } as any);

    // Ask Supabase to generate an OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUri },
    });

    if (error) throw error;

    // Open the URL in the system browser
    const res = await WebBrowser.openAuthSessionAsync(
      data.url, // 👈 Supabase OAuth URL
      redirectUri
    );

    if (res.type === "success" && res.url) {
      // Let Supabase handle the callback
      const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(res.url);

      if (sessionError) throw sessionError;
      return sessionData;
    }

    throw new Error("Google login cancelled or failed.");
  }

  return { signInWithGoogle };
}


