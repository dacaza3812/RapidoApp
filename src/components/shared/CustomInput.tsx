import { View, TextInput, StyleSheet, Text } from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors } from '@/utils/Constants'

interface CustomInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  secureTextEntry?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
}

const CustomInput: FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  secureTextEntry = false,
  onBlur,
  onFocus,
  multiline = false,
  numberOfLines = 1,
  error
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        onBlur={onBlur}
        onFocus={onFocus}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.errorInput
        ]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  input: {
    fontSize: RFValue(13),
    fontFamily: 'Medium',
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#FF4444',
  },
  errorText: {
    fontSize: RFValue(11),
    fontFamily: 'Medium',
    color: '#FF4444',
    marginTop: 4,
  }
})

export default CustomInput
