import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Subscription, SubscriptionInput } from "@/types/subscription";

const SUBSCRIPTIONS_KEY = "@subscriptions";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const data = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading subscriptions:", error);
    return [];
  }
}

export async function createSubscription(input: SubscriptionInput): Promise<Subscription> {
  const subscriptions = await getSubscriptions();
  const now = new Date().toISOString();
  
  const newSubscription: Subscription = {
    id: generateId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  subscriptions.push(newSubscription);
  await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  
  return newSubscription;
}

export async function updateSubscription(id: string, input: SubscriptionInput): Promise<Subscription | null> {
  const subscriptions = await getSubscriptions();
  const index = subscriptions.findIndex((s) => s.id === id);
  
  if (index === -1) return null;
  
  const updatedSubscription: Subscription = {
    ...subscriptions[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  subscriptions[index] = updatedSubscription;
  await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  
  return updatedSubscription;
}

export async function deleteSubscription(id: string): Promise<boolean> {
  const subscriptions = await getSubscriptions();
  const filtered = subscriptions.filter((s) => s.id !== id);
  
  if (filtered.length === subscriptions.length) return false;
  
  await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(filtered));
  return true;
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  const subscriptions = await getSubscriptions();
  return subscriptions.find((s) => s.id === id) || null;
}
