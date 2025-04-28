import { View, Text, StatusBar, FlatList, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { useUserStore } from '@/store/userStore'
import { supabase } from '@/lib/supabase'
import { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js'



const Home = () => {
  // const { user } = useUserStore()
  const { user } = useCaptainStorage()
  const isFocused = useIsFocused()
  const { emit, off, on } = useWS();
  const { onDuty, setLocation } = useCaptainStorage()
  const [location, setLocationPrueba] = useState<any>({})
  const [rideOffers, setRideOffers] = useState<any[]>([]);

  const myChannel = supabase.channel('test-channel')
  const pruebaLocation = supabase.channel('pruebaLocation')
  // Simple function to log any messages we receive
  function messageReceived(payload: { [key: string]: any; type: `${REALTIME_LISTEN_TYPES.BROADCAST}`; event: string }) {
    console.log(payload)
  }
  // Subscribe to the Channel
  myChannel
    .on(
      'broadcast',
      { event: '*' }, // Listen for "shout". Can be "*" to listen to all events
      (payload) => messageReceived(payload)
    )
    .subscribe()


  useEffect(() => {
    getMyRides(false)
  }, [])

  useEffect(() => {
    const roomOne = supabase.channel('room_01')
    roomOne
      .on('presence', { event: 'sync' }, () => {
        const newState = roomOne.presenceState()
        console.log('sync', newState)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('join', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('leave', key, leftPresences)
      })
      .subscribe()
  }, [])

  useEffect(() => {
    const logScreenView = async () => {
      await onCustomScreenView("Home", "Captain")



      supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            schema: 'public', // Subscribes to the "public" schema in Postgres
            event: '*',       // Listen to all changes,
            table: "rapido_locations_users"
          },
          (payload) => console.log(payload)
        )
        .subscribe()
    };



    logScreenView();
  }, []);



  const handleTest = async (longitude: number, latitude: number) => {
    console.log("handle Test")
    const point = 'POINT(' + longitude + ' ' + latitude + ')'

    const { data, error } = await supabase
      .from('rapido_locations_users')
      .update({
        lat: latitude,
        long: longitude,
        location: point
      })
      .eq('user_id', user?.id || '')
      console.log("data ", data)
      console.log("error ", error)
  }

  useEffect(() => {
    let locationsSubscription: any;
    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === "granted") {
        locationsSubscription = await Location.watchPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 10
        }, (location) => {
          const { latitude, longitude, heading } = location.coords
          setLocation({ latitude: latitude, longitude: longitude, address: "Somewhere", heading: heading as number })
          setLocationPrueba({ latitude: latitude, longitude: longitude, address: "Somewhere", heading: heading as number })


          pruebaLocation
            .send({
              type: "broadcast",
              event: "shout",
              payload: {
                latitude,
                longitude,
                heading
              }
            })
          emit("updateLocation", {
            latitude,
            longitude,
            heading
          })
        })
      }
    }

    if (onDuty && isFocused) {
      startLocationUpdates()
    }

    return () => {
      if (locationsSubscription) {
        locationsSubscription.remove();
      }
    }

  }, [onDuty, isFocused])

  useEffect(() => {
    handleTest(location.longitude, location.latitude)
  }, [location])

  useEffect(() => {
    if (onDuty && isFocused) {
      on("rideOffer", (rideDetails: any) => {
        setRideOffers((prevOffers) => {
          const existingIds = new Set(prevOffers?.map((offer) => offer?._id))
          if (!existingIds.has(rideDetails?._id)) {
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



  const removeRide = (id: string) => {
    setRideOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== id));
  }

  const renderRides = ({ item }: any) => {
    return (
      <CaptainRidesItem removeIt={() => removeRide(item?._id)} item={item} />
    )
  }

  return (
    <View style={homeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#176fb0" translucent={false} />
      <CaptainHeader />
      <FlatList
        data={!onDuty ? [] : rideOffers}
        renderItem={renderRides}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        keyExtractor={(item: any) => item?._id || Math.random().toString()}
        ListEmptyComponent={
          <View style={captainStyles?.emptyContainer}>
            <Image source={require("@/assets/icons/ride.png")} style={captainStyles?.emptyImage} />
            <CustomText fontSize={12} style={{ textAlign: "center" }}>
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

export default Home