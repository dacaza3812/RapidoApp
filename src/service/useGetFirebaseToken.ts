import { getApps, initializeApp } from "@react-native-firebase/app";
import { useEffect, useState } from "react";
import { firebaseConfig } from "./config";
import { getMessaging, getToken } from "@react-native-firebase/messaging";

export default function useGetFirebaseToken(){
    const [firebasePushToken, setFirebasePushToken] = useState<string | null>(null);
    const fetchToken = async () => {
        try {
            if (!getApps().length) {
                initializeApp(firebaseConfig);
            }
            const messaging = getMessaging();
            const token = await getToken(messaging, { vapidKey: "AIzaSyBVWYHKgp_9b95zaFtVwI1ekS9XirOcBV0" });
            setFirebasePushToken(token);
        } catch (error) {
            console.error("Error al obtener el token de Firebase Messaging:", error);
        }
    };

    useEffect(() => {
        // Obtener el token de FCM al montar el componente
        fetchToken();
    }, []);

    return {firebasePushToken}
}