import React, { useState, useCallback } from "react";
import { FlatList, View, StyleSheet, RefreshControl, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/hooks/useTheme";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Spacing } from "@/constants/theme";
import { getTotalMonthlyAmount, filterByCategory, getCategoryCount } from "@/lib/subscriptionUtils";
import { MonthlyTotalCard } from "@/components/MonthlyTotalCard";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { CategoryFilterModal } from "@/components/CategoryFilterModal";
import type { Subscription, CategoryId } from "@/types/subscription";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const { data: subscriptions = [], isLoading, refetch, isRefetching } = useSubscriptions();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  const filteredSubscriptions = filterByCategory(subscriptions, selectedCategory);
  const totalMonthly = getTotalMonthlyAmount(filteredSubscriptions);
  const categoryCounts = getCategoryCount(subscriptions);
  
  const handleAddPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("AddSubscription");
  }, [navigation]);
  
  const handleSubscriptionPress = useCallback((subscription: Subscription) => {
    navigation.navigate("SubscriptionDetail", { id: subscription.id });
  }, [navigation]);
  
  const handleFilterPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilterModalVisible(true);
  }, []);
  
  const renderItem = useCallback(({ item }: { item: Subscription }) => (
    <SubscriptionCard
      subscription={item}
      onPress={() => handleSubscriptionPress(item)}
    />
  ), [handleSubscriptionPress]);
  
  const renderHeader = useCallback(() => {
    if (filteredSubscriptions.length === 0) return null;
    return (
      <MonthlyTotalCard
        total={totalMonthly}
        subscriptionCount={filteredSubscriptions.length}
      />
    );
  }, [filteredSubscriptions.length, totalMonthly]);
  
  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    if (selectedCategory !== "all" && subscriptions.length > 0) {
      return (
        <View style={styles.emptyCategory}>
          <Feather name="inbox" size={48} color={theme.textTertiary} />
          <View style={styles.emptyCategoryText}>
            <Feather name="search" size={16} color={theme.textSecondary} />
          </View>
        </View>
      );
    }
    return <EmptyState onAddPress={handleAddPress} />;
  }, [isLoading, selectedCategory, subscriptions.length, theme, handleAddPress]);
  
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={{ height: headerHeight }} />
        <SkeletonLoader />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl + 70,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.text}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      
      {subscriptions.length > 0 ? (
        <Pressable
          onPress={handleFilterPress}
          style={({ pressed }) => [
            styles.filterButton,
            {
              backgroundColor: theme.backgroundDefault,
              bottom: tabBarHeight + Spacing.lg,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
          testID="button-filter"
        >
          <Feather name="filter" size={20} color={theme.text} />
          {selectedCategory !== "all" ? (
            <View style={[styles.filterBadge, { backgroundColor: theme.accent }]} />
          ) : null}
        </Pressable>
      ) : null}
      
      <Pressable
        onPress={handleAddPress}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.link,
            bottom: tabBarHeight + Spacing.lg,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
        testID="button-add"
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>
      
      <CategoryFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  filterButton: {
    position: "absolute",
    left: Spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyCategory: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
  },
  emptyCategoryText: {
    marginTop: Spacing.md,
  },
});
