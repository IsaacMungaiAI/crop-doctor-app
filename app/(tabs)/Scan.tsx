import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import type { CameraView as CameraViewType } from "expo-camera";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const cameraRef = useRef<CameraViewType>(null);
  const hasShot = useRef(false);
  const router = useRouter();

  const handleCameraReady = () => {
    if (!hasShot.current) {
      hasShot.current = true;
      setTimeout(() => takePicture("maize"), 1000);
    }
  };

  const takePicture = async (model_type: string) => {
    if (!cameraRef.current) return;
    
    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      const formData = new FormData();
      formData.append("photo", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("model_type", model_type);

      const res = await fetch(
        "https://crop-doctor-app-fastapi.onrender.com/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Scan failed!", error);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={handleCameraReady}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ position: "absolute", bottom: 50 }}
        />
      )}

      {prediction && (
        <Text style={{ color: "#fff", position: "absolute", bottom: 10 }}>
          Prediction: {prediction}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: { fontSize: 24, fontWeight: "bold", color: "white" },
});


