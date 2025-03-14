import { View, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { ScrollView } from 'react-native-gesture-handler'
import { commonStyles } from '@/styles/commonStyles'
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import CustomText from '@/components/shared/CustomText'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomButton from '@/components/shared/CustomButton'
import { signin } from '@/service/authService'
import { useWS } from '@/service/WSProvider'
import useGetFirebaseToken from '@/service/useGetFirebaseToken'

const Auth = () => {
    const {updateAccessToken} = useWS()
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const {firebasePushToken} = useGetFirebaseToken()

    const handleNext = async () => {
        try {
            setLoading(true)
            if(!phone && phone.length !== 8){
                Alert.alert("Bro....pon tu numero de cel")
                return
            }
            await signin({
                role: "customer",
                phone,
                firebasePushToken
            }, updateAccessToken)

        } catch (error) {
            console.error("Error en autenticación:", error)
            Alert.alert("Error", "Ocurrió un error al intentar iniciar sesión")
        } finally {
            setLoading(false)
        }

       
    }

  return (
    <SafeAreaView style={authStyles.container}>
        <ScrollView contentContainerStyle={authStyles.container}>

            <View style={commonStyles.flexRowBetween}>
                <Image source={require("@/assets/images/logo_t.png")} style={authStyles.logo}/>

                <TouchableOpacity style={authStyles.flexRowGap}>
                    <MaterialIcons name='help' size={18} color="grey"/>
                    <CustomText fontFamily='Medium' variant='h7'>Ayuda</CustomText>
                </TouchableOpacity>
            </View>

            <CustomText fontFamily='Medium' variant='h6'>
                Cuál es tu número de teléfono?
            </CustomText>

            <CustomText variant='h7' fontFamily='Regular' style={commonStyles.lightText}>
                Escriba su número de teléfono para proceder
            </CustomText>

            <PhoneInput
            onChangeText={setPhone}
            value={phone}
            />

            <View style={authStyles.footerContainer}>

                <CustomText variant='h8' fontFamily='Regular' style={[commonStyles.lightText, {textAlign: "center", marginHorizontal: 20}]}>
                    Al continuar, aceptas los términos y condiciones de Rapido
                </CustomText>

                <CustomButton
                    title="Siguiente"
                    onPress={handleNext}
                    loading={loading}
                    disabled={loading}
                />
            </View>

        </ScrollView>
    </SafeAreaView>
  )
}

export default Auth