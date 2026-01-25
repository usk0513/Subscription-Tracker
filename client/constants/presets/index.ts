import type { CategoryId } from "@/types/subscription";
import type { PresetService, ServicePlan } from "./types";
import { entertainmentServices } from "./entertainment";
import { workServices } from "./work";
import { aiServices } from "./ai";
import { educationServices } from "./education";
import { otherServices } from "./other";

export type { PresetService, ServicePlan } from "./types";

export const presetServices: PresetService[] = [
  ...entertainmentServices,
  ...workServices,
  ...aiServices,
  ...educationServices,
  ...otherServices,
];

export const servicesByCategory = presetServices.reduce(
  (acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  },
  {} as Record<CategoryId, PresetService[]>
);

export function getServiceById(id: string): PresetService | undefined {
  return presetServices.find((s) => s.id === id);
}

export function getPlanById(serviceId: string, planId: string): ServicePlan | undefined {
  const service = getServiceById(serviceId);
  return service?.plans.find((p) => p.id === planId);
}
