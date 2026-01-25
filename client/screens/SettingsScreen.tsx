import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Image, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface SettingsRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function SettingsRow({ icon, label, value, onPress, showChevron = true }: SettingsRowProps) {
  const { theme } = useTheme();
  
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };
  
  return (
    <Pressable
      onPress={onPress ? handlePress : undefined}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.backgroundDefault,
          opacity: pressed && onPress ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name={icon as any} size={18} color={theme.textSecondary} />
        </View>
        <ThemedText type="body">{label}</ThemedText>
      </View>
      <View style={styles.rowRight}>
        {value ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {value}
          </ThemedText>
        ) : null}
        {showChevron && onPress ? (
          <Feather name="chevron-right" size={20} color={theme.textTertiary} />
        ) : null}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  
  const appVersion = Constants.expoConfig?.version || "1.0.0";
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
    >
      <View style={[styles.profileCard, { backgroundColor: theme.backgroundDefault, ...Shadows.card }]}>
        <View style={[styles.avatar, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="user" size={32} color={theme.textSecondary} />
        </View>
        <View style={styles.profileInfo}>
          <ThemedText type="h4">サブスク管理</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            あなたのサブスクリプションを管理
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          設定
        </ThemedText>
        <View style={[styles.sectionContent, { ...Shadows.card }]}>
          <SettingsRow
            icon="bell"
            label="通知設定"
            value="オフ"
            showChevron={false}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsRow
            icon={isDark ? "moon" : "sun"}
            label="テーマ"
            value="システム設定"
            showChevron={false}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsRow
            icon="dollar-sign"
            label="通貨"
            value="JPY (¥)"
            showChevron={false}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          アプリについて
        </ThemedText>
        <View style={[styles.sectionContent, { ...Shadows.card }]}>
          <SettingsRow
            icon="info"
            label="バージョン"
            value={appVersion}
            showChevron={false}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsRow
            icon="shield"
            label="プライバシーポリシー"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsRow
            icon="file-text"
            label="利用規約"
            onPress={() => {}}
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.footerIcon}
          resizeMode="contain"
        />
        <ThemedText type="small" style={{ color: theme.textTertiary }}>
          サブスク管理 v{appVersion}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textTertiary, marginTop: Spacing.xs }}>
          Made with love
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  divider: {
    height: 1,
    marginLeft: Spacing.lg + 36 + Spacing.md,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
  },
  footerIcon: {
    width: 48,
    height: 48,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xs,
  },
});
