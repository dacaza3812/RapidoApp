import { View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, StyleSheet, Modal, Pressable } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useWS } from '@/service/WSProvider';
import { rideStyles } from '@/styles/rideStyles';
import { commonStyles } from '@/styles/commonStyles';
import { vehicleIcons } from '@/utils/mapUtils';
import CustomText from '../shared/CustomText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/utils/Constants';
import { resetAndNavigate } from '@/utils/Helpers';
import ReusableModal from '../shared/CustomAlert';
import { customEvent } from '@/lib/events';

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium"

interface RideItem {
  vehicle?: VehicleType;
  _id: string,
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
  status?: string
}

const SearchingRideSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS()
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelRoad = () => {
    setModalVisible(false);
    emit("cancelRide", item?._id)
    resetAndNavigate("/customer/home")
  }

  const mainText =
    item?.status === "SEARCHING_FOR_CAPTAIN"
      ? "¿Cancelar el viaje?"
      : "Al cancelar un viaje incurres en gastos para el chofer, en próximas versiones se aplicarán cargos por cancelación";
  const descriptionText = "Deseas realmente cancelar el viaje";

  const closeModal = () => {
    setModalVisible(false);
  };


  const handleBackRide = async () => {
    if (!item._id) {
      Alert.alert("Error", "Identificador de viaje inválido.");
      return;
    }

    setIsLoading(true);
    try {
      await customEvent({
        eventName: "change_ride_type",
        payload: {
          rideId: item._id,
          status: item.status!,
        },
      });
      // Notificamos al servidor que cancelamos
      emit("cancelRide", item._id);
      // Volvemos atrás solo si todo fue exitoso
      router.back();
    } catch (error) {
      console.error("Error al regresar ride:", error);
      Alert.alert("Oops", "No fue posible regresar al paso anterior.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View>
      <ReusableModal
        visible={modalVisible}
        mainText={mainText}
        descriptionText={descriptionText}
        leftButtonText="Cancelar Viaje"
        rightButtonText="Cancelar"
        onLeftButtonPress={handleCancelRoad}
        onRightButtonPress={closeModal}
      />
      <View style={rideStyles?.headerContainer}>
        <View style={commonStyles.flexRowBetween}>
          {item?.vehicle && (
            <Image
              source={vehicleIcons[item.vehicle]?.icon}
              style={rideStyles?.rideIcon}
            />
          )}
          <View>
            <CustomText fontSize={10}>Buscando para ti</CustomText>
            <CustomText fontFamily='Medium' fontSize={12}>Viaje en {item?.vehicle === "bike" ? "Motocicleta" : item?.vehicle === "auto" ? "Triciclo" : item?.vehicle === "cabEconomy" ? "Auto Económico" : item?.vehicle === "cabPremium" ? "Auto Premium" : item?.vehicle}</CustomText>
          </View>
        </View>

        <ActivityIndicator
          color={Colors.text}
          size="small"
        />
      </View>


      <View style={{ padding: 10 }}>
        <CustomText fontFamily='Bold' fontSize={12}>
          Detalles de Ubicación
        </CustomText>

        <View style={[commonStyles?.flexRowGap, { marginVertical: 15, width: "90%" }]}>
          <Image
            source={require("@/assets/icons/marker.png")}
            style={rideStyles?.pinIcon}
          />
          <CustomText fontSize={10} numberOfLines={2}>
            {item?.pickup?.address}
          </CustomText>
        </View>

        <View style={[commonStyles.flexRowGap, { width: "90%" }]}>
          <Image source={require("@/assets/icons/drop_marker.png")} style={rideStyles.pinIcon} />
          <CustomText fontSize={10} numberOfLines={2}>
            {item?.drop?.address}
          </CustomText>
        </View>

        <View style={{ marginVertical: 20 }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View style={[commonStyles.flexRow]}>
              <MaterialCommunityIcons name='credit-card' size={24} color="black" />
              <CustomText style={{ marginLeft: 10 }} fontFamily='SemiBold' fontSize={12}>
                Pago
              </CustomText>
            </View>

            <CustomText fontFamily='SemiBold' fontSize={14}>
              $ {item?.fare?.toFixed(2)} CUP
            </CustomText>
          </View>

          <CustomText fontSize={10}>
            Pagar en efectivo
          </CustomText>
        </View>
      </View>

      <View style={rideStyles?.bottomButtonContainer}>
        <TouchableOpacity
          style={rideStyles.cancelButton}
          onPress={() => setModalVisible(true)}
        // disabled={item.status !== "SEARCHING_FOR_CAPTAIN"}
        >
          <CustomText style={rideStyles?.cancelButtonText}>
            Cancelar
          </CustomText>
        </TouchableOpacity>

        {/* Botón "Atrás" deshabilitado si el viaje ya comenzó */}
        

        <TouchableOpacity
        style={rideStyles.backButton2}
          onPress={handleBackRide}
          disabled={isLoading || item.status !== "SEARCHING_FOR_CAPTAIN"}
        >
          {isLoading
            ? <ActivityIndicator size="small" color="#fff" />
            : <CustomText style={rideStyles?.backButtonText}>Atrás</CustomText>}
        </TouchableOpacity>
      </View>

    </View>

  )
}

export default SearchingRideSheet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialog: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: 150,
  },
  dialogText: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: 'center'
  },
  dialogTextDescription: {
    fontSize: 10,
    marginBottom: 25,
    textAlign: 'center'
  }
});