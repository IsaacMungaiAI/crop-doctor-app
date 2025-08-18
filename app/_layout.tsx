import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Slot } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from "expo-navigation-bar";
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

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
      setCheckingAuth(false);
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
    if (!checkingAuth) {
      if (session && session.user) {
        router.replace('/(tabs)')
      } else if (isNewUser) {
        router.replace('/(auth)/signup')
      } else
        router.replace('/(auth)/signin')

    }
  }, [checkingAuth, session, isNewUser])

  useEffect(() => {
    const setupAndroidNavBar = async () => {
      if (Platform.OS === "android") {
        await NavigationBar.setBackgroundColorAsync('#000000');
        await NavigationBar.setButtonStyleAsync('light');
      }
    };

    setupAndroidNavBar();
  }, []);

  if (!fontsLoaded || checkingAuth) return null;



  return (
    <SafeAreaProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot />
        <StatusBar style={colorScheme === 'light' ? 'dark' : 'dark'} />
      </NavigationThemeProvider>
    </SafeAreaProvider>
  );
}
