import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Image, TextInput, ScrollView } from 'react-native';
import React, { useMemo, useState } from 'react';
import { Colors } from '@/utils/Constants';
import { commonStyles } from '@/styles/commonStyles';
import { authStyles } from '@/styles/authStyles';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import CustomText from '../shared/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import PhoneInput from '../shared/PhoneInput';
import Input from '../shared/Input';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { signup } from '@/service/authService';
import CustomButton from '../shared/CustomButton';
import useGetFirebaseToken from '@/service/useGetFirebaseToken';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Picker } from '@react-native-picker/picker';
import { uiStyles } from '@/styles/uiStyles';

type Cube = {
  name: string;
  imageUri: any;
  value: "bike" | "auto" | "cab" | "auto_premium";
};

const cubes: Cube[] = [
  { name: 'Moto', imageUri: require('@/assets/icons/bike.png'), value: 'bike' },
  { name: 'Triciclo', imageUri: require('@/assets/icons/auto.png'), value: 'auto' },
  { name: 'Auto Económico', imageUri: require('@/assets/icons/cab.png'), value: 'cab' },
  { name: 'Auto Premium', imageUri: require('@/assets/icons/cab_premium.png'), value: 'auto_premium' },
];

const SignUpPage: React.FC = () => {
  // Form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { firebasePushToken } = useGetFirebaseToken();
  const [phone, setPhone] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Havana');
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  // Role radio buttons
  const radioButtons: RadioButtonProps[] = useMemo(() => [
    { id: '1', label: 'Chofer', value: 'captain' },
    { id: '2', label: 'Cliente', value: 'customer' },
  ], []);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('2');

  // Vehicle selection (only for Chofer)
  const [selectedCubeIndex, setSelectedCubeIndex] = useState<number | null>(null);

  const handleSignUp = async (): Promise<void> => {
    // Basic validation
    if (!email || !password || !name || !lastName || !phone || !selectedCity) {
      Alert.alert('Error de registro', 'Por favor, completa todos los campos.');
      return;
    }
    if (selectedRoleId === '1' && selectedCubeIndex === null) {
      Alert.alert('Error de registro', 'Debes seleccionar un tipo de vehículo.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error de registro', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      // 1) Comprobar si el email ya existe
      const { data: existing, error: fetchError } = await supabase
        .from('rapido_users')
        .select('email')
        .eq('email', email);

      if (fetchError) throw fetchError;
      if (existing && existing.length > 0) {
        Alert.alert('Error de creación', 'Ya existe una cuenta con ese correo.');
        setLoading(false);
        return;
      }

      // 2) Registrar usuario
      await signup({
        email,
        password,
        phone,
        options: {
          data: {
            first_name: name,
            last_name: lastName,
            fare: 0,
            phone,
            province: selectedCity,
            role: selectedRoleId === '1' ? 'captain' : 'customer',
            firebase: firebasePushToken,
            captain_type_car:
              selectedRoleId === '1' && selectedCubeIndex !== null
                ? cubes[selectedCubeIndex].value
                : null,
          },
        },
      });

      Alert.alert('¡Registro exitoso!', 'Revisa tu correo para confirmar.');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error al registrar',
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setLoading(false);
      // Reset form (optional)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 12 }}>
      <ScrollView>
        {/* Header */}
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require('@/assets/images/captain_logo.png')}
            style={authStyles.logo}
          />
          <TouchableOpacity
            style={authStyles.flexRowGap}
            onPress={() => Linking.openURL('https://t.me/rapidoappcuba')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="telegram" size={24} color="#24A1DE" />
            <CustomText fontFamily="Medium" variant="h7">
              Soporte
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Regístrate en Rapido</Text>
          <Text style={styles.subtitle}>Escriba su correo y contraseña</Text>
        </View>

        {/* Name */}
        <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
          Nombre
        </CustomText>
        <Input
        autofocus
          mode="text"
          modeSecure={false}
          plaeholderInput="Marcos"
          onChangeText={setName}
          value={name}
          keyboardType="name-phone-pad"
          autoComplete="given-name"
        />

        {/* Last Name */}
        <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
          Apellidos
        </CustomText>
        <Input
          mode="text"
          modeSecure={false}
          plaeholderInput="Daniel Fajardo"
          onChangeText={setLastName}
          value={lastName}
          keyboardType="name-phone-pad"
          autoComplete="additional-name"
        />

        {/* Email */}
        <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
          Correo Electrónico
        </CustomText>
        <Input
        autofocus={false}
          mode="email"
          modeSecure={false}
          plaeholderInput="Escriba su correo"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoComplete="email"
        />

        {/* Province Picker */}
        <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
          Provincia
        </CustomText>
        <View style={styles.pickerContainer}>
          <Picker
            mode="dropdown"
            dropdownIconColor="white"
            style={{ color: 'white' }}
            selectedValue={selectedCity}
            onValueChange={setSelectedCity}
          >
            <Picker.Item label="Pinar del Rio" value="Pinar del Rio" />
            <Picker.Item label="Artemisa" value="Artemisa" />
            <Picker.Item label="Havana" value="Havana" />
            <Picker.Item label="Mayabeque" value="Mayabeque" />
            <Picker.Item label="Matanzas" value="Matanzas" />
            <Picker.Item label="Cienfuegos" value="Cienfuegos" />
            <Picker.Item label="Villa Clara" value="Villa Clara" />
            <Picker.Item label="Sancti Spiritus" value="Sancti Spiritus" />
            <Picker.Item label="Ciego de Avila" value="Ciego de Avila" />
            <Picker.Item label="Camaguey" value="Camaguey" />
            <Picker.Item label="Las Tunas" value="Las Tunas" />
            <Picker.Item label="Granma" value="Granma" />
            <Picker.Item label="Holguin" value="Holguin" />
            <Picker.Item label="Santiago de Cuba" value="Santiago de Cuba" />
            <Picker.Item label="Guantanamo" value="Guantanamo" />
          </Picker>
        </View>

        {/* Phone */}
        <PhoneInput onChangeText={setPhone} value={phone} />

        {/* Password */}
        <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
          Contraseña
        </CustomText>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#4d4a49"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={!showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Vehicle Type (only for Chofer) */}
        {selectedRoleId === '1' && (
          <>
            <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
              Tipo de Vehículo
            </CustomText>
            <View style={uiStyles.cubes}>
              {cubes.map((item, index) => {
                const isSelected = selectedCubeIndex === index;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      uiStyles.cubeContainer,
                      selectedCubeIndex !== null && !isSelected ? { opacity: 0.5 } : null,
                    ]}
                    onPress={() => setSelectedCubeIndex(index)}
                  >
                    <View style={uiStyles.cubeIconContainer}>
                      <Image source={item.imageUri} style={uiStyles.cubeIcon} />
                    </View>
                    <CustomText fontFamily="Medium" fontSize={9.5} style={{ textAlign: 'center' }}>
                      {item.name}
                    </CustomText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Role Selection */}
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedRoleId}
          selectedId={selectedRoleId}
          layout="row"
          containerStyle={{
            justifyContent: 'space-around',
            alignItems: 'center',
            marginVertical: 20,
          }}
          labelStyle={{ color: 'white' }}
        />

        {/* Submit */}
        <CustomButton title="Crear Cuenta" onPress={handleSignUp} loading={loading} disabled={loading} />

        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => router.back()}>
          <Text style={styles.orText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  header: {
    marginVertical: 10,
  },
  title: {
    fontSize: RFValue(32),
    color: Colors.primary,
    marginBottom: 10,
    fontFamily: 'SemiBold',
  },
  subtitle: {
    fontSize: RFValue(12),
    color: Colors.text,
    marginBottom: 16,
    fontFamily: 'Light',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    marginVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    fontSize: RFValue(13),
    fontFamily: 'Medium',
    height: 45,
    width: '90%',
    color: Colors.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
    color: Colors.primary,
    fontSize: 13,
    fontFamily: 'Bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 12,
    color: Colors.text,
    fontFamily: 'Light',
    fontSize: 13,
  },
});
