// src/index.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Modal,
  Text,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Application from 'expo-application';
import { supabase } from '@/lib/supabase';
import { resetAndNavigate } from '@/utils/Helpers';
import { getItem } from '@/utils/asyncStorage';
import { Colors } from '@/utils/Constants';
import { commonStyles } from '@/styles/commonStyles';
import { splashStyles } from '@/styles/splashStyles';
import { authStyles } from '@/styles/authStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { onAppOpen, onCustomScreenView } from '@/lib/events';
import { Session } from '@supabase/supabase-js';
import { useUserStore } from '@/store/userStore';
import { useCaptainStorage } from '@/store/captainStore';
import { useFonts } from "expo-font"

const INDEX_UPDATE_URL = 'https://www.apklis.cu/application/com.dacaza.rapido';

const Main = () => {
  const [ready, setReady] = useState(false);
  const [updateRequired, setUpdateRequired] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorCheckingVersion, setErrorCheckingVersion] = useState(false);
  const [session, setSession] = useState<Session | null>(null)

  const [loaded] = useFonts({
    Bold: require("../assets/fonts/Inter_18pt-Bold.ttf"),
    Regular: require("../assets/fonts/Inter_18pt-Regular.ttf"),
    Medium: require("../assets/fonts/Inter_18pt-Medium.ttf"),
    Light: require("../assets/fonts/Inter_18pt-Light.ttf"),
    SemiBold: require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
  })

  const { setUser } = useUserStore.getState();
  const { setUser: setCaptainUser, user } = useCaptainStorage.getState();

  useEffect(() => {
    
    (async () => {

      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        if(session) {
          if (session.user.user_metadata.role === 'customer') {
            setUser(session.user);
          } else {
            setCaptainUser(session.user);
          }
        }
      })

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        if(session) {
          if (session.user.user_metadata.role === 'customer') {
            setUser(session.user);
          } else {
            setCaptainUser(session.user);
          }
        }
      })

      try {
        // 1) ¿Necesita actualización?
        const resp = await fetch('https://server-react-native-app.onrender.com/version');
        const json = await resp.json();
        const latestVersion = json.version.version;
        const currentVersion = Application.nativeApplicationVersion;
        const needsUpdate = false//latestVersion !== currentVersion;

        // Fire analytics
        await onAppOpen();
        await onCustomScreenView('Index', 'Index');

        if (needsUpdate) {
          setDownloadUrl(INDEX_UPDATE_URL);
          setUpdateRequired(true);
          // No navegamos aún; esperamos que el usuario presione "Actualizar" o "Soporte"
          return;
        }
      } catch (e) {
        console.error('[Version Check]', e);
        setErrorCheckingVersion(true);
        // Seguimos con el flujo, aunque marcamos el error
      }

      // 2) ¿Onboarded?
      const onboarded = (await getItem('onboarded')) === '1';

      // 3) ¿Sesión activa?
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      // 4) Navegación final
      if (!onboarded) {
        resetAndNavigate('/(onboarding)');
      } else if (session) {
        const role = session.user.user_metadata.role;
        resetAndNavigate(role === 'customer' ? '/customer/home' : '/captain/home');
      } else {
        resetAndNavigate('/(auth)/sign-in');
      }
    })();
  }, []);
  
    if(session){
      if (session.user.user_metadata.role === 'customer') {
        setUser(session.user);
      } else {
        setCaptainUser(session.user);
      }
    }
  // Muestra splash hasta que termine la lógica
  if (!ready && !updateRequired && !errorCheckingVersion && loaded) {
    return (
      <View style={commonStyles.container}>
      <StatusBar translucent={false} backgroundColor={Colors.primary}/>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Image
          source={require('@/assets/images/logo_t.png')}
          style={splashStyles.img}
        />
        <Text style={splashStyles.text}>Desarrollado con ❤ en 🇨🇺</Text>
      </View>
    );
  }

  // Diálogo de actualización obligatoria
  if (updateRequired) {
    return (
      <Modal visible transparent>
        <View style={styles.modalContainer}>
          <View style={styles.dialog}>
            <Text style={styles.dialogText}>
              Actualiza la app para disfrutar de nuevas funciones y seguridad.
            </Text>
            <View style={styles.dialogButtons}>
              <Pressable onPress={() => Linking.openURL(downloadUrl)}>
                <Text style={styles.updateText}>Actualizar</Text>
              </Pressable>
              <Pressable
                style={authStyles.flexRowGap}
                onPress={() => Linking.openURL('https://t.me/rapidoappcuba')}
              >
                <MaterialIcons name="telegram" size={24} color="#24A1DE" />
                <Text style={styles.updateText}>Soporte</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Diálogo de error de versión (sin conexión)
  if (errorCheckingVersion) {
    return (
      <Modal visible transparent>
        <View style={styles.modalContainer}>
          <View style={styles.dialog}>
            <Text style={styles.dialogText}>No hay conexión</Text>
            <Text style={styles.errorSubtext}>
              Al pulsar en Reintentar volveremos a intentar conectarte
            </Text>
            <Pressable onPress={() => {
              setErrorCheckingVersion(false);
              setReady(false);
            }}>
              <Text style={styles.updateText}>Reintentar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return null;
};

export default Main;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  dialogText: {
    fontSize: 17,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorSubtext: {
    marginBottom: 15,
    textAlign: 'center',
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  updateText: {
    color: '#ffc920',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
