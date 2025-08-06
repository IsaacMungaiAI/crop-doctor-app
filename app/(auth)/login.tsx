import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSSO } from '@clerk/clerk-expo';
import { COLORS } from '@/constants/theme';
import { styles } from '@/constants/auth.styles';

export default function Login() {
    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const handleGoogleSignin = async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google' });

            if (setActive && createdSessionId) {
                await setActive({ session: createdSessionId });
                router.replace('/(tabs)');
            }
        } catch (error) {
            console.error('OAuth error: ', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* App Branding */}
            <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                    <Ionicons name="leaf" size={36} color={COLORS.primary} />
                </View>
                <Text style={styles.appName}>AI Crop Doctor</Text>
                <Text style={styles.tagline}>Detect crop diseases instantly</Text>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
                <Image
                    source={require('../../assets/images/leaf.png')}
                    style={styles.illustration}
                    resizeMode="contain"
                />
            </View>

            {/* Sign In Button */}
            <View style={styles.loginSection}>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignin}
                    activeOpacity={0.9}
                >
                    <View style={styles.googleIconContainer}>
                        <Ionicons name="logo-google" size={20} color={COLORS.surface} />
                    </View>
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                    By continuing, you agree to our{' '}
                    <Text style={{ textDecorationLine: 'underline' }}>Terms</Text> &{' '}
                    <Text style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>.
                </Text>
            </View>
        </View>
    );
}
