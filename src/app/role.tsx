<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, PermissionsAndroid, Alert, Platform } from 'react-native';
import { roleStyles } from '@/styles/roleStyles';
import CustomText from '@/components/shared/CustomText';
import { router } from 'expo-router';
import { getMessaging, getToken, onMessage } from "@react-native-firebase/messaging";
import { initializeApp, getApps } from '@react-native-firebase/app';
import { firebaseConfig } from '@/service/config';
import * as Notifications from "expo-notifications";
// Configuración de Firebase (se inicializa una sola vez)


if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const messaging = getMessaging();

=======
import { View, PermissionsAndroid, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { roleStyles } from '@/styles/roleStyles'
import CustomText from '@/components/shared/CustomText'
import { router } from 'expo-router'
import messaging from "@react-native-firebase/messaging"
>>>>>>> 4f16ab7 (probando con firebase)
const Role = () => {
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const handleCustomerPress = () => {
    router.navigate("/customer/auth");
  };

  const handleCaptainPress = () => {
    router.navigate("/captain/auth");
  };

  // Función para solicitar el permiso de notificaciones en Android
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
<<<<<<< HEAD
  };

  // Función para obtener el token de Firebase Messaging
  const fetchToken = async () => {
    try {
      const token = await getToken(messaging, { vapidKey: "AIzaSyBVWYHKgp_9b95zaFtVwI1ekS9XirOcBV0" });
      console.log(token)
    } catch (error) {
      console.error("Error al obtener el token de Firebase Messaging:", error);
    }
  };

  useEffect(() => {
    // Solicitar permiso de notificaciones y obtener token al montar el componente
    requestNotificationPermission();
    fetchToken();
  }, []);
=======
    async function requestUserPermision(){
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
      if(enabled){
        console.log("Auth Status ", authStatus);
      }
    }
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const getToken = async () => {
  const token = await messaging().getToken()
  console.log(token);
}

useEffect(() => {
  requestUserPermision();
  getToken()
}, [])
>>>>>>> 4f16ab7 (probando con firebase)

  return (
    <View style={roleStyles.container}>
      <Image
        source={require("@/assets/images/logo_t.png")}
        style={roleStyles.logo}
      />
      <CustomText fontFamily='Medium' variant='h6'>
        Elija su tipo de usuario
      </CustomText>

      <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
        <Image
          source={require("@/assets/images/customer.png")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Cliente</CustomText>
          <CustomText style={roleStyles.description}>
            Ordena un viaje o entrega fácilmente
          </CustomText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={roleStyles.card} onPress={handleCaptainPress}>
        <Image
          source={require("@/assets/images/captain.png")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Chofer</CustomText>
          <CustomText style={roleStyles.description}>
            Únete a nosotros, maneja y entrega
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Role;
