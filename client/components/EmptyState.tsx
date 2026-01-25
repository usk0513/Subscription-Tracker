import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface EmptyStateProps {
  onAddPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EmptyState({ onAddPress }: EmptyStateProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/empty-subscriptions.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <ThemedText type="h4" style={styles.title}>
        まだサブスクリプションがありません
      </ThemedText>
      <ThemedText type="body" style={[styles.description, { color: theme.textSecondary }]}>
        利用中のサブスクリプションを追加して
        月額費用を管理しましょう
      </ThemedText>
      <AnimatedPressable
        onPress={onAddPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          { backgroundColor: theme.link },
          animatedStyle,
        ]}
        testID="button-add-first"
      >
        <Feather name="plus" size={20} color="#FFFFFF" />
        <ThemedText style={styles.buttonText}>
          サブスクリプションを追加
        </ThemedText>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing["4xl"],
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: Spacing["2xl"],
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    lineHeight: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
