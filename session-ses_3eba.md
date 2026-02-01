# Analizando mapa motor para Mapbox alternativa de servidor de mapas

**Session ID:** ses_3eba34249ffeBtru2r7tS7jb2Y
**Created:** 31/1/2026, 9:02:28
**Updated:** 31/1/2026, 9:08:03

---

## User

Revisa mi proyecto, estoy usando mapbox para renderizar los mapas en mi aplicación móvil pero ya he llegado al límite gratuito de peticiones de la api de mapbox. Necesito que analices mi proyecto y me des una guía para implementar mi propio servidor de mapas, lo idea sería que fuera compatible con mi implementación de mapbox para no romper nada, pero si no es posible, también dime qué componentes debería entonces modificar. NO MODIFIQUES NADA DEL CÓDIGO, SOLAMENTE QUIERO QUE INVESTIGUES Y ME DES LOS RESULTADOS PARA ENTONCES YO TOMAR UNA DESICIÓN

---

## Assistant

```
Tool: todowrite

**Input:**
```json
{
  "todos": [
    {
      "content": "Analizar implementación actual de Mapbox en el proyecto",
      "status": "in_progress",
      "priority": "high",
      "id": "1"
    },
    {
      "content": "Investigar opciones de servidores de mapas propios compatibles con Mapbox",
      "status": "pending",
      "priority": "high",
      "id": "2"
    },
    {
      "content": "Identificar componentes que necesitarían modificaciones",
      "status": "pending",
      "priority": "high",
      "id": "3"
    },
    {
      "content": "Crear guía de implementación con recomendaciones",
      "status": "pending",
      "priority": "medium",
      "id": "4"
    }
  ]
}
```
**Output:**
```
[
  {
    "content": "Analizar implementación actual de Mapbox en el proyecto",
    "status": "in_progress",
    "priority": "high",
    "id": "1"
  },
  {
    "content": "Investigar opciones de servidores de mapas propios compatibles con Mapbox",
    "status": "pending",
    "priority": "high",
    "id": "2"
  },
  {
    "content": "Identificar componentes que necesitarían modificaciones",
    "status": "pending",
    "priority": "high",
    "id": "3"
  },
  {
    "content": "Crear guía de implementación con recomendaciones",
    "status": "pending",
    "priority": "medium",
    "id": "4"
  }
]
```
```



---

## Assistant

