import { View, TouchableOpacity } from 'react-native';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import Mapbox, {
  Camera,
  Images,
  MapView,
  ShapeSource,
  SymbolLayer,
  LineLayer
} from '@rnmapbox/maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { mapStyles } from '@/styles/mapStyles';
import { getPoints, getRoute } from '@/utils/mapUtils';
import { Colors } from '@/utils/Constants';
import { point, lineString, featureCollection } from '@turf/helpers';
import markerIcon from '@/assets/icons/marker.png';
import dropMarkerIcon from '@/assets/icons/drop_marker.png';
import cabMarkerIcon from '@/assets/icons/cab_marker.png';
import { Direction } from '@/utils/types';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY || '');

const LiveTrackingMap: FC<{
  height: number;
  drop: any;
  pickup: any;
  captain: any;
  status: string;
}> = ({ drop, status, height, pickup, captain }) => {
  const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [route, setRoute] = useState<Direction | null>(null);
  const calculateCenter = () => {
    if (pickup?.latitude && drop?.latitude) {
      return [
        (pickup.longitude + drop.longitude) / 2,
        (pickup.latitude + drop.latitude) / 2
      ];
    }
    return [pickup?.longitude || 0, pickup?.latitude || 0];
  };

  const fitToMarkers = async () => {
    if (isUserInteracting) return;

    const coordinates = [];
    if (pickup?.latitude && status === 'START') {
      coordinates.push([pickup.longitude, pickup.latitude]);
    }
    if (drop?.latitude && status === 'ARRIVED') {
      coordinates.push([drop.longitude, drop.latitude]);
    }
    if (captain?.latitude) {
      coordinates.push([captain.longitude, captain.latitude]);
    }

    if (coordinates.length === 0) return;

    const bounds = coordinates.reduce(
      (acc, coord) => {
        return [
          Math.min(acc[0], coord[0]),
          Math.min(acc[1], coord[1]),
          Math.max(acc[2], coord[0]),
          Math.max(acc[3], coord[1])
        ];
      },
      [Infinity, Infinity, -Infinity, -Infinity]
    );

    cameraRef.current?.setCamera({
      bounds: {
        ne: [bounds[2], bounds[3]],
        sw: [bounds[0], bounds[1]],
        paddingTop: 50,
        paddingRight: 50,
        paddingBottom: 50,
        paddingLeft: 50
      },
      animationDuration: 1000
    });
  };

  useEffect(() => {
    if (pickup?.latitude || drop?.latitude || captain?.latitude) {
      onNavigate()
      fitToMarkers();
    }
  }, [drop, pickup, captain]);

  
const onNavigate = async () => {
      const routes = await getRoute([pickup.longitude, pickup.latitude], [drop.longitude, drop.latitude])
      setRoute(routes)
    }

    const directionCoordinate = route?.routes[0].geometry.coordinates


  return (
    <View style={{ height: height, width: '100%' }}>
      <Mapbox.MapView
        style={{ flex: 1 }}
        scaleBarEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        onMapIdle={() => setIsUserInteracting(false)}
        onCameraChanged={() => setIsUserInteracting(true)}
        ref={mapRef}
        styleURL='mapbox://styles/mapbox/dark-v11'
      >
        <Images
          images={{
            marker: markerIcon,
            dropMarker: dropMarkerIcon,
            cabMarker: cabMarkerIcon
          }}
        />

        <Camera
          ref={cameraRef}
          centerCoordinate={calculateCenter()}
          zoomLevel={14}
          animationMode="flyTo"
          followUserLocation={true}
          followZoomLevel={14}
          followPitch={0}
        />

        {/* Marcadores */}
        {pickup?.latitude && (
          <ShapeSource
            id="pickup"
            shape={point([pickup.longitude, pickup.latitude])}
          >
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

        {drop?.latitude && (
          <ShapeSource
            id="drop"
            shape={point([drop.longitude, drop.latitude])}
          >
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

        {captain?.latitude && (
          <ShapeSource
            id="captain"
            shape={point([captain.longitude, captain.latitude], {
              rotation: captain.heading
            })}
          >
            <SymbolLayer
              id="captain-layer"
              style={{
                iconImage: 'cabMarker',
                iconSize: 0.3,
                iconAnchor: 'bottom',
                iconRotate: ['get', 'rotation']
              }}
            />
          </ShapeSource>
        )}

        {/* Dibujar la ruta si se dispone de puntos */}
                {/* directionCoordinate && <RoutesView directionCoordinate={directionCoordinate}/> */}
      </Mapbox.MapView>

      <TouchableOpacity
        style={mapStyles.gpsButton}
        onPress={fitToMarkers}
      >
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#3C75BE"
        />
      </TouchableOpacity>
    </View>
  );
};

export const RoutesView = ({directionCoordinate}: any) => {

  return(

    <ShapeSource id="route"
                  lineMetrics
                  shape={{
                    properties: {},
                    type: "Feature",
                    geometry: {
                      type: "LineString",
                      coordinates: directionCoordinate
                    }
                  }}
                  >
                    <LineLayer
                      id="route-layer"
                      style={{
                        lineColor: Colors.primary,
                        lineCap: "round",
                        lineJoin: "round",
                        lineWidth: 2
                      }}
                    />
                  </ShapeSource>
  )
}

export default memo(LiveTrackingMap);