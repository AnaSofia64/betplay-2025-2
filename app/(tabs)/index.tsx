import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
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

export default function App() {
  const [colors, setColors] = useState<ColorValue[]>(themes.purple);

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <LinearGradient colors={colors as [ColorValue, ColorValue]} style={styles.logoContainer}>
        <Ionicons name="ellipse" size={30} color="#fff" />
        <Text style={styles.logoText}>BET</Text>
      </LinearGradient>

      {/* INPUTS */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#fff" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#fff" />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          style={styles.input}
        />
        <Ionicons name="eye-outline" size={20} color="#fff" />
      </View>

      
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.buttonWrapper}>
        <LinearGradient colors={colors as [ColorValue, ColorValue]} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Social Icons */}
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

      {/* Sign Up */}
      <View style={styles.signupRow}>
        <Text style={{ color: "#ccc" }}>Don’t have an account? </Text>
        <TouchableOpacity>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Selector */}
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
    backgroundColor: "#1c1c1e", // Fondo fijo
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
