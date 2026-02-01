import { View, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import CustomText from '@/components/shared/CustomText'
import CustomInput from '@/components/shared/CustomInput'
import CustomButton from '@/components/shared/CustomButton'
import { resetAndNavigate } from '@/utils/Helpers'
import { updateCaptainProfile } from '@/service/authService'
import { useCaptainStorage } from '@/store/captainStore'

const CaptainProfileSetupScreen = () => {
  const { user, setUser } = useCaptainStorage();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(user?.profile?.name || '');
  const [lastName, setLastName] = useState(user?.profile?.lastName || '');
  const [email, setEmail] = useState(user?.profile?.email || '');
  const [gender, setGender] = useState<string>(user?.profile?.gender || '');
  const [dni, setDni] = useState(user?.profile?.dni || '');
  const [licensePlate, setLicensePlate] = useState(user?.vehicle?.licensePlate || '');
  const [vehicleModel, setVehicleModel] = useState(user?.vehicle?.model || '');
  const [vehicleColor, setVehicleColor] = useState(user?.vehicle?.color || '');
  const [vehicleType, setVehicleType] = useState<string>(user?.vehicle?.type || 'auto');

  const genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' },
    { label: 'Prefiero no decir', value: 'prefer_not_to_say' },
  ];

  const vehicleTypeOptions = [
    { label: 'Moto', value: 'bike' },
    { label: 'Auto', value: 'auto' },
    { label: 'Carro', value: 'car' },
  ];

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'El apellido es requerido');
      return;
    }
    if (!dni.trim()) {
      Alert.alert('Error', 'El DNI es requerido');
      return;
    }
    if (!licensePlate.trim()) {
      Alert.alert('Error', 'La placa es requerida');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Ingresa un email válido');
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        gender: gender || undefined,
        dni: dni.trim(),
        vehicle: {
          type: vehicleType as 'bike' | 'auto' | 'car',
          licensePlate: licensePlate.trim(),
          model: vehicleModel.trim() || undefined,
          color: vehicleColor.trim() || undefined,
        },
      };

      const updatedUser = await updateCaptainProfile(profileData);
      setUser(updatedUser);
      resetAndNavigate('/captain/home');
    } catch (error) {
      console.error('Error updating captain profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <CustomText fontFamily='Bold' variant='h5'>
            Completa tu Perfil de Captain
          </CustomText>
        </View>

        <CustomText variant='h7' fontFamily='Regular' style={commonStyles.lightText}>
          Ingresa tus datos para comenzar a trabajar
        </CustomText>

        <View style={authStyles.formContainer}>
          <CustomText variant='h7' fontFamily='Medium' style={{ marginBottom: 8, marginTop: 8 }}>
            Datos Personales
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

          <View style={{ marginBottom: 16 }}>
            <CustomText variant='h7' fontFamily='Medium' style={{ marginBottom: 8 }}>
              Género (opcional)
            </CustomText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: gender === option.value ? '#24A1DE' : '#F0F0F0',
                    borderWidth: 1,
                    borderColor: gender === option.value ? '#24A1DE' : 'transparent',
                  }}
                  onPress={() => setGender(gender === option.value ? '' : option.value)}
                >
                  <CustomText 
                    variant='h8' 
                    fontFamily='Medium'
                    style={{ color: gender === option.value ? '#FFF' : '#333' }}
                  >
                    {option.label}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <CustomText variant='h7' fontFamily='Medium' style={{ marginBottom: 8, marginTop: 16 }}>
            Datos del Vehículo
          </CustomText>

          <View style={{ marginBottom: 16 }}>
            <CustomText variant='h7' fontFamily='Medium' style={{ marginBottom: 8 }}>
              Tipo de Vehículo
            </CustomText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {vehicleTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: vehicleType === option.value ? '#24A1DE' : '#F0F0F0',
                    borderWidth: 1,
                    borderColor: vehicleType === option.value ? '#24A1DE' : 'transparent',
                  }}
                  onPress={() => setVehicleType(option.value)}
                >
                  <CustomText 
                    variant='h8' 
                    fontFamily='Medium'
                    style={{ color: vehicleType === option.value ? '#FFF' : '#333' }}
                  >
                    {option.label}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <CustomInput 
            label="Placa"
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
        </View>

        <View style={authStyles.footerContainer}>
          <CustomText 
            variant='h8' 
            fontFamily='Regular' 
            style={[commonStyles.lightText, { textAlign: "center", marginHorizontal: 20, marginBottom: 16 }]}
          >
            Estos datos serán verificados para activar tu cuenta de captain
          </CustomText>

          <CustomButton
            title="Continuar"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CaptainProfileSetupScreen
