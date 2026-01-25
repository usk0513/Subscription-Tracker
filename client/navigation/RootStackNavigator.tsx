import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import AddSubscriptionScreen from "@/screens/AddSubscriptionScreen";
import SubscriptionDetailScreen from "@/screens/SubscriptionDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";

export type RootStackParamList = {
  Main: undefined;
  AddSubscription: { editId?: string } | undefined;
  SubscriptionDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddSubscription"
        component={AddSubscriptionScreen}
        options={({ navigation, route }) => ({
          presentation: "modal",
          headerTitle: route.params?.editId ? "編集" : "新規追加",
          headerLeft: () => (
            <HeaderButton onPress={() => navigation.goBack()}>
              <Feather name="x" size={24} color={theme.text} />
            </HeaderButton>
          ),
        })}
      />
      <Stack.Screen
        name="SubscriptionDetail"
        component={SubscriptionDetailScreen}
        options={{
          headerTitle: "詳細",
        }}
      />
    </Stack.Navigator>
  );
}