```
Tool: grep

**Input:**
```json
{
  "pattern": "mapbox|Mapbox",
  "path": "D:\\rapido-final\\rapido\\rapido-app",
  "include": "*.{ts,tsx,js,jsx,json}"
}
```
**Output:**
```
Found 71 matches
D:\rapido-final\rapido\rapido-app\package-lock.json:
  Line 14:         "@mapbox/polyline": "^1.2.1",
  Line 20:         "@rnmapbox/maps": "^10.1.37",
  Line 66:         "@types/mapbox__polyline": "^1.0.5",
  Line 4496:     "node_modules/@mapbox/polyline": {
  Line 4498:       "resolved": "https://registry.npmjs.org/@mapbox/polyline/-/polyline-1.2.1.tgz",
  Line 5313:     "node_modules/@rnmapbox/maps": {
  Line 5315:       "resolved": "https://registry.npmjs.org/@rnmapbox/maps/-/maps-10.1.37.tgz",
  Line 5329:         "mapbox-gl": "^2.9.0",
  Line 5338:         "mapbox-gl": {
  Line 5346:     "node_modules/@rnmapbox/maps/node_modules/@turf/helpers": {
  Line 5954:     "node_modules/@types/mapbox__polyline": {
  Line 5956:       "resolved": "https://registry.npmjs.org/@types/mapbox__polyline/-/mapbox__polyline-1.0.5.tgz",

D:\rapido-final\rapido\rapido-app\package.json:
  Line 20:       "node_modules/(?!((react-native.*|@react-native.*|expo.*|@expo.*|react-native-responsive-fontsize|@rnmapbox/.*|react-native-maps|react-native-mmkv|@gorhom/.*|react-native-gesture-handler|react-native-reanimated)/))"
  Line 41:     "@mapbox/polyline": "^1.2.1",
  Line 47:     "@rnmapbox/maps": "^10.1.37",
  Line 93:     "@types/mapbox__polyline": "^1.0.5",

D:\rapido-final\rapido\rapido-app\jest.setup.js:
  Line 83: // Mock @rnmapbox/maps
  Line 84: jest.mock('@rnmapbox/maps', () => {

D:\rapido-final\rapido\rapido-app\src\app\customer\selectlocations.tsx:
  Line 20: import MapPickerModal from "@/components/customer/MapPickerModalMapbox"

D:\rapido-final\rapido\rapido-app\src\components\customer\MapPickerModalMapbox.tsx:
  Line 7: import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
  Line 15: // Configurar Mapbox (reemplaza con tu access token)
  Line 16: Mapbox.setAccessToken('pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa2w0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A');
  Line 30: const MapPickerModalMapbox: FC<MapPickerModalProps> = ({ visible, selectedLocation, onClose, title, onSelectLocation }) => {
  Line 141:       await onCustomScreenView("MapPickerModalMapbox", "Customer")
  Line 223:               <Mapbox.MapView
  Line 230:                 styleURL='mapbox://styles/mapbox/dark-v11'
  Line 243:               </Mapbox.MapView>
  Line 277: export default memo(MapPickerModalMapbox);

D:\rapido-final\rapido\rapido-app\src\app\captain\liveride.tsx:
  Line 10: import CaptainLiveTrackingMapbox from '@/components/captain/CaptainLiveTrackingMapbox';
  Line 111:         <CaptainLiveTrackingMapbox

D:\rapido-final\rapido\rapido-app\app.json:
  Line 54:         "@rnmapbox/maps",
  Line 56:           "RNMapboxMapsDownloadToken": "sk.eyJ1IjoiZGFjYXphIiwiYSI6ImNtOGdvdHRxMzBxbWkya3B3bGxoZHk1MnkifQ.HIuCzXQQeAPcUtg7_2aMHg",
  Line 57:           "RNMapboxMapsVersion": "11.0.0"

D:\rapido-final\rapido\rapido-app\src\components\shared\Map.tsx:
  Line 3: import Mapbox, {
  Line 10: } from '@rnmapbox/maps';
  Line 27: Mapbox.setAccessToken(accesToken);
  Line 150:       <Mapbox.MapView
  Line 156:         styleURL='mapbox://styles/mapbox/dark-v11'
  Line 234:       </Mapbox.MapView>

D:\rapido-final\rapido\rapido-app\src\utils\mapUtils.tsx:
  Line 9:         const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${description}.json`, {
  Line 17:             const location = data.features[0].geometry.coordinates; // Mapbox devuelve [longitude, latitude]
  Line 21:                 latitude: location[1],  // Mapbox: [lon, lat], se invierte para que sea lat, lon
  Line 36:             `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
  Line 58:         place_id: item.id,  // Mapbox usa 'id' en lugar de 'place_id'
  Line 68:             `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
  Line 79:         // Procesar los resultados de Mapbox para que coincidan con tu estructura
  Line 189:     const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]}, ${origin[1]}; ${dest[0]}, ${dest[1]}?alternatives=false&annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa2w0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A`);

D:\rapido-final\rapido\rapido-app\src\components\customer\RoutesMap.tsx:
  Line 4: import Mapbox, {
  Line 11: } from '@rnmapbox/maps';
  Line 25: Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY || '');
  Line 33:   const mapRef = useRef<Mapbox.MapView>(null);
  Line 123:       <Mapbox.MapView
  Line 127:         styleURL='mapbox://styles/mapbox/dark-v11'
  Line 173:       </Mapbox.MapView>

D:\rapido-final\rapido\rapido-app\src\components\customer\LiveTrackingMap.tsx:
  Line 3: import Mapbox, {
  Line 10: } from '@rnmapbox/maps';
  Line 23: Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY || '');
  Line 112:       <Mapbox.MapView
  Line 120:         styleURL='mapbox://styles/mapbox/dark-v11'
  Line 194:       </Mapbox.MapView>

D:\rapido-final\rapido\rapido-app\src\components\captain\CaptainLiveTrackingMapbox.tsx:
  Line 3: import Mapbox, { Camera, Images, LineLayer, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
  Line 20: const CaptainLiveTrackingMapbox: FC<{ drop: any; pickup: any; captain: any; status: string }> = ({
  Line 34:     Mapbox.setAccessToken(apikey);
  Line 106:       <Mapbox.MapView
  Line 114:         styleURL="mapbox://styles/mapbox/dark-v11"
  Line 190:       </Mapbox.MapView>
  Line 199: export default memo(CaptainLiveTrackingMapbox);

D:\rapido-final\rapido\rapido-app\src\components\shared\MapViewDirectionsAlt.tsx:
  Line 4: import polyline from '@mapbox/polyline';
  Line 15:   apikey: string; // Tu token de Mapbox
  Line 42:         // Mapbox espera coordenadas en el formato "long,lat"
  Line 45:         const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoord};${destinationCoord}`;
```
```



```
Tool: glob

**Input:**
```json
{
  "pattern": "**/*[Mm]apbox*",
  "path": "D:\\rapido-final\\rapido\\rapido-app"
}
```
**Output:**
```
D:\rapido-final\rapido\rapido-app\src\components\customer\MapPickerModalMapbox.tsx
D:\rapido-final\rapido\rapido-app\src\components\captain\CaptainLiveTrackingMapbox.tsx
```
```

```
Tool: grep

**Input:**
```json
{
  "pattern": "@rnmapbox/maps",
  "path": "D:\\rapido-final\\rapido\\rapido-app",
  "include": "*.{ts,tsx,js,jsx,json}"
}
```
**Output:**
```
Found 13 matches
D:\rapido-final\rapido\rapido-app\package-lock.json:
  Line 20:         "@rnmapbox/maps": "^10.1.37",
  Line 5313:     "node_modules/@rnmapbox/maps": {
  Line 5315:       "resolved": "https://registry.npmjs.org/@rnmapbox/maps/-/maps-10.1.37.tgz",
  Line 5346:     "node_modules/@rnmapbox/maps/node_modules/@turf/helpers": {

D:\rapido-final\rapido\rapido-app\package.json:
  Line 47:     "@rnmapbox/maps": "^10.1.37",

D:\rapido-final\rapido\rapido-app\jest.setup.js:
  Line 83: // Mock @rnmapbox/maps
  Line 84: jest.mock('@rnmapbox/maps', () => {

D:\rapido-final\rapido\rapido-app\src\components\customer\MapPickerModalMapbox.tsx:
  Line 7: import Mapbox, { Camera, MapView } from '@rnmapbox/maps';

D:\rapido-final\rapido\rapido-app\app.json:
  Line 54:         "@rnmapbox/maps",

D:\rapido-final\rapido\rapido-app\src\components\shared\Map.tsx:
  Line 10: } from '@rnmapbox/maps';

D:\rapido-final\rapido\rapido-app\src\components\customer\RoutesMap.tsx:
  Line 11: } from '@rnmapbox/maps';

D:\rapido-final\rapido\rapido-app\src\components\customer\LiveTrackingMap.tsx:
  Line 10: } from '@rnmapbox/maps';

D:\rapido-final\rapido\rapido-app\src\components\captain\CaptainLiveTrackingMapbox.tsx:
  Line 3: import Mapbox, { Camera, Images, LineLayer, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
```
```

---

## Assistant

```
Tool: read

**Input:**
```json
{
  "filePath": "D:\\rapido-final\\rapido\\rapido-app\\src\\utils\\mapUtils.tsx"
}
```
**Output:**
```
<file>
00001| import axios from "axios";
00002| import { useUserStore } from "@/store/userStore";
00003| import { MapBox, type calculateDistance  as calculateDistanceType} from "./types";
00004| import { useEffect, useState } from "react";
00005| const apikey = process.env.EXPO_PUBLIC_MAPBOX_API_KEY || "sk.eyJ1IjoiZGFjYXphIiwiYSI6ImNtNmpjMmhmajBobWoya3ByNGhlMnZlZWgifQ.QJmQ4pkf78lHlqTFIUCXTQ"
00006| 
00007| export const getLatLong = async (placeId: string, description: string) => {
00008|     try {
00009|         const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${description}.json`, {
00010|             params: {
00011|                 placeid: placeId,
00012|                 access_token: apikey,
00013|             },
00014|         });
00015|         const data = response.data;
00016|         if (data.features.length > 0) {
00017|             const location = data.features[0].geometry.coordinates; // Mapbox devuelve [longitude, latitude]
00018|             const address = data.features[0].place_name;
00019| 
00020|             return {
00021|                 latitude: location[1],  // Mapbox: [lon, lat], se invierte para que sea lat, lon
00022|                 longitude: location[0],
00023|                 address: address,
00024|             };
00025|         } else {
00026|             throw new Error('Unable to fetch location details');
00027|         }
00028|     } catch (error) {
00029|         throw new Error('Unable to fetch location details');
00030|     }
00031| }
00032| 
00033| export const reverseGeocode = async (latitude: number, longitude: number) => {
00034|     try {
00035|         const response = await axios.get(
00036|             `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
00037|             {
00038|                 params: {
00039|                     access_token: apikey,
00040|                 }
00041|             }
00042|         );
00043|         if (response.data.features.length > 0) {
00044|             const address = response.data.features[0].place_name;
00045|             return address;
00046|         } else {
00047|             console.log('Geocoding failed: ', response.data.status);
00048|             return "";
00049|         }
00050|     } catch (error) {
00051|         console.log('Error during reverse geocoding: ', error);
00052|         return "";
00053|     }
00054| };
00055| 
00056| function extractPlaceData(data: any) {
00057|     return data.map((item: any) => ({
00058|         place_id: item.id,  // Mapbox usa 'id' en lugar de 'place_id'
00059|         title: item.text,   // 'text' es el nombre del lugar
00060|         description: item.place_name,  // 'place_name' es la descripción del lugar
00061|     }));
00062| }
00063| 
00064| export const getPlacesSuggestions = async (query: string) => {
00065|     const { location } = useUserStore.getState();
00066|     try {
00067|         const response = await axios.get(
00068|             `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
00069|             {
00070|                 params: {
00071|                     proximity: `${location?.longitude},${location?.latitude}`,
00072|                     access_token: apikey,
00073|                 }
00074|             }
00075|         );
00076| 
00077|         console.log("RESPONSE", location)
00078| 
00079|         // Procesar los resultados de Mapbox para que coincidan con tu estructura
00080|         return extractPlaceData(response.data.features);
00081| 
00082|     } catch (error) {
00083|         console.error('Error fetching autocomplete suggestions:', error);
00084|         return [];
00085|     }
00086| };
00087| 
00088| export const calculateDistance = ({lat1, lon1, lat2, lon2}: calculateDistanceType) => {
00089|     const R = 6371;
00090|     const dLat = (lat2 - lat1) * (Math.PI / 180);
00091|     const dLon = (lon2 - lon1) * (Math.PI / 180);
00092|     const a =
00093|         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
00094|         Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
00095|         Math.sin(dLon / 2) * Math.sin(dLon / 2);
00096|     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
00097|     return R * c;
00098| };
00099| 
00100| export const calculateFare = (distance: number) => {
00101|     const rateStructure = {
00102|         bike: { baseFare: 100, perKmRate: 150, minimumFare: 200 },
00103|         auto: { baseFare: 200, perKmRate: 150, minimumFare: 300 },
00104|         cabEconomy: { baseFare: 200, perKmRate: 250, minimumFare: 400 },
00105|         cabPremium: { baseFare: 200, perKmRate: 300, minimumFare: 500 },
00106|     };
00107| 
00108|     const fareCalculation = (baseFare: number, perKmRate: number, minimumFare: number) => {
00109|         const calculatedFare = baseFare + (distance * perKmRate);
00110|         const maxFare = Math.max(calculatedFare, minimumFare);
00111|         return Math.floor(maxFare / 10) * 10; // Redondeo hacia abajo al múltiplo de 10
00112|     };
00113| 
00114|     return {
00115|         bike: fareCalculation(rateStructure.bike.baseFare, rateStructure.bike.perKmRate, rateStructure.bike.minimumFare),
00116|         auto: fareCalculation(rateStructure.auto.baseFare, rateStructure.auto.perKmRate, rateStructure.auto.minimumFare),
00117|         cabEconomy: fareCalculation(rateStructure.cabEconomy.baseFare, rateStructure.cabEconomy.perKmRate, rateStructure.cabEconomy.minimumFare),
00118|         cabPremium: fareCalculation(rateStructure.cabPremium.baseFare, rateStructure.cabPremium.perKmRate, rateStructure.cabPremium.minimumFare),
00119|     };
00120| }
00121| 
00122| function quadraticBezierCurve(p1: any, p2: any, controlPoint: any, numPoints: any) {
00123|     const points = [];
00124|     const step = 1 / (numPoints - 1);
00125| 
00126|     for (let t = 0; t <= 1; t += step) {
00127|         const x =
00128|             (1 - t) ** 2 * p1[0] +
00129|             2 * (1 - t) * t * controlPoint[0] +
00130|             t ** 2 * p2[0];
00131|         const y =
00132|             (1 - t) ** 2 * p1[1] +
00133|             2 * (1 - t) * t * controlPoint[1] +
00134|             t ** 2 * p2[1];
00135|         const coord = { latitude: x, longitude: y };
00136|         points.push(coord);
00137|     }
00138| 
00139|     return points;
00140| }
00141| 
00142| const calculateControlPoint = (p1: any, p2: any) => {
00143|     const d = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
00144|     const scale = 1; // Scale factor to reduce bending
00145|     const h = d * scale; // Reduced distance from midpoint
00146|     const w = d / 2;
00147|     const x_m = (p1[0] + p2[0]) / 2;
00148|     const y_m = (p1[1] + p2[1]) / 2;
00149| 
00150|     const x_c =
00151|         x_m +
00152|         ((h * (p2[1] - p1[1])) /
00153|             (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
00154|         (w / d);
00155|     const y_c =
00156|         y_m -
00157|         ((h * (p2[0] - p1[0])) /
00158|             (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
00159|         (w / d);
00160| 
00161|     const controlPoint = [x_c, y_c];
00162|     return controlPoint;
00163| };
00164| 
00165| export const getPoints = (places: any) => {
00166|     const p1 = [places[0].latitude, places[0].longitude];
00167|     const p2 = [places[1].latitude, places[1].longitude];
00168|     const controlPoint = calculateControlPoint(p1, p2);
00169| 
00170|     return quadraticBezierCurve(p1, p2, controlPoint, 100);
00171| };
00172| 
00173| export const vehicleIcons: Record<'bike' | 'auto' | 'cabEconomy' | 'cabPremium', { icon: any }> = {
00174|     bike: { icon: require('@/assets/icons/bike.png') },
00175|     auto: { icon: require('@/assets/icons/auto.png') },
00176|     cabEconomy: { icon: require('@/assets/icons/cab.png') },
00177|     cabPremium: { icon: require('@/assets/icons/cab_premium.png') },
00178|   };
00179|   
00180|   export const calculateEstimatedArrival = (distance: number, averageSpeed: number = 40): Date => {
00181|     // Calcula el tiempo de viaje en minutos
00182|     const travelTimeMinutes = (distance / averageSpeed) * 60;
00183|     const arrivalDate = new Date();
00184|     arrivalDate.setMinutes(arrivalDate.getMinutes() + travelTimeMinutes);
00185|     return arrivalDate;
00186|   };
00187| 
00188|   export const getRoute = async(origin: any[], dest: any[]) => {
00189|     const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]}, ${origin[1]}; ${dest[0]}, ${dest[1]}?alternatives=false&annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa2w0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A`);
00190|     return await res.json()
00191|   }
00192| 
00193|   export const useGetRoute = (origin: number[], dest: number[]) => {
00194|     const [route, setRoute] = useState<MapBox | null>(null);
00195|     const [distance, setDistance] = useState<number | null>(null);
00196|     const [duration, setDuration] = useState<number | null>(null);
00197|     const [loading, setLoading] = useState<boolean>(false);
00198|     const [error, setError] = useState<Error | null>(null);
00199|     const [coordinates, setCoordinates] = useState<number[][] | null>(null); // Almacena las coordenadas de la ruta
00200| 
00201|     // route.routes[0].geometry.coordinates
00202|     useEffect(() => {
00203|         const fetchData = async () => {
00204|             try {
00205|                 setLoading(true);
00206|                 const data = await getRoute(origin, dest);
00207|                 setRoute(data);
00208|                 setDistance(parseFloat((data.routes[0].distance / 1000).toFixed(2))); // Convertir a km
00209|                 setDuration(parseFloat((data.routes[0].duration / 60).toFixed(2))); // Convertir a minutos
00210|                 setCoordinates(data.routes[0].geometry.coordinates); // Almacenar las coordenadas de la ruta
00211|                 setError(null);
00212|             } catch (err) {
00213|                 setError(err as Error);
00214|                 setRoute(null);
00215|                 setDistance(null);
00216|                 setDuration(null);
00217|             } finally {
00218|                 setLoading(false);
00219|             }
00220|         };
00221| 
00222|         if (origin && dest) fetchData();
00223|     }, [origin, dest]); // Dependencias: se ejecuta cuando cambian origen o destino
00224| 
00225|     return { route, distance, duration, loading, error, coordinates };
00226| };

(End of file - total 226 lines)
</file>
```
```



```
Tool: read

**Input:**
```json
{
  "filePath": "D:\\rapido-final\\rapido\\rapido-app\\src\\components\\shared\\Map.tsx"
}
```
**Output:**
```
<file>
00001| import { View, TouchableOpacity } from 'react-native';
00002| import React, { FC, memo, useEffect, useRef, useState } from 'react';
00003| import Mapbox, {
00004|   Camera,
00005|   Images,
00006|   LocationPuck,
00007|   MapView,
00008|   ShapeSource,
00009|   SymbolLayer
00010| } from '@rnmapbox/maps';
00011| import { useIsFocused } from '@react-navigation/native';
00012| import * as Location from 'expo-location';
00013| import { MaterialCommunityIcons } from '@expo/vector-icons';
00014| import { RFValue } from 'react-native-responsive-fontsize';
00015| import { mapStyles } from '@/styles/mapStyles';
00016| import { reverseGeocode } from '@/utils/mapUtils';
00017| import { useUserStore } from '@/store/userStore';
00018| import { featureCollection, point } from '@turf/helpers';
00019| import { useWS } from '@/service/WSProvider';
00020| import bike from '@/assets/icons/bike_marker.png';
00021| import auto from '@/assets/icons/auto_marker.png';
00022| import cab from '@/assets/icons/cab_marker.png';
00023| import captainIcon from '@/assets/icons/cab.png'; // Asegúrate de tener un ícono para los "captains"
00024| 
00025| const accesToken =
00026|   'pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa2w0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A';
00027| Mapbox.setAccessToken(accesToken);
00028| 
00029| const Map: FC<{ height: number }> = ({ height }) => {
00030|   const mapRef = useRef<MapView>(null);
00031|   const cameraRef = useRef<Camera>(null);
00032|   const { setLocation, location, outOfRange } = useUserStore();
00033|   const [captainMarkers, setCaptainMarkers] = useState<any[]>([]);
00034|   const [randomMarkers, setRandomMarkers] = useState<any[]>([]);
00035|   const { emit, on, off } = useWS();
00036|   const isFocused = useIsFocused();
00037| 
00038|   const askLocationAccess = async () => {
00039|     const { status } = await Location.requestForegroundPermissionsAsync();
00040|     if (status === 'granted') {
00041|       try {
00042|         const currentLocation = await Location.getCurrentPositionAsync({});
00043|         // Se puede centrar la cámara en la ubicación inicial
00044|         handleGpsButtonPress();
00045|       } catch (error) {
00046|         console.log('Error getting current location', error);
00047|       }
00048|     } else {
00049|       console.log('Permission to access location was denied');
00050|     }
00051|   };
00052| 
00053|   useEffect(() => {
00054|     askLocationAccess();
00055|   }, [mapRef, isFocused]);
00056| 
00057|   // Manejo del WebSocket para los marcadores de "captains"
00058|   useEffect(() => {
00059|     if (location?.latitude && location?.longitude) {
00060|       emit('subscribeToZone', {
00061|         latitude: location.latitude,
00062|         longitude: location.longitude
00063|       });
00064|       on('nearbyCaptains', (captains: any[]) => {
00065|         const updatedMarkers = captains?.map((captain) => ({
00066|           id: captain?.id,
00067|           latitude: captain?.coords.latitude,
00068|           longitude: captain?.coords.longitude,
00069|           type: 'captain',
00070|           rotation: captain.coords.heading,
00071|           visible: true
00072|         }));
00073|         setCaptainMarkers(updatedMarkers);
00074|       });
00075|       return () => {
00076|         off('nearbyCaptains');
00077|       };
00078|     }
00079|   }, [location, emit, on, off]);
00080| 
00081|   const handleGpsButtonPress = async () => {
00082|     try {
00083|       const { status } = await Location.requestForegroundPermissionsAsync();
00084|       if (status === 'granted') {
00085|         const currentLocation = await Location.getCurrentPositionAsync({});
00086|         const { latitude, longitude } = currentLocation.coords;
00087|         cameraRef.current?.setCamera({
00088|           centerCoordinate: [longitude, latitude],
00089|           zoomLevel: 16,
00090|           animationDuration: 200,
00091|           animationMode: "flyTo"
00092|         });
00093|         const address = await reverseGeocode(latitude, longitude);
00094|         setLocation({ latitude, longitude, address });
00095|       }
00096|     } catch (error) {
00097|       console.log('Error obteniendo la ubicación:', error);
00098|     }
00099|   };
00100| 
00101|   // Genera marcadores aleatorios sólo si se tiene una ubicación y no se está fuera de rango
00102|   const generateRandomMarkers = () => {
00103|     if (!location?.latitude || !location?.longitude || outOfRange) return;
00104| 
00105|     const types = ["bike", "auto", "cab"];
00106|     const newMarkers = Array.from({ length: 20 }, (_, index) => {
00107|       const randomType = types[Math.floor(Math.random() * types.length)];
00108|       const randomRotation = Math.floor(Math.random() * 360);
00109|       return {
00110|         id: `random-${index}`,
00111|         latitude: location.latitude + (Math.random() - 0.5) * 0.01,
00112|         longitude: location.longitude + (Math.random() - 0.5) * 0.01,
00113|         type: randomType,
00114|         rotation: randomRotation,
00115|         visible: true
00116|       };
00117|     });
00118|     setRandomMarkers(newMarkers);
00119|   };
00120| /*
00121|   useEffect(() => {
00122|     generateRandomMarkers();
00123|   }, [location]);
00124| */
00125|   // Filtrado de los marcadores por tipo
00126|   const bikeMarkers = randomMarkers.filter((marker) => marker.type === 'bike');
00127|   const autoMarkers = randomMarkers.filter((marker) => marker.type === 'auto');
00128|   const cabMarkers = randomMarkers.filter((marker) => marker.type === 'cab');
00129| 
00130|   // Preparamos los datos para cada capa (usamos @turf/helpers para generar puntos)
00131|   const bikeFeatures = bikeMarkers.map((marker) =>
00132|     point([marker.longitude, marker.latitude], marker)
00133|   );
00134|   const autoFeatures = autoMarkers.map((marker) =>
00135|     point([marker.longitude, marker.latitude], marker)
00136|   );
00137|   const cabFeatures = cabMarkers.map((marker) =>
00138|     point([marker.longitude, marker.latitude], marker)
00139|   );
00140|   const captainFeatures = captainMarkers.map((marker) =>
00141|     point([marker.longitude, marker.latitude], marker)
00142|   );
00143| 
00144|   const handleOnDidFinishLoadingMap = async () => {
00145|     await handleGpsButtonPress();
00146|   };
00147| 
00148|   return (
00149|     <View style={{ height: height, width: '100%' }}>
00150|       <Mapbox.MapView
00151|         scaleBarEnabled={false}
00152|         logoEnabled={false}
00153|         ref={mapRef}
00154|         style={{ flex: 1 }}
00155|         onDidFinishLoadingMap={handleOnDidFinishLoadingMap}
00156|         styleURL='mapbox://styles/mapbox/dark-v11'
00157|         attributionEnabled={false}  
00158|       >
00159|         {/* Declaramos las imágenes sólo una vez */}
00160|         <Images images={{ bike, auto, cab, captain: captainIcon }} />
00161| 
00162|         <Camera
00163|           ref={cameraRef}
00164|           followZoomLevel={16}
00165|           followUserLocation={!!location?.latitude ? false : true}
00166|         />
00167|         <LocationPuck
00168|           puckBearingEnabled
00169|           puckBearing="heading"
00170|           pulsing={{ isEnabled: true }}
00171|         />
00172| 
00173|         {/* Capa para marcadores aleatorios */}
00174|         {bikeFeatures.length > 0 && (
00175|           <ShapeSource id="random-bikes" shape={featureCollection(bikeFeatures)}>
00176|             <SymbolLayer
00177|               id="random-bikes-layer"
00178|               style={{
00179|                 iconImage: 'bike',
00180|                 iconAllowOverlap: true,
00181|                 iconSize: 0.25,
00182|                 iconAnchor: 'bottom',
00183|                 iconRotate: ['get', 'rotation']
00184|               }}
00185|             />
00186|           </ShapeSource>
00187|         )}
00188| 
00189|         {autoFeatures.length > 0 && (
00190|           <ShapeSource id="random-autos" shape={featureCollection(autoFeatures)}>
00191|             <SymbolLayer
00192|               id="random-autos-layer"
00193|               style={{
00194|                 iconImage: 'auto',
00195|                 iconAllowOverlap: true,
00196|                 iconSize: 0.25,
00197|                 iconAnchor: 'bottom',
00198|                 iconRotate: ['get', 'rotation']
00199|               }}
00200|             />
00201|           </ShapeSource>
00202|         )}
00203| 
00204|         {cabFeatures.length > 0 && (
00205|           <ShapeSource id="random-cabs" shape={featureCollection(cabFeatures)}>
00206|             <SymbolLayer
00207|               id="random-cabs-layer"
00208|               style={{
00209|                 iconImage: 'cab',
00210|                 iconAllowOverlap: true,
00211|                 iconSize: 0.25,
00212|                 iconAnchor: 'bottom',
00213|                 iconRotate: ['get', 'rotation']
00214|               }}
00215|             />
00216|           </ShapeSource>
00217|         )}
00218| 
00219|         {/* Capa para los marcadores de "captains" recibidos vía WS */}
00220|         {captainFeatures.length > 0 && (
00221|           <ShapeSource id="captains" shape={featureCollection(captainFeatures)}>
00222|             <SymbolLayer
00223|               id="captains-layer"
00224|               style={{
00225|                 iconImage: 'captain',
00226|                 iconAllowOverlap: true,
00227|                 iconSize: 0.25,
00228|                 iconAnchor: 'bottom',
00229|                 iconRotate: ['get', 'rotation']
00230|               }}
00231|             />
00232|           </ShapeSource>
00233|         )}
00234|       </Mapbox.MapView>
00235| 
00236|       <TouchableOpacity style={mapStyles.gpsButton} onPress={handleGpsButtonPress}>
00237|         <MaterialCommunityIcons name="crosshairs-gps" size={RFValue(16)} color="#3C75BE" />
00238|       </TouchableOpacity>
00239|     </View>
00240|   );
00241| };
00242| 
00243| export default memo(Map);
00244| 

(End of file - total 244 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "D:\\rapido-final\\rapido\\rapido-app\\package.json"
}
```
**Output:**
```
<file>
00001| {
00002|   "name": "rapido-app",
00003|   "main": "expo-router/entry",
00004|   "version": "1.0.0",
00005|   "scripts": {
00006|     "start": "expo start",
00007|     "reset-project": "node ./scripts/reset-project.js",
00008|     "android": "expo run:android",
00009|     "ios": "expo run:ios",
00010|     "web": "expo start --web",
00011|     "test": "jest --watchAll",
00012|     "lint": "expo lint"
00013|   },
00014|   "jest": {
00015|     "preset": "jest-expo",
00016|     "setupFilesAfterEnv": [
00017|       "<rootDir>/jest.setup.js"
00018|     ],
00019|     "transformIgnorePatterns": [
00020|       "node_modules/(?!((react-native.*|@react-native.*|expo.*|@expo.*|react-native-responsive-fontsize|@rnmapbox/.*|react-native-maps|react-native-mmkv|@gorhom/.*|react-native-gesture-handler|react-native-reanimated)/))"
00021|     ],
00022|     "moduleFileExtensions": [
00023|       "ts",
00024|       "tsx",
00025|       "js",
00026|       "jsx",
00027|       "json"
00028|     ],
00029|     "testMatch": [
00030|       "**/__tests__/**/*.test.ts?(x)"
00031|     ],
00032|     "collectCoverageFrom": [
00033|       "src/**/*.{ts,tsx}",
00034|       "!src/**/*.d.ts"
00035|     ]
00036|   },
00037|   "dependencies": {
00038|     "@expo/vector-icons": "^14.0.2",
00039|     "@firebase/analytics": "^0.10.12",
00040|     "@gorhom/bottom-sheet": "^5.0.6",
00041|     "@mapbox/polyline": "^1.2.1",
00042|     "@react-native-firebase/analytics": "^21.14.0",
00043|     "@react-native-firebase/app": "^21.14.0",
00044|     "@react-native-firebase/messaging": "^21.14.0",
00045|     "@react-navigation/bottom-tabs": "^7.2.0",
00046|     "@react-navigation/native": "^7.0.14",
00047|     "@rnmapbox/maps": "^10.1.37",
00048|     "@turf/helpers": "^7.2.0",
00049|     "axios": "^1.7.9",
00050|     "expo": "~52.0.23",
00051|     "expo-blur": "~14.0.1",
00052|     "expo-constants": "~17.0.3",
00053|     "expo-dev-client": "~5.0.9",
00054|     "expo-font": "~13.0.2",
00055|     "expo-haptics": "~14.0.0",
00056|     "expo-linking": "~7.0.3",
00057|     "expo-location": "~18.0.4",
00058|     "expo-notifications": "^0.29.14",
00059|     "expo-router": "~4.0.15",
00060|     "expo-splash-screen": "~0.29.18",
00061|     "expo-status-bar": "~2.0.0",
00062|     "expo-symbols": "~0.2.0",
00063|     "expo-system-ui": "~4.0.6",
00064|     "expo-updates": "~0.26.18",
00065|     "expo-web-browser": "~14.0.1",
00066|     "haversine-distance": "^1.2.3",
00067|     "jwt-decode": "^4.0.0",
00068|     "react": "18.3.1",
00069|     "react-dom": "18.3.1",
00070|     "react-native": "0.76.5",
00071|     "react-native-countdown-circle-timer": "^3.2.1",
00072|     "react-native-gesture-handler": "~2.20.2",
00073|     "react-native-leaflet-map": "^0.4.2",
00074|     "react-native-maps": "^1.20.1",
00075|     "react-native-maps-directions": "^1.9.0",
00076|     "react-native-mmkv": "^3.1.0",
00077|     "react-native-reanimated": "~3.16.1",
00078|     "react-native-responsive-fontsize": "^0.5.1",
00079|     "react-native-safe-area-context": "4.12.0",
00080|     "react-native-screens": "~4.4.0",
00081|     "react-native-svg": "^15.10.1",
00082|     "react-native-web": "~0.19.13",
00083|     "react-native-webview": "13.12.5",
00084|     "rn-swipe-button": "^2.0.0",
00085|     "socket.io-client": "^4.8.1",
00086|     "zustand": "^5.0.3"
00087|   },
00088|   "devDependencies": {
00089|     "@babel/core": "^7.25.2",
00090|     "@testing-library/react-native": "^13.3.3",
00091|     "@types/firebase": "^2.4.32",
00092|     "@types/jest": "^29.5.12",
00093|     "@types/mapbox__polyline": "^1.0.5",
00094|     "@types/react": "~18.3.12",
00095|     "@types/react-test-renderer": "^18.3.0",
00096|     "eslint": "^8.57.0",
00097|     "eslint-config-expo": "~8.0.1",
00098|     "jest": "^29.2.1",
00099|     "jest-expo": "~52.0.2",
00100|     "react-test-renderer": "18.3.1",
00101|     "typescript": "^5.3.3"
00102|   },
00103|   "private": true
00104| }
00105| 

(End of file - total 105 lines)
</file>
```
```

---

## Assistant

```
Tool: todowrite

**Input:**
```json
{
  "todos": [
    {
      "content": "Analizar implementación actual de Mapbox en el proyecto",
      "status": "completed",
      "priority": "high",
      "id": "1"
    },
    {
      "content": "Investigar opciones de servidores de mapas propios compatibles con Mapbox",
      "status": "in_progress",
      "priority": "high",
      "id": "2"
    },
    {
      "content": "Identificar componentes que necesitarían modificaciones",
      "status": "pending",
      "priority": "high",
      "id": "3"
    },
    {
      "content": "Crear guía de implementación con recomendaciones",
      "status": "pending",
      "priority": "medium",
      "id": "4"
    }
  ]
}
```
**Output:**
```
[
  {
    "content": "Analizar implementación actual de Mapbox en el proyecto",
    "status": "completed",
    "priority": "high",
    "id": "1"
  },
  {
    "content": "Investigar opciones de servidores de mapas propios compatibles con Mapbox",
    "status": "in_progress",
    "priority": "high",
    "id": "2"
  },
  {
    "content": "Identificar componentes que necesitarían modificaciones",
    "status": "pending",
    "priority": "high",
    "id": "3"
  },
  {
    "content": "Crear guía de implementación con recomendaciones",
    "status": "pending",
    "priority": "medium",
    "id": "4"
  }
]
```
```



```
Tool: codesearch

**Input:**
```json
{
  "query": "self-hosted map server Mapbox compatible alternatives tile server",
  "tokensNum": 8000
}
```
**Output:**
```
# Documentation Content

## Map server for self-hosting of maps - MapTiler

https://www.maptiler.com/server/

Map server for self-hosting of maps | MapTiler
![Header Rectangle] 
[Host &amp; serve maps] 
[Get map data] 
[Process geodata] 
# Serve maps on your own premises
The easiest way to deploy private, lightning-fast maps without internet dependency on secure, controllable map infrastructure.
[Download Server] [Read documentation] 
Available on:![Windows]![MacOS]![Linux]![Docker]![Raspberry Pi]![Kubernetes] 
![MapTiler image server-top-banner.webp] 
![Vaisala logo]![Cisco logo]![SOFS logo]![Bentley logo]![Metropolitan police pogo] 
## Why Server?
### Maps on-premises
Serve maps from your server or laptop, behind firewalls, on intranet.
![secured data] 
### Extremely fast
Maps appear instantly thanks to pregenerated map tiles.
![fast data serving] 
### Entire world included
Power your maps with our data, from entire globe down to the street level.
![various maps] 
### Rasterization
Map services and raster tiles on the fly from your raster or vector data.
![maps on different devices] 
## Fast and easy to use
![MapTiler image slide_1.webp] 
### Comfortable web administration
Administrate your server via a friendly interface directly in a web browser. Easily backup or move the config and map data to a different server instance easily.
![MapTiler image slide-3.webp] 
### Add your own data
Convert your files, geodata, and large imagery to fast zoomable maps with a friendly step-by-step wizard.
[More about Engine] 
![MapTiler image slide_2.webp] 
### Embedable viewers
Server automatically creates a viewer for each dataset. Viewers can be shared with URL or embeded to website with Iframe.
![MapTiler image slide_4.webp] 
### Standardized web map services
Use OGC map services to load your maps in variety of software tools from GIS and business analytics tools to your secure dashboards and applications running completely without internet.
Server exposes links with XYZ scheme, TileJSON and Web Map Tile Service (WMTS).
## Detailed global street maps
Save time and resources with ready-to-deploy global street maps. No internet dependency, complete data control, and seamless integration with your existing systems.
Drag and drop the map package of your area, choose a style and serve it to your web, mobile, or GIS software.
[Choose your area] 
![various maps that can run on on-premises] 
## High-res satellite &amp; aerial imagery
Combine[high-resolution aerial imagery] of USA, Europe, and Japan with the latest global satellite imagery - to have a detailed offline aerial map served directly from your laptop or local server.
[Learn more] 
![detailed satellite and high-resolution aerial map of the entire world] 
## Serve your own data
Convert Shapefiles or raster images for super fast map loading with[Engine].
Serve pregenerated map tiles in GeoPackage or MBTiles format.
[How to add your geodata] 
![custom maps in geopackage and mbtiles format] 
## Real-time updated maps from database
Add vector tiles PostGIS layer with the ability to rasterize - and serve WMTS - for real-time updated data in your connected Postgres/PostGIS database.
[Read more] 
![postgis database for loading vector tiles from a database] 
## Enterprise deployment with Kubernetes
Eliminate downtime and scale without limits. Deploy mission-critical mapping services that automatically optimize and recover, saving IT resources while ensuring reliability even under peak loads.
[Read more] 
![MapTiler image map-server-in-kubernetes-1-dark.webp] 
## Ready to use basemaps for self-hosting
Street and satellite maps of the entire world
[
![Streets map] 
] 
[
![Satellite map] 
] 
[
![MapTiler image carousel-base-v4.webp] 
] 
[
![light map] 
] 
[
![Dark map] 
] 
[
![Outdoor map] 
] 
[
![Winter map] 
] 
[
![3d terrain] 
] 
## Global search and geocoding
Let users search for places and addresses, or use reverse geocoding in your secure or offline applications. Keep the search in sync with our global datasets.
![MapTiler image geocoding-on-prem.webp] 
## Self-host Cesium 3D terrain
Create natural-like sceneries by combining 3D terrain data with high-resolution aerial imagery or any other basemap.
Get terrain and imagery compatible with the popular CesiumJS library.
[Read more] 
![cesium JavaScript for 3D maps on-premises] 
## On-premises Tableau basemaps
Get offline background maps with various map styles for Tableau business analytics tool running from your infrastructure.
Perfectly secured maps running on your private cloud without internet connection.
[Read documentation] 
![tableau map running from own server] 
## ArcGIS Server alternative
Get map services for your desktop GIS software. Install and set up the whole map stack in a few mouse clicks.
It is compatible with your desktop ArcGIS, QGIS, and other GIS software.
![MapTiler maps in ArcGIS] 
## Available as:
![vector tiles] 
### Vector tiles
[MapTiler SDK], native MVT clients
![raster tiles] 
### Raster tiles
Leaflet, OpenLayers, XYZ
![map services] 
### Map services
WMTS and OGC Tiles API for QGIS or ArcGIS
![static maps] 
### Static maps
Image for thumbnails
## [Technical specification] 
Operating systems
##### [Linux] (x64/[ARM64])
* Ubuntu 20.04+ (primary support)
* Debian 10+
* [RHEL] 8+
* Fedora 37+
* Centos 9+
* Mint 6 or 20+
* AppImage
* [Raspberry Pi OS (64-bit)] ##### [Windows] (x64 only)
* Windows 10+
* Windows Server 2019+###### [macOS] 10.15+ (x64/[ARM64])
###### [Docker] 
###### [Kubernetes] 
Standards
* MBTiles, GeoPackage
* WMTS
* WMS (only with commercial license)
* TileJSON
* [OGC Tiles API] 
Supported formats
##### Tiles
* raster .mbtiles \*
* vector .mbtiles \*
* raster .geopackage \*
* raster and vector .mtpkg
* quantized mesh terrain (3D) .geopackage \*
* [tiles from PostGIS geometries] 
* free version supports only tiles from[our Data] or produced by[Engine] ##### Maps
* Mapbox style
Supported CRS
##### Tiles
* complete EPSG database + custom defined SRS via Proj4. Over 6000 systems world-wide##### Maps
* Mercator sources only
Tiles serving
##### Tiles serving
* 2 CPUs
* 2GB RAM
* 1GB disc free capacity for installation (additional for tiles)##### Maps rasterization (whole planet)
* 4 CPUs
* 16GB RAM
* 100GB for tiles, fonts and other assets
Read more about the performance tips[here].
Raw rasterization performance is approx 3 tiles/sec on single core and Server does not solve caching by its own. Therefore setting a reverse proxy cache in production is highly recommended. Rasterization performance can be tuned in server settings/rasterization. Setting renderer pool size higher than CPUs count can slightly increase throughput but beware that every renderer allocates its own memory space.
Desktop viewers
* Google Earth
* ArcGIS for Desktop
* [QGIS] (Quantum GIS)
* [Tableau] 
* uDIG
* any viewer supporting WMTS or OGC Tiles API
Mobile native viewers
* Google Maps SDK for iOS
* Google Maps SDK for Android
* MapLibre iOS SDK
* MapLibre Android SDK
* Apple MapKit
* RouteMe
* OSMDroid
* any viewer supporting WMTS, OGC Tiles API, or TileJSON
Free vs Commercial Server
###### Free
* Only reads[our Data] or data made with[Engine] 
* Rasterization with watermark
* Rendering from[PostgreSQL] limited to 1 layer only###### Commercial
* Reads any MBTiles or GeoPackage data
* Rasterization without watermark
* Unlimited layers from[PostgreSQL] 
* [Admin API] available
* WMS/Static Maps available
## Read latest news about Server
[![MapTiler image 2025-12-17-regional-extracts-for-satellite-imagery.webp]] 
Dec 17, 2025
[### Regional extracts for satellite imagery: Download only what you need
] 
[![MapTiler image 2025-11-25-map-rasterization-on-all-platforms.webp]] 
Nov 25, 2025
[### Map rasterization on all platforms
] 
[![On Prem Maps in Three Simple Steps]] 
Oct 30, 2025
[### On-prem maps in three simple steps
] 
[Read more news] 
## Try Server for free!
Available for**Windows**,**macOS**,**Linux**,**Raspberry Pi**,**Docker**, and**Kubernetes**.
[Download Server] [Documentation] 
notification

---

## OpenMapTiles: World maps you can self-host - powered by free ...

https://openmaptiles.org/

World maps you can self-host - powered by free OpenStreetMap vector tiles and open-source software –OpenMapTiles
[OpenMapTiles] 
[About] [Docs] [Downloads] [Styles] [Schema] [Mobile] [e] 
H
[About] [Docs] [Downloads] [Styles] [Schema] [Mobile] [Github] 
# Open-source maps made for self-hosting
### Free OpenStreetMap Vector Tiles
![map ought to be here] 
Trusted by
![amazon]![bosch]![carto]![ibm]![planet]![siemens] 
![openmaptiles] 
### Open-source maps and schema
Host the world maps on your own server or private cloud.
Generate your**own vector tiles**from selected
OpenStreetMap tags or your geospatial data.
Code on[GitHub]. BSD/CC-BY license. Attribution required.
[Sources on GitHub] 
![maptiler] 
### Powerful map hosting from authors
Use map hosting from authors of this open-source project
serving both**raster and
vector tiles**. With a few clicks you can
design a**custom map style**fitting your app.
Lowest costs. Cheaper than maintaining your own map servers.
[Maps API for developers] [Map data for Self-hosting] 
## Explore MapTiler map styles
[![Street] Streets] [![Satellite] Satellite] [![Topo] Outdoor] [![Basic] Basic] [![Bright] Bright] [![Positron] Light] [![DarkMatter] Dark] 
## Open Map Styles
We have prepared a set of beautiful Open Map Styles
for our vector tiles. The styles are free and open-source,
and you can adapt the design and code for your project
or commercial product however you like.
Either use one of our map styles directly as your base map
or as a starting point for your own map design.
[Browse open styles] 
## Open Tile Schema
Our new Vector Tile Schema is encoding the
cartography decisions made on top of OpenStreetMap,
Natural Earth and other OpenData sources and is 100% open
and free to use, extend or build upon.
We hope people will adapt, copy and reimplement our schema
and data model in their projects while providing attribution.
[See the schema] 
## Open-source project contributors
![maptilerlogo]![klokan]![hsr]![qwant]![wikimedia] 
…and many individual contributors on[GitHub].
[![maptilerlogo]] 
OpenMapTiles.org is an open-source project from[OMT community] and MapTiler who provides[Maps API].
Read the[documentation for map developers]. Share this page on[T] [F]

---

## TileServer PHP: MapTiler and MBTiles maps via WMTS - GitHub

https://github.com/maptiler/tileserver-php

GitHub - maptiler/tileserver-php: MBTiles and MapTiler folder hosting with TileJSON, OGC WMTS, UTFGrid interaction and web interface. QGIS &amp; ESRI ArcGIS compatible. Runs on any Apache+PHP webhosting. MapBox Studio Vector Tiles hosting.
[Skip to content] 
## Navigation Menu
Toggle navigation
[] 
[Sign in] 
Appearance settings
Search or jump to...
# Search code, repositories, users, issues, pull requests...
 
Search
Clear
[Search syntax tips] 
# Provide feedback
 
We read every piece of feedback, and take your input very seriously.
Include my email address so I can be contacted
CancelSubmit feedback
# Saved searches
## Use saved searches to filter your results more quickly
 
Name
Query
To see all available qualifiers, see our[documentation].
CancelCreate saved search
[Sign in] 
[Sign up] 
Appearance settings
Resetting focus
You signed in with another tab or window.[Reload] to refresh your session.You signed out in another tab or window.[Reload] to refresh your session.You switched accounts on another tab or window.[Reload] to refresh your session.Dismiss alert
{{ message }}
This repository was archived by the owner on Jul 14, 2025. It is now read-only.
[maptiler] /**[tileserver-php] **Public archive
* [Notifications] You must be signed in to change notification settings
* [Fork166] 
* [Star588] 
MBTiles and MapTiler folder hosting with TileJSON, OGC WMTS, UTFGrid interaction and web interface. QGIS &amp; ESRI ArcGIS compatible. Runs on any Apache+PHP webhosting. MapBox Studio Vector Tiles hosting.
[tileserver.maptiler.com/] 
[588stars] [166forks] [Branches] [Tags] [Activity] 
[Star] 
[Notifications] You must be signed in to change notification settings
# maptiler/tileserver-php
master
[Branches] [Tags] 
[] [] 
Go to file
Code
Open more actions menu
## Folders and files
|Name|Name|
Last commit message
|
Last commit date
|
## Latest commit
## History
[161 Commits] 
[] 
|
[.htaccess] 
|
[.htaccess] 
|
|
|
[.travis.yml] 
|
[.travis.yml] 
|
|
|
[README.md] 
|
[README.md] 
|
|
|
[tileserver.php] 
|
[tileserver.php] 
|
|
|
View all files
|
## Repository files navigation
# TileServer PHP: MapTiler and MBTiles maps via WMTS
[] 
[![Build Status]] [![Docker Hub]] 
This server distributes maps to desktop, web, and mobile applications from a standard Apache+PHP web hosting.
It is a free and open-source project implementing the OGC WMTS standard for pre-rendered map tiles made with any[map tiling software] like MapTiler Desktop, GDAL2Tiles, or any other MBTiles file.
It is the easiest and cheapest way how to serve zoomable maps in a standardized way - practically from any ordinary web hosting.
It is easy to install - copy the project files to a PHP-enabled directory along with your map data.
It comes with an online interface showing the list of the maps and step-by-step guides for online mapping libraries (Google Maps API, Leaflet, OpenLayers, OL3, MapLibre GL JS, ArcGIS JS) and various desktop GIS software:
[![tileserver-screenshot]] 
This project is developed in PHP, not because it is the best language for the development of web applications, but because it maximally simplifies the deployment on a large number of web hostings, including various free web hostings providers.
Tiles are served directly by Apache with mod\_rewrite rules as static files and therefore are very fast and with correct HTTP caching headers. Only XML metadata is delivered via PHP. MBTiles are served via PHP and are therefore slower unless they are unpacked with mbutil.
[MapTiler] can render GeoTIFF, ECW, MrSID, GeoPDF into compatible map tiles. JPEG, PNG, GIF, and TIFF with scanned maps or images without geolocation can be turned into standard map layers with the visual georeferencing functionality ([http://youtu.be/eJxdCe9CNYg]).
[![MapTiler - mapping tiles]] 
## Requirements:
[] 
* Apache webserver (with mod\_rewrite / .htaccess supported)
* PHP 5.6+ with SQLite module (php5-sqlite)
(or another webserver implementing mod\_rewrite rules and PHP)
## Installation:
[] 
Download the project files as a[zip archive] or source code from GitHub and unpack it into a web-hosting of your choice.
If you access the web address relevant to the installation directory, the TileServer.php Server should display you a welcome message and further instructions.
Then you can upload to the web hosting your mapping data - a directory with tiles rendered with[MapTiler].
Tiles produced by open-source GDAL2Tiles or MapTiler Desktop and tiles in .mbtiles format can be easily converted to the required structure (XYZ with top-left origin and metadata.json file). The open-source utility[mbutil] produces exactly the required format.
Direct reading of .mbtiles files is supported but with decreased performance compared to the static files in a directory. The advantage is easier data management, especially upload over FTP or similar protocols.
## Supported protocols:
[] 
* OpenGIS WMTS 1.0.0
The Open Geospatial Consortium (OGC) Web Map Tile Service (WMTS)
Both KVP and RESTful version 1.0.0:[http://www.opengeospatial.org/standards/wmts/] 
Target is maximal compliance to the standard.
Exposed at http://[...]/wmts
* OSGeo TMS 1.0.0
The OSGeo Tile Maps Service, but with inverted y-coordinates:[http://wiki.osgeo.org/wiki/Tile\_Map\_Service\_Specification] This means request compatible with OpenStreetMap tile servers.
Target is "InvertedTMS" implementation used by the ArcBruTile client
which is available from[http://arcbrutile.codeplex.com/] and uses
flipped y-axis.
Exposed at http://[...]/tms
* TileJSON
Metadata about the individual maps in a ready to use form for web
clients following the standard[http://mapbox.com/developers/tilejson/] and with support for JSONP access.
Exposed at http://[...]/layer.json or .jsonp
* Direct access with XYZ tile requests (to existing tiles in a directory
or to .mbtiles)
Compatible with Google Maps API / Bing SDK / OpenStreetMap clients.
Exposed at http://[...]/layer/z/x/y.ext
* MapBox UTFgrid request (for existing tiles in .mbtiles with UTFgrid support). Callback is supported
Example[https://www.mapbox.com/demo/visiblemap/] Specification[https://github.com/mapbox/utfgrid-spec] 
Exposed at http://[...]/layer/z/x/y.grid.json
* MapBox Vector Tiles (for MBTiles generated by[MapBox Studio Classic] or by[OSM2VectorTiles] project).
Example[http://osm2vectortiles.tileserver.com/] TileJSON can be used in MapBox Studio Classic, MapBox SDKs/APIs, OpenLayers, etc.
Exposed at http://[...]/layer/z/x/y.pbf
* Retina / HighDPI routing with 512 tiles
Use @2x suffix in url for JSONs and tiles. For example[http://tileserver.maptiler.com/grandcanyon@2x.json] 
To use the OGC WMTS standard, point your client (desktop or web) to the URL of 'directory' where you installed tileserver.php project with suffix "wmts".
For example:[http://www.example.com/directory/wmts] 
If you have installed the project into a root directory of a domain, then the address is:[http://www.example.com/wmts] 
The supported WMTS requests includes:
GetCapabilities RESTful/KVP:
http://[...]/1.0.0/WMTSCapabilities.xml
http://[...]?service=wmts&amp;request=getcapabilities&amp;version=1.0.0
GetTile RESTful/KVP:
http://[...]/layer/[ANYTHING-OPTIONAL][z]/[x]/[y].[ext]
http://[...]?service=wmts&amp;request=getTile&amp;layer=[layer]&amp;tilematrix=[z]&amp;tilerow=[y]&amp;tilecol=[y]&amp;format=[ext]
Other example requests are mentioned in the .htaccess.
TileServer-PHP supports all coordinates systems. You have to define it with tilejson with specification on[https://github.com/klokantech/tilejson-spec/tree/custom-projection/2.2.0] Or use MapTiler to produce datasets with this specification.
## Performance from the web clients
[] 
It is highly recommended to map several domain names to the service, such as:
[http://a.example.com/],[http://b.example.com/],[http://c.example.com/].
This can be done with DNS CNAME records pointing to your hosting. The reason for this is that traditionally browsers will not send more than two simultaneous HTTP requests to the same domain - with multiple domains for the same server, you can better saturate the network and receive the maps faster.
## Performance
[] 
In case the data are available in the form of a directory with XYZ tiles, then the Apache webserver is serving these files directly as WMTS RESTful or KVP.
This means performance is excellent, maps are delivered very fast, and a large number of concurrent visitors can be handled even with quite low-end hardware or cheap/free web hosting providers.
Mod\_rewrite rules are utilized to ensure the HTTP requests defined in the OCG WMTS standard are served, and Apache preserves standard caching headers &amp;&amp; eTag.
The performance should be significantly better than any other tile caching project (such as TileCache.org or GeoWebCache).
Performance graph for "apache static" comparing other tile caching projects is available online at[http://code.google.com/p/mod-geocache/wiki/PreliminaryBenchmark] 
## Limits of actual implementation
[] 
With intention, at this moment, the project supports only:
* We enforce and require XYZ (top-left origin) tiling schema (even for TMS).
## Password protection
[] 
HTTP Simple Authentication can be easily added to the server.
Edit the .htaccess and add these lines:
```
`AuthUserFile /full/path/to/.htpasswd
AuthType Basic
AuthName "Secure WMTS"
Require valid-user`
```
Create a file called .htpasswd with user:password format.
You can use a command-line utility:
$ htpasswd -c .htpasswd [your-user-login]
Or an online service:
[http://www.htaccesstools.com/htpasswd-generator/] 
## HTTPS / SSL support
[] 
TileServer.php can run without any problems over HTTPS, if required.
## Microsoft Windows web-hosting
[] 
The TileServer.php should run on Windows-powered webservers with Apache installation if PHP 5.2+ and mod\_rewrite are available.
With the IIS webserver hosting, you may need PHP and IIRF module ([http://iirf.codeplex.com/]) and alter appropriately the rewrite rules.
## Credits / Contributors
[] 
Project developed initially by Klokan Technologies GmbH, Switzerland, in cooperation with National Oceanic and Atmospheric Administration - NOAA, USA.
* Petr Pridal - Klokan Technologies GmbH[petr.pridal@maptiler.com] 
* Jason Woolard - NOAA[jason.woolard@noaa.gov] 
* Jon Sellars - NOAA[jon.sellars@noaa.gov] 
* Dalibor Janak - Klokan Technologies GmbH[dalibor.janak@maptiler.com] 
## Tested WMTS/TMS clients
[] 
* QuantumGIS Desktop 1.9+ - open with Layer-&gt;Add WMS layer[http://www.qgis.org/] 
* ESRI ArcGIS Desktop 10.1+ - native WMTS implementation supported[http://www.esri.com/software/arcgis/arcgis-for-desktop] 
* ESRI ArcGIS Online - loading via WMTS protocol[http://www.arcgis.com/] 
* ArcBruTiles plugin for ArcGIS 9.3+ - via TMS endpoint[http://arcbrutile.codeplex.com/] 
* OpenLayers WMTS Layer - including parsing GetCapabilities[http://www.openlayers.org/] 
* GAIA - native WMTS (issues with 3857 to be fixed)[http://www.thecarbonproject.com/gaia.php] 
* MapBox.js - the loading of maps via TileJSON, interaction layer supported[https://www.mapbox.com/mapbox.js] 
## Alternative
[] 
If you need[map server with commercial support], explore the possibilities provided by the MapTiler Server.
## BSD License
[] 
Copyright (C) 2020 MapTiler AG ([https://www.maptiler.com/])
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
## About
MBTiles and MapTiler folder hosting with TileJSON, OGC WMTS, UTFGrid interaction and web interface. QGIS &amp; ESRI ArcGIS compatible. Runs on any Apache+PHP webhosting. MapBox Studio Vector Tiles hosting.
[tileserver.maptiler.com/] 
### Resources
[Readme] 
### Uh oh!
There was an error while loading.[Please reload this page].
[Activity] 
[Custom properties] 
### Stars
[**588**stars] 
### Watchers
[**48**watching] 
### Forks
[**166**forks] 
[Report repository] 
## [Releases3] 
[
v2.0Latest
May 4, 2016
] 
[+ 2 releases] 
## [Packages0] 
No packages published
### Uh oh!
There was an error while loading.[Please reload this page].
## [Contributors12] 
* * * * * * * * * * * * ### Uh oh!
There was an error while loading.[Please reload this page].
## Languages
* [PHP100.0%] 
You can’t perform that action at this time.

---

## Protomaps - The open source map in a file

https://protomaps.com/

Protomaps - The open source map in a file
# The open source map
that's just one file
![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile]![map tile] 
Protomaps is a free, customizable map of the world, deployable as a single static file on cloud storage.
[Get Started] 
If you**know how to use S3**, you know how to**publish earth-scale, interactive maps.**
Protomaps enables frontend developers to easily "self-host" maps - it's just a file, no server setup required.
It makes serving vector map tiles simple and affordable by using[HTTP range requests.] 
[→ Try the quick start tutorial] 
## Examples
Minimal, HTML + JS examples of building rich basemaps and data overlays.
[![Display a map example.] 
Display a map
] 
[![Data sandwich] 
Overlay PMTiles on a basemap
] 
[![Theme and language example.] 
Change the basemap theme+language
] 
[![Custom theme example.] 
Use a custom theme
] 
## Open Format
PMTiles is a specification for Hilbert-ordered tile pyramid archives, for**any geospatial data**- rasters, vector basemaps and custom layers.
Try the[MapLibre plugin],[the command line interface], and[CDN integrations.] 
[→ Learn more about PMTiles] 
## Open Data
Protomaps maintains a basemap tileset built from[OpenStreetMap] and other open data sources.
It's the**easiest way to adopt OSM**for interactive web maps.
Download the planet for free, or extract any part using the CLI.
[→ Download your area] 
## Hosted API
Don't want to manage a big file? Use the CDN-cached**basemap tiles API**; It's the easiest way to try out Protomaps!
Noncommercial use is free; for commercial use, become a[GitHub Sponsor.] 
[→ Use the Maps API in your code] 
## For Companies
![points on a map] 
Take**full-stack control**of your site map embeds. Reduce your map bills from hundreds per month to pennies, on the cloud storage you're already using.
## For Newsrooms
![upshot precincts] 
Protomaps enables journalists to tell interactive stories with**customized cartography that works forever**, without depending on a third-party API.
## For Science
![Landsat image] 
Use the PMTiles format to visualize**earth-scale climate and environment data**. Create data explorers using open source tools and mapping frontends.
## For Governments
![Buildings image] 
Escape the lock-in of Big Tech and preserve citizen privacy and GDPR compliance. A**free alternative to proprietary GIS**in your agency!
“Protomaps is the single most exciting development in digital mapping in the past 10 years.”
[— Aaron Straup Cope, SFO Museum] 
Protomaps is supported by:
[Allmaps] 
[] 
[] 
[Cloud-Native Geospatial Forum] 
[]

---

## Mapbox alternatives: Evaluating cost, features, and flexibility ... - Felt

https://felt.com/blog/mapbox-alternatives

Mapbox alternatives: Evaluating cost, features, and flexibility for scalable mapping
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
37° 48&#x27; 15.7068&#x27;&#x27; N, 122° 16&#x27; 15.9996&#x27;&#x27; W
cloud-native gis has arrived
Introducing Felt AI, your built-in team of spatial engineers[Learn more] 
[![Felt logo.]] 
PLATFORM
Industries
Resources
[
PRICING
] [
BOOK ADEMO
] [
Log in
] 
[
Sign Up
![]] 
[![]] 
![Maps] 
### Need a map and not sure where to start?
Answer 5 quick questions to discover the right map for your needs.
[Get Started] 
Editorial
Mapbox alternatives: Evaluating cost, features, and flexibility for scalable mapping
Mamata Akella
,
Head of Cartography
•Tuesday, December 23, 2025
> Explore the best Mapbox alternatives, including open-source and cloud mapping tools, to compare features and pick the right web GIS solution.
![] 
Explore the best Mapbox alternatives, including open-source and cloud mapping tools, to compare features and pick the right web GIS solution.
# What are the best Mapbox alternatives? A Helpful comparison
Mapbox does a solid job with mapping, geocoding, and spatial analysis, but it’s not the only option out there. Teams often evaluate alternatives to save money, get more flexibility, and access[GIS capabilities] Mapbox doesn’t provide.
We’re breaking down the top commercial and open source Mapbox competitors so you can find the one that fits your project —and your budget.
## What is Mapbox, and why consider other Mapbox API alternatives?
Mapbox is a location data platform known for its high-performance[map API], advanced geocoding, and spatial analysis tools. Developers use it to create interactive maps and visualize geospatial data in different location-based applications.
Even though Mapbox has a lot to offer, it’s not the perfect fit for every project. Here are reasons you might want to explore other map software:
* **Pricing model:**The platform’s pay-as-you-go model can become unpredictable as you add users or scale up. Alternative platforms offer transparent, tiered pricing that’s easier to budget for.
* **SDK constraints:**Mapbox SDKs impose limits on offline map usage and cap API requests. Alternatives provide more generous offline capabilities and higher (or unlimited) API request thresholds, so apps function smoothly without hitting technical ceilings.
* **Vector tile rendering:**Under certain conditions, features may appear misaligned or incorrectly rendered due to issues with data encoding and coordinate systems. Many alternatives can create accurate, artifact-free maps across all zoom levels and datasets.
* **Mobile performance:**Mapbox can lag or stutter during map interactions —particularly when handling multiple data layers and complex animations. Alternatives are often optimized for mobile and deliver smooth, responsive maps even under heavy usage.
* **Unity support:**Mapbox’s Unity SDK lacks modern features like 3D Tiles support and precise coordinate-system controls. Alternatives offer richer 3D data formats and better spatial accuracy tools, making them more reliable for large-scale Unity applications.## 8 best Mapbox competitors for scalable map software
Looking for[mapping software] that scales with you? Check out these Mapbox alternatives that deliver exceptional performance and customization.
### 1. Felt
[Felt] offers one of the most innovative platforms for creating, sharing, and collaborating on interactive maps. It offers a powerful tiling and rendering engine that makes large datasets performant, as well as SDKs for building native applications and spatial experiences without the complexity of traditional[GIS software]. Felt shines when you need to build applications fast and easily, without a team of spatial experts.
Felt’s subscription-based pricing is easy to understand and more transparent than Mapbox’s usage-based, pay-as-you-go model. With Felt, teams can access the tools they need without worrying about unexpected costs and ongoing maintenance of the spatial stack.
### 2. Google Maps Platform
When weighing Mapbox vs. Google Maps, many teams looking for an alternative value Google Maps for its superior global coverage and extensive data accuracy. Developers use it to run ap

... (truncated to fit token limit)
```
```

```
Tool: codesearch

**Input:**
```json
{
  "query": "TileServer GL setup configuration Mapbox GL JS compatible",
  "tokensNum": 8000
}
```
**Output:**
```
## Configuration file - TileServer GL's documentation! - Read the Docs

https://tileserver.readthedocs.io/en/latest/config.html

```
"sources"
:
{
"aws-tiles"
:
{
"url"
:
"pmtiles://s3://my-bucket/tiles.pmtiles?profile=production"
,
"type"
:
"vector"
},
"dotted-bucket"
:
{
"url"
:
"pmtiles://s3://my.bucket.name/tiles.pmtiles?s3UrlFormat=aws"
,
"type"
:
"vector"
},
"spaces-tiles"
:
{
"url"
:
"pmtiles://s3://example-storage.com/my-bucket/tiles.pmtiles?region=nyc3"
,
"type"
:
"vector"
}
}
```

## Usage — TileServer GL 1.0 documentation

https://tileserver.readthedocs.io/en/latest/usage.html

```
Usage
:
tileserver
-
gl
[
file
]
[
options
]
Options
:
--
file

MBTiles
or
PMTiles
file
(
local
path
,
http
(
s
):
//
,
s3
:
//
,
pmtiles
:
//
,
or
mbtiles
:
//
URL
)
ignored
if
the
configuration
file
is
also
specified
--
mbtiles

(
DEPRECIATED
)
MBTiles
file
ignored
if
file
is
also
specified
ignored
if
the
configuration
file
is
also
specified
-
c
,
--
config

Configuration
file
[
config
.
json
]
(
default
:
"config.json"
)
-
b
,
--
bind

Bind
address
-
p
,
--
port

Port
[
8080
]
(
default
:
8080
)
-
C
|--
no
-
cors
Disable
Cross
-
origin
resource
sharing
headers
-
u
|--
public_url

Enable
exposing
the
server
on
subpaths
,
not
necessarily
the
root
of
the
domain
--
fetch
-
timeout

Timeout
in
milliseconds
for
fetching
remote
tiles
(
default
:
15000
)
--
ignore
-
missing
-
files
Do
not
exit
when
referenced
data
files
or
remote
sources
are
missing
at
startup
;
log
a
warning
and
continue
running
(
useful
when
styles
reference
optional
or
not
-
yet
-
available
sources
)
-
V
,
--
verbose
[
level
]
More
verbose
output
(
level
1
-
3
)
-
V
,
--
verbose
,
-
V
1
,
or
--
verbose
1
:
Important
operations
-
V
2
or
--
verbose
2
:
Detailed
operations
-
V
3
or
--
verbose
3
:
All
requests
and
debug
info
-
s
,
--
silent
Less
verbose
output
-
l
|--
log_file

output
log
file
(
defaults
to
standard
out
)
-
f
|--
log_format

define
the
log
format
:
https
:
//
github
.
com
/
expressjs
/
morgan
#morganformat-options
-
v
,
--
version
output
the
version
number
-
h
,
--
help
display
help
for
command
```


```
```

---

## Assistant

```
Tool: codesearch

**Input:**
```json
{
  "query": "react-native-maps MapLibre alternative to Mapbox custom tile server URL",
  "tokensNum": 5000
}
```
**Output:**
```
## App Component with Maplibre Integration in React

https://raw.githubusercontent.com/visgl/react-map-gl/main/modules/main/README.md

```
// Using Maplibre
import * as React from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{width: 600, height: 400}}
      mapStyle="https://api.maptiler.com/maps/streets/style.json?key=<Maptiler access token>"
    />
  );
}
```

## addProtocol() - MapLibre GL JS

https://maplibre.org/maplibre-gl-js/docs/API/functions/addProtocol/

```
// This will fetch a file using the fetch API (this is obviously a non interesting example...)
addProtocol('custom',async(params,abortController)=>{
const t=await fetch(`https:// ${ params.url.split("://" )[ 1]}`);
if(t.status == 200){
const buffer=await t.arrayBuffer ();
return{data:buffer}
}else{
throw new Error(`Tile fetch error: ${ t.statusText}`);
}
});
// the following is an example of a way to return an error when trying to load a tile
addProtocol('custom2',async(params,abortController)=>{
throw new Error('someErrorMessage' );
});
```

## Configures Source for Single and Multiple Tile Servers

https://raw.githubusercontent.com/antvis/L7/main/site/docs/api/tile/vector_tile_layer.zh.md

```
// 单服务器
const source = new Source('http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...})

// 多服务器
const source = new Source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...})
```

## Initialize OpenLayers Map with XYZ Tile Source

https://raw.githubusercontent.com/Hxy1992/MapDownload/main/README.md

```
// 非百度地图
const baseMap = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'http://localhost:7099/{z}/{x}/{y}.png',
    projection: 'EPSG:3857',
  }),
});
const map = new ol.Map({
  layers: [baseMap],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([105.08052356963802, 36.04231948670001], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5,
  }),
});
```

## Configure MapView for Android with LocalTile Overlay

https://raw.githubusercontent.com/react-native-maps/react-native-maps/main/README.md

```
<MapView
  mapType={Platform.OS == "android" ? "none" : "standard"}
