import { AuthContext, AuthProvider } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RegisterScreen from "./app/(tabs)/(auth)/register";
import ResetPasswordScreen from "./app/(tabs)/(auth)/reset";

// ----- Pantallas locales -----
function LoginScreen({ navigation }: any) {
  const { login } = useContext(AuthContext);
  const [email] = useState("test@test.com");
  const [password] = useState("12345678");

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BET</Text>

      <TouchableOpacity
        style={styles.circle}
        onPress={async () => {
          try {
            await login(email, password);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        <Text style={{ color: "#fff" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ color: "#fff", marginTop: 20 }}>Ir a Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Reset")}>
        <Text style={{ color: "#fff", marginTop: 20 }}>
          Olvidé mi contraseña
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>🏠 Bienvenido al Home</Text>
    </View>
  );
}

function ProfileScreen() {
  const { logout } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>👤 Perfil</Text>
      <TouchableOpacity onPress={logout}>
        <Text style={{ color: "red", marginTop: 20 }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#111" },
        tabBarActiveTintColor: "#fff",
        tabBarIcon: ({ size, color }) => {
          const icon =
            route.name === "Home"
              ? "home"
              : route.name === "Profile"
              ? "person"
              : "game-controller";
          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bets" component={HomeScreen} />
      <Tab.Screen name="Games" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

// ----- Estilos -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
  },
  logo: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
  },
  circle: {
    padding: 15,
    backgroundColor: "#4c76beff",
    borderRadius: 10,
  },
});
