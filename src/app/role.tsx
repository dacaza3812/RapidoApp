import { View, PermissionsAndroid, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { roleStyles } from '@/styles/roleStyles'
import CustomText from '@/components/shared/CustomText'
import { router } from 'expo-router'
import messaging from "@react-native-firebase/messaging"
const Role = () => {
    const handleCustomerPress = () => {
        router.navigate("/customer/auth")
    }

    const handleCaptainPress = () => {
        router.navigate("/captain/auth")
    }
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