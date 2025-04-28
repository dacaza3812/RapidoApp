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
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { mapStyles } from '@/styles/mapStyles';
import { reverseGeocode } from '@/utils/mapUtils';
import { useUserStore } from '@/store/userStore';
import { featureCollection, point } from '@turf/helpers';
import captainIcon from '@/assets/icons/cab.png';
import bikeIcon from '@/assets/icons/bike.png';
import autoIcon from '@/assets/icons/auto.png';
import autoPremium from '@/assets/icons/cab_premium.png';
import { tunasIntialRegion } from '@/utils/CustomMap';
import { supabase } from '@/lib/supabase';

// Tu Mapbox token
const accesToken = 'pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa3Q0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A';
Mapbox.setAccessToken(accesToken);
type RPCDATA = {
  id: number;
  user_id: string;
  lat: number;
  long: number;
  type_car: string;
  dist_meters: number;
}

const Map: FC<{ height: number }> = ({ height }) => {
  const mapRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const { setLocation, location, user } = useUserStore();
  const [captainMarkers, setCaptainMarkers] = useState<any[]>([]);
  const [pruebaMarkers, setpruebamarkers] = useState<RPCDATA[] >([]);

  const handleTest = async () => {
    const { data: rpcData, error: errorRpc } = await supabase.rpc('nearby_rapido_users', {
      p_lat: location?.latitude || tunasIntialRegion.latitude,
      p_long: location?.longitude || tunasIntialRegion.longitude,
      p_max_dist_meters: 3000
    })
    if(rpcData) setpruebamarkers(rpcData)
    
    console.log("RPC ", rpcData)
    console.log("errorRpc ", errorRpc)
  }

  // 1. Centrar cámara y obtener dirección
  const handleGpsButtonPress = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;

    cameraRef.current?.setCamera({
      centerCoordinate: [longitude, latitude],
      zoomLevel: 16,
      animationDuration: 200,
      animationMode: 'flyTo'
    });

    const address = await reverseGeocode(latitude, longitude);
    setLocation({ latitude, longitude, address });
    
  };

  // 2. Al montar, pedimos ubicación inicial
  useEffect(() => {
    handleGpsButtonPress();
  }, []);

  // 3. Suscripción a TODOS los cambios en "rapido_locations_users"
  useEffect(() => {
    const channel = supabase
      .channel('rapido_locations_users_changes')
      .on('postgres_changes', {
        schema: 'public',
        table: 'rapido_locations_users',
        event: '*'              // INSERT, UPDATE, DELETE
      }, async () => {
        // Tras cada cambio, recargar TODO el set de choferes
        const { data: rpcData, error: errorRpc } = await supabase.rpc('nearby_rapido_users', {
          p_lat: location?.latitude || tunasIntialRegion.latitude,
          p_long: location?.longitude || tunasIntialRegion.longitude,
          p_max_dist_meters: 3000,
          p_province: user?.user_metadata.province
        })
        

        if (errorRpc) {
          console.error('Error al recargar choferes:', errorRpc);
          return;
        }
        // Mapeamos cada registro a un marcador
        const markers = (rpcData || []).map(record => ({
          id: record.id,
          latitude: record.lat,
          longitude: record.long,
          rotation: 0.1,
          visible: true,
          iconCar: record.type_car
        }));
        setCaptainMarkers(markers);
      })
      .subscribe();

    return () => {
      // Limpieza al desmontar
      supabase.removeChannel(channel);
    };
  }, []);

console.log("captainMarkers ",captainMarkers)
  const bikeMarkers = captainMarkers.filter((marker) => marker.iconCar === 'bike');
  const bikeFeatures = bikeMarkers.map((marker) =>
    point([marker.longitude, marker.latitude], marker)
  );

  const autoMarker = captainMarkers.filter((marker) => marker.iconCar === 'auto');
  const autoFeatures = autoMarker.map((marker) =>
    point([marker.longitude, marker.latitude], marker)
  );

  const cabMarker = captainMarkers.filter((marker) => marker.iconCar === 'cab');
  const cabFeatures = cabMarker.map((marker) =>
    point([marker.longitude, marker.latitude], marker)
  );

  const cabPremiumMarker = captainMarkers.filter((marker) => marker.iconCar === 'auto_premium');
  const cabPremiumFeatures = cabPremiumMarker.map((marker) =>
    point([marker.longitude, marker.latitude], marker)
  );
  // pruebaMarkers
  const preuba = pruebaMarkers?.filter((marker) => marker.type_car === 'auto_premium');
  const cabPremiumFeaturesPrueba = preuba?.map((marker) =>
    point([marker.long, marker.lat], marker)
  );

  return (
    <View style={{ height, width: '100%' }}>
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        onDidFinishLoadingMap={handleGpsButtonPress}
        styleURL='mapbox://styles/mapbox/dark-v11'
        logoEnabled={false}
        attributionEnabled={false}
      >
        {/* Solo cargamos el ícono de captains */}
        <Images images={{ captain: captainIcon, bike: bikeIcon, auto: autoIcon, autoPremium: autoPremium }} />

        <Camera
          ref={cameraRef}
          followZoomLevel={16}
          followUserLocation={false}
          defaultSettings={{
            centerCoordinate: [tunasIntialRegion.longitude, tunasIntialRegion.latitude],
            zoomLevel: 1
          }}
        />

        <LocationPuck puckBearingEnabled pulsing={{ isEnabled: true }} />

        {/* Capa única de "captains" */}
        {cabFeatures.length > 0 && (
          <ShapeSource id="captains" shape={featureCollection(cabFeatures)}>
            <SymbolLayer
              id="captains-layer"
              style={{
                iconImage: 'captain',
                iconAllowOverlap: true,
                iconSize: 0.30,
                iconAnchor: 'bottom',
                iconRotate: ['get', 'rotation']
              }}
            />
          </ShapeSource>
        )}

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

        {cabPremiumFeatures.length > 0 && (
          <ShapeSource id="random-cabs-premium" shape={featureCollection(cabPremiumFeatures)}>
            <SymbolLayer
              id="random-cabs-premium-layer"
              style={{
                iconImage: 'autoPremium',
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


      </Mapbox.MapView>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={handleGpsButtonPress}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#3C75BE"
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(Map);