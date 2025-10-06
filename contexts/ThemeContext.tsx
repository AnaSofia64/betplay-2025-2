import React, { createContext, useContext, useState } from "react";
import { ColorValue } from "react-native";

const themes: Record<string, ColorValue[]> = {
  purple: ["#a18cd1", "#fbc2eb"],
  blue: ["#1e3c72", "#4c76beff"],
  red: ["#570000ff", "#d61b1bff"],
  green: ["#11998e", "#38ef7d"],
};

type ThemeContextType = {
  colors: ColorValue[];
  setTheme: (colors: ColorValue[]) => void;
  
};

const ThemeContext = createContext<ThemeContextType>({
  colors: themes.purple,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ColorValue[]>(themes.purple);
  const setTheme = (newColors: ColorValue[]) => setColors(newColors);

  return (
     <ThemeContext.Provider value={{ colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
