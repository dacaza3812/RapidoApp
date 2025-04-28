import { View, Text, SafeAreaView, Platform } from 'react-native'
import React from 'react'
import SignInFormCaptain from '@/components/captain/SignInFormCaptain'
import { StatusBar } from 'expo-status-bar'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import SignUpPage from '@/components/captain/Register'

const SignIn = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
        <StatusBar translucent={false} backgroundColor={Colors.primary}/>
      {  <SignInFormCaptain/> }
     {/* <SignUpPage /> */}
    </SafeAreaView>
  )
}

export default SignIn