>
```

## Defines Mapbox Access Token in Android Resources

https://raw.githubusercontent.com/mapbox/mapbox-java/main/INSTALL.md

```
<resources>
    <string name="mapbox_access_token"><your access token here></string>
</resources>
```

## Integrate MapBoxOfflineTileProvider with GoogleMap

https://raw.githubusercontent.com/cocoahero/android-gmaps-addons/main/README.md

```
` java
// Retrieve GoogleMap instance from MapFragment or elsewhere
GoogleMap map;

// Create new TileOverlayOptions instance.
TileOverlayOptions opts = new TileOverlayOptions();

// Get a File reference to the MBTiles file.
File myMBTiles;

// Create an instance of MapBoxOfflineTileProvider.
MapBoxOfflineTileProvider provider = new MapBoxOfflineTileProvider(myMBTiles);

// Set the tile provider on the TileOverlayOptions.
opts.tileProvider(provider);

// Add the tile overlay to the map.
TileOverlay overlay = map.addTileOverlay(opts);

// Sometime later when the map view is destroyed, close the provider.
// This is important to prevent a leak of the backing SQLiteDatabase.
provider.close();
```

## Imports Mapbox GL CSS for React Map Components

https://raw.githubusercontent.com/visgl/react-map-gl/main/docs/get-started/get-started.md

