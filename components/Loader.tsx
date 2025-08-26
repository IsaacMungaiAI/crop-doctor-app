import { ActivityIndicator, SafeAreaView, Text, View, StyleSheet } from "react-native";

if (isLoading) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.loaderWrapper}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loaderText}>Loading profile...</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        justifyContent: "center",
        alignItems: "center",
    },
    loaderWrapper: {
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    loaderText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
        marginTop: 10,
    },
});
