import { AuthContext } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
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
  blue: ["#1e3c72", "#2a5298"],
  red: ["#ff416c", "#ff4b2b"],
  green: ["#11998e", "#38ef7d"],
};

export default function RegisterScreen() {
  const [colors, setColors] = useState<ColorValue[]>(themes.blue);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { register } = useContext(AuthContext);
  const router = useRouter();

  // ✅ Registro limpio
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("❌ Error", "All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("❌ Error", "Passwords do not match");
      return;
    }

    try {
      const user = await register(name, email, password); // 👈 viene de AuthContext

      if (user) {
        Alert.alert("✅ Account created", `Welcome ${name}!`);
        router.replace("../../main/(tabs)/Home");
      }
    } catch (err: any) {
      Alert.alert("❌ Registration Failed", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <LinearGradient
        colors={colors as [ColorValue, ColorValue]}
        style={styles.logoContainer}
      >
        <Ionicons name="person-add-outline" size={30} color="#fff" />
        <Text style={styles.logoText}>REGISTER</Text>
      </LinearGradient>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#fff" />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#fff" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#fff" />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#fff" />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Botón registro */}
      <TouchableOpacity style={styles.buttonWrapper} onPress={handleRegister}>
        <LinearGradient
          colors={colors as [ColorValue, ColorValue]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Redirigir a login */}
      <View style={styles.signupRow}>
        <Text style={{ color: "#ccc" }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Temas */}
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
    marginTop: 30,
    alignItems: "center",
  },
  themeRow: { flexDirection: "row", marginTop: 30 },
  circle: { width: 30, height: 30, borderRadius: 15, marginHorizontal: 10 },
});
