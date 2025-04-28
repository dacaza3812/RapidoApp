import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useWS } from '@/service/WSProvider'
import { useCaptainStorage } from '@/store/captainStore'
import { useIsFocused } from '@react-navigation/native'
import { captainStyles } from '@/styles/captainStyles'
import { commonStyles } from '@/styles/commonStyles'
import { MaterialIcons } from '@expo/vector-icons'
import { logout } from '@/service/authService'
import CustomText from '../shared/CustomText'
import * as Location from "expo-location"
import { Colors } from '@/utils/Constants'
import { supabase } from '@/lib/supabase'

const CaptainHeader = () => {
    const { disconnect, emit } = useWS()
    const { setOnDuty, onDuty, setLocation, user } = useCaptainStorage()
    
    const isFocused = useIsFocused()

    

    const handleLogOut = async () => {
        if(!user) return 
        try {
            await supabase
                .from('rapido_locations_users')
                .delete()
                .eq('user_id', user?.id || '')

                logout(disconnect)
        } catch (error) {
            console.log(error)
        }
    }

    const toggleOnDuty = async () => {
        if (onDuty) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status != "granted") {
                Alert.prompt("Permiso Denegado a la ubicación")
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude, heading } = location.coords;
            setLocation({ latitude: latitude, longitude: longitude, address: "Somewhere", heading: heading as number })
            const point = 'POINT(' + longitude + ' ' + latitude + ')'
           
            await supabase
                .from('rapido_locations_users')
                .insert([
                    {
                        user_id: user?.id,
                        lat: latitude,
                        long: longitude,
                        location: point,
                        heading: heading,
                        province: user?.user_metadata.province,
                        type_car: user?.user_metadata.captain_type_car
                    }
                ])
                .eq('id', Number(user?.id))
                .select()
            emit("goOnDuty", {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
                heading: heading
            })

        } else {
            console.log("cambia a no estar de viaje")
            emit("goOffDuty")
            await supabase
                .from('rapido_locations_users')
                .delete()
                .eq('user_id', user?.id || '')
        }
    }


    useEffect(() => {
        if (isFocused) {
            toggleOnDuty()
        }
    }, [isFocused, onDuty])

    return (
        <>
            <View style={captainStyles.headerContainer}>
                <SafeAreaView />

                <View style={commonStyles.flexRowBetween}>
                    <MaterialIcons name='logout' size={24} color="white" onPress={() => handleLogOut()} />
                    <TouchableOpacity style={captainStyles.toggleContainer} onPress={() => setOnDuty(!onDuty)}>
                        <CustomText fontFamily='SemiBold' fontSize={12} style={{ color: Colors.text }}>
                            {onDuty ? "EN SERVICIO" : "FUERA DE SERVICIO"}
                        </CustomText>

                        <Image
                            source={onDuty ?
                                require("@/assets/icons/switch_on.png") :
                                require("@/assets/icons/switch_off.png")
                            }
                            style={captainStyles.icon}
                        />
                    </TouchableOpacity>

                    <MaterialIcons name='notifications' size={24} color="white" />

                </View>
            </View>

            { /* <View style={captainStyles?.earningContainer}>
            <CustomText fontSize={13} style={{color: "#fff"}} fontFamily='Medium'>
                Ganado hoy
            </CustomText>

            <View style={commonStyles?.flexRowGap}>
                <CustomText fontSize={14} style={{color: "#fff"}} fontFamily='Medium'>
                    $ 5030 CUP
                </CustomText>
                <MaterialIcons name='arrow-drop-down' size={24} color="#fff"/>
            </View>
        </View> */}
        </>
    )
}

export default CaptainHeader