```
<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v<YOUR_MAPBOX_VERSION>/mapbox-gl.css' rel='stylesheet' />
```

## How to use MapLibre GL Js in react native - Stack Overflow

https://stackoverflow.com/questions/67952068/how-to-use-maplibre-gl-js-in-react-native

```
import { StyleSheet, View } from "react-native"; import MapboxGL from "@react-native-mapbox-gl/maps"; MapboxGL.setAccessToken(""); const styles = StyleSheet.create({ page: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5FCFF" }, container: { height: 300, width: 300, backgroundColor: "tomato" }, map: { flex: 1 } }); export default class App extends Component { render() { return ( ); } }
```

## Defines rawPath for tile requests in AWS Lambda

https://raw.githubusercontent.com/protomaps/PMTiles/main/serverless/aws/README.md

```
{
  "rawPath": "/my-tileset-name/0/0/0.mvt"
}
```

## js Result 1

https://raw.githubusercontent.com/maplibre/maplibre-native/main/platform/node/README.md

```
var mbgl = require('@maplibre/maplibre-gl-native');
var sharp = require('sharp');

var map = new mbgl.Map();

map.load(require('./test/fixtures/style.json'));

map.render(function(err, buffer) {
    if (err) throw err;

    map.release();

    var image = sharp(buffer, {
        raw: {
            width: 512,
            height: 512,
            channels: 4
        }
    });

    // Convert raw image buffer to PNG
    image.toFile('image.png', function(err) {
        if (err) throw err;
    });
});
```

