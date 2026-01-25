import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useCreateSubscription, useUpdateSubscription, useSubscription } from "@/hooks/useSubscriptions";
import { Spacing, BorderRadius, Categories, CategoryColors } from "@/constants/theme";
import type { BillingCycle, CategoryId, SubscriptionInput } from "@/types/subscription";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "AddSubscription">;

export default function AddSubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  
  const editId = route.params?.editId;
  const { data: existingSubscription } = useSubscription(editId || "");
  
  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();
  
  const [name, setName] = useState(existingSubscription?.name || "");
  const [price, setPrice] = useState(existingSubscription?.price?.toString() || "");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    existingSubscription?.billingCycle || "monthly"
  );
  const [startDate, setStartDate] = useState<Date>(
    existingSubscription?.startDate ? new Date(existingSubscription.startDate) : new Date()
  );
  const [category, setCategory] = useState<CategoryId>(
    existingSubscription?.category || "other"
  );
  const [managementUrl, setManagementUrl] = useState(existingSubscription?.managementUrl || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  React.useEffect(() => {
    if (existingSubscription) {
      setName(existingSubscription.name);
      setPrice(existingSubscription.price.toString());
      setBillingCycle(existingSubscription.billingCycle);
      setStartDate(new Date(existingSubscription.startDate));
      setCategory(existingSubscription.category);
      setManagementUrl(existingSubscription.managementUrl || "");
    }
  }, [existingSubscription]);
  
  const isValid = name.trim() && price && parseFloat(price) > 0;
  
  const handleSave = async () => {
    if (!isValid) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const input: SubscriptionInput = {
      name: name.trim(),
      price: parseFloat(price),
      billingCycle,
      startDate: startDate.toISOString(),
      category,
      managementUrl: managementUrl.trim() || undefined,
    };
    
    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, input });
      } else {
        await createMutation.mutateAsync(input);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("エラー", "保存に失敗しました。もう一度お試しください。");
    }
  };
  
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  
  const formatDisplayDate = (date: Date): string => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          アプリ/サービス名
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
          value={name}
          onChangeText={setName}
          placeholder="Netflix, Spotify など"
          placeholderTextColor={theme.textTertiary}
          testID="input-name"
        />
      </View>
      
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          料金
        </ThemedText>
        <View style={styles.priceInputContainer}>
          <ThemedText type="body" style={styles.currencyPrefix}>¥</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.priceInput,
              {
                backgroundColor: theme.backgroundDefault,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            value={price}
            onChangeText={setPrice}
            placeholder="980"
            placeholderTextColor={theme.textTertiary}
            keyboardType="numeric"
            testID="input-price"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          支払いサイクル
        </ThemedText>
        <View style={[styles.segmentContainer, { backgroundColor: theme.backgroundDefault }]}>
          <Pressable
            onPress={() => setBillingCycle("monthly")}
            style={[
              styles.segment,
              billingCycle === "monthly" && {
                backgroundColor: theme.link,
              },
            ]}
            testID="button-monthly"
          >
            <ThemedText
              style={[
                styles.segmentText,
                { color: billingCycle === "monthly" ? "#FFFFFF" : theme.text },
              ]}
            >
              月払い
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setBillingCycle("yearly")}
            style={[
              styles.segment,
              billingCycle === "yearly" && {
                backgroundColor: theme.link,
              },
            ]}
            testID="button-yearly"
          >
            <ThemedText
              style={[
                styles.segmentText,
                { color: billingCycle === "yearly" ? "#FFFFFF" : theme.text },
              ]}
            >
              年払い
            </ThemedText>
          </Pressable>
        </View>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          開始日
        </ThemedText>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.dateButton,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.border,
            },
          ]}
          testID="button-date"
        >
          <ThemedText>{formatDisplayDate(startDate)}</ThemedText>
          <Feather name="calendar" size={20} color={theme.textSecondary} />
        </Pressable>
        
        {showDatePicker ? (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              locale="ja-JP"
            />
            {Platform.OS === "ios" ? (
              <Pressable
                onPress={() => setShowDatePicker(false)}
                style={[styles.datePickerDone, { backgroundColor: theme.link }]}
              >
                <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  完了
                </ThemedText>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
      
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          カテゴリー
        </ThemedText>
        <View style={styles.categoryGrid}>
          {Categories.map((cat) => {
            const isSelected = category === cat.id;
            const color = CategoryColors[cat.id];
            return (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? `${color}20` : theme.backgroundDefault,
                    borderColor: isSelected ? color : theme.border,
                  },
                ]}
                testID={`button-category-${cat.id}`}
              >
                <Feather
                  name={cat.icon as any}
                  size={16}
                  color={isSelected ? color : theme.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.categoryText,
                    { color: isSelected ? color : theme.text },
                  ]}
                >
                  {cat.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          管理ページURL（任意）
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
          value={managementUrl}
          onChangeText={setManagementUrl}
          placeholder="https://..."
          placeholderTextColor={theme.textTertiary}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          testID="input-url"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleSave}
          disabled={!isValid || createMutation.isPending || updateMutation.isPending}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: isValid ? theme.link : theme.backgroundSecondary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          testID="button-save"
        >
          <ThemedText style={[styles.saveButtonText, { color: isValid ? "#FFFFFF" : theme.textTertiary }]}>
            {editId ? "更新する" : "保存する"}
          </ThemedText>
        </Pressable>
      </View>
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
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    borderWidth: 1,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyPrefix: {
    marginRight: Spacing.sm,
    fontSize: 18,
    fontWeight: "600",
  },
  priceInput: {
    flex: 1,
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: BorderRadius.xs,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: BorderRadius.xs - 2,
  },
  segmentText: {
    fontWeight: "600",
    fontSize: 14,
  },
  dateButton: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  datePickerContainer: {
    marginTop: Spacing.sm,
  },
  datePickerDone: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    marginTop: Spacing.sm,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
  saveButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
