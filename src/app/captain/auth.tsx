import { View, SafeAreaView, Image, TouchableOpacity, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { ScrollView } from 'react-native-gesture-handler'
import { commonStyles } from '@/styles/commonStyles'
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import CustomText from '@/components/shared/CustomText'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomButton from '@/components/shared/CustomButton'
import { signin } from '@/service/authService'
import { useWS } from '@/service/WSProvider'
import * as Notifications from "expo-notifications";
import { getApps, initializeApp } from '@react-native-firebase/app'
import { getMessaging, getToken } from '@react-native-firebase/messaging'

export const firebaseConfig = {
    apiKey: "AIzaSyBVWYHKgp_9b95zaFtVwI1ekS9XirOcBV0",
    authDomain: "rapidoapp-4a547.firebaseapp.com",
    databaseURL: "https://rapidoapp-4a547-default-rtdb.firebaseio.com",
    projectId: "rapidoapp-4a547",
    storageBucket: "rapidoapp-4a547.firebasestorage.app",
    messagingSenderId: "547406702474",
    appId: "1:547406702474:web:d2a0f1ed1c6b2b3dca4a73",
    measurementId: "G-MWJPFJMSLT"
  };

const Auth = () => {
    const {updateAccessToken} = useWS()
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)

    if (!getApps().length) {
        initializeApp(firebaseConfig);
      }
      const messaging = getMessaging();
      
      const requestNotificationPermission = async () => {
          if (Platform.OS === "android") {
            try {
              const { status } = await Notifications.requestPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permiso no concedido', 'Necesitamos el permiso para enviar notificaciones');
              }
            } catch (error) {
              console.error("Error al solicitar permiso de notificaciones:", error);
            }
          }
        };

        const fetchToken = async () => {
            try {
              const token = await getToken(messaging, { vapidKey: "AIzaSyBVWYHKgp_9b95zaFtVwI1ekS9XirOcBV0" });
              console.log("Firebase Messaging Token:", token);
            } catch (error) {
              console.error("Error al obtener el token de Firebase Messaging:", error);
            }
          };

          useEffect(() => {
            // Solicitar permiso de notificaciones y obtener token al montar el componente
            requestNotificationPermission();
            fetchToken();
        
            // Suscribirse a onMessage para recibir notificaciones en primer plano
        
            /*
            const unsubscribe = onMessage(messaging, (payload) => {
              console.log('Mensaje recibido:', payload.notification?.title);
              Alert.alert(payload.notification?.title || '', payload.notification?.body);
            });
        
            setBackgroundMessageHandler(messaging, async (payload) => {
              console.log(payload)
            })
        */
            // Limpiar la suscripción al desmontar el componente
           // return () => unsubscribe();  
          }, []);

    const handleNext = async () => {
        try {
            setLoading(true)
            
            // Validación del número
            if (!phone || phone.length !== 8) {
                Alert.alert("Número requerido", "Por favor ingresa tu número de 8 dígitos")
                return
            }

            // Llamada asíncrona con await
            await signin({
                role: "captain",
                phone
            }, updateAccessToken)

        } catch (error) {
            // Manejo de errores
            console.error("Error en autenticación:", error)
            Alert.alert("Error", "Ocurrió un error al intentar iniciar sesión")
        } finally {
            // Siempre quitamos el loading
            setLoading(false)
        }
    }

  return (
    <SafeAreaView style={authStyles.container}>
        <ScrollView contentContainerStyle={authStyles.container}>

            <View style={commonStyles.flexRowBetween}>
                <Image source={require("@/assets/images/captain_logo.png")} style={authStyles.logo}/>

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