## Configure Leaflet Tile Layer and Subdomains

https://raw.githubusercontent.com/axyjo/leaflet-rails/main/README.md

```
Leaflet.tile_layer = "http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png"
Leaflet.subdomains = ['otile1', 'otile2', 'otile3', 'otile4']
```

## Setup MapCache in MKMapView for Offline Tile Caching

https://raw.githubusercontent.com/merlos/iOS-Open-GPX-Tracker/main/Pods/MapCache/README.md

```
// ViewController.swift
class ViewController: UIViewController {
  @IBOutlet weak var map: MKMapView!

  override func viewDidLoad() {
    super.viewDidLoad()

    //...

    map.delegate = self

    //...

    // First setup the config of our cache. 
    // The only thing we must provide is the url template of the tile server.
    // (All other config options are explained below in the section MapCache Configuration)
    let config = MapCacheConfig(withUrlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")

    // initialize the cache with our config
    let mapCache = MapCache(withConfig: config)

    // We tell the MKMapView to use the cache
    // So whenever it requires a tile, it will be requested to the 
    // cache 
    map.useCache(mapCache)

    //...
}
```

## Configures Zoomify Source for OpenLayers Map

https://raw.githubusercontent.com/openlayers/openlayers/main/changelog/upgrade-notes.md

```
new ol.source.Zoomify({
  url: 'https://{a-f}.example.com/cgi-bin/iipsrv.fcgi?zoomify=/a/b/{TileGroup}/{z}-{x}-{y}.jpg'
});
```

