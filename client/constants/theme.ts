import { Platform } from "react-native";

const primaryColor = "#1A1A2E";
const accentColor = "#FF6B6B";

export const Colors = {
  light: {
    text: "#1A1A2E",
    textSecondary: "#6B6B7B",
    textTertiary: "#9B9BA8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9B9BA8",
    tabIconSelected: primaryColor,
    link: primaryColor,
    accent: accentColor,
    backgroundRoot: "#FAFAFA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    backgroundTertiary: "#EFEFEF",
    border: "#E8E8E8",
    success: "#4CAF50",
    warning: "#FFA726",
    error: "#FF6B6B",
    categoryEntertainment: "#9B59B6",
    categoryWork: "#3498DB",
    categoryHealth: "#27AE60",
    categoryEducation: "#F39C12",
    categoryOther: "#95A5A6",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#A0A0AA",
    textTertiary: "#6B6B7B",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B6B7B",
    tabIconSelected: "#FFFFFF",
    link: "#FF6B6B",
    accent: accentColor,
    backgroundRoot: "#121218",
    backgroundDefault: "#1E1E26",
    backgroundSecondary: "#2A2A34",
    backgroundTertiary: "#36363F",
    border: "#36363F",
    success: "#4CAF50",
    warning: "#FFA726",
    error: "#FF6B6B",
    categoryEntertainment: "#9B59B6",
    categoryWork: "#3498DB",
    categoryHealth: "#27AE60",
    categoryEducation: "#F39C12",
    categoryOther: "#95A5A6",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHover: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 3,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const CategoryColors: Record<string, string> = {
  entertainment: Colors.light.categoryEntertainment,
  work: Colors.light.categoryWork,
  health: Colors.light.categoryHealth,
  education: Colors.light.categoryEducation,
  other: Colors.light.categoryOther,
};

export const Categories = [
  { id: "entertainment", label: "エンタメ", icon: "play-circle" },
  { id: "work", label: "仕事", icon: "briefcase" },
  { id: "health", label: "健康", icon: "heart" },
  { id: "education", label: "教育", icon: "book-open" },
  { id: "other", label: "その他", icon: "grid" },
] as const;
