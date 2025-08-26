import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import getUserProfile from '@/utils/getUserProfile';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '@/types/UserProfile';
import { loader } from '../styles/Loader';



const ProfileScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();


  const { data: user, isLoading, isError, refetch } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5, //5min before considering stale
    //cacheTime: 1000 * 60 * 30, //stays in cache for 30min
  })



  // You’d normally get this from Supabase auth session
  /*const user = {
    name: 'Isaac Mungai',
    email: 'isaac@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  };*/

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      queryClient.removeQueries({ queryKey: ['userProfile'] })
      //router.replace('/(auth)/signin') // Adjust the path as needed
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={loader.container}>
        <View style={loader.loaderWrapper}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={loader.loaderText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error fetching profile</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }







  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />



        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/profile/EditProfile')}>
          <Text style={styles.buttonText} >Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
          <Text>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4ade80',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 15,
    width: '60%',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#f87171',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
