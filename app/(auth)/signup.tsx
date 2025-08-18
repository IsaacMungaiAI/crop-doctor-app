import React, { useState } from "react";
import { Alert, StyleSheet, View, TouchableOpacity, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert("Error", error.message);
    if (!session) {
      Alert.alert("Success", "Please check your inbox for email verification!");
      router.replace("/signin");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholder="Enter your password"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
        onPress={signUpWithEmail}
      >
        <Text style={styles.buttonText}>{loading ? "Loading..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signin")} style={styles.switchButton}>
        <Text style={styles.switchText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#f5f5f5", padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: "#2563eb", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#93c5fd" },
  buttonText: { color: "white", fontWeight: "600" },
  switchButton: { marginTop: 20, alignItems: "center" },
  switchText: { color: "#2563eb", fontWeight: "500" },
});
