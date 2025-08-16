import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Slot } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import * as NavigationBar from "expo-navigation-bar";
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user?.user_metadata?.isNewUser) {
        setIsNewUser(true);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.user_metadata?.isNewUser) {
        setIsNewUser(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const setupAndroidNavBar = async () => {
      if (Platform.OS === "android") {
        await NavigationBar.setBackgroundColorAsync('#000000');
        await NavigationBar.setButtonStyleAsync('light');
      }
    };

    setupAndroidNavBar();
  }, []);

  if (!fontsLoaded) return null;

  // Determine the redirect path outside of the render to avoid infinite loops
  const redirectPath = session && session.user ? "/" : (isNewUser ? "/signup" : "/signin");

  return (
    <SafeAreaProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Redirect href='/(tabs)' />
        {session && session.user ? <Slot /> : <Auth />}
        <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />
      </NavigationThemeProvider>
    </SafeAreaProvider>
  );
}