## Configure MapboxWind TileSource and Layer for Carto

https://raw.githubusercontent.com/sakitam-fdd/wind-layer/main/packages/mapbox-gl/README.md

```
const source = new mapboxWind.TileSource('carto', {
    tileSize: 256,
    minZoom: 0,
    maxZoom: 22,
    roundZoom: true,
    subdomains: ['a', 'b', 'c', 'd'],
    // coordinates: [
    //   [-180, 85.051129],
    //   [180, 85.051129],
    //   [180, -85.051129],
    //   [-180, -85.051129],
    // ],
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    wrapX: true,
});

const layer = new mapboxWind.Layer('carto', source, {
    styleSpec: {
      'opacity': [
        'interpolate',
        ['exponential', 0.5],
        ['zoom'],
        1,
        1,
        2,
        1
      ],
    },
    renderType: mapboxWind.RenderType.image,
});

map.addLayer(layer);
```

## Vector Tiles with MapLibre GL in React Leaflet

https://docs.stadiamaps.com/tutorials/vector-tiles-with-react-leaflet/

```
useVectorTiles = true
```

## Integrates OmvDataSource in Angular MapComponent

https://raw.githubusercontent.com/heremaps/harp.gl/main/docs/GettingStartedAngular.md

```
--- a/src/app/map/map.component.ts
+++ b/src/app/map/map.component.ts
@@ -1,5 +1,6 @@
 import { Component, OnInit } from '@angular/core';
 import { MapView } from '@here/harp-mapview';
+import { OmvDataSource } from '@here/harp-omv-datasource';

 @Component({
   selector: 'app-map',
@@ -19,11 +20,17 @@ export class MapComponent implements OnInit {
         'https://unpkg.com/@here/harp-map-theme/resources/berlin_tilezen_base.json',
       decoderUrl: './decoder.bundle.js'
     });
+
+    const omvDataSource = new OmvDataSource({
+      baseUrl: 'https://vector.hereapi.com/v2/vectortiles/base/mc',
+      authenticationCode: 'J0IJdYzKDYS3nHVDDEWETIqK3nAcxqW42vz7xeSq61M',
+    });
+    this.mapView.addDataSource(omvDataSource);
   }

 }
```

## Configures Basemap Style URL for MapLibre GL Rendering

https://raw.githubusercontent.com/consbio/mbtileserver/main/README.md

```
--basemap-style-url "https://tiles.stadiamaps.com/styles/stamen_toner_lite.json?api_key=<your key>"
```

## Configure ol.source.TileUTFGrid for Mapbox v3 and v4 APIs

https://raw.githubusercontent.com/openlayers/openlayers/main/changelog/v3.16.0.md

```
// To work with the v4 API
var v4source = new ol.source.TileUTFGrid({
  url: 'https://api.tiles.mapbox.com/v4/example.json?access_token=' + YOUR_KEY_HERE
});

// To work with the v3 API
var v3source = new ol.source.TileUTFGrid({
  jsonp: true, // <--- this is required for v3
  url: 'http://api.tiles.mapbox.com/v3/example.json'
});
```

## MaplibreWorldMap Component with MapTiler API Key

https://raw.githubusercontent.com/pnp/sp-dev-fx-controls-react/main/docs/documentation/docs/controls/WorldMap.md

```
<MaplibreWorldMap
  data={locations}
  mapKey="your-maptiler-api-key"
/>
```

## Configures Tile Source URL with API Key for MapLibre

https://raw.githubusercontent.com/maplibre/flutter-maplibre-gl/main/maplibre_gl/README.md

```
https://tiles.example.com/{z}/{x}/{y}.vector.pbf?api_key={your_key}
```

## RasterTileSource - MapLibre GL JS

https://maplibre.org/maplibre-gl-js/docs/API/classes/RasterTileSource/

```
map.addSource('wms-test-source',{
'type':'raster',
// use the tiles option to specify a WMS tile source URL
'tiles':[
'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'
],
'tileSize':256 // Important for WMS if tiles are 256px
});
```

## Sources - MapLibre Style Spec

https://www.maplibre.org/maplibre-style-spec/sources/

```
{"sum": [["+", ["accumulated"], ["get", "sum"]], ["get", "scalerank"]]}
```

## swift Result 1

https://raw.githubusercontent.com/maplibre/maplibre-native/main/platform/ios/MapLibre.docc/ActionJournalExample.md

```
let options = MLNMapOptions()
        options.actionJournalOptions.enabled = true
        options.styleURL = AMERICANA_STYLE
        mapView = MLNMapView(frame: view.bounds, options: options)
```

## VectorTileSource - MapLibre GL JS

https://maplibre.org/maplibre-gl-js/docs/API/classes/VectorTileSource/

```
map.getSource('some id' ). setTiles ([ 'https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt' ]);
```

## Create TileSource for Wind Layer in MapLibre

https://raw.githubusercontent.com/sakitam-fdd/wind-layer/main/docs/guide/maplibre-gl.md

```
import { Layer, TileSource, RenderType, DecodeType, RenderFrom } from '@sakitam-gis/maplibre-wind';

const source = new TileSource('wind', {
    url: 'https://blog.sakitam.com/wind-layer/data/tiles/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
    tileSize: 256,
    minZoom: 0,
    maxZoom: 3,
    roundZoom: true,
    decodeType: DecodeType.imageWithExif,
    wrapX: true,
});
```

## Set Mapbox Access Token in React Native App

https://raw.githubusercontent.com/rnmapbox/maps/main/docs/GettingStarted.md

```
import Mapbox from "@rnmapbox/maps";

Mapbox.setAccessToken("<YOUR_ACCESSTOKEN>");
```

## Install MapLibre for React Native with Expo

https://raw.githubusercontent.com/maplibre/maplibre-react-native/main/docs/content/setup/expo.md

```
npx expo install @maplibre/maplibre-react-native
```

## Configures OpenStreetMap Tile Layer for Mapbox Integration

https://raw.githubusercontent.com/reggie3/react-native-webview-leaflet/main/readme.md

```
{
    baseLayerName: 'OpenStreetMap',  // the name of the layer, this will be seen in the layer selection control
    baseLayerIsChecked: 'true',  // if the layer is selected in the layer selection control
    layerType: 'TileLayer',  // Optional: a MapLayerType enum specifying the type of layer see "Types of Layers" below. Defaults to TILE_LAYER
    baseLayer: true,
    // url of tiles
    url: `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${mapboxToken}`,
    // attribution string to be shown for this layer
    attribution:
      '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
  }
```

## Configure Raster Source in React Mapbox GL

https://raw.githubusercontent.com/alex3165/react-mapbox-gl/main/docs/API.md

```
import { Source } from "react-mapbox-gl";

...

const RASTER_SOURCE_OPTIONS = {
  "type": "raster",
  "tiles": [
    "https://someurl.com/512/{z}/{x}/{y}",
  ],
  "tileSize": 512
};

<Source id="source_id" tileJsonSource={RASTER_SOURCE_OPTIONS} />
<Layer type="raster" id="layer_id" sourceId="source_id" />
```

## Style Component for Mapbox GL Style Specification

https://raw.githubusercontent.com/rnmapbox/maps/main/docs/Style.md

```
MapboxJSON | URL
```

## Install MapLibre for React Native using Yarn

https://raw.githubusercontent.com/maplibre/maplibre-react-native/main/docs/content/setup/react-native.md

```
yarn add @maplibre/maplibre-react-native
```

## Load PMTiles Style JSON for MapLibre iOS

https://raw.githubusercontent.com/maplibre/maplibre-native/main/platform/ios/MapLibre.docc/PMTiles.md

```
https://raw.githubusercontent.com/wipfli/foursquare-os-places-pmtiles/refs/heads/main/style.json
```

## Configures MapLibre GL Style for Local Tile Server

https://raw.githubusercontent.com/matrix-org/matrix.org/main/content/docs/older/map-tile-server.md

```
{
  "version": 8,
  "sources": {
    "localsource": {
      "type": "raster",
      "tiles": [
        "http://127.0.0.1:8080/tile/{z}/{x}/{y}.png"
      ],
      "tileSize": 256,
      "attribution": "Maps Copyright 2022 &lt;a href=\"http://www.geofabrik.de/\"&gt;Geofabrik GmbH&lt;/a&gt; and &lt;a href=\"http://www.openstreetmap.org/\"&gt;OpenStreetMap Contributors&lt;/a&gt;"
    }
  },
  "layers": [
    {
      "id": "locallayer",
      "source": "localsource",
      "type": "raster"
    }
  ]
}
```

## Configure Wind Layer with MapLibreWind

https://raw.githubusercontent.com/sakitam-fdd/wind-layer/main/packages/maplibre-gl/README.md

```
const tileSource = new maplibreWind.TileSource('wind', {
  tileSize: 256,
  minZoom: 0,
  maxZoom: 4,
  roundZoom: true,
  decodeType: maplibreWind.DecodeType.imageWithExif,
  wrapX: true,
  // tileBounds: [-78.120282611, -75.191804486, 132.453327310, 68.846393966],
  url: 'http://localhost:5000/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
});

const layer = new maplibreWind.Layer('wind', tileSource, {
  styleSpec: {
    'fill-color': [
      'interpolate',
      ['step', 1],
      ['get', 'value'],
      ...interpolateColor
    ],
    'opacity': 1,
  },
  renderFrom: maplibreWind.RenderFrom.rg,
  widthSegments: 1,
  heightSegments: 1,
  displayRange: [0, 104],
  renderType: maplibreWind.RenderType.colorize,
  picking: true,
  // mask: {
  //   data: clip,
  //   // type: maplibreWind.MaskType.outside,
  //   type: maplibreWind.MaskType.inside, // 默认是 inside，即只显示范围内的
  // }
});

map.addLayer(layer);
```

## Add PMTiles Protocol Cache to MapLibre GL

https://raw.githubusercontent.com/protomaps/PMTiles/main/js/CHANGELOG.md

```
let cache = new pmtiles.ProtocolCache();
  maplibregl.addProtocol("pmtiles",cache.protocol);
```

## Register MapLibreComtProvider and Initialize Map Instance

https://raw.githubusercontent.com/mactrem/com-tiles/main/packages/maplibre-provider/README.md

