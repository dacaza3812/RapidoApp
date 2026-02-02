import { Alert } from "react-native"
import { appAxios } from "./apiInterceptors";
import { router } from "expo-router";
import { resetAndNavigate } from "@/utils/Helpers";
import { useRidePersistStore } from "@/store/ridePersistStore";

interface coords {
    address: string,
    latitude: number,
    longitude: number,
}

export const createRide = async (payload: {
    vehicle: "bike" | "auto" | "cabEconomy" | "cabPremium",
    pickup: coords,
    drop: coords
}) => {
    try {
        const res = await appAxios.post("/api/v1/rides/create", payload)
        const ride = res?.data?.ride;
        
        // Guardar en storage persistente
        const { setActiveRide } = useRidePersistStore.getState();
        setActiveRide({
          rideId: ride._id,
          status: ride.status,
          pickup: ride.pickup,
          drop: ride.drop,
          fare: ride.fare,
          vehicle: ride.vehicle,
          otp: ride.otp,
          captain: ride.captain,
          createdAt: ride.createdAt,
        });
        
        router?.navigate({
            pathname: "/customer/liveride",
            params: {
                id: ride?._id
            }
        })
    } catch (error: any) {
        Alert.alert("Oh, hubo un error");
        console.log(error)
    }
}

export const getMyRides = async (isCustomer: boolean = true) => {
    try {
        const res = await appAxios.get("/api/v1/rides/")
        const filterRides = res.data.rides?.filter((ride: any) => ride?.status != "COMPLETED")
        if(filterRides?.length > 0){
            router?.navigate({
                pathname: isCustomer ? "/customer/liveride" : "/captain/liveride",
                params: {
                    id: filterRides![0]?._id
                }
            })
        }
    } catch (error: any) {
        Alert.alert("Oh, hubo un error obteniendo mis viajes");
        console.log(error)
    }
}

export const acceptRideOffer = async (rideId: string) => {
    try {
       const res = await appAxios.patch(`/api/v1/rides/accept/${rideId}`);
       const ride = res?.data?.ride;
       
       // Guardar en storage persistente para el capitán
       const { setAssignedRide } = useRidePersistStore.getState();
       setAssignedRide({
         rideId: ride._id,
         status: ride.status,
         pickup: ride.pickup,
         drop: ride.drop,
         fare: ride.fare,
         vehicle: ride.vehicle,
         otp: ride.otp,
         customer: ride.customer,
         createdAt: ride.createdAt,
       });
       
       resetAndNavigate({
        pathname: "/captain/liveride",
        params: {id: rideId}
       })
    } catch (error: any) {
        Alert.alert("Oh, hubo un error ");
        console.log(error)
    }
}

export const updateRideStatus = async (rideId: string, status: string) => {
    try {
        const res = await appAxios.patch(`/api/v1/rides/update/${rideId}`, {status});
        return true
    } catch (error) {
        Alert.alert("Hubo un error")
        console.log(error)
        return false
    }
}