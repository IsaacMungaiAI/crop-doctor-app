import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fef7',
        padding: 20,
        justifyContent: 'space-between',
    },
    brandSection: {
        alignItems: 'center',
        marginTop: 40,
    },
    logoContainer: {
        backgroundColor: '#e3f7e3',
        padding: 12,
        borderRadius: 50,
        marginBottom: 10,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.primary,
    },
    tagline: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustration: {
        width: '100%',
        height: 260,
    },
    loginSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    googleButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    googleIconContainer: {
        marginRight: 10,
    },
    googleButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: '600',
    },
    termsText: {
        marginTop: 12,
        fontSize: 12,
        color: '#777',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
});
