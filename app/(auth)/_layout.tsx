import { Redirect, Stack } from 'expo-router'
import React from 'react'


export default function AuthRoutesLayout() {
  const[isSignedIn, setIsSignedIn] = React.useState(false)

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack />
}