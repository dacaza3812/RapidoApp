import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Colors } from '@/utils/Constants';
import { resetAndNavigate } from '@/utils/Helpers';
import { setItem } from '@/utils/asyncStorage';

const HomeOnboardingScreen = () => {

    const animation = useRef<LottieView>(null);

    useEffect(() => {
        animation.current?.play();
    }, []);

    const handleDone = async () => {
        await setItem('onboarded', '1')
        resetAndNavigate('/(auth)/sign-in')
    }

    const doneButton = ({...props}) => {
        return (
            <TouchableOpacity {...props} style={{  padding: 10, borderRadius: 5, marginRight: 20 }}>
                <Text style={{fontSize: 15, fontWeight: "600"}}>Listo</Text>
            </TouchableOpacity>
        )
    }

    const skipButton = ({...props}) => {
        return (
            <TouchableOpacity {...props} style={{  padding: 10, borderRadius: 5, marginLeft: 20 }}>
                <Text style={{fontSize: 15, fontWeight: "400"}}>Saltar</Text>
            </TouchableOpacity>
        )
    }

    const nextButton = ({...props}) => {
        return (
            <TouchableOpacity {...props} style={{  padding: 10, borderRadius: 5, marginRight: 20 }}>
                <Text style={{fontSize: 15, fontWeight: "400"}}>Siguiente</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <Onboarding
                onDone={handleDone}
                onSkip={handleDone}
                DoneButtonComponent={doneButton}
                SkipButtonComponent={skipButton}
                NextButtonComponent={nextButton}
                containerStyles={{ paddingHorizontal: 15 }}
                pages={[
                    {
                        backgroundColor: '#FFC6C6',
                        image: (
                            <View style={styles.lottie}>
                                <LottieView
                                    style={styles.lottie}
                                    autoPlay
                                    ref={animation}
                                    loop
                                    // Find more Lottie files at https://lottiefiles.com/featured
                                    source={require('@/assets/lottie/Animation - 1745329925965.json')}
                                />
                            </View>
                        ),
                        title: 'En una mano',
                        subtitle: 'Hemos encontrado la manera de conectarte con lo que necesitas',
                    },
                    {
                        backgroundColor: '#81E7AF',
                        image: (
                            <View style={styles.lottie}>
                                <LottieView
                                    style={styles.lottie}
                                    autoPlay
                                    ref={animation}
                                    loop
                                    // Find more Lottie files at https://lottiefiles.com/featured
                                    source={require('@/assets/lottie/Animation - 1745330640754.json')}
                                />
                            </View>
                        ),
                        title: 'Prioridad',
                        subtitle: 'Solicita un viaje o entrega y nosotros nos encargamos del resto',
                    },
                    {
                        backgroundColor: '#F2EFE7',
                        image: (
                            <View style={styles.lottie}>
                                <LottieView
                                    style={styles.lottie}
                                    autoPlay
                                    ref={animation}
                                    loop
                                    // Find more Lottie files at https://lottiefiles.com/featured
                                    source={require('@/assets/lottie/prueba1.json')}
                                />
                            </View>
                        ),
                        title: 'Ganancias',
                        subtitle: 'Regístrate como chofer y empieza a ganar por cada viaje',
                    },
                    {
                        backgroundColor: '#FFF085',
                        image: (
                            <View style={styles.lottie}>
                                <LottieView
                                    style={styles.lottie}
                                    autoPlay
                                    ref={animation}
                                    loop
                                    // Find more Lottie files at https://lottiefiles.com/featured
                                    source={require('@/assets/lottie/Animation - 1745331565401.json')}
                                />
                            </View>
                        ),
                        title: 'Lo que prefieras',
                        subtitle: 'Paga con tu método de pago de preferencia',
                    }
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lottie: {
        width: 300,
        height: 300,
    }
})

export default HomeOnboardingScreen