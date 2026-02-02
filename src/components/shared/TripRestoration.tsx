import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRidePersistStore } from '@/store/ridePersistStore';
import { useUserStore } from '@/store/userStore';
import { useCaptainStorage } from '@/store/captainStore';
import { router } from 'expo-router';
import { getMyRides } from '@/service/rideService';
import { getMyDeliveries } from '@/service/storeService';

/**
 * Componente que verifica y restaura viajes activos al iniciar la app
 * Se ejecuta al montar la aplicación
 */
export const TripRestoration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useUserStore();
  const { user: captainUser } = useCaptainStorage();
  
  const {
    hasActiveRide,
    hasActiveDelivery,
    hasAssignedRide,
    hasAssignedDelivery,
    activeRide,
    activeDelivery,
    assignedRide,
    assignedDelivery,
    setActiveRide,
    setActiveDelivery,
    setAssignedRide,
    setAssignedDelivery,
    clearActiveTrip,
    clearAssignedTrip,
  } = useRidePersistStore();

  useEffect(() => {
    checkAndRestoreTrips();
  }, []);

  const checkAndRestoreTrips = async () => {
    try {
      // Determinar el rol del usuario
      const role = user?.role || captainUser?.role;
      
      if (!role) {
        setIsChecking(false);
        return;
      }

      // Verificar viajes activos desde el storage local
      const hasLocalActiveRide = hasActiveRide();
      const hasLocalActiveDelivery = hasActiveDelivery();
      const hasLocalAssignedRide = hasAssignedRide();
      const hasLocalAssignedDelivery = hasAssignedDelivery();

      // Si no hay nada en storage, no hacer nada
      if (!hasLocalActiveRide && !hasLocalActiveDelivery && 
          !hasLocalAssignedRide && !hasLocalAssignedDelivery) {
        setIsChecking(false);
        return;
      }

      // Verificar con el servidor si los viajes siguen activos
      if (role === 'customer') {
        // Verificar rides del cliente
        if (hasLocalActiveRide && activeRide) {
          const rides = await getMyRides(true);
          const currentRide = rides.find(r => r._id === activeRide.rideId && 
            !['COMPLETED', 'CANCELLED'].includes(r.status));
          
          if (currentRide) {
            // El viaje sigue activo, redirigir
            router.replace({
              pathname: '/customer/liveride',
              params: { id: activeRide.rideId }
            });
            setIsChecking(false);
            return;
          } else {
            // El viaje ya terminó, limpiar storage
            clearActiveTrip();
          }
        }

        // Verificar deliveries del cliente
        if (hasLocalActiveDelivery && activeDelivery) {
          const deliveries = await getMyDeliveries();
          const currentDelivery = deliveries.find(d => d._id === activeDelivery.deliveryId && 
            !['DELIVERED', 'CANCELLED'].includes(d.status));
          
          if (currentDelivery) {
            router.replace({
              pathname: '/customer/liveride',
              params: { id: activeDelivery.deliveryId, type: 'delivery' }
            });
            setIsChecking(false);
            return;
          } else {
            clearActiveTrip();
          }
        }
      }

      if (role === 'captain') {
        // Verificar rides asignados al capitán
        if (hasLocalAssignedRide && assignedRide) {
          const rides = await getMyRides(false);
          const currentRide = rides.find(r => r._id === assignedRide.rideId && 
            !['COMPLETED', 'CANCELLED'].includes(r.status));
          
          if (currentRide) {
            router.replace({
              pathname: '/captain/liveride',
              params: { id: assignedRide.rideId }
            });
            setIsChecking(false);
            return;
          } else {
            clearAssignedTrip();
          }
        }

        // Verificar deliveries asignados al capitán
        if (hasLocalAssignedDelivery && assignedDelivery) {
          const deliveries = await getMyDeliveries();
          const currentDelivery = deliveries.find(d => d._id === assignedDelivery.deliveryId && 
            !['DELIVERED', 'CANCELLED'].includes(d.status));
          
          if (currentDelivery) {
            router.replace({
              pathname: '/captain/liveride',
              params: { id: assignedDelivery.deliveryId, type: 'delivery' }
            });
            setIsChecking(false);
            return;
          } else {
            clearAssignedTrip();
          }
        }
      }

    } catch (error) {
      console.error('Error checking active trips:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#24A1DE" />
      </View>
    );
  }

  return <>{children}</>;
};

export default TripRestoration;
