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
import captainIcon from '@/assets/icons/cab.png'; // Asegúrate de tener un ícono para los "captains"

const accesToken =
  'pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa2w0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A';
Mapbox.setAccessToken(accesToken);

const Map: FC<{ height: number }> = ({ height }) => {
  const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const { setLocation, location, outOfRange } = useUserStore();
  const [captainMarkers, setCaptainMarkers] = useState<any[]>([]);
  const [randomMarkers, setRandomMarkers] = useState<any[]>([]);
  const { emit, on, off } = useWS();
  const isFocused = useIsFocused();

  const askLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        // Se puede centrar la cámara en la ubicación inicial
        handleGpsButtonPress();
      } catch (error) {
        console.log('Error getting current location', error);
      }
    } else {
      console.log('Permission to access location was denied');
    }
  };

  useEffect(() => {
    askLocationAccess();
  }, [mapRef, isFocused]);

  // Manejo del WebSocket para los marcadores de "captains"
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
        setCaptainMarkers(updatedMarkers);
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
          animationDuration: 200,
          animationMode: "flyTo"
        });
        const address = await reverseGeocode(latitude, longitude);
        setLocation({ latitude, longitude, address });
      }
    } catch (error) {
      console.log('Error obteniendo la ubicación:', error);
    }
  };

  // Genera marcadores aleatorios sólo si se tiene una ubicación y no se está fuera de rango
  const generateRandomMarkers = () => {
    if (!location?.latitude || !location?.longitude || outOfRange) return;

    const types = ["bike", "auto", "cab"];
    const newMarkers = Array.from({ length: 20 }, (_, index) => {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomRotation = Math.floor(Math.random() * 360);
      return {
        id: `random-${index}`,
        latitude: location.latitude + (Math.random() - 0.5) * 0.01,
        longitude: location.longitude + (Math.random() - 0.5) * 0.01,
        type: randomType,
        rotation: randomRotation,
        visible: true
      };
    });
    setRandomMarkers(newMarkers);
  };
/*
  useEffect(() => {
    generateRandomMarkers();
  }, [location]);
*/
  // Filtrado de los marcadores por tipo
  const bikeMarkers = randomMarkers.filter((marker) => marker.type === 'bike');
  const autoMarkers = randomMarkers.filter((marker) => marker.type === 'auto');
  const cabMarkers = randomMarkers.filter((marker) => marker.type === 'cab');

  // Preparamos los datos para cada capa (usamos @turf/helpers para generar puntos)
  const bikeFeatures = bikeMarkers.map((marker) =>
    point([marker.longitude, marker.latitude], marker)
  );
  const autoFeatures = autoMarkers.map((marker) =>
    point([marker.longitude, marker.latitude], marker)
  );
  const cabFeatures = cabMarkers.map((marker) =>
    point([marker.longitude, marker.latitude], marker)
  );
  const captainFeatures = captainMarkers.map((marker) =>
    point([marker.longitude, marker.latitude], marker)
  );

  const handleOnDidFinishLoadingMap = async () => {
    await handleGpsButtonPress();
  };

  return (
    <View style={{ height: height, width: '100%' }}>
      <Mapbox.MapView
        scaleBarEnabled={false}
        logoEnabled={false}
        ref={mapRef}
        style={{ flex: 1 }}
        onDidFinishLoadingMap={handleOnDidFinishLoadingMap}
        styleURL='mapbox://styles/mapbox/dark-v11'
        attributionEnabled={false}  
      >
        {/* Declaramos las imágenes sólo una vez */}
        <Images images={{ bike, auto, cab, captain: captainIcon }} />

        <Camera
          ref={cameraRef}
          followZoomLevel={16}
          followUserLocation={!!location?.latitude ? false : true}
        />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true }}
        />

        {/* Capa para marcadores aleatorios */}
        {bikeFeatures.length > 0 && (
          <ShapeSource id="random-bikes" shape={featureCollection(bikeFeatures)}>
            <SymbolLayer
              id="random-bikes-layer"
              style={{
                iconImage: 'bike',
                iconAllowOverlap: true,
                iconSize: 0.25,
                iconAnchor: 'bottom',
                iconRotate: ['get', 'rotation']
              }}
            />
          </ShapeSource>
        )}

        {autoFeatures.length > 0 && (
          <ShapeSource id="random-autos" shape={featureCollection(autoFeatures)}>
            <SymbolLayer
              id="random-autos-layer"
              style={{
                iconImage: 'auto',
                iconAllowOverlap: true,
                iconSize: 0.25,
                iconAnchor: 'bottom',
                iconRotate: ['get', 'rotation']
              }}
            />
          </ShapeSource>
        )}

        {cabFeatures.length > 0 && (
          <ShapeSource id="random-cabs" shape={featureCollection(cabFeatures)}>
            <SymbolLayer
              id="random-cabs-layer"
              style={{
                iconImage: 'cab',
                iconAllowOverlap: true,
                iconSize: 0.25,
                iconAnchor: 'bottom',
                iconRotate: ['get', 'rotation']
              }}
            />
          </ShapeSource>
        )}

        {/* Capa para los marcadores de "captains" recibidos vía WS */}
        {captainFeatures.length > 0 && (
          <ShapeSource id="captains" shape={featureCollection(captainFeatures)}>
            <SymbolLayer
              id="captains-layer"
              style={{
                iconImage: 'captain',
                iconAllowOverlap: true,
                iconSize: 0.25,
                iconAnchor: 'bottom',
                iconRotate: ['get', 'rotation']
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
