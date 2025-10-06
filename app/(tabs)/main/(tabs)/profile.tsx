import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState({ name: "", username: "", bio: "" });
  const [activeTab, setActiveTab] = useState<"Activity" | "Bets" | "Rewards">(
    "Activity"
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  // 📌 Cargar perfil
  const fetchProfile = async () => {
    setLoading(true);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error(userError);
      setLoading(false);
      return;
    }

    const user = userData?.user;
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(error);
    } else if (data) {
      setProfile(data);
      setEditData({
        name: data.name || "",
        username: data.username || "",
        bio: data.bio || "",
      });
    }

    setLoading(false);
  };

  // 📌 Subir avatar a Supabase Storage
  const uploadAvatar = async (uri: string) => {
    try {
      if (!profile) return;

      // convertir URI -> blob con fetch (esto soluciona tu error 👇)
      const response = await fetch(uri);
      const blob = await response.blob();

      // nombre único
      const filePath = `avatars/${profile.id}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars") // 👈 asegúrate de tener este bucket creado en Supabase
        .upload(filePath, blob, { contentType: "image/jpeg", upsert: true });

      if (uploadError) {
        console.error(uploadError);
        Alert.alert("❌ Error", "No se pudo subir avatar");
        return;
      }

      // URL pública
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Guardar en profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date() })
        .eq("id", profile.id);

      if (!updateError) {
        setProfile({ ...profile, avatar_url: publicUrl });
      }
    } catch (err) {
      console.error("Error subiendo avatar:", err);
    }
  };

  // 📌 Seleccionar imagen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  // 📌 Tomar foto
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("❌ Permiso denegado", "Se necesita permiso para usar la cámara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  // 📌 Guardar cambios en perfil
  const updateProfile = async () => {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        name: editData.name,
        username: editData.username,
        bio: editData.bio,
        updated_at: new Date(),
      })
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, ...editData });
      setModalVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: "#1c1c1e" }]}>
      {/* Avatar */}
      <TouchableOpacity onPress={pickImage} onLongPress={takePhoto}>
        <Image
          source={{ uri: profile?.avatar_url || "https://i.pravatar.cc/200" }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={{ color: "#aaa", fontSize: 12, marginTop: 5 }}>
        (Toca para elegir, mantén presionado para tomar foto)
      </Text>

      {/* Nombre */}
      <View style={styles.nameRow}>
        <Text style={styles.username}>{profile?.name || "No name set"}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="pencil" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Activity", "Bets", "Rewards"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
            <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido de tabs */}
      <View style={styles.content}>
        {activeTab === "Activity" && (
          <>
            <Text style={styles.stat}>⭐ Experience: {profile?.experience || 0}</Text>
            <Text style={styles.stat}>🔮 Bubbles: {profile?.bubbles || 0}</Text>
          </>
        )}
        {activeTab === "Bets" && (
          <Text style={styles.stat}>🎲 Bets: {profile?.bets || 0}</Text>
        )}
        {activeTab === "Rewards" && (
          <Text style={styles.stat}>🥇 Best Bet: {profile?.best_bet || 0}</Text>
        )}
      </View>

      {/* Botón logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>

      {/* Modal edición */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={{ color: "#fff", fontSize: 18, marginBottom: 10 }}>
            Edit Profile
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={editData.name}
            onChangeText={(t) => setEditData({ ...editData, name: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={editData.username}
            onChangeText={(t) => setEditData({ ...editData, username: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Bio"
            placeholderTextColor="#999"
            value={editData.bio}
            onChangeText={(t) => setEditData({ ...editData, bio: t })}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: "#444" }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#fff" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginTop: 20 },
  nameRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  username: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  tabs: { flexDirection: "row", marginTop: 20 },
  tab: { marginHorizontal: 12, fontSize: 16, color: "#aaa" },
  activeTab: { color: "#fff", fontWeight: "bold" },
  content: { marginTop: 20, alignItems: "center" },
  stat: { color: "#fff", fontSize: 18, marginVertical: 5 },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#e63946",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    padding: 20,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#2c2c2e",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: "#38ef7d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
});
