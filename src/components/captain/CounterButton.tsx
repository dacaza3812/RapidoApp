import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { Colors } from '@/utils/Constants';
import CustomText from '../shared/CustomText';
import {CountdownCircleTimer} from "react-native-countdown-circle-timer"

interface CounterButtonProps {
    title: string;
    onPress: () => void;
    initialCount: number;
    onCountdownEnd: () => void;
    disabled?: boolean;
}

const CounterButton:FC<CounterButtonProps> = ({title,initialCount,onCountdownEnd,onPress,disabled}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.container, disabled && styles.disabledContainer]}>
      <CustomText fontFamily='Medium' fontSize={12} style={styles.text}>
        {title}
      </CustomText>
      <View style={styles.counter}>
        <CountdownCircleTimer
            onComplete={onCountdownEnd}
            isPlaying={!disabled}
            duration={initialCount}
            size={30}
            strokeWidth={3}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[12,5,2,0]}
        >
            {
                ({remainingTime}) => <CustomText style={{color: "black"}} fontSize={10} fontFamily='SemiBold'>{remainingTime}</CustomText>
            }
        </CountdownCircleTimer>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        backgroundColor: Colors.primary,
    },
    disabledContainer: {
        opacity: 0.5,
    },
    counter: {
        backgroundColor: "white",
        borderRadius: 50
    },
    text: {
        color: Colors.text,
        marginRight: 10
    },
});

export default CounterButton