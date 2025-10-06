import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import {
  Alert,
  ColorValue,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

const themes: Record<string, ColorValue[]> = {
  purple: ["#a18cd1", "#fbc2eb"],
  blue: ["#1e3c72", "#2a5298"],
  red: ["#ff416c", "#ff4b2b"],
  green: ["#11998e", "#38ef7d"],
};

export default function LoginScreen() {
  const [colors, setColors] = useState<ColorValue[]>(themes.purple);
  const { login, isLoading } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("../../main/(tabs)/Home")
    } catch (err: any) {
      console.log("Login error:", err);
      Alert.alert("Error", err?.message || "Error al iniciar sesión");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        
        <LinearGradient
          colors={colors as [ColorValue, ColorValue]}
          style={styles.logoContainer}
        >
          <Ionicons name="ellipse" size={30} color="#fff" />
          <Text style={styles.logoText}>BET</Text>
        </LinearGradient>

        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
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
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>

        
        <TouchableOpacity onPress={() => router.push("/reset")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

       
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={colors as [ColorValue, ColorValue]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Loading..." : "Sign In"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        
        <Text style={styles.socialText}>Or by social accounts</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={[styles.socialBtn, { backgroundColor: "#3b5998" }]}>
            <Ionicons name="logo-facebook" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, { backgroundColor: "#db4437" }]}>
            <Ionicons name="logo-google" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, { backgroundColor: "#1da1f2" }]}>
            <Ionicons name="logo-twitter" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        
        <View style={styles.signupRow}>
          <Text style={{ color: "#ccc" }}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign Up</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
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
    paddingVertical: 5,
    marginVertical: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    padding: 10,
    color: "#fff",
  },
  forgot: { alignSelf: "flex-end", color: "#ccc", marginVertical: 10 },
  buttonWrapper: { width: "100%", marginTop: 10 },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  socialText: { marginTop: 20, color: "#fff" },
  socialRow: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
    width: "60%",
  },
  socialBtn: {
    padding: 12,
    borderRadius: 50,
  },
  signupRow: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },
  themeRow: { flexDirection: "row", marginTop: 30 },
  circle: { width: 30, height: 30, borderRadius: 15, marginHorizontal: 10 },
});
