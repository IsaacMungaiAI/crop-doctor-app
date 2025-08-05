import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>CropDoctor</Text>
      <Text style={styles.subtitle}>Empowering Farmers with AI for Sustainable Farming</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/Chat')}
        >
          <Image source={require('@/assets/images/chat.png')} style={styles.icon} />
          <Text style={styles.cardText}>Chat With AI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            // You can add scan navigation later
            alert('Scanning feature coming soon');
          }}
        >
          <Image source={require('@/assets/images/scan.png')} style={styles.icon} />
          <Text style={styles.cardText}>Scan Plant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/Profile')}
        >
          <Image source={require('@/assets/images/profile.png')} style={styles.icon} />
          <Text style={styles.cardText}>Your Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>🌿 Daily Crop Health Tip</Text>
        <Text style={styles.tipText}>Water early in the morning to reduce fungal infections on leaves.</Text>
      </View>
      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>🌿 Daily Crop Health Tip</Text>
        <Text style={styles.tipText}>Water early in the morning to reduce fungal infections on leaves.</Text>
      </View>
      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>🌿 Daily Crop Health Tip</Text>
        <Text style={styles.tipText}>Water early in the morning to reduce fungal infections on leaves.</Text>
      </View>
      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>🌿 Daily Crop Health Tip</Text>
        <Text style={styles.tipText}>Water early in the morning to reduce fungal infections on leaves.</Text>
      </View>
      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>🌿 Daily Crop Health Tip</Text>
        <Text style={styles.tipText}>Water early in the morning to reduce fungal infections on leaves.</Text>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 30,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  tipSection: {
    backgroundColor: '#E5F6DA',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C763D',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: '#3C763D',
  },
});

