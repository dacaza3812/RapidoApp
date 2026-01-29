import { View, Image, Alert, Modal, Text, Button, Linking, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { commonStyles } from '@/styles/commonStyles'
import { splashStyles } from '@/styles/splashStyles'
import CustomText from '@/components/shared/CustomText'
import { useFonts } from "expo-font"
import { resetAndNavigate } from '@/utils/Helpers'
import { jwtDecode } from 'jwt-decode'
import { tokenStorage } from '@/store/storage'
import { refresh_tokens } from '@/service/apiInterceptors'
import { useUserStore } from '@/store/userStore'
import * as Application from 'expo-application';
import { type Version } from '@/utils/types'
import { MaterialIcons } from '@expo/vector-icons'
import { authStyles } from '@/styles/authStyles'
import { Colors } from '@/utils/Constants'
import { StatusBar } from 'expo-status-bar'
import { onAppOpen, onCustomScreenView } from '@/lib/events'


interface DecodedToken {
  exp: number
}

const Main = () => {
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/NotoSans-Bold.ttf"),
    Regular: require("../assets/fonts/NotoSans-Regular.ttf"),
    Medium: require("../assets/fonts/NotoSans-Medium.ttf"),
    Light: require("../assets/fonts/NotoSans-Light.ttf"),
    SemiBold: require("../assets/fonts/NotoSans-SemiBold.ttf"),
  })

  const { user } = useUserStore()

  const [hasNavigated, setHasNavigated] = useState(false)

  const [updateRequired, setUpdateRequired] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMessage, setError] = useState(false);
  const [loading, setLoading] = useState(true); // Nuevo estado

  const checkVersion = async () => {

    try {
      // throw new Error("error")
      const response = await fetch('https://server-react-native-app.onrender.com/version');
      const data: Version = await response.json();
      const latestVersion = data.version.version;
      const currentVersion = Application.nativeApplicationVersion;
      console.log(currentVersion);
      await onAppOpen()
      await onCustomScreenView("Index", "Index")
      const isUpdateRequired = (latestVersion !== currentVersion);
      if (isUpdateRequired) {
        setDownloadUrl("https://www.apklis.cu/application/com.dacaza.rapido");
        setUpdateRequired(true);
      }
      return false;
    } catch (error) {
      // Alert.alert("Error de Comprobación", "No se pudo acceder al servidor para validar la versión de su dispositivo")
      console.error('Error al comprobar la versión:', error);
      setError(true)// O bien, considerar cómo manejar el error
      return true
    }
  };

  const retryCheckVersion = () => {
    setError(false); // Reinicia el error
    checkVersion(); // Vuelve a verificar la versión
  };

  const tokenCheck = async () => {
    const access_token = tokenStorage.getString("access_token") as string;
    const refresh_token = tokenStorage.getString("refresh_token") as string;

    if (access_token) {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate("/role")
        Alert.alert("Su sesión ha expirado, por favor vuelva a iniciar")
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          refresh_tokens()
        } catch (err) {
          console.log(err)
          Alert.alert("Refresh token error")
        }
      }

      if (user) {
        resetAndNavigate("/customer/home")
      } else {
        resetAndNavigate("/captain/home")
      }

      return
    }

    resetAndNavigate('/role')
  }


  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(async () => {

        const isUpdateRequired = await checkVersion();
        if (!isUpdateRequired && !errorMessage) {
          await tokenCheck();
          setHasNavigated(true);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated, errorMessage]);





  return (
    <>
    <StatusBar translucent={false} backgroundColor={Colors.primary}/>
      {updateRequired && (
        <Modal visible={true} transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.dialog}>
              <Text style={styles.dialogText}>
                "Actualiza la app para disfrutar de nuevas funciones y seguridad."
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", alignItems: "center" }}>
                <Pressable onPress={() => Linking.openURL(downloadUrl)}>
                  <Text style={{ color: "#ffc920", fontWeight: "bold", fontSize: 17 }}>Actualizar</Text>
                </Pressable>
                <Pressable style={authStyles.flexRowGap} onPress={() => Linking.openURL('https://t.me/rapidoappcuba')}  >
                  <MaterialIcons name="telegram" size={24} style={{ color: "#24A1DE" }} />
                  <Text style={{ color: "#ffc920", fontWeight: "bold", fontSize: 17 }}>Soporte</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </Modal>
      )}

      {
        errorMessage && (
          <Modal visible={true} transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.dialog}>
                <Text style={styles.dialogText}>
                  No hay conexión
                </Text>
                <Text style={{ marginBottom: 5, textAlign: "center" }}>
                  Al pulsar en Reintentar voleremos a intentar conectarte
                </Text>
                <Pressable onPress={() => retryCheckVersion()}>
                  {({ pressed }) => (
                    <Text style={[
                      { color: "#ffc920", fontWeight: "bold", fontSize: 17 },
                      pressed && { color: "black" } // Color más oscuro al presionar
                    ]}>
                      Reintentar
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </Modal>
        )
      }
      <View style={commonStyles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Image
          source={require("@/assets/images/logo_t.png")}
          style={splashStyles.img}
        />
        <CustomText variant="h6" fontFamily="Light" style={splashStyles.text}>
          Desarrollado con ❤ en 🇨🇺
        </CustomText>
      </View>
    </>
  );

}

export default Main

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialog: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: 150,
  },
  dialogText: {
    fontSize: 17,
    marginBottom: 25,
    textAlign: 'center'
  }
});