import { supabase } from "@/lib/supabaseClient";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CameraModalProps = {
  visible: boolean;
  onClose: () => void;
  userId: string; // 👈 recibimos el ID del usuario
  onUploaded: (url: string) => void; // 👈 callback cuando se guarda
};

interface PreviewProps {
  uri: string;
  base64?: string;
}

export default function CameraModal({
  visible,
  onClose,
  userId,
  onUploaded,
}: CameraModalProps) {
  const [preview, setPreview] = useState<PreviewProps | null>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  }, [visible]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>No camera permissions</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📌 Función para subir imagen a Supabase
  const uploadAvatar = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filePath = `${userId}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, { contentType: "image/jpeg", upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Guardamos en perfil
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      onUploaded(publicUrl);
      onClose();
    } catch (e) {
      console.error("Upload error:", e);
      Alert.alert("❌ Error", "No se pudo guardar la imagen");
    }
  };

  // galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setPreview({ uri: result.assets[0].uri });
      await uploadAvatar(result.assets[0].uri);
    }
  };

  // cámara
  const handleTake = async () => {
    if (cameraRef.current) {
      try {
        const response = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
        if (response?.uri) {
          setPreview({ uri: response.uri });
          await uploadAvatar(response.uri);
        }
      } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("❌ Error", "No se pudo tomar foto");
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

        {preview && <Image source={{ uri: preview.uri }} style={styles.preview} />}

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={handleTake}>
            <Text style={styles.buttonText}>📸</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>📁</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancel]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  preview: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
  },
  controls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#4c76be",
    padding: 12,
    borderRadius: 8,
  },
  cancel: { backgroundColor: "#888" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
