import type { PresetService } from "./types";

export const aiServices: PresetService[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "work",
    managementUrl: "https://chatgpt.com/settings",
    plans: [
      { id: "chatgpt-plus", name: "Plus", price: 3000, billingCycle: "monthly", description: "$20" },
      { id: "chatgpt-pro", name: "Pro", price: 30000, billingCycle: "monthly", description: "$200" },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    category: "work",
    managementUrl: "https://claude.ai/settings",
    plans: [
      { id: "claude-pro", name: "Pro", price: 3000, billingCycle: "monthly", description: "$20" },
      { id: "claude-max-5x", name: "Max 5×", price: 15000, billingCycle: "monthly", description: "$100" },
      { id: "claude-max-20x", name: "Max 20×", price: 30000, billingCycle: "monthly", description: "$200" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "work",
    managementUrl: "https://one.google.com/settings",
    plans: [
      { id: "gemini-pro", name: "AI Pro (Advanced)", price: 3000, billingCycle: "monthly", description: "$19.99" },
      { id: "gemini-ultra", name: "AI Ultra", price: 37500, billingCycle: "monthly", description: "$249.99" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    category: "work",
    managementUrl: "https://www.perplexity.ai/settings",
    plans: [
      { id: "perplexity-pro", name: "Pro", price: 3000, billingCycle: "monthly", description: "$20" },
      { id: "perplexity-max", name: "Max", price: 30000, billingCycle: "monthly", description: "$200" },
    ],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "work",
    managementUrl: "https://www.midjourney.com/account",
    plans: [
      { id: "mj-basic", name: "Basic", price: 1500, billingCycle: "monthly", description: "$10" },
      { id: "mj-standard", name: "Standard", price: 4500, billingCycle: "monthly", description: "$30" },
      { id: "mj-pro", name: "Pro", price: 9000, billingCycle: "monthly", description: "$60" },
      { id: "mj-mega", name: "Mega", price: 18000, billingCycle: "monthly", description: "$120" },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "work",
    managementUrl: "https://github.com/settings/copilot",
    plans: [
      { id: "copilot-pro", name: "Pro", price: 1500, billingCycle: "monthly", description: "$10" },
      { id: "copilot-pro-plus", name: "Pro+", price: 6000, billingCycle: "monthly", description: "$39" },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "work",
    managementUrl: "https://cursor.com/settings",
    plans: [
      { id: "cursor-pro", name: "Pro", price: 3000, billingCycle: "monthly", description: "$20" },
      { id: "cursor-pro-plus", name: "Pro+", price: 9000, billingCycle: "monthly", description: "$60" },
      { id: "cursor-ultra", name: "Ultra", price: 30000, billingCycle: "monthly", description: "$200" },
    ],
  },
];
