import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, PermissionsAndroid, Alert, Platform } from 'react-native';
import { roleStyles } from '@/styles/roleStyles';
import CustomText from '@/components/shared/CustomText';
import { router } from 'expo-router';
import { getMessaging, getToken, onMessage } from "@react-native-firebase/messaging";
import { initializeApp, getApps } from '@react-native-firebase/app';

// Configuración de Firebase (se inicializa una sola vez)
const firebaseConfig = {
  apiKey: "AIzaSyBVWYHKgp_9b95zaFtVwI1ekS9XirOcBV0",
  authDomain: "rapidoapp-4a547.firebaseapp.com",
  databaseURL: "https://rapidoapp-4a547-default-rtdb.firebaseio.com",
  projectId: "rapidoapp-4a547",
  storageBucket: "rapidoapp-4a547.firebasestorage.app",
  messagingSenderId: "547406702474",
  appId: "1:547406702474:web:d2a0f1ed1c6b2b3dca4a73",
  measurementId: "G-MWJPFJMSLT"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const messaging = getMessaging();

const Role = () => {
  const [messagePush, setMessagePush] = useState("");

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
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Permiso de Notificaciones',
            message: 'La aplicación necesita acceso a las notificaciones para enviarte actualizaciones.',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permiso de notificaciones concedido");
        } else {
          console.log("Permiso de notificaciones denegado");
        }
      } catch (error) {
        console.error("Error al solicitar permiso de notificaciones:", error);
      }
    }
  };

  // Función para obtener el token de Firebase Messaging
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
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Mensaje recibido:', payload.notification?.title);
      Alert.alert(payload.notification?.title || '');
      setMessagePush(payload.notification?.title || '');
    });

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

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
