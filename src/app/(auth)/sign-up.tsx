import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Colors } from '@/utils/Constants'
import SignUpPage from '@/components/captain/Register'
import { authStyles } from '@/styles/authStyles'

const SignUp = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar translucent={false} backgroundColor={Colors.primary} />
        <SignUpPage />
    </View>
  )
}

export default SignUp