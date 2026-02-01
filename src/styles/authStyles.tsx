import { Colors, screenWidth } from "@/utils/Constants";
import { Platform, StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    flex1: {
        flex: 1,
    },
    scrollContent: {
        padding: 12,
        paddingBottom: 100,
    },
    flexRowGap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    formContainer: {
        marginTop: 20,
    },
    headerContainer: {
        marginBottom: 16,
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
    footerContainer: {
        padding: 16,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    termsText: {
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 16,
        color: '#666',
    },
})
