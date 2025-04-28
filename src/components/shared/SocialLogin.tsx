import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const SocialLogin = () => {
  return (
    <View style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 20
    }}>
        
      <TouchableOpacity
        style={{
            padding: 10,
            justifyContent: "center",
        }}
      >
        <Image source={require("@/assets/icons/icons8-google-logo-48.png")} style={{width: 40, height: 40}}/>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
            padding: 10,
            justifyContent: "center",
        }}
      >
        <Image source={require("@/assets/icons/icons8-facebook-logo-64.png")} style={{width: 40, height: 45}}/>
      </TouchableOpacity>
    </View>
  )
}

export default SocialLogin