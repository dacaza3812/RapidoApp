import React, { useState } from 'react'
import { View, SafeAreaView, Alert } from 'react-native'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomButton from '@/components/shared/CustomButton'
import CustomText from '@/components/shared/CustomText'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import { signin, signup } from '@/service/authService'
import Input from '@/components/shared/Input'
import useGetFirebaseToken from '@/service/useGetFirebaseToken'

type Props = { switchRole?: boolean }

const Auth = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const {firebasePushToken} = useGetFirebaseToken()

  const handleSubmit = async () => {
    
    try {
      setLoading(true)
      // Convertimos phone a email temporalmente
      const email = `david383812+01@gmail.com`
      await signup({
        email: "david383812@gmail.com",
        password: "12345678",
        phone: "+573053838128",
        options: {
          data: {
            fare: 0,
            firebase: firebasePushToken,
            first_name: "David",
            last_name: "Gonzalez",
            province: "Cundinamarca",
            role: "captain",
            phone: "+573053838128"
          }
        }
      })
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <SafeAreaView style={authStyles.container}>
      <View style={commonStyles.center}>
        <CustomText variant="h6">Inicia sesión como Chofer</CustomText>
        
        <Input value={phone} onChangeText={setPhone} mode='email' modeSecure={false} plaeholderInput='email'/>
        <Input value={password} onChangeText={setPassword} modeSecure mode='text'/>
        <CustomButton title="Entrar" onPress={handleSubmit} loading={loading} />
      </View>
    </SafeAreaView>
  )
}

export default Auth