import { View, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { ScrollView } from 'react-native-gesture-handler'
import { commonStyles } from '@/styles/commonStyles'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomText from '@/components/shared/CustomText'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomButton from '@/components/shared/CustomButton'
import { signin } from '@/service/authService'
import { useWS } from '@/service/WSProvider'
import useGetFirebaseToken from '@/service/useGetFirebaseToken'
import * as Linking from 'expo-linking';
import { onUserLogin } from '@/lib/events'
import { useUserStore } from '@/store/userStore'


const Auth = () => {
    const {updateAccessToken} = useWS()
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const {firebasePushToken} = useGetFirebaseToken()
    const { user: customerUser } = useUserStore(); // Usuario cliente previo

    const doSignin = async (forceSwitch: boolean) => {
            try {
              setLoading(true);
        
              if (!phone || phone.length !== 8) {
                Alert.alert("Número requerido", "Por favor ingresa tu número de 8 dígitos");
                return;
              }
        
              await signin("david383812@gmail.com", "Dacaza3812*", "captain");
        
              await onUserLogin(phone, "customer");
            } catch (error) {
              console.error("Error en autenticación:", error);
              Alert.alert("Error", "Ocurrió un error al intentar iniciar sesión");
            } finally {
              setLoading(false);
            }
          };

    const handleNext = () => {
            if (customerUser && customerUser.role === "captain") {
              Alert.alert(
                "Cambiar a perfil Chofer",
                "Vas a cambiar de cliente a chofer. ¿Deseas continuar?",
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Continuar", onPress: () => doSignin(true) }, // forceSwitch: true
                ]
              );
            } else {
              doSignin(false);
            }
          };

  return (
    <SafeAreaView style={authStyles.container}>
        <ScrollView contentContainerStyle={authStyles.container}>

            <View style={commonStyles.flexRowBetween}>
                <Image source={require("@/assets/images/logo_t.png")} style={authStyles.logo}/>

                <TouchableOpacity style={authStyles.flexRowGap} onPress={() => Linking.openURL('https://t.me/rapidoappcuba')}  activeOpacity={0.7}>
                    <MaterialIcons name="telegram" size={24}  style={{color: "#24A1DE"}}/>
                    <CustomText fontFamily='Medium' variant='h7'>Soporte</CustomText>
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