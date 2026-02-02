
import React from 'react'
import { Stack } from 'expo-router'
import {gestureHandlerRootHOC} from 'react-native-gesture-handler'
import { WSProvider } from '@/service/WSProvider'
import { TripRestoration } from '@/components/shared/TripRestoration'
import { NotificationHandler } from '@/components/shared/NotificationHandler'

const Layout = () => {
  return (
    <WSProvider>
      <TripRestoration>
        <NotificationHandler>
          <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='role' />
        <Stack.Screen name='customer/auth' />
        <Stack.Screen name='captain/auth' />
        <Stack.Screen name='store/auth' />
        <Stack.Screen name='captain/profile-setup' />
        <Stack.Screen name='customer/profile-setup' />
        <Stack.Screen name='captain/home' />
        <Stack.Screen name='customer/home' />
        <Stack.Screen name='store/home' />
        <Stack.Screen name='customer/selectlocations' />
        <Stack.Screen name='customer/ridebooking' />
        <Stack.Screen name='customer/liveride' />
        <Stack.Screen name='captain/liveride' />
        </Stack>
        </NotificationHandler>
      </TripRestoration>
    </WSProvider>
  )
}

export default gestureHandlerRootHOC(Layout)