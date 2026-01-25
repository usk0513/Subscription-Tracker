import type { PresetService } from "./types";

export const otherServices: PresetService[] = [
  {
    id: "amazon-prime",
    name: "Amazon Prime",
    category: "other",
    managementUrl: "https://www.amazon.co.jp/gp/primecentral",
    plans: [
      { id: "amazon-prime-monthly", name: "月額", price: 600, billingCycle: "monthly" },
      { id: "amazon-prime-yearly", name: "年額", price: 5900, billingCycle: "yearly" },
    ],
  },
];
