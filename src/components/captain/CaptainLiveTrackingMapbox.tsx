import { View, TouchableOpacity } from 'react-native';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import Mapbox, { Camera, Images, LineLayer, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Location from 'expo-location';
import { point } from '@turf/helpers';
import markerIcon from '@/assets/icons/marker.png';
import dropMarkerIcon from '@/assets/icons/drop_marker.png';
import cabMarkerIcon from '@/assets/icons/cab_marker.png';
import { Direction } from '@/utils/types';
import { RoutesView } from '../customer/LiveTrackingMap';
import { Colors } from '@/utils/Constants';
import { getRoute } from '@/utils/mapUtils';
import { mapStyles } from '@/styles/mapStyles';
import { useWS } from '@/service/WSProvider';

const apikey = process.env.EXPO_PUBLIC_MAPBOX_API_KEY || 'sk.eyJ1IjoiZGFjYXphIiwiYSI6ImNtNmpjMmhmajBobWoya3ByNGhlMnZlZWgifQ.QJmQ4pkf78lHlqTFIUCXTQ';

const CaptainLiveTrackingMapbox: FC<{ drop: any; pickup: any; captain: any; status: string }> = ({
  drop,
  status,
  pickup,
  captain,
}) => {
  const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [destiny, setDestiny] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<Direction | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);



  useEffect(() => {
    Mapbox.setAccessToken(apikey);
    // Se mantiene la obtención de la ubicación del dispositivo por si se requiere en otros contextos
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      setCurrentLocation([coords.longitude, coords.latitude]);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // Se invoca la navegación usando las coordenadas del "captain" como punto de partida
  useEffect(() => {
    if (captain?.latitude && destiny) {
      onNavigate();
    }
  }, [captain, destiny, status]);

  useEffect(() => {
    if (status === 'START' && pickup?.latitude) {
      setDestiny([pickup.longitude, pickup.latitude]);
    } else if (status === 'ARRIVED' && drop?.latitude) {
      setDestiny([drop.longitude, drop.latitude]);
    }
    fitToMarkers()
  }, [status, pickup, drop]);

  const onNavigate = async () => {
    if (!captain || !destiny) return;

    try {
      // Se utiliza la ubicación del "captain" para iniciar la ruta
      const startPoint: [number, number] = [captain.longitude, captain.latitude];
      const routes = await getRoute(startPoint, destiny);
      setRoute(routes);
    } catch (error) {
      console.error('Error getting route:', error);
    }
  };

  const fitToMarkers = async () => {
    if (isUserInteracting) return;

    const coordinates = [];
    if (captain?.latitude) coordinates.push([captain.longitude, captain.latitude]);
    if (status === 'START' && pickup?.latitude) coordinates.push([pickup.longitude, pickup.latitude]);
    if (status === 'ARRIVED' && drop?.latitude) coordinates.push([drop.longitude, drop.latitude]);

    if (coordinates.length === 0) return;

    const bounds = coordinates.reduce(
      (acc, coord) => [
        Math.min(acc[0], coord[0]),
        Math.min(acc[1], coord[1]),
        Math.max(acc[2], coord[0]),
        Math.max(acc[3], coord[1]),
      ],
      [Infinity, Infinity, -Infinity, -Infinity]
    );

    cameraRef.current?.setCamera({
      bounds: {
        ne: [bounds[2], bounds[3]],
        sw: [bounds[0], bounds[1]],
        paddingTop: 50,
        paddingRight: 50,
        paddingBottom: 50,
        paddingLeft: 50,
      },
      animationDuration: 1000,
    });
  };

 

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        style={{ flex: 1 }}
        scaleBarEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        onMapIdle={() => setIsUserInteracting(false)}
        onCameraChanged={() => setIsUserInteracting(true)}
        ref={mapRef}
        styleURL="mapbox://styles/mapbox/dark-v11"
      >
        <Images
          images={{
            marker: markerIcon,
            dropMarker: dropMarkerIcon,
            cabMarker: cabMarkerIcon,
          }}
        />

        <Camera
          ref={cameraRef}
          defaultSettings={{
            // Se centra la cámara en la ubicación del "captain" si existe, o en la ubicación del dispositivo
            centerCoordinate: captain
              ? [captain.longitude, captain.latitude]
              : currentLocation || [0, 0],
            zoomLevel: 14,
          }}
        />

        {/* Marcadores */}
        {pickup?.latitude && (
          <ShapeSource id="pickup" shape={point([pickup.longitude, pickup.latitude])}>
            <SymbolLayer
              id="pickup-layer"
              style={{
                iconImage: 'marker',
                iconSize: 0.5,
                iconAnchor: 'bottom',
              }}
            />
          </ShapeSource>
        )}

        {drop?.latitude && (
          <ShapeSource id="drop" shape={point([drop.longitude, drop.latitude])}>
            <SymbolLayer
              id="drop-layer"
              style={{
                iconImage: 'dropMarker',
                iconSize: 0.5,
                iconAnchor: 'bottom',
              }}
            />
          </ShapeSource>
        )}

        {captain?.latitude && (
          <ShapeSource
            id="captain"
            shape={point([captain.longitude, captain.latitude], { rotation: captain.heading })}
          >
            <SymbolLayer
              id="captain-layer"
              style={{
                iconImage: 'cabMarker',
                iconSize: 0.3,
                iconAnchor: 'bottom',
                iconRotate: ['get', 'rotation'],
              }}
            />
          </ShapeSource>
        )}

        {/* Ruta */}
        {route?.routes[0]?.geometry?.coordinates && (
          <RoutesView directionCoordinate={route.routes[0].geometry.coordinates} />
        )}
      </Mapbox.MapView>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
        <MaterialCommunityIcons name="crosshairs-gps" size={RFValue(16)} color="#3C75BE" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(CaptainLiveTrackingMapbox);
