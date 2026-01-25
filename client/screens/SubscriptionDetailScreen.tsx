import React, { useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

import { ThemedText } from "@/components/ThemedText";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useTheme } from "@/hooks/useTheme";
import { useSubscription, useDeleteSubscription } from "@/hooks/useSubscriptions";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import {
  formatCurrency,
  getMonthlyAmount,
  formatDate,
  getNextBillingDate,
  getUsageDuration,
} from "@/lib/subscriptionUtils";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "SubscriptionDetail">;

interface InfoRowProps {
  label: string;
  value: string;
  icon: string;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
      <View style={styles.infoLeft}>
        <View style={[styles.infoIcon, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name={icon as any} size={16} color={theme.textSecondary} />
        </View>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {label}
        </ThemedText>
      </View>
      <ThemedText type="body" style={styles.infoValue}>
        {value}
      </ThemedText>
    </View>
  );
}

export default function SubscriptionDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  
  const { id } = route.params;
  const { data: subscription, isLoading } = useSubscription(id);
  const deleteMutation = useDeleteSubscription();
  
  const handleEdit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("AddSubscription", { editId: id });
  }, [navigation, id]);
  
  const handleOpenManagementPage = useCallback(async () => {
    if (!subscription?.managementUrl) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await WebBrowser.openBrowserAsync(subscription.managementUrl);
    } catch (error) {
      try {
        await Linking.openURL(subscription.managementUrl);
      } catch (linkError) {
        Alert.alert("エラー", "URLを開けませんでした");
      }
    }
  }, [subscription?.managementUrl]);
  
  const handleDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      "削除の確認",
      `「${subscription?.name}」を削除しますか？この操作は取り消せません。`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              navigation.goBack();
            } catch (error) {
              Alert.alert("エラー", "削除に失敗しました");
            }
          },
        },
      ]
    );
  }, [subscription?.name, deleteMutation, id, navigation]);
  
  if (isLoading || !subscription) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
          <Feather name="loader" size={24} color={theme.textTertiary} />
        </View>
      </View>
    );
  }
  
  const monthlyAmount = getMonthlyAmount(subscription);
  const nextBilling = getNextBillingDate(subscription);
  const usageDuration = getUsageDuration(subscription.startDate);
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={[styles.headerCard, { backgroundColor: theme.backgroundDefault, ...Shadows.card }]}>
        <View style={styles.headerTop}>
          <ThemedText type="h2" style={styles.name}>
            {subscription.name}
          </ThemedText>
          <CategoryBadge category={subscription.category} size="medium" />
        </View>
        
        <View style={styles.priceSection}>
          <View style={styles.priceMain}>
            <ThemedText style={styles.price}>
              {formatCurrency(subscription.price)}
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              /{subscription.billingCycle === "monthly" ? "月" : "年"}
            </ThemedText>
          </View>
          {subscription.billingCycle === "yearly" ? (
            <ThemedText type="small" style={{ color: theme.textTertiary }}>
              月額換算: {formatCurrency(monthlyAmount)}/月
            </ThemedText>
          ) : null}
        </View>
      </View>
      
      <View style={[styles.infoCard, { backgroundColor: theme.backgroundDefault, ...Shadows.card }]}>
        <InfoRow
          label="料金"
          value={`${formatCurrency(subscription.price)}/${subscription.billingCycle === "monthly" ? "月" : "年"}`}
          icon="credit-card"
        />
        <InfoRow
          label="支払いサイクル"
          value={subscription.billingCycle === "monthly" ? "月払い" : "年払い"}
          icon="repeat"
        />
        <InfoRow
          label="開始日"
          value={formatDate(subscription.startDate)}
          icon="calendar"
        />
        <InfoRow
          label="利用期間"
          value={usageDuration}
          icon="clock"
        />
        <InfoRow
          label="次回更新日"
          value={formatDate(nextBilling.toISOString())}
          icon="bell"
        />
      </View>
      
      {subscription.managementUrl ? (
        <Pressable
          onPress={handleOpenManagementPage}
          style={({ pressed }) => [
            styles.linkButton,
            {
              backgroundColor: theme.backgroundDefault,
              opacity: pressed ? 0.9 : 1,
              ...Shadows.card,
            },
          ]}
          testID="button-management"
        >
          <View style={styles.linkContent}>
            <Feather name="external-link" size={20} color={theme.link} />
            <ThemedText type="body" style={{ color: theme.link }}>
              管理ページを開く
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.link} />
        </Pressable>
      ) : null}
      
      <View style={styles.actions}>
        <Pressable
          onPress={handleEdit}
          style={({ pressed }) => [
            styles.actionButton,
            styles.editButton,
            {
              backgroundColor: theme.backgroundDefault,
              opacity: pressed ? 0.9 : 1,
              ...Shadows.card,
            },
          ]}
          testID="button-edit"
        >
          <Feather name="edit-2" size={18} color={theme.text} />
          <ThemedText style={styles.actionText}>編集</ThemedText>
        </Pressable>
        
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.actionButton,
            styles.deleteButton,
            {
              backgroundColor: `${theme.error}15`,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          testID="button-delete"
        >
          <Feather name="trash-2" size={18} color={theme.error} />
          <ThemedText style={[styles.actionText, { color: theme.error }]}>
            削除
          </ThemedText>
        </Pressable>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  name: {
    flex: 1,
    marginRight: Spacing.md,
  },
  priceSection: {
    gap: Spacing.xs,
  },
  priceMain: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 36,
    fontWeight: "700",
  },
  infoCard: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  infoValue: {
    fontWeight: "500",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  editButton: {},
  deleteButton: {},
  actionText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
