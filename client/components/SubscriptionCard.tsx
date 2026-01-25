import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { formatCurrency, getMonthlyAmount, getNextBillingDate, formatDate } from "@/lib/subscriptionUtils";
import type { Subscription } from "@/types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97, springConfig);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
  const monthlyAmount = getMonthlyAmount(subscription);
  const nextBilling = getNextBillingDate(subscription);
  const isYearly = subscription.billingCycle === "yearly";
  
  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundDefault,
          ...Shadows.card,
        },
        animatedStyle,
      ]}
      testID={`card-subscription-${subscription.id}`}
    >
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <ThemedText type="body" style={styles.name}>
            {subscription.name}
          </ThemedText>
          <CategoryBadge category={subscription.category} />
        </View>
        <Feather name="chevron-right" size={20} color={theme.textTertiary} />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <ThemedText type="h4" style={styles.price}>
            {formatCurrency(monthlyAmount)}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            /月
          </ThemedText>
          {isYearly ? (
            <View style={[styles.cycleTag, { backgroundColor: theme.accent + "20" }]}>
              <Feather name="calendar" size={10} color={theme.accent} />
              <ThemedText style={[styles.cycleText, { color: theme.accent }]}>
                年払い
              </ThemedText>
            </View>
          ) : null}
        </View>
        
        <ThemedText type="small" style={{ color: theme.textTertiary }}>
          次回: {formatDate(nextBilling.toISOString())}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
    flexWrap: "wrap",
  },
  name: {
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.xs,
  },
  price: {
    fontWeight: "700",
  },
  cycleTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.xs,
    gap: 2,
  },
  cycleText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
