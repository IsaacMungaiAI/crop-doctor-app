import { Redirect, Stack } from 'expo-router'
import React from 'react'


export default function AuthRoutesLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false, // optional, hides headers for auth screens
      }} />
  )

}