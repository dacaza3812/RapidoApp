import { View, Text, StyleSheet, TextInput, InputModeOptions, KeyboardTypeOptions } from 'react-native'
import React, { FC } from 'react'
import { Colors } from '@/utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    mode: InputModeOptions;
    autoComplete?: 'additional-name'
    | 'address-line1'
    | 'address-line2'
    | 'birthdate-day'
    | 'birthdate-full'
    | 'birthdate-month'
    | 'birthdate-year'
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-day'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-number'
    | 'cc-name'
    | 'cc-given-name'
    | 'cc-middle-name'
    | 'cc-family-name'
    | 'cc-type'
    | 'country'
    | 'current-password'
    | 'email'
    | 'family-name'
    | 'gender'
    | 'given-name'
    | 'honorific-prefix'
    | 'honorific-suffix'
    | 'name'
    | 'name-family'
    | 'name-given'
    | 'name-middle'
    | 'name-middle-initial'
    | 'name-prefix'
    | 'name-suffix'
    | 'new-password'
    | 'nickname'
    | 'one-time-code'
    | 'organization'
    | 'organization-title'
    | 'password'
    | 'password-new'
    | 'postal-address'
    | 'postal-address-country'
    | 'postal-address-extended'
    | 'postal-address-extended-postal-code'
    | 'postal-address-locality'
    | 'postal-address-region'
    | 'postal-code'
    | 'street-address'
    | 'sms-otp'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-device'
    | 'url'
    | 'username'
    | 'username-new'
    | 'off'
    | undefined;
    plaeholderInput?: string;
    modeSecure: boolean;
    keyboardType: KeyboardTypeOptions;
    autofocus?: boolean
}

const Input: FC<PhoneInputProps> = ({
    value,
    onChangeText,
    onBlur,
    onFocus,
    mode,
    autoComplete,
    plaeholderInput,
    modeSecure,
    keyboardType,
    autofocus
}) => {
  return (
    <View style={styles.container}>
      <TextInput
              inputMode={mode}
              autoFocus={autofocus}
              autoComplete={autoComplete} 
              placeholder={plaeholderInput}
              secureTextEntry={modeSecure}
              keyboardType={keyboardType}
              
              value={value}
              onChangeText={onChangeText}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholderTextColor={"#4d4a49"}
              style={styles.input}
            />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
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
        fontSize: RFValue(13),
        fontFamily: "Medium",
        height: 45,
        width: "90%",
        color: Colors.text,
    },
    text: {
        fontSize: RFValue(13),
        top: -1,
        fontFamily: "Medium"
    }
})

export default Input