import type { CategoryId, BillingCycle } from "@/types/subscription";

export interface ServicePlan {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  description?: string;
}

export interface PresetService {
  id: string;
  name: string;
  category: CategoryId;
  plans: ServicePlan[];
  managementUrl?: string;
}