```
`js
import  { MapLibreComtProvider } from "@com-tiles/maplibre-provider";

MapLibreComtProvider.register();
const map = new maplibregl.Map({...});
```

## Integrates PMTiles Protocol with MapLibre GL JS

https://raw.githubusercontent.com/protomaps/PMTiles/main/js/README.md

```
import { Protocol } from "pmtiles";
let protocol = new Protocol();
maplibregl.addProtocol("pmtiles",protocol.tile);
var style = {
"version": 8,
"sources": {
    "example_source": {
        "type": "vector",
        "url": "pmtiles://https://example.com/example.pmtiles",
        "attribution": '© <a href="https://openstreetmap.org">OpenStreetMap</a>'
    ...
```

## MapBox Component with PMTiles Protocol Integration

https://raw.githubusercontent.com/supabase/supabase/main/apps/www/_blog/2024-06-19-self-host-maps-storage-protomaps.mdx

```
'use dom'

import 'text-encoding-polyfill'
import { useEffect } from 'react'
import Map from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Protocol } from 'pmtiles'

export default function MapBox(_) {
  useEffect(() => {
    let protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    return () => {
      maplibregl.removeProtocol('pmtiles')
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        style={{ width: '100%', height: 900 }}
        mapStyle={{
          version: 8,
          sources: {
            sample: {
              type: 'vector',
              url: 'pmtiles://https://r2-public.protomaps.com/protomaps-sample-datasets/cb_2018_us_zcta510_500k.pmtiles',
            },
          },
          layers: [
            {
              id: 'zcta',
              source: 'sample',
              'source-layer': 'zcta',
              type: 'line',
              paint: {
                'line-color': '#999',
              },
            },
          ],
        }}
        mapLib={maplibregl}
      />
    </div>
  )
}
```

## Imports tileStore from @rnmapbox/maps for tile management

https://raw.githubusercontent.com/rnmapbox/maps/main/docs/tileStore.md

```
import { tileStore } from '@rnmapbox/maps';

tileStore
```


```
```



```
Tool: codesearch

**Input:**
```json
{
  "query": "TileServer GL light Mapbox GL JS style.json custom vector tiles",
  "tokensNum": 5000
}
```
**Output:**
```
## Integrates PMTiles Protocol with MapLibre GL JS

https://raw.githubusercontent.com/protomaps/PMTiles/main/js/README.md

```
import { Protocol } from "pmtiles";
let protocol = new Protocol();
maplibregl.addProtocol("pmtiles",protocol.tile);
var style = {
"version": 8,
"sources": {
    "example_source": {
        "type": "vector",
        "url": "pmtiles://https://example.com/example.pmtiles",
        "attribution": '© <a href="https://openstreetmap.org">OpenStreetMap</a>'
    ...
```

## Initialize MapLibre GL with PMTiles Protocol

https://raw.githubusercontent.com/simonw/til/main/gis/pmtiles.md

```
import * as pmtiles from "pmtiles";
import * as maplibregl from "maplibre-gl";
import layers from "protomaps-themes-base";

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const myMap = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    glyphs: "https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf",
    sources: {
      protomaps: {
        type: "vector",
        url: `pmtiles://${location.protocol}//${location.host}${location.pathname}hmb.pmtiles`,
        attribution:
          '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
      },
    },
    layers: layers("protomaps", "light"),
  },
});
myMap.on("load", () => {
  const myBounds = myMap.getSource("protomaps").bounds;
  myMap.setMaxBounds(myBounds);
});
```

## Configures map_style_url for Element client tile server

https://raw.githubusercontent.com/matrix-org/matrix.org/main/content/docs/older/map-tile-server.md

```
{
   ... other config ...
   "map_style_url": "http://127.0.0.1:8080/style.json",
   ... other config ...
}
```

## Configuration file — TileServer GL 1.0 documentation

https://tileserver.readthedocs.io/en/latest/config.html

```
"sources"
:
{
"aws-tiles"
:
{
"url"
:
"pmtiles://s3://my-bucket/tiles.pmtiles?profile=production"
,
"type"
:
"vector"
},
"dotted-bucket"
:
{
"url"
:
"pmtiles://s3://my.bucket.name/tiles.pmtiles?s3UrlFormat=aws"
,
"type"
:
"vector"
},
"spaces-tiles"
:
{
"url"
:
"pmtiles://s3://example-storage.com/my-bucket/tiles.pmtiles?region=nyc3"
,
"type"
:
"vector"
}
}
```

## Defines COMTiles source for MapLibre GL JS

https://raw.githubusercontent.com/mactrem/com-tiles/main/packages/maplibre-provider/README.md

```
`json
"test-source": {
    "type": "vector",
    "tiles": [
      "comt://http://0.0.0.0:9000/comtiles/test.comt/{z}/{x}/{y}"
    ]
    "maxzoom": 14
}
```

## Add Raster Tile Source and Layer to Mapbox GL JS

https://raw.githubusercontent.com/mapbox/geojson.io/main/API.md

```
window.api.map.addSource('raster-tiles', {
    'type': 'raster',
    'tiles': [
    'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'
    ],
    'tileSize': 256,
    'attribution':
    'Map tiles by <a target="_top" rel="noopener" href="https://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="https://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="https://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
})

window.api.map.addLayer({
    'id': 'simple-tiles',
    'type': 'raster',
    'source': 'raster-tiles',
    'minzoom': 0,
    'maxzoom': 22
})
```

## Initialize Mapbox Map and Add Vector Layer

https://raw.githubusercontent.com/gisarmory/gisarmory.blog/main/maputnik-GeoserverVectorTiles/README.md

```
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	zoom: 3,
	center: [108.34942054748535,37.83543237333567]
});

map.on('load', function() {
	map.addLayer({
		"id": "mapillary",
		"type": "line",
		"source": {
			"type": "vector",
			'scheme':'tms',
			"tiles": ["http://192.168.50.198:7000/geoserver/gwc/service/tms/1.0.0/china%3Acity_region@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf"],
		},
		"source-layer": "city_region",
		"paint": {
			"line-opacity": 0.6,
			"line-color": "rgb(53, 175, 109)",
			"line-width": 2
		}
	}, 'waterway-label');
});
```

## unknown Result 1

https://raw.githubusercontent.com/rnmapbox/maps/main/src/web/install.md

```
yarn add mapbox-gl
```

## Creates OpenLayers Image Layer with Vector Source

https://raw.githubusercontent.com/openlayers/openlayers/main/changelog/v4.6.0.md

```
new ol.layer.Image({
  source: new ol.source.ImageVector({
    style: myStyle,
    source: new ol.source.Vector({
      url: 'my/data.json',
      format: new ol.format.GeoJSON()
    })
  })
});
```

## Add GeoJSON Layer with Custom Styles in Geemap

https://raw.githubusercontent.com/giswqs/geebook/main/chapters/04_local_data.md

```
Map = geemap.Map()

style = {
    "stroke": True,
    "color": "#0000ff",
    "weight": 2,
    "opacity": 1,
    "fill": True,
    "fillColor": "#0000ff",
    "fillOpacity": 0.1,
}

hover_style = {"fillOpacity": 0.7}

Map.add_geojson(url, layer_name="Countries", style=style, hover_style=hover_style)
Map
```

## Creating Offline Custom Style Maps With tileserver-gl - Yasoob Khalid

https://yasoob.me/posts/custom-map-with-tileserver-gl/

```
Hostname / Ports
```

## C++ Result 1

https://raw.githubusercontent.com/maplibre/maplibre-native/main/vendor/maplibre-native-base/docs/value.md

```
using A = mapbox::base::ValueArray;

    A lineGradient = {"interpolate", A{"linear"}, A{"line-progress"}};

    lineGradient.push_back(0);
    lineGradient.push_back("blue");

    lineGradient.push_back(0.1);
    lineGradient.push_back("royalblue");

    lineGradient.push_back(0.3);
    lineGradient.push_back("cyan");

    lineGradient.push_back(0.5);
    lineGradient.push_back("lime");

    lineGradient.push_back(0.7);
    lineGradient.push_back("yellow");

    lineGradient.push_back(1);
    lineGradient.push_back("red");

    //! which we can now give to the map:
    map->setStyleLayerProperty("my-line", "line-gradient", lineGradient);

    std::cout << toString(lineGradient) << std::endl;
```

## Instantiate HeatmapTileLayer from @deck.gl/carto

https://raw.githubusercontent.com/visgl/deck.gl/main/docs/api-reference/carto/heatmap-tile-layer.md

```
import {HeatmapTileLayer} from '@deck.gl/carto';
new HeatmapTileLayer({});
```

## Add Layer to Map with mmgisAPI.addLayer

https://raw.githubusercontent.com/NASA-AMMOS/MMGIS/main/docs/pages/APIs/JavaScript/Main/Main.md

```
window.mmgisAPI.addLayer({ name: "Sample Header", type: "header" }).then(() => {
  console.log("added and loaded");
});

window.mmgisAPI
  .addLayer(
    {
      name: "New Waypoints",
      kind: "waypoint",
      shape: "none",
      type: "vector",
      url: "Layers/Waypoints/waypoints.json",
      demparser: "",
      controlled: false,
      layer3dType: "clamped",
      description:
        "### Overview\n\nIure iure quas doloremque sequi pariatur repudiandae. Provident similique in illum deleniti qui consequuntur iste aut. Quia accusamus dolorem beatae et aut.\n\nVero cum ullam cumque optio laborum. Qui corporis incidunt accusamus voluptatem. Quam eos et expedita. Quidem et velit fuga et delectus veniam.\n\n- Vel ex voluptatem dicta\n- Dolor et itaque quidem\n- Vero cum ullam cumque [optio laborum](www.duckduckgo.com)\n\nDolor et itaque quidem. Dolorem ut nemo porro rerum. Rerum voluptas quo sit velit voluptatibus perspiciatis ipsum. Vel ex voluptatem dicta. Et porro harum maiores. Quae consequatur exercitationem numquam.\n",
      tags: ["rover", "science", "telem:45B", "location"],
      legend: "Layers/Waypoints/legend.csv",
      visibility: true,
      initialOpacity: 1,
      togglesWithHeader: true,
      style: {
        className: "waypoints",
        color: "#FFF",
        fillColor: "#000",
        weight: 2,
        fillOpacity: 1,
        opacity: 1,
      },
      variables: {
        useKeyAsName: "sol_site_p",
        layerAttachments: {
          labels: {
            initialVisibility: false,
            theme: "default",
            size: "large",
          },
        },
        markerAttachments: {
          bearing: {
            angleProp: "yaw_rad",
            angleUnit: "rad",
            color: "#FFFFFF",
          },
        },
        search: "(sol_site_p)",
      },
      radius: 8,
      time: {
        enabled: false,
        type: "requery",
        isRelative: true,
        current: "2023-02-07T17:58:53Z",
        start: "",
        end: "",
        startProp: "",
        endProp: "",
        format: "%Y-%m-%dT%H:%M:%SZ",
        compositeTile: false,
        refresh: "1 hours",
        increment: "5 minutes",
      },
      uuid: "7f6396c3-eef1-401a-9e99-790ed102efff",
    },
    { path: "Features", index: 0 }
  )
  .then(() => {
    console.log("loaded");
  })
  .catch((errMsg) => {
    console.log(errMsg);
  });
```

## Load AMap TileLayer with Custom URL in Scene

https://raw.githubusercontent.com/antvis/L7/main/site/docs/tutorial/map/amapplugin.zh.md

```
scene.on('loaded', () => {
  var xyzTileLayer = new window.AMap.TileLayer({
    getTileUrl:
      'https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&size=1&scl=1&style=8&ltype=11',
    zIndex: 100,
  });
  scene.map.add(xyzTileLayer);
});
```

## Defines mapLayers for vector and XYZ layers in GeoJSON format

https://raw.githubusercontent.com/wegue-oss/wegue/main/docs/workshop.md

```
"mapLayers": [
    {
        "type": "VECTOR",
        "format": "GeoJSON",
        "lid": "airports",
        "name": "Airports",
        "url": "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/90266457d82d3717e47313e72a921e31a087d2c4/50m/cultural/ne_50m_airports.json"
    },
    {
        "type": "XYZ",
        "name": "Carto Positron",
        "url": "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "lid": "positron",
        "attributions": "Maps: © <a href='https://carto.com/attribution/' target='_blank'>CARTO</a> | <a href='https://openstreetmap.org/copyright' target='_blank'>© OpenStreetMap</a>-contributors | "
    }
]
```

## Configures Mapzen Vector Tile Source for MapboxGL

https://raw.githubusercontent.com/tilezen/vector-datasource/main/docs/display-tiles.md

```
"sources": {
    "osm": {
      "type": "vector",
      "tiles": ["https://tile.mapzen.com/mapzen/vector/v1/{layers}/{zoom}/{x}/{y}.mvt"]
```

## Configures sm-web-map with raster tiles and layer styles

https://raw.githubusercontent.com/SuperMap/vue-iclient/main/docs/zh/api/control/open-file.md

```
<sm-web-map :map-options="mapOptions">
  <sm-open-file :layer-style="layerStyle"></sm-open-file>
</sm-web-map>

<script>
export default {
  data() {
      return {
          mapOptions: {
            container: "map", // container id
            style: {
                version: 8,
                sources: {
                    "raster-tiles": {
                        type: "raster",
                        tiles: [
                            "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/ChinaDark/zxyTileImage.png?z={z}&x={x}&y={y}"
                        ],
                        tileSize: 256
                    }
                },
                layers: [
                    {
                        id: "simple-tiles",
                        type: "raster",
                        source: "raster-tiles",
                        minzoom: 0,
                        maxzoom: 22
                    }
                ]
            },
            center: [120.143, 30.236],
            zoom: 3
          },
          layerStyle: {
              line: new SuperMap.Components.commontypes.LineStyle(),
              circle: new SuperMap.Components.commontypes.CircleStyle(),
              fill: new SuperMap.Components.commontypes.FillStyle()
          },
      };
}
</script>
```

## Mapbox Style Configuration for Landsat WRS Data

https://raw.githubusercontent.com/developmentseed/tipg/main/docs/src/user_guide/endpoints.md

```
// http://127.0.0.1:8081/collections/public.landsat_wrs/WebMercatorQuad/style.json
{
  "version": 8,
  "name": "TiPg",
  "layers": [
    {
      "id": "public.landsat_wrs_fill",
      "source": "public.landsat_wrs",
      "source-layer": "default",
      "type": "fill",
      "filter": [
        "==",
        [
          "geometry-type"
        ],
        "Polygon"
      ],
      "paint": {
        "fill-color": "rgba(200, 100, 240, 0.4)",
        "fill-outline-color": "#000"
      }
    },
    {
      "id": "public.landsat_wrs_stroke",
      "source": "public.landsat_wrs",
      "source-layer": "default",
      "type": "line",
      "filter": [
        "==",
        [
          "geometry-type"
        ],
        "LineString"
      ],
      "paint": {
        "line-color": "#000",
        "line-width": 1,
        "line-opacity": 0.75
      }
    },
    {
      "id": "public.landsat_wrs_point",
      "source": "public.landsat_wrs",
      "source-layer": "default",
      "type": "circle",
      "filter": [
        "==",
        [
          "geometry-type"
        ],
        "Point"
      ],
      "paint": {
        "circle-color": "#000",
        "circle-radius": 2.5,
        "circle-opacity": 0.75
      }
    }
  ],
  "sources": {
    "public.landsat_wrs": {
      "type": "vector",
      "scheme": "xyz",
      "tiles": [
        "http://127.0.0.1:8081/collections/public.landsat_wrs/tiles/WebMercatorQuad/{z}/{x}/{y}"
      ],
      "bounds": [
        -180,
        -82.6401,
        180,
        82.6401
      ],
      "minzoom": 0,
      "maxzoom": 22
    }
  },
  "center": [
    0,
    0
  ],
  "zoom": 0
}
```

## Add Styled Vector Layer to Geemap with Custom Visualization

https://raw.githubusercontent.com/giswqs/geog-312/main/book/geospatial/geemap.md

```
m = geemap.Map(center=[40, -100], zoom=4)
states = ee.FeatureCollection("TIGER/2018/States")
vis_params = {
    "color": "000000",
    "colorOpacity": 1,
    "pointSize": 3,
    "pointShape": "circle",
    "width": 2,
    "lineType": "solid",
    "fillColorOpacity": 0.66,
}
palette = ["006633", "E5FFCC", "662A00", "D8D8D8", "F5F5F5"]
m.add_styled_vector(
    states, column="NAME", palette=palette, layer_name="Styled vector", **vis_params
)
m
```

## Apply Mapbox Style to OpenLayers Map

https://raw.githubusercontent.com/openlayers/ol-mapbox-style/main/README.md

```
import { apply } from 'ol-mapbox-style';

apply('map', 'https://api.mapbox.com/styles/v1/mapbox/bright-v9?access_token=YOUR_MAPBOX_TOKEN');
```

## maptiler/tileserver-gl - GitHub

https://github.com/maptiler/tileserver-gl

```
xvfb-run --server-args="-screen 0 1024x768x24" node .
```

## Integrates Leaflet with Mapbox GL for Enhanced Mapping

https://raw.githubusercontent.com/mapbox/mapbox-gl-leaflet/main/README.md

```
<!-- Leaflet -->
<link rel="stylesheet" href="leaflet.css" />
<script src="leaflet.js"></script>

<!-- Mapbox GL -->
<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css' rel='stylesheet' />
<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.js'></script>

<script src="leaflet-mapbox-gl.js"></script>
```

## Serve maps with TileServer GL - OpenMapTiles

https://openmaptiles.org/docs/host/tileserver-gl/

```
docker run -it -v $(pwd):/data -p 8080:8080 maptiler/tileserver-gl
```

## Add Mapbox Layers for Voter Precincts and Polling Locations

https://raw.githubusercontent.com/tobinbradley/dirt-simple-postgis-http-api/main/README.md

```
map.on('load', function() {
  map.addLayer({
    id: 'dirt-mvt',
    source: {
      type: 'vector',
      tiles: ['http://localhost:3000/v1/mvt/voter_precinct/{z}/{x}/{y}'],
      maxzoom: 14,
      minzoom: 5
    },
    'source-layer': 'voter_precinct',
    type: 'fill',
    minzoom: 5,
    paint: {
      'fill-color': '#088',
      'fill-outline-color': '#333'
    }
  })

  map.addLayer({
    id: 'dirt-geojson',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'http://localhost:3000/v1/geojson/voter_polling_location'
    },
    paint: {
      'circle-radius': 2,
      'circle-color': '#bada55'
    }
  })
})
```

## tileserver-gl-light - NPM

https://www.npmjs.com/package/tileserver-gl-light

```
npm install -g tileserver-gl-light
```

## Defines MVTSource URL for fetching vector tiles

https://raw.githubusercontent.com/SpatialServer/Leaflet.MapboxVectorTile/main/docs/configuration.md

```
url: "http://spatialserver.spatialdev.com/services/vector-tiles/gaul_fsp_india/{z}/{x}/{y}.pbf",
```

## Custom Map Style Configuration for Kepler.gl

https://raw.githubusercontent.com/keplergl/kepler.gl/main/docs/api-reference/advanced-usages/custom-map-styles.md

```
// custom map style
{
  id: 'voyager',
  label: 'Voyager',
  url: 'https://api.maptiler.com/maps/voyager/style.json?key=xxxx',
  icon: 'https://api.maptiler.com/maps/voyager/256/0/0/0.png?key=xxx',
  layerGroups: [
    {
      slug: 'label',
      filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
      defaultVisibility: true
    },
    {
      slug: 'road',
      filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
      defaultVisibility: true
    }
  ]
}
```

## Custom Tile Servers | MeshMonitor

https://meshmonitor.org/configuration/custom-tile-servers.html

```
# Try older version (may have better compatibility) docker run -d \ --name tileserver \ -p 8080:8080 \ -v $(pwd)/tiles:/data \ maptiler/tileserver-gl:v3.1.1
```


```
```

---

## Assistant

```
Tool: todowrite

**Input:**
```json
{
  "todos": [
    {
      "content": "Analizar implementación actual de Mapbox en el proyecto",
      "status": "completed",
      "priority": "high",
      "id": "1"
    },
    {
      "content": "Investigar opciones de servidores de mapas propios compatibles con Mapbox",
      "status": "completed",
      "priority": "high",
      "id": "2"
    },
    {
      "content": "Identificar componentes que necesitarían modificaciones",
      "status": "completed",
      "priority": "high",
      "id": "3"
    },
    {
      "content": "Crear guía de implementación con recomendaciones",
      "status": "in_progress",
      "priority": "medium",
      "id": "4"
    }
  ]
}
```
**Output:**
```
[
  {
    "content": "Analizar implementación actual de Mapbox en el proyecto",
    "status": "completed",
    "priority": "high",
    "id": "1"
  },
  {
    "content": "Investigar opciones de servidores de mapas propios compatibles con Mapbox",
    "status": "completed",
    "priority": "high",
    "id": "2"
  },
  {
    "content": "Identificar componentes que necesitarían modificaciones",
    "status": "completed",
    "priority": "high",
    "id": "3"
  },
  {
    "content": "Crear guía de implementación con recomendaciones",
    "status": "in_progress",
    "priority": "medium",
    "id": "4"
  }
]
```
```



---

## Assistant

 He analizado tu proyecto y las opciones disponibles. Aquí está mi informe completo:

## 📊 ANÁLISIS ACTUAL DE MAPBOX EN TU PROYECTO

### Componentes que usan Mapbox:

1. **Map.tsx** (`src/components/shared/Map.tsx`) - Mapa principal del cliente
2. **RoutesMap.tsx** (`src/components/customer/RoutesMap.tsx`) - Mapa de rutas
3. **LiveTrackingMap.tsx** (`src/components/customer/LiveTrackingMap.tsx`) - Seguimiento en vivo
4. **CaptainLiveTrackingMapbox.tsx** (`src/components/captain/CaptainLiveTrackingMapbox.tsx`) - Seguimiento del capitán
5. **MapPickerModalMapbox.tsx** (`src/components/customer/MapPickerModalMapbox.tsx`) - Selector de ubicación
6. **mapUtils.tsx** (`src/utils/mapUtils.tsx`) - Servicios de geocodificación y rutas

### APIs de Mapbox que estás usando:
- **Map Tiles** (styleURL: 'mapbox://styles/mapbox/dark-v11')
- **Geocoding API** (búsqueda de lugares)
- **Directions API** (cálculo de rutas)
- **Reverse Geocoding** (coordenadas a dirección)

---

## 🗺️ OPCIONES DE SERVIDORES DE MAPAS PROPIOS

### Opción 1: **TileServer GL** (Recomendada - Mayor compatibilidad)
**Pros:**
- 100% compatible con Mapbox GL JS (mismo formato de estilos)
- Soporta vector tiles y raster tiles
- Puede usar archivos MBTiles o PMTiles
- Fácil configuración con Docker
- No requiere cambios en la estructura de estilos

**Contras:**
- Requiere servidor propio (VPS/cloud)
- Necesitas descargar datos de mapas (OpenStreetMap)

**Compatibilidad con tu proyecto:** ⭐⭐⭐⭐⭐
- Mantiene `styleURL` con formato Mapbox
- Mismo formato de tiles `{z}/{x}/{y}`
- Compatible con @rnmapbox/maps

### Opción 2: **Protomaps + PMTiles** (Más económica)
**Pros:**
- Un solo archivo para todo el mapa
- Sin servidor necesario (puede usar CDN/cloud storage)
- Formatos modernos y eficientes
- Datos basados en OpenStreetMap

**Contras:**
- Requiere migración a MapLibre (alternativa open source a Mapbox)
- Estilos diferentes (aunque adaptables)
- Mayor trabajo de migración

**Compatibilidad con tu proyecto:** ⭐⭐⭐
- Requiere cambiar de @rnmapbox/maps a @maplibre/maplibre-react-native
- Diferente sistema de estilos

### Opción 3: **OpenMapTiles + TileServer**
**Pros:**
- Stack completo open source
- Datos actualizados de OpenStreetMap
- Buena documentación

**Contras:**
- Requiere generar tus propios tiles
- Setup más complejo

**Compatibilidad:** ⭐⭐⭐⭐
- Similar a TileServer GL

---

## 🔧 COMPONENTES QUE NECESITARÍAS MODIFICAR

### Si usas **TileServer GL** (mínimos cambios):

**Archivos a modificar:**
1. **mapUtils.tsx** - Cambiar URLs de APIs:
   - Geocoding: Reemplazar `api.mapbox.com/geocoding` → Tu servidor o alternativa (Nominatim, Pelias)
   - Directions: Reemplazar `api.mapbox.com/directions` → Tu servidor (OSRM, Valhalla) o alternativa

2. **Todos los componentes de mapa** - Cambiar `styleURL`:
   ```typescript
   // De:
   styleURL='mapbox://styles/mapbox/dark-v11'
   
   // A:
   styleURL='http://TU_SERVIDOR:8080/styles/dark/style.json'
   ```

3. **Configuración de tokens** - Eliminar o cambiar:
   ```typescript
   // Ya no necesitas tokens de Mapbox
   // Mapbox.setAccessToken(accesToken);
   ```

### Si usas **MapLibre + Protomaps** (cambios mayores):

**Archivos a modificar:**
1. **package.json** - Cambiar dependencia:
   ```json
   // De:
   "@rnmapbox/maps": "^10.1.37"
   
   // A:
   "@maplibre/maplibre-react-native": "^10.0.0"
   ```

2. **Todos los imports** - Cambiar en 6 archivos:
   ```typescript
   // De:
   import Mapbox from '@rnmapbox/maps';
   
   // A:
   import MapLibre from '@maplibre/maplibre-react-native';
   ```

3. **Todos los componentes de mapa** - Adaptar props y estilos
4. **mapUtils.tsx** - Cambiar todas las APIs

---

## 🚀 GUÍA DE IMPLEMENTACIÓN RECOMENDADA

### Opción A: TileServer GL (Compatibilidad máxima)

**Paso 1: Setup del servidor**
```bash
# Usando Docker (recomendado)
docker run -it -v $(pwd)/tiles:/data -p 8080:8080 maptiler/tileserver-gl

# O instalar localmente
npm install -g tileserver-gl-light
```

**Paso 2: Obtener datos de mapas**
- Descargar MBTiles de [OpenMapTiles](https://openmaptiles.org/downloads.html) o [Protomaps](https://protomaps.com/downloads)
- O generar tus propios tiles con tippecanoe

**Paso 3: Configurar estilos**
- Usar estilos Mapbox existentes (dark-v11, streets-v11, etc.)
- O crear estilos personalizados con Maputnik

**Paso 4: Modificar tu código**
- Solo cambiar URLs en los 6 archivos mencionados
- Reemplazar APIs de geocodificación/rutas

### Opción B: Alternativas a las APIs de Mapbox

**Para Geocoding (reemplaza mapbox.places):**
- **Nominatim** (OpenStreetMap) - Gratuito, requiere servidor propio
- **Pelias** - Open source, requiere servidor
- **Geoapify** - Comercial, precios razonables

**Para Directions (reemplaza directions/v5):**
- **OSRM** (Open Source Routing Machine) - Open source, requiere servidor
- **Valhalla** - Open source, más flexible
- **OpenRouteService** - API gratuita con límites

---

## 💰 ESTIMACIÓN DE COSTOS

### Opción TileServer GL:
- **Servidor VPS:** $10-50/mes (depende de tráfico)
- **Almacenamiento:** ~50GB para mapa mundial completo
- **Ancho de banda:** Variable según usuarios
- **Setup inicial:** 4-8 horas de trabajo

### Opción Protomaps (sin servidor):
- **Cloud Storage (S3/R2):** ~$5-20/mes
- **CDN:** ~$10-30/mes
- **Setup inicial:** 8-12 horas (migración más compleja)

### Comparación con Mapbox:
- Mapbox: $0.25-0.50 por 1000 cargas de mapa
- Tu servidor: Costo fijo mensual, sin límites de uso

---

## ✅ RECOMENDACIÓN FINAL

**Te recomiendo la Opción 1: TileServer GL** porque:

1. **Mínimo esfuerzo de migración** - Solo cambias URLs
2. **Mantiene @rnmapbox/maps** - No rompes funcionalidad existente
3. **100% compatible** - Mismos estilos, mismos formatos
4. **Escalable** - Puedes agregar más capacidad fácilmente
5. **Costo predecible** - Pago mensual fijo vs uso variable

### Próximos pasos sugeridos:
1. Prueba TileServer GL localmente con Docker
2. Descarga un extracto pequeño de OpenMapTiles (tu ciudad/país)
3. Modifica un solo componente (Map.tsx) para probar
4. Si funciona, migra el resto gradualmente
5. Configura un VPS con los datos completos

¿Te gustaría que profundice en algún aspecto específico de la implementación?

---

