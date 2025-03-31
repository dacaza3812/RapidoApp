import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, Image } from 'react-native'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { modalStyles } from '@/styles/modalStyles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { getLatLong, getPlacesSuggestions, reverseGeocode } from '@/utils/mapUtils';
import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import { useUserStore } from '@/store/userStore';
import * as Location from "expo-location";
import LocationItem from './LocationItem';
import { tunasIntialRegion } from '@/utils/CustomMap';
import { mapStyles } from '@/styles/mapStyles';

// Configurar Mapbox (reemplaza con tu access token)
Mapbox.setAccessToken('pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa2w0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A');

interface MapPickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  selectedLocation: {
    latitude: number;
    longitude: number;
    address: string;
  },
  onSelectLocation: (location: any) => void;
}

const MapPickerModalMapbox: FC<MapPickerModalProps> = ({ visible, selectedLocation, onClose, title, onSelectLocation }) => {
  const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const [text, setText] = useState("");
  const { location } = useUserStore();
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locations, setLocations] = useState([]);
  const textInputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [followUser, setFollowUser] = useState(false); // Add state to control follow behavior

  const fetchLocation = async (query: string) => {
    if (query?.length > 4) {
      setQuery(query);
      const data = await getPlacesSuggestions(query);
      setLocations(data);
    } else {
      setLocations([]);
    }
  };

  useEffect(() => {
    const loadInitialLocation = async () => {
      if (selectedLocation?.latitude) {
        setAddress(selectedLocation.address);
        setRegion({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });
        cameraRef.current?.setCamera({
          centerCoordinate: [selectedLocation.longitude, selectedLocation.latitude],
          zoomLevel: 16,
          animationDuration: 1000,
        });
      } else {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = loc.coords;
          setRegion({ latitude, longitude });
          setFollowUser(true); // Activar follow para que la cámara siga al usuario
          cameraRef.current?.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 16,
            animationDuration: 1000,
          });
        } catch (error) {
          console.log("Error al obtener ubicación inicial:", error);
        }
      }
    }
    loadInitialLocation();

  }, [selectedLocation]); // Este efecto ya inicializa la cámara correctamente

  const addLocation = async (place_id: string, description: string) => {
    const data = await getLatLong(place_id, description);
    if (data) {
      setFollowUser(false); // Desactivar seguimiento
      setRegion(data); // Actualizar región con los datos correctos
      setAddress(data.address);
      cameraRef.current?.setCamera({
        centerCoordinate: [data.longitude, data.latitude],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
    textInputRef.current?.blur();
    setText("");
  };

  const renderLocations = ({ item }: any) => {
    return (
      <LocationItem item={item} onPress={() => addLocation(item?.place_id, item?.description)} />
    );
  };

  const handleRegionDidChange = async (event: any) => {
    const { geometry } = event;
    if (geometry && geometry.coordinates) {
      const [longitude, latitude] = geometry.coordinates;
      try {
        const addr = await reverseGeocode(latitude, longitude);
        setRegion({ latitude, longitude });
        setAddress(addr);
      } catch (error) {
        console.log("Error getting location", error);
      }
    }
  };

  const handleGpsButtonPress = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setFollowUser(true); // Enable follow mode
      cameraRef.current?.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: 16,
        animationDuration: 100,
      });
      const addr = await reverseGeocode(latitude, longitude);
      setAddress(addr);
      setRegion({ latitude, longitude });
    } catch (error) {
      console.log(error);
    }
  };




  return (
    <Modal
      animationType='slide'
      visible={visible}
      presentationStyle='formSheet'
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <Text style={modalStyles.centerText}>
          Seleccionar {title}
        </Text>

        <TouchableOpacity onPress={onClose}>
          <Text style={modalStyles.cancelButton}>Cancelar</Text>
        </TouchableOpacity>

        <View style={modalStyles.searchContainer}>
          { /*<Ionicons name='search-outline' size={RFValue(16)} color="#777" />
          <TextInput
            ref={textInputRef}
            style={modalStyles.input}
            placeholder='Buscar dirección'
            placeholderTextColor="#aaa"
            value={text}
            onChangeText={(e) => {
              setText(e);
              fetchLocation(e);
            }}
          /> */}
        </View>

        {text !== "" ? (
          <FlatList
            ListHeaderComponent={
              <View>
                {text.length > 4 ? null :
                  <Text style={{ marginHorizontal: 16 }}>
                    Introduzca los últimos 4 caracteres para buscar
                  </Text>
                }
              </View>
            }
            data={locations}
            renderItem={renderLocations}
            keyExtractor={(item: any) => item.place_id}
            initialNumToRender={5}
            windowSize={5}
          />
        ) : (
          <>
            <View style={{ flex: 1, width: "100%" }}>
              <Mapbox.MapView
                ref={mapRef}
                style={{ flex: 1 }}
                onRegionDidChange={handleRegionDidChange}
                logoEnabled={false}
                scaleBarEnabled={false}
                onDidFinishLoadingMap={handleGpsButtonPress}
              >
                <Camera
                  ref={cameraRef}
                  followUserLocation={followUser}
                  followZoomLevel={16}
                  animationDuration={100}
                  defaultSettings={{
                    centerCoordinate: [tunasIntialRegion.longitude, tunasIntialRegion.latitude],
                    zoomLevel: 16
                  }}
                />
              </Mapbox.MapView>
              <View style={mapStyles.centerMarkerContainer}>
                <Image
                  source={title === "drop" ? require("@/assets/icons/drop_marker.png") : require("@/assets/icons/marker.png")}
                  style={mapStyles.marker}
                />
              </View>

              <TouchableOpacity style={mapStyles.gpsButton} onPress={handleGpsButtonPress}>
                <MaterialCommunityIcons name="crosshairs-gps" size={RFValue(16)} color="#3C75BE" />
              </TouchableOpacity>
            </View>

            <View style={modalStyles.footerContainer}>
              <Text style={modalStyles.addressText} numberOfLines={2}>
                {address === "" ? "Obteniendo dirección..." : address}
              </Text>
              <View style={modalStyles.buttonContainer}>
                <TouchableOpacity style={modalStyles.button}
                  onPress={() => {
                    onSelectLocation({
                      type: title,
                      latitude: region?.latitude,
                      longitude: region?.longitude,
                      address: address
                    });
                    onClose();
                  }}
                >
                  <Text style={modalStyles.buttonText}>
                    Establecer Dirección
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default memo(MapPickerModalMapbox);
