import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
    GestureResponderEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useRouter } from 'expo-router';
import updateUserProfile from '@/utils/updateUserProfile';
import getUserProfile from '@/utils/getUserProfile';
import { supabase } from '@/lib/supabase';
import { pickAndUploadProfilePhoto } from './uploadProfilePhoto';
import {Image} from 'react-native';
//import { getUserProfile, updateUserProfile, UserProfile } from '@/utils/getUserProfile';


const EditProfileScreen = () => {


    // Mocked user data (replace with real data/fetch)
    const [full_name, setFullName] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');




    const router = useRouter();


    // ✅ Load actual profile from DB
    useEffect(() => {
        (async () => {
            const profile = await getUserProfile();
            if (profile) {
                setFullName(profile.full_name || '');
                setEmail(profile.email || '');
                setAvatarUrl(profile.avatar_url || null);
            }
        })();
    }, []);


    const handlePickPhoto = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            const url = await pickAndUploadProfilePhoto(user.id);
            if (url) {
                setAvatarUrl(url);
                await updateUserProfile({ full_name, email, password, avatar_url: url });
            }
        } catch (error) {
            Alert.alert("Upload Error", (error as Error).message);
        }
    };


    const handleSave = async () => {
        setLoading(true);
        const { success, error } = await updateUserProfile({ full_name, email, password, avatar_url: avatarUrl });

        setLoading(false);
        if (success) {
            Alert.alert("Success", "Profile updated successfully");
            router.back();
        }
        else {
            Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Edit Profile</Text>

                <TouchableOpacity onPress={handlePickPhoto} style={{ alignSelf: "center", marginBottom: 20 }}>
                    {avatarUrl ? (
                        <Image 
                            source={{ uri: avatarUrl }}
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                    ) : (
                        <View style={{
                            width: 100, height: 100, borderRadius: 50,
                            backgroundColor: "#d1d5db", alignItems: "center", justifyContent: "center"
                        }}>
                            <Text style={{ color: "#6b7280" }}>Add Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    value={full_name}

                    onChangeText={setFullName}
                    placeholder="Enter your name"
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 25,
        color: '#111827',
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    saveButton: {
        backgroundColor: '#4ade80',
        marginTop: 30,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    cancelText: {
        color: '#6b7280',
        fontSize: 14,
    },
});
