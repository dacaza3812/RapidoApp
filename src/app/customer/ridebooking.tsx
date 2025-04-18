// RideBooking.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity, Image, SafeAreaView, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useUserStore } from '@/store/userStore';
import { calculateFare, calculateEstimatedArrival } from '@/utils/mapUtils';
import { rideStyles } from '@/styles/rideStyles';
import CustomText from '@/components/shared/CustomText';
import { commonStyles } from '@/styles/commonStyles';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomButton from '@/components/shared/CustomButton';
import RoutesMap from '@/components/customer/RoutesMap';
import { createRide } from '@/service/rideService';
import { Colors } from '@/utils/Constants';
import { customEvent, onAddPaymentInfo } from '@/lib/events';

const RideBooking = () => {
  const route = useRoute() as any;
  const item = route?.params as any;
  const { location } = useUserStore() as any;
  const [selectedOption, setSelectedOption] = useState("Motocicleta");
  const [loading, setLoading] = useState(false);

  // Calcula las tarifas basadas en la distancia
  const farePrices = useMemo(() => calculateFare(parseFloat(item?.distanceInKm)), [item?.distanceInKm]);
  

  // Estado para el tiempo actual, se actualizará cada minuto
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Definición de velocidades promedio (en km/h) para cada medio de transporte
  const averageSpeeds: Record<string, number> = {
    "Motocicleta": 30,
    "Triciclo": 20,
    "Auto Económico": 35,
    "Auto Premium": 25,
  };

  // Opciones base de viaje sin ETA
  const baseRideOptions = [
    {
      type: "Motocicleta",
      seats: 1,
      price: farePrices?.bike,
      isFastest: true,
      icon: require("@/assets/icons/bike.png")
    },
    {
      type: "Triciclo",
      seats: 3,
      price: farePrices?.auto,
      isFastest: false,
      icon: require("@/assets/icons/auto.png")
    },
    {
      type: "Auto Económico",
      seats: 4,
      price: farePrices?.cabEconomy,
      isFastest: false,
      icon: require("@/assets/icons/cab.png")
    },
    {
      type: "Auto Premium",
      seats: 1,
      price: farePrices?.cabPremium,
      isFastest: true,
      icon: require("@/assets/icons/cab_premium.png")
    },
  ];

  // Para cada opción, se calcula el ETA usando calculateEstimatedArrival con la velocidad específica
  const rideOptions = useMemo(() => {
    const distance = parseFloat(item?.distanceInKm);
    return baseRideOptions.map((ride) => {
      const avgSpeed = averageSpeeds[ride.type];
      const estimatedArrivalDate = calculateEstimatedArrival(distance, avgSpeed);
      const diffMs = estimatedArrivalDate.getTime() - currentTime.getTime();
      const dynamicArrivalMinutes = Math.max(Math.round(diffMs / 60000), 0);
      const arrivalTimeString = estimatedArrivalDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      return {
        ...ride,
        time: `${dynamicArrivalMinutes} min`,
        dropTime: arrivalTimeString,
      };
    });
  }, [item?.distanceInKm, currentTime, farePrices]);

  const handleOptionSelect = async (type: string) => {
    setSelectedOption(type);
    await customEvent({
      eventName: "ride_option_select",
      payload: {
        ride_type: type,
        distance: item?.distanceInKm,
        estimated_arrival_time: rideOptions.find((ride) => ride.type === type)?.time,
        drop_time: rideOptions.find((ride) => ride.type === type)?.dropTime,
        pickup_address: location?.address,
        drop_address: item?.drop_address
      }
    })
  };

  const handleRideBooking = async () => {
    try {
      setLoading(true);
    await createRide({
      vehicle:
        selectedOption === "Auto Económico"
          ? "cabEconomy"
          : selectedOption === "Auto Premium"
          ? "cabPremium"
          : selectedOption === "Motocicleta"
          ? "bike"
          : "auto",
      drop: {
        latitude: parseFloat(item.drop_latitude),
        longitude: parseFloat(item.drop_longitude),
        address: item?.drop_address
      },
      pickup: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        address: location.address
      }
    });
    const fareKeyMap: Record<string, keyof typeof farePrices> = {
      "Motocicleta": "bike",
      "Triciclo": "auto",
      "Auto Económico": "cabEconomy",
      "Auto Premium": "cabPremium",
    };

    await onAddPaymentInfo({
      paymentMethod: "Efectivo",
      value: farePrices[fareKeyMap[selectedOption]],
    });
    setLoading(false);
    } catch (error) {
      console.error("Error al crear el viaje:", error);
      
    }
  };

  return (
    <View style={rideStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#176fb0" translucent={false} />
      {item?.drop_latitude && location?.latitude && (
        <RoutesMap
          drop={{ latitude: parseFloat(item?.drop_latitude), longitude: parseFloat(item?.drop_longitude) }}
          pickup={{ latitude: parseFloat(location?.latitude), longitude: parseFloat(location?.longitude) }}
        />
      )}
      <View style={rideStyles.rideSelectionContainer}>
        <View style={rideStyles.offerContainer}>
          <CustomText fontSize={12} style={rideStyles.offerText}>
            Has obtenido $10 de descuento
          </CustomText>
        </View>
        <ScrollView contentContainerStyle={rideStyles.scrollContainer} showsVerticalScrollIndicator={false}>
          {rideOptions.map((ride, index) => (
            <RideOption key={index} ride={ride} selected={selectedOption} onSelect={handleOptionSelect} />
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={rideStyles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={RFValue(14)} style={{ left: 0 }} color={Colors.text} />
      </TouchableOpacity>
      <View style={rideStyles.bookingContainer}>
        <View style={commonStyles.flexRowBetween}>
          <View style={[rideStyles.couponContainer, { borderRightWidth: 1, borderRightColor: "#ccc" }]}>
            <Image source={require("@/assets/icons/rupee.png")} style={rideStyles.icon} />
            <View>
              <CustomText fontFamily="Medium" fontSize={12}>
                Efectivo
              </CustomText>
              <CustomText fontFamily="Medium" fontSize={10} style={{ opacity: 0.7 }}>
                A: {item?.distanceInKm} KM
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={RFValue(14)} color="#777" />
          </View>
          <View style={rideStyles.couponContainer}>
            <Image source={require("@/assets/icons/coupon.png")} style={rideStyles.icon} />
            <View>
              <CustomText fontFamily="Medium" fontSize={12}>
                GORAPIDO
              </CustomText>
              <CustomText style={{ opacity: 0.7 }} fontFamily="Medium" fontSize={10}>
                Cupón Aplicado
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={RFValue(14)} color="#777" />
          </View>
        </View>
        <CustomButton title="Realizar Viaje" disabled={loading} loading={loading} onPress={handleRideBooking} />
      </View>
    </View>
  );
};

const RideOption = React.memo(({ ride, selected, onSelect }: any) => (
  
  <TouchableOpacity
    onPress={() => onSelect(ride?.type)}
    style={[rideStyles.rideOption, { borderColor: selected === ride.type ? Colors.text : Colors.background }]}
  >
    <View style={commonStyles.flexRowBetween}>
      <Image source={ride?.icon} style={rideStyles.rideIcon} />
      <View style={rideStyles.rideDetails}>
        <CustomText fontFamily="Medium" fontSize={12}>
          {ride?.type} {ride?.isFastest && <Text style={rideStyles.fastestLabel}>SUPER RÁPIDO</Text>}
        </CustomText>
        <CustomText fontSize={10}>
          {ride?.seats} asientos » llegada: {ride?.time} {/* » Recogida: {ride?.dropTime} */}
        </CustomText>
      </View>
      <View style={rideStyles.priceContainer}>
        <CustomText fontFamily="Medium" fontSize={13}>
          {ride?.price?.toFixed(2)} CUP
        </CustomText>
        {selected === ride.type && (
          <Text style={rideStyles.discountedPrice}>${Number(ride?.price + 10).toFixed(2)}</Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

export default React.memo(RideBooking);
