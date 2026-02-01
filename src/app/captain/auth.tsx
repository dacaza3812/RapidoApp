import { View, SafeAreaView, Image, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useCallback, useRef } from 'react'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import CustomText from '@/components/shared/CustomText'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomInput from '@/components/shared/CustomInput'
import CustomButton from '@/components/shared/CustomButton'
import { login, register } from '@/service/authService'
import { useWS } from '@/service/WSProvider'
import useGetFirebaseToken from '@/service/useGetFirebaseToken'
import * as Linking from 'expo-linking'
import { onUserLogin } from '@/lib/events'

const CaptainAuth = () => {
  const { updateAccessToken } = useWS()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const { firebasePushToken } = useGetFirebaseToken()
  const scrollViewRef = useRef<ScrollView>(null)

  // Login fields
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // Register fields
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState<string>('')
  const [dni, setDni] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehicleType, setVehicleType] = useState<string>('auto')

  const genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' },
    { label: 'Prefiero no decir', value: 'prefer_not_to_say' },
  ]

  const vehicleTypeOptions = [
    { label: 'Moto', value: 'bike' },
    { label: 'Auto', value: 'auto' },
    { label: 'Carro', value: 'car' },
  ]

  const validateLogin = useCallback(() => {
    if (!phone || phone.length < 8) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono válido')
      return false
    }
    if (!password || password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres')
      return false
    }
    return true
  }, [phone, password])

  const validateRegister = useCallback(() => {
    if (!phone || phone.length < 8) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono válido')
      return false
    }
    if (!password || password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres')
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
    if (!dni.trim()) {
      Alert.alert('Error', 'El DNI es requerido')
      return false
    }
    if (!licensePlate.trim()) {
      Alert.alert('Error', 'La placa del vehículo es requerida')
      return false
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Ingresa un email válido')
      return false
    }
    return true
  }, [phone, password, name, lastName, dni, licensePlate, email])

  const handleLogin = useCallback(async () => {
    if (!validateLogin()) return

    try {
      setLoading(true)
      await login(
        {
          role: 'captain',
          phone,
          password,
          firebasePushToken,
        },
        updateAccessToken
      )
      await onUserLogin(phone, 'captain')
    } catch (error) {
      console.error('Error en login:', error)
    } finally {
      setLoading(false)
    }
  }, [phone, password, firebasePushToken, updateAccessToken, validateLogin])

  const handleRegister = useCallback(async () => {
    if (!validateRegister()) return

    try {
      setLoading(true)
      await register(
        {
          role: 'captain',
          phone,
          password,
          firebasePushToken,
          name: name.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          gender: gender as 'male' | 'female' | 'other' | 'prefer_not_to_say' || undefined,
          dni: dni.trim(),
          vehicle: {
            type: vehicleType as 'bike' | 'auto' | 'car',
            licensePlate: licensePlate.trim(),
            model: vehicleModel.trim() || undefined,
            color: vehicleColor.trim() || undefined,
          },
        },
        updateAccessToken
      )
      await onUserLogin(phone, 'captain')
    } catch (error) {
      console.error('Error en registro:', error)
    } finally {
      setLoading(false)
    }
  }, [phone, password, name, lastName, email, gender, dni, vehicleType, licensePlate, vehicleModel, vehicleColor, firebasePushToken, updateAccessToken, validateRegister])

  const handleGenderSelect = useCallback((value: string) => {
    setGender(prev => prev === value ? '' : value)
  }, [])

  const handleVehicleTypeSelect = useCallback((value: string) => {
    setVehicleType(value)
  }, [])

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={authStyles.flex1}
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          <View style={authStyles.headerContainer}>
            <View style={commonStyles.flexRowBetween}>
              <Image
                source={require('@/assets/images/captain_logo.png')}
                style={authStyles.logo}
                accessibilityLabel="Logo de Captain"
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
            {isLogin ? 'Inicia sesión como Chofer' : 'Regístrate como Chofer'}
          </CustomText>

          <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
            {isLogin ? 'Ingresa tus credenciales para continuar' : 'Ingresa tus datos para registrarte'}
          </CustomText>

          {/* Toggle Login/Register */}
          <View style={{ flexDirection: 'row', marginVertical: 16, gap: 8 }}>
            <TouchableOpacity
              style={[
                { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
                isLogin ? { backgroundColor: '#24A1DE' } : { backgroundColor: '#F0F0F0' }
              ]}
              onPress={() => setIsLogin(true)}
            >
              <CustomText variant="h7" fontFamily="Medium" style={{ color: isLogin ? '#FFF' : '#333' }}>
                Iniciar sesión
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
                !isLogin ? { backgroundColor: '#24A1DE' } : { backgroundColor: '#F0F0F0' }
              ]}
              onPress={() => setIsLogin(false)}
            >
              <CustomText variant="h7" fontFamily="Medium" style={{ color: !isLogin ? '#FFF' : '#333' }}>
                Registrarse
              </CustomText>
            </TouchableOpacity>
          </View>

          <View style={authStyles.formContainer}>
            <CustomText variant="h7" fontFamily="Medium" style={authStyles.sectionTitle}>
              Datos de acceso
            </CustomText>

            <PhoneInput
              label="Teléfono"
              onChangeText={setPhone}
              value={phone}
            />

            <CustomInput
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {!isLogin && (
              <>
                <CustomText variant="h7" fontFamily="Medium" style={[authStyles.sectionTitle, { marginTop: 16 }]}>
                  Datos personales
                </CustomText>

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
                  label="DNI"
                  placeholder="Ingresa tu DNI"
                  value={dni}
                  onChangeText={setDni}
                  keyboardType="numeric"
                  maxLength={11}
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

                <CustomText variant="h7" fontFamily="Medium" style={[authStyles.sectionTitle, { marginTop: 16 }]}>
                  Datos del Vehículo
                </CustomText>

                <View style={authStyles.inputGroup}>
                  <CustomText variant="h7" fontFamily="Medium" style={authStyles.label}>
                    Tipo de Vehículo *
                  </CustomText>
                  <View style={authStyles.chipContainer}>
                    {vehicleTypeOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          authStyles.chip,
                          vehicleType === option.value && authStyles.chipSelected,
                        ]}
                        onPress={() => handleVehicleTypeSelect(option.value)}
                        accessibilityLabel={option.label}
                        accessibilityRole="button"
                      >
                        <CustomText
                          variant="h8"
                          fontFamily="Medium"
                          style={vehicleType === option.value ? authStyles.chipTextSelected : authStyles.chipText}
                        >
                          {option.label}
                        </CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <CustomInput
                  label="Placa *"
                  placeholder="ABC123"
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                  autoCapitalize="characters"
                  maxLength={10}
                />

                <CustomInput
                  label="Modelo (opcional)"
                  placeholder="Ej: Toyota Corolla 2020"
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                />

                <CustomInput
                  label="Color (opcional)"
                  placeholder="Ej: Blanco"
                  value={vehicleColor}
                  onChangeText={setVehicleColor}
                />
              </>
            )}
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
            title={isLogin ? 'Iniciar sesión' : 'Registrarse'}
            onPress={isLogin ? handleLogin : handleRegister}
            loading={loading}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CaptainAuth
