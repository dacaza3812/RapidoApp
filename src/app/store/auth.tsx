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

const StoreAuth = () => {
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
  const [businessName, setBusinessName] = useState('')
  const [taxId, setTaxId] = useState('')

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
      Alert.alert('Error', 'El nombre del propietario es requerido')
      return false
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'El apellido del propietario es requerido')
      return false
    }
    if (!businessName.trim()) {
      Alert.alert('Error', 'El nombre del negocio es requerido')
      return false
    }
    if (!taxId.trim()) {
      Alert.alert('Error', 'El RUC/Tax ID es requerido')
      return false
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Ingresa un email válido')
      return false
    }
    return true
  }, [phone, password, name, lastName, businessName, taxId, email])

  const handleLogin = useCallback(async () => {
    if (!validateLogin()) return

    try {
      setLoading(true)
      await login(
        {
          role: 'store_owner',
          phone,
          password,
          firebasePushToken,
        },
        updateAccessToken
      )
      await onUserLogin(phone, 'store_owner')
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
          role: 'store_owner',
          phone,
          password,
          firebasePushToken,
          name: name.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          businessName: businessName.trim(),
          taxId: taxId.trim(),
        },
        updateAccessToken
      )
      await onUserLogin(phone, 'store_owner')
    } catch (error) {
      console.error('Error en registro:', error)
    } finally {
      setLoading(false)
    }
  }, [phone, password, name, lastName, email, businessName, taxId, firebasePushToken, updateAccessToken, validateRegister])

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
            {isLogin ? 'Inicia sesión como Tienda' : 'Registra tu Tienda'}
          </CustomText>

          <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
            {isLogin ? 'Ingresa tus credenciales para continuar' : 'Ingresa los datos de tu negocio'}
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
                  Datos del propietario
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
                  label="Email (opcional)"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <CustomText variant="h7" fontFamily="Medium" style={[authStyles.sectionTitle, { marginTop: 16 }]}>
                  Datos del negocio
                </CustomText>

                <CustomInput
                  label="Nombre del negocio *"
                  placeholder="Ej: Tienda El Éxito"
                  value={businessName}
                  onChangeText={setBusinessName}
                  autoCapitalize="words"
                />

                <CustomInput
                  label="RUC / Tax ID *"
                  placeholder="Ingresa el RUC o Tax ID"
                  value={taxId}
                  onChangeText={setTaxId}
                  autoCapitalize="characters"
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

export default StoreAuth
