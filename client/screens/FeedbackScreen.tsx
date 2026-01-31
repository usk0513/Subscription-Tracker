import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "Feedback">;

export default function FeedbackScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const prefilledService = route.params?.serviceName || "";

  const [serviceName, setServiceName] = useState(prefilledService);
  const [planName, setPlanName] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = serviceName.trim() && details.trim();

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await fetch(new URL("/api/feedback", getApiUrl()).toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName: serviceName.trim(),
          planName: planName.trim() || undefined,
          details: details.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "送信に失敗しました");
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "送信完了",
        "フィードバックをお送りいただきありがとうございます。開発チームが確認いたします。",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "エラー",
        error instanceof Error ? error.message : "送信に失敗しました。もう一度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
        },
      ]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={[styles.infoCard, { backgroundColor: `${theme.link}10` }]}>
        <Feather name="info" size={20} color={theme.link} />
        <ThemedText style={[styles.infoText, { color: theme.text }]}>
          登録したいサービスやプランが見つからない場合は、こちらからリクエストをお送りください。
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          サービス名 *
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={serviceName}
          onChangeText={setServiceName}
          placeholder="例: Notion, Figma, Canva"
          placeholderTextColor={theme.textTertiary}
          testID="input-service-name"
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          プラン名（任意）
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={planName}
          onChangeText={setPlanName}
          placeholder="例: Pro, Business, Team"
          placeholderTextColor={theme.textTertiary}
          testID="input-plan-name"
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          詳細 *
        </ThemedText>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={details}
          onChangeText={setDetails}
          placeholder="料金や請求サイクルなど、わかる範囲で教えてください"
          placeholderTextColor={theme.textTertiary}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          testID="input-details"
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={!isValid || isSubmitting}
        style={({ pressed }) => [
          styles.submitButton,
          {
            backgroundColor: isValid ? theme.link : theme.backgroundSecondary,
            opacity: pressed && isValid ? 0.9 : 1,
          },
        ]}
        testID="button-submit-feedback"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Feather
              name="send"
              size={18}
              color={isValid ? "#FFFFFF" : theme.textTertiary}
            />
            <ThemedText
              style={[
                styles.submitButtonText,
                { color: isValid ? "#FFFFFF" : theme.textTertiary },
              ]}
            >
              送信する
            </ThemedText>
          </>
        )}
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: 52,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
