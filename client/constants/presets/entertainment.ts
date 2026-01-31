import type { PresetService } from "./types";

export const entertainmentServices: PresetService[] = [
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
      { id: "spotify-family-6", name: "ファミリープラン 6人用", price: 1980, billingCycle: "monthly" },
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
];
