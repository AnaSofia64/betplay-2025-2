import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ColorValue,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const themes: Record<string, ColorValue[]> = {
  purple: ["#a18cd1", "#fbc2eb"],
  blue: ["#1e3c72", "#4c76beff"],
  red: ["#570000ff", "#d61b1bff"],
  green: ["#11998e", "#38ef7d"],
};

export default function ResetPasswordScreen() {
  const [colors, setColors] = useState<ColorValue[]>(themes.red);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("❌ Error", "Please enter your email");
      return;
    }

    try {
      
      Alert.alert("✅ Reset Link Sent", `Check your email: ${email}`);
      router.replace("../(auth)/login");
    } catch (error: any) {
      Alert.alert("❌ Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <LinearGradient
        colors={colors as [ColorValue, ColorValue]}
        style={styles.logoContainer}
      >
        <Ionicons name="key-outline" size={30} color="#fff" />
        <Text style={styles.logoText}>RESET</Text>
      </LinearGradient>

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#fff" />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      
      <TouchableOpacity style={styles.buttonWrapper} onPress={handleReset}>
        <LinearGradient
          colors={colors as [ColorValue, ColorValue]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </LinearGradient>
      </TouchableOpacity>

      
      <View style={styles.signupRow}>
        <Text style={{ color: "#ccc" }}>Remembered your password? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign In</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.themeRow}>
        {Object.keys(themes).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setColors(themes[t])}
            style={[styles.circle, { backgroundColor: themes[t][0] as string }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 50,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c2c2e",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    padding: 10,
    color: "#fff",
  },
  buttonWrapper: { width: "100%", marginTop: 10 },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupRow: {
    flexDirection: "row",
    marginTop: 80,
    alignItems: "center",
  },
  themeRow: { flexDirection: "row", marginTop: 30 },
  circle: { width: 30, height: 30, borderRadius: 15, marginHorizontal: 10 },
});
