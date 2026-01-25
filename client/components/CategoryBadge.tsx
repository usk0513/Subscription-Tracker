import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { CategoryColors, Categories, Spacing, BorderRadius } from "@/constants/theme";
import type { CategoryId } from "@/types/subscription";

interface CategoryBadgeProps {
  category: CategoryId;
  showLabel?: boolean;
  size?: "small" | "medium";
}

export function CategoryBadge({ category, showLabel = true, size = "small" }: CategoryBadgeProps) {
  const categoryInfo = Categories.find((c) => c.id === category) || Categories[4];
  const color = CategoryColors[category] || CategoryColors.other;
  const iconSize = size === "small" ? 12 : 16;
  const fontSize = size === "small" ? 12 : 14;
  
  return (
    <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
      <Feather name={categoryInfo.icon as any} size={iconSize} color={color} />
      {showLabel ? (
        <ThemedText style={[styles.label, { color, fontSize }]}>
          {categoryInfo.label}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  label: {
    fontWeight: "500",
  },
});
