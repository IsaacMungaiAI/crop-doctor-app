import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from "expo-navigation-bar";
import EnsureSupabaseUserWrapper from '@/components/EnsureUserInSupabaseWrapper';

export default function RootLayout() {
  const colorScheme = useColorScheme();


  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });



  //update the navigation bar on android
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync('#000000');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, [])

 


  if (!fontsLoaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache} >
      <SafeAreaProvider>
        <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <EnsureSupabaseUserWrapper />
          <Slot/>
          <StatusBar style={colorScheme === 'light' ? 'dark' : 'dark'} />
        </NavigationThemeProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
