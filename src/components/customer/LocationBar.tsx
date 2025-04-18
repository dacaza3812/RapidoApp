import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { useWS } from '@/service/WSProvider'
import { uiStyles } from '@/styles/uiStyles'
import Ionicos from '@expo/vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors } from '@/utils/Constants'
import { router } from 'expo-router'
import CustomText from '../shared/CustomText'
import { logout } from '@/service/authService'
import { customEvent, onCustomScreenView } from '@/lib/events'
import { useBannersByCity } from '@/service/useBannersByCity'

const LocationBar = () => {
    const {location} = useUserStore()
    const {disconnect} = useWS()
    const {provincy} = useBannersByCity()
    useEffect(() => {
        const logScreenView = async () => {
          await onCustomScreenView("LiveRide", "Customer")
          if(provincy) {
            await customEvent({
              eventName: "Location",
              payload: {
                provincy: provincy,
              }
            })
          }
        };
    
        logScreenView();
      }, []);
  return (
    <View style={uiStyles.absoluteTop}>
      <SafeAreaView/>
      <View style={uiStyles.container}>
        <TouchableOpacity style={uiStyles.btn} onPress={() => logout(disconnect)}>
            <Ionicos name='log-out-outline' size={RFValue(18)} color={Colors.text}/>
        </TouchableOpacity>

        <TouchableOpacity style={uiStyles.locationBar}
         onPress={() => router.navigate("/customer/selectlocations")}>
            <View style={uiStyles.dot}/>

            <CustomText numberOfLines={1} style={uiStyles.locationText}>
            {location?.address || "Obteniendo dirección..."}
        </CustomText>
        </TouchableOpacity>

        
      </View>
    </View>
  )
}

export default LocationBar