import { getApps, initializeApp } from "@react-native-firebase/app";
import { getMessaging, getToken } from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyBVWYHKgp_9b95zaFtVwI1ekS9XirOcBV0",
    authDomain: "rapidoapp-4a547.firebaseapp.com",
    databaseURL: "https://rapidoapp-4a547-default-rtdb.firebaseio.com",
    projectId: "rapidoapp-4a547",
    storageBucket: "rapidoapp-4a547.firebasestorage.app",
    messagingSenderId: "547406702474",
    appId: "1:547406702474:web:d2a0f1ed1c6b2b3dca4a73",
    measurementId: "G-MWJPFJMSLT"
  };

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