import React, { useState } from "react";
import { Alert, StyleSheet, View, TouchableOpacity, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error, data: { session } } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (session) router.replace("/(tabs)"); // replace instead of push to prevent back nav to signin
    if (error) {
      Alert.alert("Error", error.message);
      console.log(error);


    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

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
        onPress={signInWithEmail}
      >
        <Text style={styles.buttonText}>{loading ? "Loading..." : "Sign In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")} style={styles.switchButton}>
        <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
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
