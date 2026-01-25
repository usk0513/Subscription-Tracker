import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { formatCurrency } from "@/lib/subscriptionUtils";

interface MonthlyTotalCardProps {
  total: number;
  subscriptionCount: number;
}

export function MonthlyTotalCard({ total, subscriptionCount }: MonthlyTotalCardProps) {
  const { theme, isDark } = useTheme();
  
  return (
    <LinearGradient
      colors={isDark ? ["#2A2A34", "#1E1E26"] : ["#1A1A2E", "#2D2D42"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.content}>
        <ThemedText style={styles.label}>
          月額合計
        </ThemedText>
        <View style={styles.amountContainer}>
          <ThemedText style={[styles.amount, Typography.display]}>
            {formatCurrency(total)}
          </ThemedText>
          <ThemedText style={styles.suffix}>
            /月
          </ThemedText>
        </View>
        <ThemedText style={styles.count}>
          {subscriptionCount}件のサブスクリプション
        </ThemedText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  content: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  amount: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  suffix: {
    fontSize: 20,
    color: "rgba(255,255,255,0.7)",
    marginLeft: Spacing.xs,
    fontWeight: "500",
  },
  count: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginTop: Spacing.md,
  },
});
