import type { Subscription, CategoryId } from "@/types/subscription";

export function getMonthlyAmount(subscription: Subscription): number {
  if (subscription.billingCycle === "monthly") {
    return subscription.price;
  }
  return Math.round(subscription.price / 12);
}

export function getTotalMonthlyAmount(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, sub) => total + getMonthlyAmount(sub), 0);
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function getNextBillingDate(subscription: Subscription): Date {
  const startDate = new Date(subscription.startDate);
  const now = new Date();
  const nextDate = new Date(startDate);
  
  if (subscription.billingCycle === "monthly") {
    while (nextDate <= now) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
  } else {
    while (nextDate <= now) {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
  }
  
  return nextDate;
}

export function getUsageDuration(startDateString: string): string {
  const startDate = new Date(startDateString);
  const now = new Date();
  
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays}日`;
  }
  
  const months = Math.floor(diffDays / 30);
  if (months < 12) {
    return `${months}ヶ月`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years}年`;
  }
  
  return `${years}年${remainingMonths}ヶ月`;
}

export function groupByCategory(subscriptions: Subscription[]): Record<CategoryId, Subscription[]> {
  const groups: Record<CategoryId, Subscription[]> = {
    entertainment: [],
    work: [],
    health: [],
    education: [],
    other: [],
  };
  
  subscriptions.forEach((sub) => {
    groups[sub.category].push(sub);
  });
  
  return groups;
}

export function filterByCategory(subscriptions: Subscription[], category: CategoryId | "all"): Subscription[] {
  if (category === "all") return subscriptions;
  return subscriptions.filter((sub) => sub.category === category);
}

export function getCategoryCount(subscriptions: Subscription[]): Record<CategoryId | "all", number> {
  const counts: Record<CategoryId | "all", number> = {
    all: subscriptions.length,
    entertainment: 0,
    work: 0,
    health: 0,
    education: 0,
    other: 0,
  };
  
  subscriptions.forEach((sub) => {
    counts[sub.category]++;
  });
  
  return counts;
}
