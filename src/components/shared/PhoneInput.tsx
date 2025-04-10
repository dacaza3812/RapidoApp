import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomText from './CustomText'
import { Colors } from '@/utils/Constants'

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
}

const PhoneInput: FC<PhoneInputProps> = ({
    value,
    onChangeText,
    onBlur,
    onFocus
}) => {
  return (
    <View style={styles.container}>
      <CustomText fontFamily='Medium' style={styles.text}>
      🇨🇺 +53
      </CustomText>
      <TextInput
        inputMode='tel'
        autoFocus={true}
        autoComplete='tel'  
        placeholder='51234567'
        keyboardType='phone-pad'
        maxLength={8}
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

export default PhoneInput