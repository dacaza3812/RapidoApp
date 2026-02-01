import { Colors, screenWidth } from "@/utils/Constants";
import { Platform, StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain'
    },
    container: {
        padding: 12,
        flex: 1,
        backgroundColor: Colors.background
    },
    flexRowGap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    formContainer: {
        marginTop: 20,
        marginBottom: 100,
    },
    footerContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'android' ? 20 : 30,
        width: screenWidth,
        padding: 10,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: Colors.background,
    },
    sectionTitle: {
        marginBottom: 12,
        color: Colors.text,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        color: '#333',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    chipText: {
        color: '#333',
    },
    chipTextSelected: {
        color: '#FFF',
    },
})
