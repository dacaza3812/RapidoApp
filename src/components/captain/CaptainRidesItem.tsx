import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { FC, memo } from 'react'
import { useCaptainStorage } from '@/store/captainStore';
import { acceptRideOffer } from '@/service/rideService';
import Animated, { FadeInLeft, FadeOut, FadeOutRight } from 'react-native-reanimated';
import { orderStyles } from '@/styles/captainStyles';
import { commonStyles } from '@/styles/commonStyles';
import { calculateDistance, vehicleIcons } from '@/utils/mapUtils';
import CustomText from '../shared/CustomText';
import { Ionicons } from '@expo/vector-icons';
import CounterButton from './CounterButton';
import { resetAndNavigate } from '@/utils/Helpers';
import { Colors } from '@/utils/Constants';

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
    _id: string,
    vehicle?: VehicleType;
    pickup: { address: string, latitude: number, longitude: number };
    drop?: { address: string, latitude: number, longitude: number };
    fare?: number;
    distance: number;
}

const CaptainRidesItem: FC<{ item: RideItem, removeIt: () => void }> = ({ item, removeIt }) => {
    const { location } = useCaptainStorage()
    const [loading, setLoading] = React.useState(false)
    const acceptRide = async () => {
        try {
            setLoading(true)
            await acceptRideOffer(item?._id)
        } catch (error) {
            console.error("Error accepting ride:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Animated.View entering={FadeInLeft.duration(500)} exiting={FadeOutRight.duration(500)} style={orderStyles.container}>
            <View style={commonStyles.flexRowBetween}>
                <View style={commonStyles.flexRow}>
                    {
                        item?.vehicle && (
                            <Image source={vehicleIcons![item.vehicle]?.icon} style={orderStyles.rideIcon} />
                        )
                    }

                    <CustomText style={{ textTransform: "capitalize" }} fontSize={11}>
                        {item?.vehicle === "cabPremium" ? "Auto Premium" : item?.vehicle === "bike" ? "Motor": item?.vehicle === "cabEconomy" ? "Auto Económico" : "Triciclo"}
                    </CustomText>
                </View>
                <CustomText fontSize={11} fontFamily='SemiBold'>
                    #RID {item?._id.slice(0, 5).toUpperCase()}
                </CustomText>
            </View>

            <View style={orderStyles?.locationsContainer}>
                <View style={orderStyles?.flexRowBase}>
                    <View>
                        <View style={orderStyles?.pickupHollowCircle} />
                        <View style={orderStyles?.continuousLine} />
                    </View>
                    <View style={orderStyles?.infoText}>
                        <CustomText fontFamily='SemiBold' fontSize={11} numberOfLines={1}>
                            Recoger al cliente en:
                        </CustomText>
                        <CustomText fontFamily='Medium' fontSize={9.5} numberOfLines={2} style={orderStyles.label}>
                            {item?.pickup?.address}
                        </CustomText>
                    </View>
                </View>

                <View style={orderStyles.flexRowBase}>
                    <View style={orderStyles.dropHollowCircle} />
                    <View style={orderStyles.infoText}>
                        <CustomText fontFamily='SemiBold' fontSize={11} numberOfLines={1}>
                            Dejar al cliente en:
                        </CustomText>
                        <CustomText fontFamily='Medium' fontSize={9.5} numberOfLines={2} style={orderStyles.label}>
                            {item?.drop?.address}
                        </CustomText>
                    </View>
                </View>
            </View>

            <View style={[commonStyles?.flexRowGap]}>
                <View>
                    <CustomText fontFamily='Medium' fontSize={9} style={orderStyles.label}>
                        Recogida
                    </CustomText>

                    <CustomText fontFamily='SemiBold' fontSize={11}>
                        {
                            location && calculateDistance({
                                lat1: item?.pickup?.latitude,
                                lon1: item?.pickup?.longitude,
                                lat2: location?.latitude,
                                lon2: location?.longitude,
                            }
                            ).toFixed(2) || "--"
                        } Km
                    </CustomText>
                </View>

                <View style={orderStyles.borderLine}>
                    <CustomText fontFamily='Medium' fontSize={9} style={orderStyles.label}>
                        Destino
                    </CustomText>
                    <CustomText fontFamily='SemiBold' fontSize={11}>
                        {item?.distance.toFixed(2)} Km
                    </CustomText>
                </View>
                <View style={orderStyles.borderLine}>
                    <CustomText fontFamily='Medium' fontSize={9} style={orderStyles.label}>
                        Precio
                    </CustomText>
                    <CustomText fontFamily='SemiBold' fontSize={11}>
                        {item?.fare} CUP
                    </CustomText>
                </View>
            </View>

            <View style={orderStyles?.flexRowEnd}>
                <TouchableOpacity onPress={removeIt}>
                    <Ionicons name='close-circle' size={24} color={Colors.text} />
                </TouchableOpacity>

                <CounterButton
                    onCountdownEnd={removeIt}
                    initialCount={30}
                    onPress={acceptRide}
                    title={loading ? "Procesando..." : "Aceptar"}
                    disabled={loading}
                />
            </View>

        </Animated.View>
    )
}

export default memo(CaptainRidesItem)