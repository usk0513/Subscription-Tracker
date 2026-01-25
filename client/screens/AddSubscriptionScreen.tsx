import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Alert,
  ScrollView,
  FlatList,
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
import { presetServices, PresetService, ServicePlan, servicesByCategory } from "@/constants/presetServices";
import type { BillingCycle, CategoryId, SubscriptionInput } from "@/types/subscription";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "AddSubscription">;

type Step = "choose" | "service" | "plan" | "form";

const categoryLabels: Record<CategoryId, string> = {
  entertainment: "エンタメ",
  work: "仕事",
  health: "健康",
  education: "教育",
  other: "その他",
};

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
  
  const [step, setStep] = useState<Step>(editId ? "form" : "choose");
  const [selectedService, setSelectedService] = useState<PresetService | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
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
  
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return presetServices;
    const query = searchQuery.toLowerCase();
    return presetServices.filter(
      (s) => s.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);
  
  const groupedServices = useMemo(() => {
    const grouped: { category: CategoryId; label: string; services: PresetService[] }[] = [];
    const categories: CategoryId[] = ["entertainment", "work", "education", "other"];
    
    for (const cat of categories) {
      const services = filteredServices.filter((s) => s.category === cat);
      if (services.length > 0) {
        grouped.push({
          category: cat,
          label: categoryLabels[cat],
          services,
        });
      }
    }
    return grouped;
  }, [filteredServices]);
  
  const handleSelectService = (service: PresetService) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedService(service);
    if (service.plans.length === 1) {
      handleSelectPlan(service, service.plans[0]);
    } else {
      setStep("plan");
    }
  };
  
  const handleSelectPlan = (service: PresetService, plan: ServicePlan) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedService(service);
    setSelectedPlan(plan);
    setName(service.name);
    setPrice(plan.price.toString());
    setBillingCycle(plan.billingCycle);
    setCategory(service.category);
    setManagementUrl(service.managementUrl || "");
    setStep("form");
  };
  
  const handleManualEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedService(null);
    setSelectedPlan(null);
    setStep("form");
  };
  
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === "plan") {
      setStep("service");
    } else if (step === "form" && selectedService) {
      if (selectedService.plans.length > 1) {
        setStep("plan");
      } else {
        setStep("service");
      }
    } else if (step === "form") {
      setStep("choose");
    } else if (step === "service") {
      setStep("choose");
    }
  };
  
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
  
  const renderChooseStep = () => (
    <View style={styles.stepContainer}>
      <ThemedText type="h3" style={styles.stepTitle}>
        サブスクを追加
      </ThemedText>
      <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
        登録方法を選択してください
      </ThemedText>
      
      <View style={styles.choiceContainer}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setStep("service");
          }}
          style={({ pressed }) => [
            styles.choiceCard,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          testID="button-preset"
        >
          <View style={[styles.choiceIconContainer, { backgroundColor: `${theme.link}15` }]}>
            <Feather name="list" size={28} color={theme.link} />
          </View>
          <ThemedText type="h4" style={styles.choiceTitle}>
            サービスから選ぶ
          </ThemedText>
          <ThemedText type="small" style={[styles.choiceDesc, { color: theme.textSecondary }]}>
            Netflix, Spotify, ChatGPT など人気サービスから選択
          </ThemedText>
          <View style={styles.choiceArrow}>
            <Feather name="chevron-right" size={24} color={theme.textTertiary} />
          </View>
        </Pressable>
        
        <Pressable
          onPress={handleManualEntry}
          style={({ pressed }) => [
            styles.choiceCard,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          testID="button-manual"
        >
          <View style={[styles.choiceIconContainer, { backgroundColor: `${theme.textSecondary}15` }]}>
            <Feather name="edit-3" size={28} color={theme.textSecondary} />
          </View>
          <ThemedText type="h4" style={styles.choiceTitle}>
            手動で入力
          </ThemedText>
          <ThemedText type="small" style={[styles.choiceDesc, { color: theme.textSecondary }]}>
            サービス名と料金を自分で入力
          </ThemedText>
          <View style={styles.choiceArrow}>
            <Feather name="chevron-right" size={24} color={theme.textTertiary} />
          </View>
        </Pressable>
      </View>
    </View>
  );
  
  const renderServiceStep = () => (
    <View style={styles.stepContainer}>
      <Pressable onPress={handleBack} style={styles.backButton} testID="button-back">
        <Feather name="arrow-left" size={20} color={theme.link} />
        <ThemedText style={[styles.backText, { color: theme.link }]}>戻る</ThemedText>
      </Pressable>
      
      <ThemedText type="h3" style={styles.stepTitle}>
        サービスを選択
      </ThemedText>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <Feather name="search" size={18} color={theme.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="サービス名で検索..."
          placeholderTextColor={theme.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="input-search"
        />
        {searchQuery.length > 0 ? (
          <Pressable onPress={() => setSearchQuery("")}>
            <Feather name="x" size={18} color={theme.textTertiary} />
          </Pressable>
        ) : null}
      </View>
      
      <ScrollView 
        style={styles.serviceList}
        showsVerticalScrollIndicator={false}
      >
        {groupedServices.map((group) => (
          <View key={group.category} style={styles.serviceGroup}>
            <ThemedText type="small" style={[styles.groupLabel, { color: theme.textSecondary }]}>
              {group.label}
            </ThemedText>
            {group.services.map((service) => (
              <Pressable
                key={service.id}
                onPress={() => handleSelectService(service)}
                style={({ pressed }) => [
                  styles.serviceItem,
                  {
                    backgroundColor: theme.backgroundDefault,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                testID={`button-service-${service.id}`}
              >
                <View style={styles.serviceInfo}>
                  <ThemedText type="body" style={styles.serviceName}>
                    {service.name}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {service.plans.length > 1 
                      ? `${service.plans.length}プラン` 
                      : `¥${service.plans[0].price.toLocaleString()}/月`}
                  </ThemedText>
                </View>
                <Feather name="chevron-right" size={20} color={theme.textTertiary} />
              </Pressable>
            ))}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
  
  const renderPlanStep = () => (
    <View style={styles.stepContainer}>
      <Pressable onPress={handleBack} style={styles.backButton} testID="button-back">
        <Feather name="arrow-left" size={20} color={theme.link} />
        <ThemedText style={[styles.backText, { color: theme.link }]}>戻る</ThemedText>
      </Pressable>
      
      <ThemedText type="h3" style={styles.stepTitle}>
        {selectedService?.name}
      </ThemedText>
      <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
        プランを選択してください
      </ThemedText>
      
      <View style={styles.planList}>
        {selectedService?.plans.map((plan) => (
          <Pressable
            key={plan.id}
            onPress={() => handleSelectPlan(selectedService, plan)}
            style={({ pressed }) => [
              styles.planItem,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            testID={`button-plan-${plan.id}`}
          >
            <View style={styles.planInfo}>
              <ThemedText type="body" style={styles.planName}>
                {plan.name}
              </ThemedText>
              {plan.description ? (
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {plan.description}
                </ThemedText>
              ) : null}
            </View>
            <View style={styles.planPriceContainer}>
              <ThemedText type="h4" style={[styles.planPrice, { color: theme.link }]}>
                ¥{plan.price.toLocaleString()}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                /{plan.billingCycle === "monthly" ? "月" : "年"}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
  
  const renderFormStep = () => (
    <KeyboardAwareScrollViewCompat
      style={[styles.formContainer, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={styles.formContent}
    >
      {!editId && selectedService ? (
        <Pressable onPress={handleBack} style={styles.backButton} testID="button-back">
          <Feather name="arrow-left" size={20} color={theme.link} />
          <ThemedText style={[styles.backText, { color: theme.link }]}>戻る</ThemedText>
        </Pressable>
      ) : null}
      
      {selectedService && selectedPlan ? (
        <View style={[styles.selectedBadge, { backgroundColor: `${theme.link}15` }]}>
          <Feather name="check-circle" size={16} color={theme.link} />
          <ThemedText style={[styles.selectedBadgeText, { color: theme.link }]}>
            {selectedService.name} - {selectedPlan.name}
          </ThemedText>
        </View>
      ) : null}
      
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
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      {step === "choose" ? renderChooseStep() : null}
      {step === "service" ? renderServiceStep() : null}
      {step === "plan" ? renderPlanStep() : null}
      {step === "form" ? renderFormStep() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  stepTitle: {
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  backText: {
    fontSize: 15,
    fontWeight: "500",
  },
  choiceContainer: {
    gap: Spacing.md,
  },
  choiceCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  choiceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  choiceTitle: {
    marginBottom: Spacing.xs,
  },
  choiceDesc: {
    lineHeight: 20,
  },
  choiceArrow: {
    position: "absolute",
    right: Spacing.lg,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  serviceList: {
    flex: 1,
  },
  serviceGroup: {
    marginBottom: Spacing.xl,
  },
  groupLabel: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontWeight: "500",
    marginBottom: 2,
  },
  planList: {
    gap: Spacing.md,
  },
  planItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontWeight: "600",
    marginBottom: 2,
  },
  planPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontWeight: "700",
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  selectedBadgeText: {
    fontSize: 13,
    fontWeight: "500",
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
