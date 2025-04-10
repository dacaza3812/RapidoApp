// RoutesMap.tsx
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Mapbox, {
  MapView,
  Camera,
  Images,
  ShapeSource,
  SymbolLayer,
  LineLayer
} from '@rnmapbox/maps';
import { mapStyles } from '@/styles/mapStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { customMapStyle, tunasIntialRegion } from '@/utils/CustomMap';
import { getPoints, getRoute } from '@/utils/mapUtils';
import { Colors } from '@/utils/Constants';
import { point, lineString } from '@turf/helpers';
import markerIcon from '@/assets/icons/marker.png';
import dropMarkerIcon from '@/assets/icons/drop_marker.png';
import { Direction } from '@/utils/types';
import { RoutesView } from './LiveTrackingMap';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY || '');

interface RoutesMapProps {
  drop: { latitude: number; longitude: number };
  pickup: { latitude: number; longitude: number };
}

const RoutesMap: FC<RoutesMapProps> = ({ drop, pickup }) => {
  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const [route, setRoute] = useState<Direction | null>(null)

  // Ajusta la cámara para que se vean ambos marcadores
  const fitToMarkers = async () => {
    const coordinates: [number, number][] = [];
    if (pickup?.latitude && pickup?.longitude) {
      coordinates.push([pickup.longitude, pickup.latitude]);
    }
    if (drop?.latitude && drop?.longitude) {
      coordinates.push([drop.longitude, drop.latitude]);
    }
    if (coordinates.length === 0) return;

    // Calcula el bounding box
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;
    coordinates.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    });

    try {
      cameraRef.current?.fitBounds([minLng, minLat], [maxLng, maxLat], [50, 50, 50, 50]);
    } catch (error) {
      console.log(error);
    }
  };

  const fitToMarkersWithDelay = () => {
    setTimeout(() => {
      onNavigate()
      fitToMarkers();
    }, 500);
  };

  // Llama a fitToMarkers cuando se reciben las coordenadas
  useEffect(() => {
    if (drop?.latitude && pickup?.latitude) {
      fitToMarkersWithDelay();
    }
  }, [drop?.latitude, pickup?.latitude]);

  // Calcula la configuración inicial de la cámara
  const calculateInitialSettings = () => {
    if (pickup?.latitude && drop?.latitude) {
      const latitude = (pickup.latitude + drop.latitude) / 2;
      const longitude = (pickup.longitude + drop.longitude) / 2;
      return {
        centerCoordinate: [longitude, latitude],
        zoomLevel: 14
      };
    }
    return {
      centerCoordinate: [tunasIntialRegion.longitude, tunasIntialRegion.latitude],
      zoomLevel: 14
    };
  };

  // Construye la ruta utilizando getPoints y Turf
  let routeFeature: any = null;
  if (pickup?.latitude && drop?.latitude) {
    const routeCoords = getPoints([pickup, drop]).map(({ latitude, longitude }) => [longitude, latitude]);
    if (routeCoords.length > 0) {
      routeFeature = lineString(routeCoords);
    }
  }

  const onNavigate = async () => {
      const route = await getRoute([pickup.longitude, pickup.latitude], [drop.longitude, drop.latitude])
      setRoute(route)
    }

    const directionCoordinate = route?.routes[0].geometry.coordinates

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        onDidFinishLoadingMap={fitToMarkersWithDelay}
        styleURL='mapbox://styles/mapbox/dark-v11'
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
      >
        {/* Declaramos las imágenes para usarlas como íconos */}
        <Images
          images={{
            marker: markerIcon,
            dropMarker: dropMarkerIcon
          }}
        />

        {/* Cámara inicial */}
        <Camera ref={cameraRef} defaultSettings={calculateInitialSettings()} />

        {/* Dibujar la ruta si se dispone de puntos */}
        {directionCoordinate && <RoutesView  directionCoordinate={directionCoordinate}/>}

        {/* Marcador de recogida (pickup) */}
        {pickup?.latitude && (
          <ShapeSource id="pickup" shape={point([pickup.longitude, pickup.latitude])}>
            <SymbolLayer
              id="pickup-layer"
              style={{
                iconImage: 'marker',
                iconSize: 0.5,
                iconAnchor: 'bottom'
              }}
            />
          </ShapeSource>
        )}

        {/* Marcador de destino (drop) */}
        {drop?.latitude && (
          <ShapeSource id="drop" shape={point([drop.longitude, drop.latitude])}>
            <SymbolLayer
              id="drop-layer"
              style={{
                iconImage: 'dropMarker',
                iconSize: 0.5,
                iconAnchor: 'bottom'
              }}
            />
          </ShapeSource>
        )}
      </Mapbox.MapView>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
        <MaterialCommunityIcons name="crosshairs-gps" size={RFValue(16)} color="#3C75BE" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(RoutesMap);
