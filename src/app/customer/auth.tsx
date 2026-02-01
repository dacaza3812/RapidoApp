import { View, SafeAreaView, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import CustomText from '@/components/shared/CustomText'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomInput from '@/components/shared/CustomInput'
import CustomButton from '@/components/shared/CustomButton'
import { signin } from '@/service/authService'
import { useWS } from '@/service/WSProvider'
import useGetFirebaseToken from '@/service/useGetFirebaseToken'
import * as Linking from 'expo-linking'
import { onUserLogin } from '@/lib/events'
import { useUserStore } from '@/store/userStore'

const CustomerAuth = () => {
  const { updateAccessToken } = useWS()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const { firebasePushToken } = useGetFirebaseToken()
  const { user: customerUser } = useUserStore()

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState<string>('')

  const genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' },
    { label: 'Prefiero no decir', value: 'prefer_not_to_say' },
  ]

  const validateForm = () => {
    if (!phone || phone.length !== 8) {
      Alert.alert('Número requerido', 'Por favor ingresa tu número de 8 dígitos')
      return false
    }
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es requerido')
      return false
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'El apellido es requerido')
      return false
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Ingresa un email válido')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (customerUser && customerUser.role === 'captain') {
      Alert.alert(
        'Cambiar a perfil Cliente',
        'Vas a cambiar de chofer a cliente. ¿Deseas continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => doSignin(true) },
        ]
      )
    } else {
      doSignin(false)
    }
  }

  const doSignin = async (forceSwitch: boolean) => {
    if (!validateForm()) return

    try {
      setLoading(true)

      await signin(
        {
          role: 'customer',
          phone,
          firebasePushToken,
          forceSwitch,
          name: name.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          gender: gender as 'male' | 'female' | 'other' | 'prefer_not_to_say' || undefined,
        },
        updateAccessToken
      )

      await onUserLogin(phone, 'customer')
    } catch (error) {
      console.error('Error en autenticación:', error)
      Alert.alert('Error', 'Ocurrió un error al intentar iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require('@/assets/images/logo_t.png')}
            style={authStyles.logo}
          />
          <TouchableOpacity
            style={authStyles.flexRowGap}
            onPress={() => Linking.openURL('https://t.me/rapidoappcuba')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="telegram" size={24} style={{ color: '#24A1DE' }} />
            <CustomText fontFamily="Medium" variant="h7">
              Soporte
            </CustomText>
          </TouchableOpacity>
        </View>

        <CustomText fontFamily="Medium" variant="h6">
          Regístrate en Rapido
        </CustomText>

        <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
          Ingresa tus datos para crear tu cuenta
        </CustomText>

        <View style={authStyles.formContainer}>
          <CustomText variant="h7" fontFamily="Medium" style={authStyles.sectionTitle}>
            Datos de Contacto
          </CustomText>

          <PhoneInput onChangeText={setPhone} value={phone} />

          <CustomInput
            label="Nombre"
            placeholder="Ingresa tu nombre"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <CustomInput
            label="Apellido"
            placeholder="Ingresa tu apellido"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <CustomInput
            label="Email (opcional)"
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={authStyles.inputGroup}>
            <CustomText variant="h7" fontFamily="Medium" style={authStyles.label}>
              Género (opcional)
            </CustomText>
            <View style={authStyles.chipContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    authStyles.chip,
                    gender === option.value && authStyles.chipSelected,
                  ]}
                  onPress={() => setGender(gender === option.value ? '' : option.value)}
                >
                  <CustomText
                    variant="h8"
                    fontFamily="Medium"
                    style={gender === option.value ? authStyles.chipTextSelected : authStyles.chipText}
                  >
                    {option.label}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={authStyles.footerContainer}>
          <CustomText
            variant="h8"
            fontFamily="Regular"
            style={[
              commonStyles.lightText,
              { textAlign: 'center', marginHorizontal: 20, marginBottom: 16 },
            ]}
          >
            Al continuar, aceptas los términos y condiciones de Rapido
          </CustomText>

          <CustomButton
            title="Registrarse"
            onPress={handleNext}
            loading={loading}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CustomerAuth
