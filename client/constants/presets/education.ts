import type { PresetService } from "./types";

export const educationServices: PresetService[] = [
  {
    id: "duolingo",
    name: "Duolingo",
    category: "education",
    managementUrl: "https://www.duolingo.com/settings/account",
    plans: [
      { id: "duolingo-plus", name: "Super", price: 1100, billingCycle: "monthly" },
      { id: "duolingo-family", name: "ファミリー", price: 1700, billingCycle: "monthly" },
    ],
  },
  {
    id: "kindle-unlimited",
    name: "Kindle Unlimited",
    category: "education",
    managementUrl: "https://www.amazon.co.jp/hz/mycd/myx",
    plans: [
      { id: "kindle-unlimited", name: "Kindle Unlimited", price: 980, billingCycle: "monthly" },
    ],
  },
  {
    id: "audible",
    name: "Audible",
    category: "education",
    managementUrl: "https://www.audible.co.jp/account",
    plans: [
      { id: "audible", name: "Audible", price: 1500, billingCycle: "monthly" },
    ],
  },
];
