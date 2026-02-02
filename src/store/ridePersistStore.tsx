import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";

interface RideData {
  rideId: string;
  status: string;
  pickup: {
    address: string;
    latitude: number;
    longitude: number;
  };
  drop: {
    address: string;
    latitude: number;
    longitude: number;
  };
  fare: number;
  vehicle: string;
  otp: string;
  captain?: {
    _id: string;
    name: string;
    phone: string;
    vehicle?: {
      type: string;
      licensePlate: string;
    };
  };
  customer?: {
    _id: string;
    name: string;
    phone: string;
  };
  createdAt: string;
}

interface DeliveryData {
  deliveryId: string;
  orderNumber: string;
  trackingCode: string;
  status: string;
  store: {
    _id: string;
    name: string;
    address: {
      street: string;
      city: string;
      latitude: number;
      longitude: number;
    };
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  pricing: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
  };
  pickup: {
    address: {
      street: string;
      city: string;
    };
    latitude: number;
    longitude: number;
  };
  delivery: {
    address: {
      street: string;
      city: string;
    };
    latitude: number;
    longitude: number;
    instructions?: string;
  };
  captain?: {
    _id: string;
    name: string;
    phone: string;
  };
  customer?: {
    _id: string;
    name: string;
    phone: string;
  };
  otp: string;
  createdAt: string;
}

interface ActiveTripState {
  // Viaje activo (para clientes)
  activeRide: RideData | null;
  
  // Delivery activo (para clientes)
  activeDelivery: DeliveryData | null;
  
  // Viaje asignado (para capitanes)
  assignedRide: RideData | null;
  
  // Delivery asignado (para capitanes)
  assignedDelivery: DeliveryData | null;
  
  // Timestamp de última actualización
  lastUpdated: number;
  
  // Actions
  setActiveRide: (ride: RideData | null) => void;
  setActiveDelivery: (delivery: DeliveryData | null) => void;
  setAssignedRide: (ride: RideData | null) => void;
  setAssignedDelivery: (delivery: DeliveryData | null) => void;
  
  updateRideStatus: (rideId: string, status: string) => void;
  updateDeliveryStatus: (deliveryId: string, status: string) => void;
  
  // Verificar si hay viaje activo
  hasActiveRide: () => boolean;
  hasActiveDelivery: () => boolean;
  hasAssignedRide: () => boolean;
  hasAssignedDelivery: () => boolean;
  
  // Limpiar todo
  clearActiveTrip: () => void;
  clearAssignedTrip: () => void;
  clearAll: () => void;
}

export const useRidePersistStore = create<ActiveTripState>()(
  persist(
    (set, get) => ({
      activeRide: null,
      activeDelivery: null,
      assignedRide: null,
      assignedDelivery: null,
      lastUpdated: 0,
      
      setActiveRide: (ride) => set({ 
        activeRide: ride, 
        lastUpdated: Date.now() 
      }),
      
      setActiveDelivery: (delivery) => set({ 
        activeDelivery: delivery, 
        lastUpdated: Date.now() 
      }),
      
      setAssignedRide: (ride) => set({ 
        assignedRide: ride, 
        lastUpdated: Date.now() 
      }),
      
      setAssignedDelivery: (delivery) => set({ 
        assignedDelivery: delivery, 
        lastUpdated: Date.now() 
      }),
      
      updateRideStatus: (rideId, status) => {
        const { activeRide, assignedRide } = get();
        
        if (activeRide?.rideId === rideId) {
          set({ 
            activeRide: { ...activeRide, status },
            lastUpdated: Date.now()
          });
        }
        
        if (assignedRide?.rideId === rideId) {
          set({ 
            assignedRide: { ...assignedRide, status },
            lastUpdated: Date.now()
          });
        }
      },
      
      updateDeliveryStatus: (deliveryId, status) => {
        const { activeDelivery, assignedDelivery } = get();
        
        if (activeDelivery?.deliveryId === deliveryId) {
          set({ 
            activeDelivery: { ...activeDelivery, status },
            lastUpdated: Date.now()
          });
        }
        
        if (assignedDelivery?.deliveryId === deliveryId) {
          set({ 
            assignedDelivery: { ...assignedDelivery, status },
            lastUpdated: Date.now()
          });
        }
      },
      
      hasActiveRide: () => {
        const { activeRide } = get();
        if (!activeRide) return false;
        return !['COMPLETED', 'CANCELLED'].includes(activeRide.status);
      },
      
      hasActiveDelivery: () => {
        const { activeDelivery } = get();
        if (!activeDelivery) return false;
        return !['DELIVERED', 'CANCELLED'].includes(activeDelivery.status);
      },
      
      hasAssignedRide: () => {
        const { assignedRide } = get();
        if (!assignedRide) return false;
        return !['COMPLETED', 'CANCELLED'].includes(assignedRide.status);
      },
      
      hasAssignedDelivery: () => {
        const { assignedDelivery } = get();
        if (!assignedDelivery) return false;
        return !['DELIVERED', 'CANCELLED'].includes(assignedDelivery.status);
      },
      
      clearActiveTrip: () => set({ 
        activeRide: null, 
        activeDelivery: null,
        lastUpdated: Date.now()
      }),
      
      clearAssignedTrip: () => set({ 
        assignedRide: null, 
        assignedDelivery: null,
        lastUpdated: Date.now()
      }),
      
      clearAll: () => set({
        activeRide: null,
        activeDelivery: null,
        assignedRide: null,
        assignedDelivery: null,
        lastUpdated: Date.now(),
      }),
    }),
    {
      name: "ride-persist-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
