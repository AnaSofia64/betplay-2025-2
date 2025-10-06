import { AuthContext } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useContext } from "react";

export default function TabsLayout() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      initialRouteName="Home" 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1c1c1e",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#4c76be",
        tabBarInactiveTintColor: "#888",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "home") iconName = "home-outline"; 
          else if (route.name === "bets") iconName = "football-outline";
          else if (route.name === "game") iconName = "play-outline";
          else if (route.name === "wallet") iconName = "wallet-outline";
          else if (route.name === "profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="game" options={{ title: "Game" }} />
      <Tabs.Screen name="bets" options={{ title: "Bets" }} />
      <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
