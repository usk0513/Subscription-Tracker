import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SkeletonCardProps {
  index?: number;
}

function SkeletonCard({ index = 0 }: SkeletonCardProps) {
  const { theme } = useTheme();
  const shimmer = useSharedValue(0);
  
  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]);
    return { opacity };
  });
  
  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.nameLine, { backgroundColor: theme.backgroundSecondary }]} />
        <View style={[styles.badge, { backgroundColor: theme.backgroundSecondary }]} />
      </View>
      <View style={styles.footer}>
        <View style={[styles.priceLine, { backgroundColor: theme.backgroundSecondary }]} />
        <View style={[styles.dateLine, { backgroundColor: theme.backgroundSecondary }]} />
      </View>
    </Animated.View>
  );
}

export function SkeletonLoader() {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.totalCard,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      />
      {[0, 1, 2].map((i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  totalCard: {
    height: 140,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  nameLine: {
    width: 120,
    height: 20,
    borderRadius: BorderRadius.xs,
  },
  badge: {
    width: 60,
    height: 24,
    borderRadius: BorderRadius.full,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLine: {
    width: 80,
    height: 28,
    borderRadius: BorderRadius.xs,
  },
  dateLine: {
    width: 100,
    height: 16,
    borderRadius: BorderRadius.xs,
  },
});
