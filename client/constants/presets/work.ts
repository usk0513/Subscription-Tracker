import type { PresetService } from "./types";

export const workServices: PresetService[] = [
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    category: "work",
    managementUrl: "https://account.microsoft.com/services",
    plans: [
      { id: "m365-personal", name: "Personal", price: 1490, billingCycle: "monthly" },
      { id: "m365-family", name: "Family", price: 2100, billingCycle: "monthly" },
    ],
  },
  {
    id: "adobe-cc",
    name: "Adobe Creative Cloud",
    category: "work",
    managementUrl: "https://account.adobe.com/plans",
    plans: [
      { id: "adobe-photo", name: "フォトプラン", price: 1180, billingCycle: "monthly" },
      { id: "adobe-single", name: "単体プラン", price: 2728, billingCycle: "monthly" },
      { id: "adobe-complete", name: "コンプリート", price: 7780, billingCycle: "monthly" },
    ],
  },
  {
    id: "notion",
    name: "Notion",
    category: "work",
    managementUrl: "https://www.notion.so/my-account",
    plans: [
      { id: "notion-plus", name: "Plus", price: 1500, billingCycle: "monthly", description: "$10" },
      { id: "notion-business", name: "Business", price: 2700, billingCycle: "monthly", description: "$18" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    category: "work",
    managementUrl: "https://slack.com/account/settings",
    plans: [
      { id: "slack-pro", name: "Pro", price: 1050, billingCycle: "monthly" },
      { id: "slack-business", name: "Business+", price: 1800, billingCycle: "monthly" },
    ],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    category: "work",
    managementUrl: "https://www.dropbox.com/account",
    plans: [
      { id: "dropbox-plus", name: "Plus", price: 1500, billingCycle: "monthly" },
      { id: "dropbox-professional", name: "Professional", price: 2400, billingCycle: "monthly" },
    ],
  },
  {
    id: "google-one",
    name: "Google One",
    category: "work",
    managementUrl: "https://one.google.com/settings",
    plans: [
      { id: "google-one-100", name: "100GB", price: 250, billingCycle: "monthly" },
      { id: "google-one-200", name: "200GB", price: 380, billingCycle: "monthly" },
      { id: "google-one-2tb", name: "2TB", price: 1300, billingCycle: "monthly" },
    ],
  },
  {
    id: "icloud",
    name: "iCloud+",
    category: "work",
    managementUrl: "https://www.icloud.com/settings/",
    plans: [
      { id: "icloud-50", name: "50GB", price: 130, billingCycle: "monthly" },
      { id: "icloud-200", name: "200GB", price: 400, billingCycle: "monthly" },
      { id: "icloud-2tb", name: "2TB", price: 1300, billingCycle: "monthly" },
      { id: "icloud-6tb", name: "6TB", price: 3900, billingCycle: "monthly" },
      { id: "icloud-12tb", name: "12TB", price: 7900, billingCycle: "monthly" },
    ],
  },
  {
    id: "evernote",
    name: "Evernote",
    category: "work",
    managementUrl: "https://www.evernote.com/Settings.action",
    plans: [
      { id: "evernote-personal", name: "Personal", price: 775, billingCycle: "monthly" },
      { id: "evernote-professional", name: "Professional", price: 1100, billingCycle: "monthly" },
    ],
  },
];
