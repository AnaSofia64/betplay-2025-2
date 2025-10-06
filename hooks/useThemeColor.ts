import { useTheme } from "../contexts/ThemeContext";

export function useThemeColor() {
  const { colors, setTheme } = useTheme();

  return { colors, setTheme };
}