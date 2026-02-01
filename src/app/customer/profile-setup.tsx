import { View, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import CustomText from '@/components/shared/CustomText'
import CustomInput from '@/components/shared/CustomInput'
import CustomButton from '@/components/shared/CustomButton'
import { resetAndNavigate } from '@/utils/Helpers'
import { updateProfile } from '@/service/authService'
import { useUserStore } from '@/store/userStore'

interface ProfileSetupProps {
  role: 'customer' | 'captain' | 'store_owner';
}

const ProfileSetupScreen: React.FC<ProfileSetupProps> = ({ role }) => {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(user?.profile?.name || '');
  const [lastName, setLastName] = useState(user?.profile?.lastName || '');
  const [email, setEmail] = useState(user?.profile?.email || '');
  const [gender, setGender] = useState<string>(user?.profile?.gender || '');
  const [dni, setDni] = useState(user?.profile?.dni || '');

  const genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' },
    { label: 'Prefiero no decir', value: 'prefer_not_to_say' },
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
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Ingresa un email válido');
      return;
    }

    setLoading(true);
    try {
      const profileData: any = {
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        gender: gender || undefined,
      };

      if (role === 'captain') {
        if (!dni.trim()) {
          Alert.alert('Error', 'El DNI es requerido para captains');
          setLoading(false);
          return;
        }
        profileData.dni = dni.trim();
      }

      const updatedUser = await updateProfile(profileData);
      setUser(updatedUser);

      if (role === 'customer') {
        resetAndNavigate('/customer/home');
      } else if (role === 'captain') {
        resetAndNavigate('/captain/home');
      } else {
        resetAndNavigate('/customer/home');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCaptain = role === 'captain';

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <CustomText fontFamily='Bold' variant='h5'>
            {isCaptain ? 'Completa tu Perfil de Captain' : 'Completa tu Perfil'}
          </CustomText>
        </View>

        <CustomText variant='h7' fontFamily='Regular' style={commonStyles.lightText}>
          {isCaptain 
            ? 'Ingresa tus datos para comenzar a trabajar' 
            : 'Ingresa tus datos personales'}
        </CustomText>

        <View style={authStyles.formContainer}>
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

          {isCaptain && (
            <CustomInput 
              label="DNI"
              placeholder="Ingresa tu DNI"
              value={dni}
              onChangeText={setDni}
              keyboardType="numeric"
              maxLength={11}
            />
          )}
        </View>

        <View style={authStyles.footerContainer}>
          <CustomText 
            variant='h8' 
            fontFamily='Regular' 
            style={[commonStyles.lightText, { textAlign: "center", marginHorizontal: 20, marginBottom: 16 }]}
          >
            {isCaptain 
              ? 'Estos datos serán verificados para activar tu cuenta de captain'
              : 'Tus datos están seguros con nosotros'}
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

export default ProfileSetupScreen
