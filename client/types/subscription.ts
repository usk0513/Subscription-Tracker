export type BillingCycle = "monthly" | "yearly";

export type CategoryId = "entertainment" | "work" | "health" | "education" | "other";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  startDate: string;
  category: CategoryId;
  managementUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionInput {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  startDate: string;
  category: CategoryId;
  managementUrl?: string;
}
