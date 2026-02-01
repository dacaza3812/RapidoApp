import { View, SafeAreaView, Image, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useCallback } from 'react'
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

  const validateForm = useCallback(() => {
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
  }, [phone, name, lastName, email])

  const handleNext = useCallback(() => {
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
  }, [customerUser])

  const doSignin = useCallback(async (forceSwitch: boolean) => {
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
  }, [phone, name, lastName, email, gender, firebasePushToken, updateAccessToken, validateForm])

  const handleGenderSelect = useCallback((value: string) => {
    setGender(prev => prev === value ? '' : value)
  }, [])

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.headerContainer}>
            <View style={commonStyles.flexRowBetween}>
              <Image
                source={require('@/assets/images/logo_t.png')}
                style={authStyles.logo}
                accessibilityLabel="Logo de Rapido"
              />
              <TouchableOpacity
                style={authStyles.flexRowGap}
                onPress={() => Linking.openURL('https://t.me/rapidoappcuba')}
                activeOpacity={0.7}
                accessibilityLabel="Contactar soporte por Telegram"
              >
                <MaterialIcons name="telegram" size={24} style={{ color: '#24A1DE' }} />
                <CustomText fontFamily="Medium" variant="h7">
                  Soporte
                </CustomText>
              </TouchableOpacity>
            </View>
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

            <PhoneInput
              label="Teléfono"
              onChangeText={setPhone}
              value={phone}
            />

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
                    onPress={() => handleGenderSelect(option.value)}
                    accessibilityLabel={option.label}
                    accessibilityRole="button"
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
        </ScrollView>

        <View style={authStyles.footerContainer}>
          <CustomText
            variant="h8"
            fontFamily="Regular"
            style={authStyles.termsText}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CustomerAuth
