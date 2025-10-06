import { supabase } from "@/lib/supabaseClient";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";



export default function HomeScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error(userError);
      Alert.alert("❌ Error", "No se pudo obtener el usuario");
      return;
    }

    const user = userData?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      setName(user.email?.split("@")[0] || "Usuario");
    } else if (data) {
      setName(data.name || user.email?.split("@")[0] || "Usuario");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: "#1c1c1e" }]}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient colors={colors as [string, string]} style={styles.logo}>
          <Ionicons name="football" size={28} color="#fff" />
        </LinearGradient>
        <Text style={styles.username}>{name}</Text>
      </View>

      {/* Apuestas del día */}
      <Text style={styles.sectionTitle}>Apuestas del día</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Mundial: Brasil 🇧🇷 vs Alemania 🇩🇪</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>Mundial: Francia 🇫🇷 vs España 🇪🇸</Text>
      </View>

      {/* Partido esperado */}
      <Text style={styles.sectionTitle}>Partido esperado</Text>
      <View style={styles.highlightCard}>
        <LinearGradient
          colors={colors as [string, string]}
          style={styles.highlightInner}
        >
          <Text style={styles.highlightText}>Argentina 🇦🇷 vs Inglaterra 🏴</Text>
        </LinearGradient>
      </View>

      {/* Grabaciones en vivo */}
      <Text style={styles.sectionTitle}>Grabaciones en vivo</Text>
      <View style={styles.videoCard}>
        <Image
          source={{ uri: "https://placekitten.com/400/200" }}
          style={styles.videoThumb}
        />
        <Text style={styles.videoText}>
          Resumen: Italia 🇮🇹 vs Portugal 🇵🇹
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
  },
  card: {
    backgroundColor: "#2c2c2e",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  cardText: { color: "#fff", fontSize: 16 },
  highlightCard: { borderRadius: 15, overflow: "hidden", marginBottom: 20 },
  highlightInner: { padding: 20, alignItems: "center" },
  highlightText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  videoCard: { marginBottom: 20 },
  videoThumb: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 5,
  },
  videoText: { color: "#ccc" },
});
