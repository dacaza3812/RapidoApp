import { View, TouchableOpacity } from 'react-native';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import Mapbox, {
  Camera,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer
} from '@rnmapbox/maps';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { mapStyles } from '@/styles/mapStyles';
import { reverseGeocode } from '@/utils/mapUtils';
import { useUserStore } from '@/store/userStore';
import { featureCollection, point } from '@turf/helpers';
import { useWS } from '@/service/WSProvider';
import bike from '@/assets/icons/bike_marker.png';
import auto from '@/assets/icons/auto_marker.png';
import cab from '@/assets/icons/cab_marker.png';

const accesToken =
  'pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa2w0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A';
Mapbox.setAccessToken(accesToken);

const Map: FC<{ height: number }> = ({ height }) => {
  const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const { setLocation, location, outOfRange, SetOutOfRange } = useUserStore();
  const [markers, setMarkers] = useState<any>([]);
  const { emit, on, off } = useWS();
  const isFocused = useIsFocused();

  const askLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        
        // Aquí podrías centrar la cámara si lo requieres
      } catch (error) {
        console.log('Error getting current location');
      }
    } else {
      console.log('Permission to acces location was denied');
    }
  };

  useEffect(() => {
    askLocationAccess();
    handleGpsButtonPress();
  }, [mapRef, isFocused]);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      emit('subscribeToZone', {
        latitude: location.latitude,
        longitude: location.longitude
      });

      on('nearbyCaptains', (captains: any[]) => {
        const updatedMarkers = captains?.map((captain) => ({
          id: captain?.id,
          latitude: captain?.coords.latitude,
          longitude: captain?.coords.longitude,
          type: 'captain',
          rotation: captain.coords.heading,
          visible: true
        }));
        setMarkers(updatedMarkers);
      });
      return () => {
        off('nearbyCaptains');
      };
    }
  }, [location, emit, on, off]);

  const handleGpsButtonPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        cameraRef.current?.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: 16,
          animationDuration: 1000
        });
        const address = await reverseGeocode(latitude, longitude);
        setLocation({
          latitude,
          longitude,
          address
        });
      }
    } catch (error) {
      console.log('Error obteniendo la ubicación:', error);
    }
  };

  // Separamos los marcadores según el tipo
  const bikeAll = markers.filter((marker: { type: string }) => marker.type === 'bike');
  const markerBike = bikeAll.map((marker: { longitude: number; latitude: number }) =>
    point([marker.longitude, marker.latitude], { marker })
  );

  const autoAll = markers.filter((marker: { type: string }) => marker.type === 'auto');
  const markerAuto = autoAll.map((marker: { longitude: number; latitude: number }) =>
    point([marker.longitude, marker.latitude], { marker })
  );

  const cabAll = markers.filter((marker: { type: string }) => marker.type === 'cab');
  const markerCab = cabAll.map((marker: { longitude: number; latitude: number }) =>
    point([marker.longitude, marker.latitude], { marker })
  );

  return (
    <View style={{ height: height, width: '100%' }}>
      <Mapbox.MapView
        ref={mapRef}
        styleURL="mapbox://styles/mapbox/dark-v11"
        style={{ flex: 1 }}
      >
        {/* Declaramos las imágenes una única vez */}
        <Images images={{ bike, auto, cab }} />

        <Camera ref={cameraRef} followUserLocation followZoomLevel={16} />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true }}
        />

        {/* Capa para cada tipo de marcador */}
        {markerBike.length > 0 && (
          <ShapeSource id="captains-bike" shape={featureCollection(markerBike)}>
            <SymbolLayer
              id="captains-icons-bike"
              style={{
                iconImage: 'bike',
                iconAllowOverlap: true,
                iconSize: 0.25,
                iconAnchor: 'bottom'
              }}
            />
          </ShapeSource>
        )}

        {markerAuto.length > 0 && (
          <ShapeSource id="captains-auto" shape={featureCollection(markerAuto)}>
            <SymbolLayer
              id="captains-icons-auto"
              style={{
                iconImage: 'auto',
                iconAllowOverlap: true,
                iconSize: 0.25,
                iconAnchor: 'bottom'
              }}
            />
          </ShapeSource>
        )}

        {markerCab.length > 0 && (
          <ShapeSource id="captains-cab" shape={featureCollection(markerCab)}>
            <SymbolLayer
              id="captains-icons-cab"
              style={{
                iconImage: 'cab',
                iconAllowOverlap: true,
                iconSize: 0.25,
                iconAnchor: 'bottom'
              }}
            />
          </ShapeSource>
        )}
      </Mapbox.MapView>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={handleGpsButtonPress}>
        <MaterialCommunityIcons name="crosshairs-gps" size={RFValue(16)} color="#3C75BE" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(Map);
