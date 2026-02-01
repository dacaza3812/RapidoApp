import { View, Text, StatusBar, FlatList, Image } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { getMyRides } from '@/service/rideService'
import { homeStyles } from '@/styles/homeStyles'
import CaptainHeader from '@/components/captain/CaptainHeader'
import { useIsFocused } from '@react-navigation/native'
import { useWS } from '@/service/WSProvider'
import { useCaptainStorage } from '@/store/captainStore'
import { captainStyles } from '@/styles/captainStyles'
import CustomText from '@/components/shared/CustomText'
import * as Location from "expo-location"
import CaptainRidesItem from '@/components/captain/CaptainRidesItem'
import { onCustomScreenView } from '@/lib/events'

const Home = () => {

  const isFocused = useIsFocused()
  const {emit, off, on} = useWS();
  const {onDuty, setLocation} = useCaptainStorage()

  const [rideOffers, setRideOffers] = useState<any[]>([]);
 
  useEffect(() => {
    getMyRides(false)
  }, []) 

  useEffect(() => {
        const logScreenView = async () => {
          await onCustomScreenView("Home", "Captain")
        };
      
        logScreenView();
      }, []);
  
  useEffect(() => {
    let locationsSubscription: any;
    let isActive = true;

    const startLocationUpdates = async () => {
      try {
        const {status} = await Location.requestForegroundPermissionsAsync()
        if(status === "granted" && isActive){
          locationsSubscription = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10
          }, (location) => {
            if(isActive){
              const {latitude, longitude, heading} = location.coords
              setLocation({latitude: latitude, longitude: longitude, address: "Somewhere", heading: heading as number})
              emit("updateLocation", {
                latitude,
                longitude,
                heading
              })
            }
          })
        }
      } catch (error) {
        console.error("Error starting location updates:", error)
      }
    }

    if(onDuty && isFocused){
      startLocationUpdates()
    }

    return () => {
      isActive = false
      if(locationsSubscription){
        locationsSubscription.remove()
      }
    }

  }, [onDuty, isFocused, setLocation, emit])

  useEffect(() => {
    if(onDuty && isFocused){
      on("rideOffer", (rideDetails: any) => {
        setRideOffers((prevOffers) => {
          const existingIds = new Set(prevOffers?.map((offer) => offer?._id))
          if(!existingIds.has(rideDetails?._id)){
            return [...prevOffers, rideDetails]
          }
          return prevOffers
        })
      })
    }

    return () => {
      off("rideOffer")
    }
  }, [onDuty, on, off, isFocused])

  

  const removeRide = useCallback((id: string) => {
    setRideOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== id));
  }, [])

  const renderRides = useCallback(({item}: any) => {
    return(
      <CaptainRidesItem removeIt={() => removeRide(item?._id)} item={item} />
    )
  }, [removeRide])

  return (
    <View style={homeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#176fb0" translucent={false}/>
      <CaptainHeader />
    
      <FlatList
        data={!onDuty ? [] : rideOffers}
        renderItem={renderRides}
        style={{flex: 1}}
        contentContainerStyle={{padding: 10, paddingBottom: 120}}
        keyExtractor={(item: any) => item?._id || Math.random().toString()}
        ListEmptyComponent={
          <View style={captainStyles?.emptyContainer}>
            <Image source={require("@/assets/icons/ride.png")} style={captainStyles?.emptyImage}/>
            <CustomText fontSize={12} style={{textAlign: "center"}}>
              {onDuty ?
              "No hay carreras disponibles! Mantente activo" :
              "Estás FUERA DE SERVICIO, cambia a En Servicio para empezar a ganar"  
            }
            </CustomText>
          </View>
        }
      />
    </View>
  )
}

export default React.memo(Home)