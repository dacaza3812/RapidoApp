import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useCallback, useRef } from 'react'
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

const CaptainHeader = () => {
    const {disconnect, emit, on, off} = useWS()
    const {setOnDuty, onDuty, setLocation} = useCaptainStorage()
    const isFocused = useIsFocused()
    const [isLoading, setIsLoading] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    console.log("🚀 CaptainHeader mounted. Initial onDuty:", onDuty)

    useEffect(() => {
        const handleCaptainStatusChanged = (data: any) => {
            console.log("📨 captainStatusChanged event received:", data)

            // Limpiar timeout si llega respuesta
            if(timeoutRef.current){
                console.log("⏱️ Clearing timeout - response received")
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }

            if(data.status === "onDuty"){
                console.log("✅ Setting onDuty to TRUE")
                setOnDuty(true)
                setIsLoading(false)
            }else if(data.status === "offDuty"){
                console.log("✅ Setting onDuty to FALSE")
                setOnDuty(false)
                setIsLoading(false)
            }
        }

        console.log("🔌 Registering listener for event: captainStatusChanged")
        on("captainStatusChanged", handleCaptainStatusChanged)

        return () => {
            console.log("🔌 Cleaning up captainStatusChanged listener")
            off("captainStatusChanged")
        }
    }, [on, off, setOnDuty])

    // Limpiar timeout cuando el componente se desmonta
    useEffect(() => {
        return () => {
            if(timeoutRef.current){
                console.log("🧹 Cleaning up timeout on unmount")
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        }
    }, [])

    const toggleOnDuty = useCallback(async () => {
        if(isLoading) return

        console.log("🔄 toggleOnDuty called. Current onDuty:", onDuty)
        setIsLoading(true)

        try {
            if(!onDuty){
                console.log("📍 Requesting location permissions...")
                const {status} = await Location.requestForegroundPermissionsAsync();
                if(status !== "granted"){
                    Alert.alert("Permiso Denegado", "Se requiere acceso a la ubicación para estar en servicio")
                    setIsLoading(false)
                    return
                }

                console.log("📍 Getting current position...")
                const location = await Location.getCurrentPositionAsync({});
                const {latitude, longitude, heading} = location.coords;
                setLocation({latitude: latitude, longitude: longitude, address: "Somewhere", heading: heading as number})

                console.log("📡 Emitting goOnDuty with coords:", { latitude, longitude, heading })
                emit("goOnDuty", {
                    latitude,
                    longitude,
                    heading
                })

                // Limpiar timeout anterior si existe
                if(timeoutRef.current){
                    clearTimeout(timeoutRef.current)
                }

                // Timeout por si el servidor tarda mucho en responder
                timeoutRef.current = setTimeout(() => {
                    console.log("⏱️ Timeout waiting for captainStatusChanged response")
                    setIsLoading(false)
                    timeoutRef.current = null
                    Alert.alert(
                        "Tiempo de espera agotado",
                        "El servidor está tardando mucho en responder. Por favor, verifica tu conexión y vuelve a intentar.",
                        [{ text: "OK" }]
                    )
                }, 30000) // 30 segundos de timeout

            }else{
                console.log("📡 Emitting goOffDuty")
                emit("goOffDuty")

                // Limpiar timeout anterior si existe
                if(timeoutRef.current){
                    clearTimeout(timeoutRef.current)
                }

                // Timeout por si el servidor tarda mucho en responder
                timeoutRef.current = setTimeout(() => {
                    console.log("⏱️ Timeout waiting for captainStatusChanged response")
                    setIsLoading(false)
                    timeoutRef.current = null
                    Alert.alert(
                        "Tiempo de espera agotado",
                        "El servidor está tardando mucho en responder. Por favor, verifica tu conexión y vuelve a intentar.",
                        [{ text: "OK" }]
                    )
                }, 30000)
            }
        } catch (error) {
            console.error("❌ Error in toggleOnDuty:", error)
            setIsLoading(false)
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
            Alert.alert("Error", "Ocurrió un error al cambiar el estado de servicio")
        }
    }, [onDuty, isLoading, emit, setLocation, setOnDuty])

  return (
    <>
        <View style={captainStyles.headerContainer}>
            <SafeAreaView />

            <View style={commonStyles.flexRowBetween}>
                <MaterialIcons name='logout' size={24} color="white" onPress={() => logout(disconnect)}/>

                <TouchableOpacity
                    style={[
                        captainStyles.toggleContainer,
                        isLoading && captainStyles.toggleContainerDisabled
                    ]}
                    onPress={toggleOnDuty}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <View style={captainStyles.loadingContainer}>
                            <ActivityIndicator size="small" color={Colors.text} />
                            <CustomText fontFamily='SemiBold' fontSize={12} style={{color: Colors.text, marginLeft: 8}}>
                                {onDuty ? "Desactivando..." : "Activando..."}
                            </CustomText>
                        </View>
                    ) : (
                        <>
                            <CustomText fontFamily='SemiBold' fontSize={12} style={{color: Colors.text}}>
                                {onDuty ? "EN SERVICIO" : "FUERA DE SERVICIO"}
                            </CustomText>

                            <Image
                                source={onDuty ?
                                    require("@/assets/icons/switch_on.png") :
                                    require("@/assets/icons/switch_off.png")
                                }
                                style={captainStyles.icon}
                            />
                        </>
                    )}
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

export default React.memo(CaptainHeader)
