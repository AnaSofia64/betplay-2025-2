import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { createContext, useContext, useState } from "react";

const themes: Record<string, [string, string]> = {
  purple: ["#a18cd1", "#fbc2eb"],
  blue: ["#1e3c72", "#4c76beff"],
  red: ["#570000ff", "#d61b1bff"],
  green: ["#11998e", "#38ef7d"],
};

type ThemeContextType = {
  colors: [string, string];
  setColors: (colors: [string, string]) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: themes.purple,
  setColors: () => {},
});

export const useThemeColor = () => useContext(ThemeContext);

export default function RootLayout() {
  const [colors, setColors] = useState<[string, string]>(themes.purple);

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ colors, setColors }}>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeContext.Provider>
    </AuthProvider>
  );
}
