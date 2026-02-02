import React, { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import { useCaptainStorage } from '@/store/captainStore';
import {
  setupNotificationListeners,
  initializeNotifications,
  getPushToken,
  savePushTokenToBackend,
} from '@/service/notificationService';

/**
 * Componente que maneja las notificaciones push de la aplicación
 * Se monta en el layout principal y configura todos los listeners
 */
export const NotificationHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserStore();
  const { user: captainUser } = useCaptainStorage();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Solo inicializar si hay un usuario logueado
    const currentUser = user || captainUser;
    if (!currentUser) return;

    const setupNotifications = async () => {
      try {
        // Inicializar notificaciones
        await initializeNotifications();
        
        // Configurar listeners
        const cleanup = setupNotificationListeners();
        cleanupRef.current = cleanup;
        
        // Obtener y guardar token actualizado
        const token = await getPushToken();
        if (token) {
          await savePushTokenToBackend(token);
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();

    // Limpiar listeners al desmontar
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [user, captainUser]);

  return <>{children}</>;
};

export default NotificationHandler;
