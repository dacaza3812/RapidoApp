import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors } from '@/utils/Constants'

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    label?: string;
}

const PhoneInput: FC<PhoneInputProps> = ({
    value,
    onChangeText,
    onBlur,
    onFocus,
    label,
}) => {
  const handleChangeText = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '')
    onChangeText(numericText)
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>🇨🇺 +53</Text>
        <TextInput
            inputMode='numeric'
            autoFocus={true}
            autoComplete='tel'
            placeholder='51234567'
            placeholderTextColor="#999"
            keyboardType='number-pad'
            maxLength={8}
            value={value}
            onChangeText={handleChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            style={styles.input}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: RFValue(12),
        fontFamily: 'Medium',
        color: '#333',
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FAFAFA',
        height: 48,
    },
    countryCode: {
        fontSize: RFValue(13),
        fontFamily: 'Medium',
        color: '#333',
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: RFValue(13),
        fontFamily: 'Medium',
        height: '100%',
        color: '#333',
    },
})

export default PhoneInput
