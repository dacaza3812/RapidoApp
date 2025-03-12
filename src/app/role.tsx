import { View,  Image, TouchableOpacity, PermissionsAndroid, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { roleStyles } from '@/styles/roleStyles'
import CustomText from '@/components/shared/CustomText'
import { router } from 'expo-router'
import {getMessaging, getToken, onMessage} from "@react-native-firebase/messaging"
import { initializeApp } from '@react-native-firebase/app'

const Role = () => {
    const handleCustomerPress = () => {
        router.navigate("/customer/auth")
    }

    const handleCaptainPress = () => {
        router.navigate("/captain/auth")
    }
    
    const [messagePush, setMessagePush] = useState("")
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
    
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
       onMessage(messaging, (payload) => {
        console.log('Message received. ', payload.notification?.title);
        Alert.alert(payload.notification?.title || "")
        setMessagePush(payload.notification?.title || "")
        // ...
      });
      
      const requestNotificationPermission = async () => {
        if(Platform.OS ==="android"){
          try {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            ).then(response => console.log("PermissionsAndroid.request ", response));
            PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS').then(
              response => {
                if(!response){
                  PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS',{
                      title: 'Notification',
                      message:
                        'App needs access to your notification ' +
                        'so you can get Updates',
                      buttonNeutral: 'Ask Me Later',
                      buttonNegative: 'Cancel',
                      buttonPositive: 'OK',
                  })
                }
              }
            ).catch(
              err => {
                console.log("Notification Error=====>",err);
              }
            )
          } catch (err){
            console.log(err);
          }
        }
      };
      const requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Cool Photo App Camera Permission',
              message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      };
      
      async function requestUserPermision(){
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            const authStatus = await messaging.requestPermission();
            console.log(authStatus);
            Notification.requestPermission().then((permisiion) => {
              console.log(permisiion);
            })
          }
      
      const getTokens = async () => {
        const tokenPedido = await getToken(messaging, {vapidKey: "AIzaSyBVWYHKgp_9b95zaFtVwI1ekS9XirOcBV0"});
        console.log(tokenPedido);
      }
    
    requestUserPermision();
    getTokens()
  
  
    async function testPermision() {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log("Permiso de notificaciones concedido");
  } else {
    console.log("Permiso de notificaciones denegado");
  }
    }
  
    useEffect(() => {
      (async () => {
        await requestNotificationPermission()
        await testPermision();
        await getTokens();
        await requestCameraPermission()
      })();
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
                Ordena un viaje o entrega facilmente
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
  )
}

export default Role