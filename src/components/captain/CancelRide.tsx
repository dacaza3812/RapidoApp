// CancelRide.tsx
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useWS } from '@/service/WSProvider';
import { uiStyles } from '@/styles/uiStyles';
import Ionicos from '@expo/vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@/utils/Constants';
import ReusableModal from '../shared/CustomAlert';
import { resetAndNavigate } from '@/utils/Helpers';

interface CancelRideProps {
    rideId: string; // Aseguramos que es string para coincidir con rideData._id
}

const CancelRide: React.FC<CancelRideProps> = ({ rideId }) => {
    const { emit, on, off } = useWS();

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCancelRoad = () => {
        if (!rideId) {
            Alert.alert('Error', 'El identificador del viaje no está disponible.')
            return
        }
        setLoading(true)
        setModalVisible(false)
        emit("cancelRide", rideId)
        
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    const mainText = "Suspender el viaje?";
    const descriptionText = "En próximas versiones se aplicarán cargos por cancelación";

  const closeModal = () => {
    setModalVisible(false);
  };

    return (
        <View style={uiStyles.absoluteTop}>
            <SafeAreaView />
            <View style={uiStyles.container}>
                <ReusableModal
                    visible={modalVisible}
                    mainText={mainText}
                    descriptionText={descriptionText}
                    leftButtonText="Suspender Viaje"
                    rightButtonText="Cancelar"
                    onLeftButtonPress={handleCancelRoad}
                    onRightButtonPress={closeModal}
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.background,
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        flexDirection: 'row',
                        opacity: loading ? 0.5 : 1,
                    }}
                    onPress={() => setModalVisible(true)}
                    disabled={loading}
                >
                    {loading ? (
                        <Text style={{ color: Colors.text, fontSize: 13 }}>Cancelando...</Text>
                    ) : (
                        <>
                            <Ionicos name='log-out-outline' size={RFValue(18)} color={Colors.text} />
                            <Text style={{ color: Colors.text, fontSize: 13, marginLeft: 5 }}>Cancelar viaje</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CancelRide;
