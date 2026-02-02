import { Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { router } from "expo-router";
import { useRidePersistStore } from "@/store/ridePersistStore";
import { appAxios } from "./apiInterceptors";

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Tipos de notificaciones
export type NotificationType = 
  | "ride_request"      // Para capitanes: nuevo viaje disponible
  | "ride_assigned"     // Para clientes: capitán asignado
  | "ride_cancelled"    // Para ambos: viaje cancelado
  | "delivery_request"  // Para capitanes: nuevo delivery disponible
  | "delivery_assigned" // Para clientes: capitán asignado al delivery
  | "delivery_status"   // Para clientes: cambio de estado del delivery
  | "captain_arrived"   // Para clientes: capitán llegó al punto de recogida
  | "order_ready"       // Para capitanes: pedido listo en tienda
  | "general";          // Notificaciones generales

interface NotificationData {
  type: NotificationType;
  rideId?: string;
  deliveryId?: string;
  storeId?: string;
  orderId?: string;
  captainId?: string;
  customerId?: string;
  title?: string;
  body?: string;
  [key: string]: any;
}

// Solicitar permisos de notificación
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log("Notificaciones push solo funcionan en dispositivos físicos");
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permiso de notificaciones no concedido");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error solicitando permisos:", error);
    return false;
  }
};

// Obtener el token de push
export const getPushToken = async (): Promise<string | null> => {
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Push Token:", token);
    return token;
  } catch (error) {
    console.error("Error obteniendo push token:", error);
    return null;
  }
};

// Guardar token en el backend
export const savePushTokenToBackend = async (token: string): Promise<void> => {
  try {
    await appAxios.patch("/api/v1/auth/update-profile", {
      firebasePushToken: token,
    });
    console.log("Token guardado en backend");
  } catch (error) {
    console.error("Error guardando token:", error);
  }
};

// Inicializar notificaciones
export const initializeNotifications = async (): Promise<void> => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  const token = await getPushToken();
  if (token) {
    await savePushTokenToBackend(token);
  }

  // Configurar canal de notificaciones para Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#24A1DE",
    });

    // Canal para notificaciones de viajes (alta prioridad)
    await Notifications.setNotificationChannelAsync("rides", {
      name: "Viajes y Entregas",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: "#FF9800",
      sound: "default",
    });
  }
};

// Manejar notificación recibida en primer plano
export const handleForegroundNotification = (
  notification: Notifications.Notification
): void => {
  const { title, body, data } = notification.request.content;
  const notificationData = data as NotificationData;

  console.log("Notificación en primer plano:", { title, body, data });

  // Mostrar alerta interactiva
  Alert.alert(
    title || "Nueva notificación",
    body || "",
    [
      {
        text: "Ver",
        onPress: () => navigateFromNotification(notificationData),
      },
      {
        text: "Cerrar",
        style: "cancel",
      },
    ]
  );
};

// Manejar notificación cuando la app está en background
export const handleBackgroundNotification = async (
  notification: Notifications.Notification
): Promise<void> => {
  const { title, body, data } = notification.request.content;
  const notificationData = data as NotificationData;

  console.log("Notificación en background:", { title, body, data });

  // Guardar en storage para manejar cuando se abra la app
  // Esto ya lo hace el sistema de notificaciones automáticamente
};

// Navegar según el tipo de notificación
export const navigateFromNotification = (data: NotificationData): void => {
  const { type, rideId, deliveryId, storeId } = data;

  console.log("Navegando desde notificación:", { type, rideId, deliveryId });

  switch (type) {
    case "ride_request":
      // Para capitanes: ir a home y mostrar oferta
      router.navigate({
        pathname: "/captain/home",
        params: { showRideOffer: "true", rideId },
      });
      break;

    case "ride_assigned":
    case "captain_arrived":
      // Para clientes: ir a la vista del viaje en vivo
      if (rideId) {
        router.navigate({
          pathname: "/customer/liveride",
          params: { id: rideId },
        });
      }
      break;

    case "delivery_request":
      // Para capitanes: ir a home y mostrar oferta de delivery
      router.navigate({
        pathname: "/captain/home",
        params: { showDeliveryOffer: "true", deliveryId },
      });
      break;

    case "delivery_assigned":
    case "delivery_status":
      // Para clientes: ir a la vista del delivery
      if (deliveryId) {
        router.navigate({
          pathname: "/customer/liveride",
          params: { id: deliveryId, type: "delivery" },
        });
      }
      break;

    case "order_ready":
      // Para capitanes: ir a la vista del delivery
      if (deliveryId) {
        router.navigate({
          pathname: "/captain/liveride",
          params: { id: deliveryId, type: "delivery" },
        });
      }
      break;

    case "ride_cancelled":
      // Mostrar alerta y limpiar storage
      Alert.alert("Viaje cancelado", "El viaje ha sido cancelado");
      const { clearActiveTrip } = useRidePersistStore.getState();
      clearActiveTrip();
      break;

    default:
      // Navegación por defecto según el rol
      router.navigate("/");
  }
};

// Configurar listeners de notificaciones
export const setupNotificationListeners = (): (() => void) => {
  // Listener para notificaciones en primer plano
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      handleForegroundNotification(notification);
    }
  );

  // Listener para cuando el usuario toca una notificación
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const { notification } = response;
      const data = notification.request.content.data as NotificationData;
      navigateFromNotification(data);
    }
  );

  // Retornar función de limpieza
  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
  };
};

// Enviar notificación local (para pruebas)
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: NotificationData
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: "default",
    },
    trigger: null, // Inmediatamente
  });
};

// Programar notificación local con delay
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  seconds: number,
  data?: NotificationData
): Promise<string> => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: {
      seconds,
    },
  });
  return id;
};

// Cancelar notificación programada
export const cancelScheduledNotification = async (id: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(id);
};
