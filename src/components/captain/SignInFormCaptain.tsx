import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native'
import { Colors } from '@/utils/Constants'
import { commonStyles } from '@/styles/commonStyles'
import { authStyles } from '@/styles/authStyles'
import { Image } from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import CustomText from '../shared/CustomText'
import Input from '../shared/Input'
import SocialLogin from '../shared/SocialLogin'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import { signin } from '@/service/authService'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import { resetAndNavigate } from '@/utils/Helpers'
import { useUserStore } from '@/store/userStore'
import { useCaptainStorage } from '@/store/captainStore'
import { router } from 'expo-router'
import CustomButton from '../shared/CustomButton'

type Incoming = {
  user: User | null
  session: Session | null
}

const SignInFormCaptain = () => {
  // Estados de formulario
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedId, setSelectedId] = useState<string>("2")
  const [loading, setLoading] = useState(false)

  // Estados deep link / sesión
  // Arrancamos en true para cubrir el primer render
  const [deepLinkLoading, setDeepLinkLoading] = useState<boolean>(true)
  const [incoming, setIncoming] = useState<Incoming | null>(null)

  const { setUser } = useUserStore.getState()
  const { setUser: setCaptainUser } = useCaptainStorage.getState()

  WebBrowser.maybeCompleteAuthSession()

  // Procesa la URL recibida por deep link
  const createSessionFromUrl = async (url: string) => {
    try {
      const { params, errorCode } = QueryParams.getQueryParams(url)
      if (errorCode) throw new Error(errorCode)
      const { access_token, refresh_token } = params
      if (!access_token) return

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })
      if (error) throw error
      if (data) setIncoming(data)
    } catch (err) {
      Alert.alert("Error al procesar enlace", err instanceof Error ? err.message : String(err))
    }
  }

  // 1) Efecto de inicialización: chequea getInitialURL()
  useEffect(() => {
    const init = async () => {
      setDeepLinkLoading(true)
      const initialUrl = await Linking.getInitialURL()
      if (initialUrl) {
        await createSessionFromUrl(initialUrl)
      }
      setDeepLinkLoading(false)
    }
    init()
  }, [])

  // 2) Listener para enlaces entrantes mientras la app está abierta o en background
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      setDeepLinkLoading(true)
      createSessionFromUrl(url).finally(() => setDeepLinkLoading(false))
    })
    return () => sub.remove()
  }, [])

  const handleChangeVisibility = async () => {
    try {
      await supabase
       .from('rapido_users')
       .update({ iscaptainnow: true })
       .eq('id', incoming?.user?.id)
       .select()
   } catch (error) {
     console.log(error)
   }
  }

  // 3) Cuando incoming se actualiza, redirigimos al home
  useEffect(() => {
    if (!incoming?.user) return
    const { user } = incoming
    if (user.user_metadata.role === "customer") {
      setUser(user)
      resetAndNavigate("/customer/home")
    } else {
      handleChangeVisibility()
      setCaptainUser(user)
      resetAndNavigate("/captain/home")
    }
  }, [incoming])

  // Manejador de login manual
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error de inicio de sesión", "Para iniciar sesión llene los campos")
      return
    }
    setLoading(true)
    try {
      await signin({
        email,
        password,
        role: selectedId === "1" ? "captain" : "customer"
      })
    } catch (error) {
      Alert.alert("Error al iniciar sesión", error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  // Botones de rol
  const radioButtons: RadioButtonProps[] = useMemo(() => ([
    { id: '1', label: 'Chofer',  value: 'captain'  },
    { id: '2', label: 'Cliente', value: 'customer' }
  ]), [])

  // Mostrar spinner hasta que terminemos de chequear deep link
  if (deepLinkLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  // Render del formulario normal
  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      {/* Header con logo y soporte */}
      <View style={commonStyles.flexRowBetween}>
        <Image
          source={require("@/assets/images/captain_logo.png")}
          style={authStyles.logo}
        />
        <TouchableOpacity
          style={authStyles.flexRowGap}
          onPress={() => Linking.openURL('https://t.me/rapidoappcuba')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="telegram" size={24} color="#24A1DE" />
          <CustomText fontFamily='Medium' variant='h7'>Soporte</CustomText>
        </TouchableOpacity>
      </View>

      {/* Títulos */}
      <View style={styles.header}>
        <Text style={styles.title}>Inicia sesión en tu Cuenta</Text>
        <Text style={styles.subtitle}>Escriba su correo y contraseña</Text>
      </View>

      {/* Inputs */}
      <View>
        <CustomText variant='h7' fontFamily='Regular' style={commonStyles.lightText}>
          Correo Electrónico
        </CustomText>
        <Input
          mode='email'
          modeSecure={false}
          plaeholderInput='Escriba su correo'
          onChangeText={setEmail}
          value={email}
          keyboardType='email-address'
          autoComplete='email'
        />

        <CustomText variant='h7' fontFamily='Regular' style={commonStyles.lightText}>
          Contraseña
        </CustomText>
        <View style={styles.passwordContainer}>
          <TextInput
            autoFocus
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#4d4a49"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
          layout='row'
          containerStyle={{
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: 20
          }}
          labelStyle={{ color: "white" }}
        />
      </View>

      {/* Botones */}
      <View>
        <CustomButton
          title="Iniciar Sesión"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />

        <TouchableOpacity
          style={{ marginTop: 30 }}
          onPress={() => router.navigate("/(auth)/sign-up")}
        >
          <Text style={styles.orText}>Crear una cuenta</Text>
        </TouchableOpacity>

        <Text style={{
          textAlign: "center",
          marginVertical: 8,
          color: Colors.primary,
          fontFamily: "Bold",
          fontSize: 13
        }}>
          O continúa con
        </Text>
        <SocialLogin />
      </View>
    </ScrollView>
  )
}

export default SignInFormCaptain

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  header: {
    marginVertical: 10
  },
  title: {
    fontSize: 32,
    color: Colors.primary,
    marginBottom: 10,
    fontFamily: "SemiBold"
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text,
    marginBottom: 16,
    fontFamily: "Light"
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  input: {
    fontSize: 13,
    fontFamily: "Medium",
    height: 45,
    width: "90%",
    color: Colors.text,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
    color: Colors.primary,
    fontSize: 13,
    fontFamily: "Bold"
  },
  orText: {
    textAlign: "center",
    marginVertical: 12,
    color: Colors.text,
    fontFamily: "Light",
    fontSize: 13
  }
})
