import { CategoryId, BillingCycle } from "@/types/subscription";

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

export const presetServices: PresetService[] = [
  // エンタメ - 動画配信
  {
    id: "netflix",
    name: "Netflix",
    category: "entertainment",
    managementUrl: "https://www.netflix.com/account",
    plans: [
      { id: "netflix-ads", name: "広告付きスタンダード", price: 890, billingCycle: "monthly" },
      { id: "netflix-standard", name: "スタンダード", price: 1590, billingCycle: "monthly" },
      { id: "netflix-premium", name: "プレミアム", price: 2290, billingCycle: "monthly" },
    ],
  },
  {
    id: "amazon-prime-video",
    name: "Amazon Prime Video",
    category: "entertainment",
    managementUrl: "https://www.amazon.co.jp/gp/primecentral",
    plans: [
      { id: "prime-monthly", name: "月額プラン", price: 600, billingCycle: "monthly" },
      { id: "prime-yearly", name: "年額プラン", price: 5900, billingCycle: "yearly" },
    ],
  },
  {
    id: "disney-plus",
    name: "Disney+",
    category: "entertainment",
    managementUrl: "https://www.disneyplus.com/account",
    plans: [
      { id: "disney-standard", name: "スタンダード", price: 990, billingCycle: "monthly" },
      { id: "disney-premium", name: "プレミアム", price: 1320, billingCycle: "monthly" },
    ],
  },
  {
    id: "u-next",
    name: "U-NEXT",
    category: "entertainment",
    managementUrl: "https://account.unext.jp/",
    plans: [
      { id: "u-next-standard", name: "月額プラン", price: 2189, billingCycle: "monthly" },
    ],
  },
  {
    id: "hulu",
    name: "Hulu",
    category: "entertainment",
    managementUrl: "https://www.hulu.jp/account",
    plans: [
      { id: "hulu-standard", name: "Hulu", price: 1026, billingCycle: "monthly" },
    ],
  },
  {
    id: "abema",
    name: "ABEMA プレミアム",
    category: "entertainment",
    managementUrl: "https://abema.tv/account",
    plans: [
      { id: "abema-premium", name: "プレミアム", price: 960, billingCycle: "monthly" },
    ],
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    category: "entertainment",
    managementUrl: "https://www.youtube.com/paid_memberships",
    plans: [
      { id: "yt-individual", name: "個人", price: 1280, billingCycle: "monthly" },
      { id: "yt-family", name: "ファミリー", price: 2280, billingCycle: "monthly" },
    ],
  },
  // エンタメ - 音楽
  {
    id: "spotify",
    name: "Spotify",
    category: "entertainment",
    managementUrl: "https://www.spotify.com/account",
    plans: [
      { id: "spotify-individual", name: "Individual", price: 980, billingCycle: "monthly" },
      { id: "spotify-student", name: "Student", price: 480, billingCycle: "monthly" },
      { id: "spotify-duo", name: "Duo", price: 1280, billingCycle: "monthly" },
      { id: "spotify-family", name: "Family", price: 1580, billingCycle: "monthly" },
    ],
  },
  {
    id: "apple-music",
    name: "Apple Music",
    category: "entertainment",
    managementUrl: "https://music.apple.com/account",
    plans: [
      { id: "apple-music-voice", name: "Voice", price: 480, billingCycle: "monthly" },
      { id: "apple-music-student", name: "学生", price: 580, billingCycle: "monthly" },
      { id: "apple-music-individual", name: "個人", price: 1080, billingCycle: "monthly" },
      { id: "apple-music-family", name: "ファミリー", price: 1680, billingCycle: "monthly" },
    ],
  },
  {
    id: "amazon-music",
    name: "Amazon Music Unlimited",
    category: "entertainment",
    managementUrl: "https://www.amazon.co.jp/music/settings",
    plans: [
      { id: "amazon-music-prime", name: "Prime会員", price: 980, billingCycle: "monthly" },
      { id: "amazon-music-individual", name: "個人", price: 1080, billingCycle: "monthly" },
      { id: "amazon-music-family", name: "ファミリー", price: 1680, billingCycle: "monthly" },
    ],
  },
  {
    id: "line-music",
    name: "LINE MUSIC",
    category: "entertainment",
    managementUrl: "https://music.line.me/webapp/account",
    plans: [
      { id: "line-music-student", name: "学生", price: 480, billingCycle: "monthly" },
      { id: "line-music-premium", name: "プレミアム", price: 980, billingCycle: "monthly" },
      { id: "line-music-family", name: "ファミリー", price: 1480, billingCycle: "monthly" },
    ],
  },
  // 仕事・生産性
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
  // ゲーム
  {
    id: "playstation-plus",
    name: "PlayStation Plus",
    category: "entertainment",
    managementUrl: "https://www.playstation.com/acct/management",
    plans: [
      { id: "ps-essential", name: "Essential", price: 850, billingCycle: "monthly" },
      { id: "ps-extra", name: "Extra", price: 1550, billingCycle: "monthly" },
      { id: "ps-premium", name: "Premium", price: 1850, billingCycle: "monthly" },
    ],
  },
  {
    id: "nintendo-switch-online",
    name: "Nintendo Switch Online",
    category: "entertainment",
    managementUrl: "https://accounts.nintendo.com/",
    plans: [
      { id: "nso-individual", name: "個人", price: 306, billingCycle: "monthly" },
      { id: "nso-family", name: "ファミリー", price: 815, billingCycle: "monthly" },
      { id: "nso-expansion", name: "追加パック", price: 818, billingCycle: "monthly" },
    ],
  },
  {
    id: "xbox-game-pass",
    name: "Xbox Game Pass",
    category: "entertainment",
    managementUrl: "https://account.xbox.com/",
    plans: [
      { id: "xbox-core", name: "Core", price: 842, billingCycle: "monthly" },
      { id: "xbox-standard", name: "Standard", price: 1210, billingCycle: "monthly" },
      { id: "xbox-ultimate", name: "Ultimate", price: 1450, billingCycle: "monthly" },
    ],
  },
  {
    id: "apple-arcade",
    name: "Apple Arcade",
    category: "entertainment",
    managementUrl: "https://apps.apple.com/account/subscriptions",
    plans: [
      { id: "apple-arcade", name: "Apple Arcade", price: 900, billingCycle: "monthly" },
    ],
  },
  // 教育・学習
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
  // 生成AI
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
  // その他
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
