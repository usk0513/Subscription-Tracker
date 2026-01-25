import {
  getMonthlyAmount,
  getTotalMonthlyAmount,
  formatCurrency,
  formatDate,
  getNextBillingDate,
  getUsageDuration,
  groupByCategory,
  filterByCategory,
  getCategoryCount,
} from "@/lib/subscriptionUtils";
import type { Subscription, CategoryId } from "@/types/subscription";

const createMockSubscription = (
  overrides: Partial<Subscription> = {}
): Subscription => ({
  id: "test-id",
  name: "Test Subscription",
  price: 1000,
  billingCycle: "monthly",
  startDate: "2024-01-01",
  category: "entertainment",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

describe("subscriptionUtils", () => {
  describe("getMonthlyAmount", () => {
    it("should return price for monthly subscriptions", () => {
      const sub = createMockSubscription({ price: 1490, billingCycle: "monthly" });
      expect(getMonthlyAmount(sub)).toBe(1490);
    });

    it("should divide price by 12 for yearly subscriptions", () => {
      const sub = createMockSubscription({ price: 12000, billingCycle: "yearly" });
      expect(getMonthlyAmount(sub)).toBe(1000);
    });

    it("should round yearly price to nearest integer", () => {
      const sub = createMockSubscription({ price: 10000, billingCycle: "yearly" });
      expect(getMonthlyAmount(sub)).toBe(833);
    });
  });

  describe("getTotalMonthlyAmount", () => {
    it("should return 0 for empty array", () => {
      expect(getTotalMonthlyAmount([])).toBe(0);
    });

    it("should sum monthly subscriptions", () => {
      const subs = [
        createMockSubscription({ id: "1", price: 1000, billingCycle: "monthly" }),
        createMockSubscription({ id: "2", price: 500, billingCycle: "monthly" }),
      ];
      expect(getTotalMonthlyAmount(subs)).toBe(1500);
    });

    it("should convert yearly to monthly before summing", () => {
      const subs = [
        createMockSubscription({ id: "1", price: 1000, billingCycle: "monthly" }),
        createMockSubscription({ id: "2", price: 12000, billingCycle: "yearly" }),
      ];
      expect(getTotalMonthlyAmount(subs)).toBe(2000);
    });
  });

  describe("formatCurrency", () => {
    it("should format with yen symbol", () => {
      expect(formatCurrency(1000)).toBe("¥1,000");
    });

    it("should handle zero", () => {
      expect(formatCurrency(0)).toBe("¥0");
    });

    it("should handle large amounts", () => {
      expect(formatCurrency(100000)).toBe("¥100,000");
    });
  });

  describe("formatDate", () => {
    it("should format date in Japanese style", () => {
      expect(formatDate("2024-01-15")).toBe("2024年1月15日");
    });

    it("should format date with double digit month", () => {
      expect(formatDate("2024-12-25")).toBe("2024年12月25日");
    });
  });

  describe("getNextBillingDate", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return next month for monthly subscription", () => {
      jest.setSystemTime(new Date("2024-06-15"));
      const sub = createMockSubscription({
        startDate: "2024-01-01",
        billingCycle: "monthly",
      });

      const nextDate = getNextBillingDate(sub);
      expect(nextDate.getMonth()).toBe(6);
      expect(nextDate.getDate()).toBe(1);
    });

    it("should return next year for yearly subscription", () => {
      jest.setSystemTime(new Date("2024-06-15"));
      const sub = createMockSubscription({
        startDate: "2024-01-01",
        billingCycle: "yearly",
      });

      const nextDate = getNextBillingDate(sub);
      expect(nextDate.getFullYear()).toBe(2025);
      expect(nextDate.getMonth()).toBe(0);
    });

    it("should return start date if it's in the future", () => {
      jest.setSystemTime(new Date("2023-06-15"));
      const sub = createMockSubscription({
        startDate: "2024-01-01",
        billingCycle: "monthly",
      });

      const nextDate = getNextBillingDate(sub);
      expect(nextDate.getFullYear()).toBe(2024);
      expect(nextDate.getMonth()).toBe(0);
    });
  });

  describe("getUsageDuration", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return days for less than 30 days", () => {
      jest.setSystemTime(new Date("2024-01-15"));
      expect(getUsageDuration("2024-01-01")).toBe("14日");
    });

    it("should return months for less than 12 months", () => {
      jest.setSystemTime(new Date("2024-06-01"));
      expect(getUsageDuration("2024-01-01")).toBe("5ヶ月");
    });

    it("should return years for 12+ months", () => {
      jest.setSystemTime(new Date("2025-01-01"));
      expect(getUsageDuration("2024-01-01")).toBe("1年");
    });

    it("should return years and months", () => {
      jest.setSystemTime(new Date("2025-07-01"));
      expect(getUsageDuration("2024-01-01")).toBe("1年6ヶ月");
    });
  });

  describe("groupByCategory", () => {
    it("should return empty groups for empty array", () => {
      const result = groupByCategory([]);
      expect(result.entertainment).toEqual([]);
      expect(result.work).toEqual([]);
      expect(result.health).toEqual([]);
      expect(result.education).toEqual([]);
      expect(result.other).toEqual([]);
    });

    it("should group subscriptions by category", () => {
      const subs = [
        createMockSubscription({ id: "1", category: "entertainment" }),
        createMockSubscription({ id: "2", category: "work" }),
        createMockSubscription({ id: "3", category: "entertainment" }),
      ];

      const result = groupByCategory(subs);
      expect(result.entertainment).toHaveLength(2);
      expect(result.work).toHaveLength(1);
      expect(result.health).toHaveLength(0);
    });
  });

  describe("filterByCategory", () => {
    const subs = [
      createMockSubscription({ id: "1", category: "entertainment" }),
      createMockSubscription({ id: "2", category: "work" }),
      createMockSubscription({ id: "3", category: "entertainment" }),
    ];

    it("should return all for 'all' category", () => {
      expect(filterByCategory(subs, "all")).toHaveLength(3);
    });

    it("should filter by specific category", () => {
      expect(filterByCategory(subs, "entertainment")).toHaveLength(2);
      expect(filterByCategory(subs, "work")).toHaveLength(1);
      expect(filterByCategory(subs, "health")).toHaveLength(0);
    });
  });

  describe("getCategoryCount", () => {
    it("should return all zeros for empty array", () => {
      const result = getCategoryCount([]);
      expect(result.all).toBe(0);
      expect(result.entertainment).toBe(0);
      expect(result.work).toBe(0);
    });

    it("should count subscriptions by category", () => {
      const subs = [
        createMockSubscription({ id: "1", category: "entertainment" }),
        createMockSubscription({ id: "2", category: "work" }),
        createMockSubscription({ id: "3", category: "entertainment" }),
        createMockSubscription({ id: "4", category: "health" }),
      ];

      const result = getCategoryCount(subs);
      expect(result.all).toBe(4);
      expect(result.entertainment).toBe(2);
      expect(result.work).toBe(1);
      expect(result.health).toBe(1);
      expect(result.education).toBe(0);
      expect(result.other).toBe(0);
    });
  });
});
