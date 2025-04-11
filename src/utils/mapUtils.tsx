import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { MapBox, type calculateDistance  as calculateDistanceType} from "./types";
import { useEffect, useState } from "react";
const apikey = process.env.EXPO_PUBLIC_MAPBOX_API_KEY || "sk.eyJ1IjoiZGFjYXphIiwiYSI6ImNtNmpjMmhmajBobWoya3ByNGhlMnZlZWgifQ.QJmQ4pkf78lHlqTFIUCXTQ"

export const getLatLong = async (placeId: string, description: string) => {
    try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${description}.json`, {
            params: {
                placeid: placeId,
                access_token: apikey,
            },
        });
        const data = response.data;
        if (data.features.length > 0) {
            const location = data.features[0].geometry.coordinates; // Mapbox devuelve [longitude, latitude]
            const address = data.features[0].place_name;

            return {
                latitude: location[1],  // Mapbox: [lon, lat], se invierte para que sea lat, lon
                longitude: location[0],
                address: address,
            };
        } else {
            throw new Error('Unable to fetch location details');
        }
    } catch (error) {
        throw new Error('Unable to fetch location details');
    }
}

export const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
            {
                params: {
                    access_token: apikey,
                }
            }
        );
        if (response.data.features.length > 0) {
            const address = response.data.features[0].place_name;
            return address;
        } else {
            console.log('Geocoding failed: ', response.data.status);
            return "";
        }
    } catch (error) {
        console.log('Error during reverse geocoding: ', error);
        return "";
    }
};

function extractPlaceData(data: any) {
    return data.map((item: any) => ({
        place_id: item.id,  // Mapbox usa 'id' en lugar de 'place_id'
        title: item.text,   // 'text' es el nombre del lugar
        description: item.place_name,  // 'place_name' es la descripción del lugar
    }));
}

export const getPlacesSuggestions = async (query: string) => {
    const { location } = useUserStore.getState();
    try {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
            {
                params: {
                    proximity: `${location?.longitude},${location?.latitude}`,
                    access_token: apikey,
                }
            }
        );

        console.log("RESPONSE", location)

        // Procesar los resultados de Mapbox para que coincidan con tu estructura
        return extractPlaceData(response.data.features);

    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        return [];
    }
};

export const calculateDistance = ({lat1, lon1, lat2, lon2}: calculateDistanceType) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const calculateFare = (distance: number) => {
    const rateStructure = {
        bike: { baseFare: 100, perKmRate: 150, minimumFare: 200 },
        auto: { baseFare: 200, perKmRate: 150, minimumFare: 300 },
        cabEconomy: { baseFare: 200, perKmRate: 250, minimumFare: 400 },
        cabPremium: { baseFare: 200, perKmRate: 300, minimumFare: 500 },
    };

    const fareCalculation = (baseFare: number, perKmRate: number, minimumFare: number) => {
        const calculatedFare = baseFare + (distance * perKmRate);
        const maxFare = Math.max(calculatedFare, minimumFare);
        return Math.floor(maxFare / 10) * 10; // Redondeo hacia abajo al múltiplo de 10
    };

    return {
        bike: fareCalculation(rateStructure.bike.baseFare, rateStructure.bike.perKmRate, rateStructure.bike.minimumFare),
        auto: fareCalculation(rateStructure.auto.baseFare, rateStructure.auto.perKmRate, rateStructure.auto.minimumFare),
        cabEconomy: fareCalculation(rateStructure.cabEconomy.baseFare, rateStructure.cabEconomy.perKmRate, rateStructure.cabEconomy.minimumFare),
        cabPremium: fareCalculation(rateStructure.cabPremium.baseFare, rateStructure.cabPremium.perKmRate, rateStructure.cabPremium.minimumFare),
    };
}

function quadraticBezierCurve(p1: any, p2: any, controlPoint: any, numPoints: any) {
    const points = [];
    const step = 1 / (numPoints - 1);

    for (let t = 0; t <= 1; t += step) {
        const x =
            (1 - t) ** 2 * p1[0] +
            2 * (1 - t) * t * controlPoint[0] +
            t ** 2 * p2[0];
        const y =
            (1 - t) ** 2 * p1[1] +
            2 * (1 - t) * t * controlPoint[1] +
            t ** 2 * p2[1];
        const coord = { latitude: x, longitude: y };
        points.push(coord);
    }

    return points;
}

const calculateControlPoint = (p1: any, p2: any) => {
    const d = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
    const scale = 1; // Scale factor to reduce bending
    const h = d * scale; // Reduced distance from midpoint
    const w = d / 2;
    const x_m = (p1[0] + p2[0]) / 2;
    const y_m = (p1[1] + p2[1]) / 2;

    const x_c =
        x_m +
        ((h * (p2[1] - p1[1])) /
            (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
        (w / d);
    const y_c =
        y_m -
        ((h * (p2[0] - p1[0])) /
            (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
        (w / d);

    const controlPoint = [x_c, y_c];
    return controlPoint;
};

export const getPoints = (places: any) => {
    const p1 = [places[0].latitude, places[0].longitude];
    const p2 = [places[1].latitude, places[1].longitude];
    const controlPoint = calculateControlPoint(p1, p2);

    return quadraticBezierCurve(p1, p2, controlPoint, 100);
};

export const vehicleIcons: Record<'bike' | 'auto' | 'cabEconomy' | 'cabPremium', { icon: any }> = {
    bike: { icon: require('@/assets/icons/bike.png') },
    auto: { icon: require('@/assets/icons/auto.png') },
    cabEconomy: { icon: require('@/assets/icons/cab.png') },
    cabPremium: { icon: require('@/assets/icons/cab_premium.png') },
  };
  
  export const calculateEstimatedArrival = (distance: number, averageSpeed: number = 40): Date => {
    // Calcula el tiempo de viaje en minutos
    const travelTimeMinutes = (distance / averageSpeed) * 60;
    const arrivalDate = new Date();
    arrivalDate.setMinutes(arrivalDate.getMinutes() + travelTimeMinutes);
    return arrivalDate;
  };

  export const getRoute = async(origin: any[], dest: any[]) => {
    const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]}, ${origin[1]}; ${dest[0]}, ${dest[1]}?alternatives=false&annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=pk.eyJ1IjoiZGFjYXphIiwiYSI6ImNsa2w0Yzc2cDA1ZTUza3Bja3V6bHU0c20ifQ.TZYLa2XeoNUDXtxuPiRv2A`);
    return await res.json()
  }

  export const useGetRoute = (origin: number[], dest: number[]) => {
    const [route, setRoute] = useState<MapBox | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [coordinates, setCoordinates] = useState<number[][] | null>(null); // Almacena las coordenadas de la ruta

    // route.routes[0].geometry.coordinates
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getRoute(origin, dest);
                setRoute(data);
                setDistance(parseFloat((data.routes[0].distance / 1000).toFixed(2))); // Convertir a km
                setDuration(parseFloat((data.routes[0].duration / 60).toFixed(2))); // Convertir a minutos
                setCoordinates(data.routes[0].geometry.coordinates); // Almacenar las coordenadas de la ruta
                setError(null);
            } catch (err) {
                setError(err as Error);
                setRoute(null);
                setDistance(null);
                setDuration(null);
            } finally {
                setLoading(false);
            }
        };

        if (origin && dest) fetchData();
    }, [origin, dest]); // Dependencias: se ejecuta cuando cambian origen o destino

    return { route, distance, duration, loading, error, coordinates };
};