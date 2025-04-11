// ReusableModal.tsx
import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface ReusableModalProps {
  visible: boolean;
  mainText: string;
  descriptionText: string;
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonPress: () => void;
  onRightButtonPress: () => void;
  // Opcionalmente puedes permitir la personalización de estilos
  customContainerStyle?: StyleProp<ViewStyle>;
  customDialogStyle?: StyleProp<ViewStyle>;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  visible,
  mainText,
  descriptionText,
  leftButtonText,
  rightButtonText,
  onLeftButtonPress,
  onRightButtonPress,
  customContainerStyle,
  customDialogStyle,
}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={[styles.modalContainer, customContainerStyle]}>
        <View style={[styles.dialog, customDialogStyle]}>
          <Text style={styles.dialogText}>{mainText}</Text>
          <Text style={styles.dialogTextDescription}>{descriptionText}</Text>
          <View style={styles.buttonContainer}>
            <Pressable onPress={onLeftButtonPress}>
              <Text style={styles.leftButtonText}>{leftButtonText}</Text>
            </Pressable>
            <Pressable onPress={onRightButtonPress}>
              <Text style={styles.rightButtonText}>{rightButtonText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: 150,
  },
  dialogText: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dialogTextDescription: {
    fontSize: 13,
    marginBottom: 25,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  leftButtonText: {
    color: "#BE3D2A",
    fontWeight: 'bold',
    fontSize: 15,
  },
  rightButtonText: {
    // Este color lo puedes ajustar o recibirlo como prop si deseas
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 17,
  },
  centerButtonPress: {
    color: "#BE3D2A",
    fontWeight: 'bold',
    fontSize: 15,
  }
});

export default ReusableModal;

interface ReusableModalAlertProps {
  visible: boolean;
  mainText: string;
  descriptionText: string;
  centerText: string;
  onCenterButtonPress: () => void;
  // Opcionalmente puedes permitir la personalización de estilos
  customContainerStyle?: StyleProp<ViewStyle>;
  customDialogStyle?: StyleProp<ViewStyle>;
}


export const CustomModalAlert: React.FC<ReusableModalAlertProps> = ({
  visible,
  mainText,
  descriptionText,
  centerText,
  onCenterButtonPress,
  customContainerStyle,
  customDialogStyle,
}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={[styles.modalContainer, customContainerStyle]}>
        <View style={[styles.dialog, customDialogStyle]}>
          <Text style={styles.dialogText}>{mainText}</Text>
          <Text style={styles.dialogTextDescription}>{descriptionText}</Text>
          <View style={styles.buttonContainer}>
            <Pressable onPress={onCenterButtonPress}>
              <Text style={styles.centerButtonPress}>{centerText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};