import React from "react";
import { View, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, CategoryColors, Categories } from "@/constants/theme";
import type { CategoryId } from "@/types/subscription";

interface CategoryFilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory: CategoryId | "all";
  onSelectCategory: (category: CategoryId | "all") => void;
  categoryCounts: Record<CategoryId | "all", number>;
}

interface CategoryOptionProps {
  id: CategoryId | "all";
  label: string;
  icon: string;
  color: string;
  count: number;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryOption({ id, label, icon, color, count, isSelected, onPress }: CategoryOptionProps) {
  const { theme } = useTheme();
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: isSelected ? `${color}15` : "transparent",
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      testID={`button-category-${id}`}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Feather name={icon as any} size={20} color={color} />
        </View>
        <ThemedText type="body" style={styles.optionLabel}>
          {label}
        </ThemedText>
      </View>
      <View style={styles.optionRight}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {count}
        </ThemedText>
        {isSelected ? (
          <Feather name="check" size={20} color={color} />
        ) : null}
      </View>
    </Pressable>
  );
}

export function CategoryFilterModal({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFilterModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const handleSelect = (category: CategoryId | "all") => {
    onSelectCategory(category);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <ThemedView style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <View style={styles.header}>
            <ThemedText type="h4">カテゴリー</ThemedText>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.content}>
            <CategoryOption
              id="all"
              label="すべて"
              icon="grid"
              color={theme.link}
              count={categoryCounts.all}
              isSelected={selectedCategory === "all"}
              onPress={() => handleSelect("all")}
            />
            {Categories.map((cat) => (
              <CategoryOption
                key={cat.id}
                id={cat.id}
                label={cat.label}
                icon={cat.icon}
                color={CategoryColors[cat.id]}
                count={categoryCounts[cat.id]}
                isSelected={selectedCategory === cat.id}
                onPress={() => handleSelect(cat.id)}
              />
            ))}
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128,128,128,0.1)",
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontWeight: "500",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
});
