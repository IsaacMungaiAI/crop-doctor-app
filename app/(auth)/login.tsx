import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { COLORS } from "@/constants/theme";
import { styles } from "@/constants/auth.styles";

export default function Login() {
  const router = useRouter();

  const handleGoogleSignin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:3000", // 👈 can be your hosted domain too
        },
      });

      if (error) {
        console.error("Supabase OAuth error:", error);
        Alert.alert("Login failed", error.message);
        return;
      }

      if (data?.url) {
        // Open the OAuth provider in a browser
        // On mobile, Supabase will automatically persist session after login
        router.push("/(tabs)");
      }
    } catch (err) {
      console.error("Unexpected OAuth error:", err);
      Alert.alert("Error", "Something went wrong, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* App Branding */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>AI Crop Doctor</Text>
        <Text style={styles.tagline}>Detect crop diseases instantly</Text>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/leaf.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Sign In Button */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignin}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text style={{ textDecorationLine: "underline" }}>Terms</Text> &{" "}
          <Text style={{ textDecorationLine: "underline" }}>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}

